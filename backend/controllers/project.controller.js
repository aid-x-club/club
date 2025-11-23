import Project from '../models/Project.js';
import User from '../models/User.js';

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      shortDescription,
      category,
      technologies,
      repositoryUrl,
      liveUrl,
      documentationUrl,
      startDate,
      endDate,
    } = req.body;

    // Validate required fields
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and category',
      });
    }

    // Create project
    const project = await Project.create({
      title,
      description,
      shortDescription,
      category,
      technologies: technologies || [],
      repositoryUrl,
      liveUrl,
      documentationUrl,
      startDate,
      endDate,
      createdBy: req.user.id,
      teamMembers: [
        {
          userId: req.user.id,
          role: 'lead',
        },
      ],
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get all projects with filtering
// @route   GET /api/projects
// @access  Public
export const getAllProjects = async (req, res) => {
  try {
    const { category, status, sort, page = 1, limit = 10, search } = req.query;

    let query = { visibility: 'public' };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search in title and description
    if (search) {
      query.$text = { $search: search };
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNum - 1) * pageSize;

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'trending') {
      sortOption = { likes: -1, views: -1 };
    } else if (sort === 'recent') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'popular') {
      sortOption = { views: -1 };
    }

    // Execute query
    const projects = await Project.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize)
      .populate('createdBy', 'fullName studentId profileImage')
      .populate('teamMembers.userId', 'fullName studentId profileImage');

    const total = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      pages: Math.ceil(total / pageSize),
      data: projects,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'fullName studentId profileImage email')
      .populate('teamMembers.userId', 'fullName studentId profileImage');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Increment views
    project.views += 1;
    await project.save();

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get user's projects
// @route   GET /api/projects/user/:userId
// @access  Public
export const getUserProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNum - 1) * pageSize;

    const projects = await Project.find({
      createdBy: req.params.userId,
      visibility: 'public',
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate('createdBy', 'fullName studentId profileImage')
      .populate('teamMembers.userId', 'fullName studentId profileImage');

    const total = await Project.countDocuments({
      createdBy: req.params.userId,
      visibility: 'public',
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      data: projects,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (project owner only)
export const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user is project owner or lead
    const isOwner = project.createdBy.toString() === req.user.id;
    const isLead = project.teamMembers.some(
      member =>
        member.userId.toString() === req.user.id && member.role === 'lead'
    );

    if (!isOwner && !isLead) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project',
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'title',
      'description',
      'shortDescription',
      'category',
      'technologies',
      'status',
      'repositoryUrl',
      'liveUrl',
      'documentationUrl',
      'startDate',
      'endDate',
      'coverImage',
      'tags',
      'visibility',
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    project = await project.save();

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (project owner only)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user is project owner
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project',
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Add team member to project
// @route   POST /api/projects/:id/members
// @access  Private (project owner only)
export const addTeamMember = async (req, res) => {
  try {
    const { userId, role = 'member' } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check authorization
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this project',
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if already a member
    if (
      project.teamMembers.some(
        member => member.userId.toString() === userId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: 'User is already a team member',
      });
    }

    // Add member
    project.teamMembers.push({ userId, role });
    await project.save();

    res.status(200).json({
      success: true,
      message: 'Team member added',
      data: project,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Remove team member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private (project owner only)
export const removeTeamMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check authorization
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this project',
      });
    }

    // Remove member
    project.teamMembers = project.teamMembers.filter(
      member => member.userId.toString() !== req.params.userId
    );
    await project.save();

    res.status(200).json({
      success: true,
      message: 'Team member removed',
      data: project,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Like a project
// @route   POST /api/projects/:id/like
// @access  Private
export const likeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if already liked
    const alreadyLiked = project.likedBy.includes(req.user.id);

    if (alreadyLiked) {
      // Unlike
      project.likedBy = project.likedBy.filter(
        id => id.toString() !== req.user.id
      );
      project.likes -= 1;
    } else {
      // Like
      project.likedBy.push(req.user.id);
      project.likes += 1;
    }

    await project.save();

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likes: project.likes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Save a project
// @route   POST /api/projects/:id/save
// @access  Private
export const saveProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if already saved
    const alreadySaved = project.savedBy.includes(req.user.id);

    if (alreadySaved) {
      // Unsave
      project.savedBy = project.savedBy.filter(
        id => id.toString() !== req.user.id
      );
    } else {
      // Save
      project.savedBy.push(req.user.id);
    }

    await project.save();

    res.status(200).json({
      success: true,
      saved: !alreadySaved,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get featured projects
// @route   GET /api/projects/featured
// @access  Public
export const getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      isFeatured: true,
      visibility: 'public',
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('createdBy', 'fullName studentId profileImage')
      .populate('teamMembers.userId', 'fullName studentId profileImage');

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get trending projects
// @route   GET /api/projects/trending
// @access  Public
export const getTrendingProjects = async (req, res) => {
  try {
    const projects = await Project.find({ visibility: 'public' })
      .sort({ likes: -1, views: -1 })
      .limit(6)
      .populate('createdBy', 'fullName studentId profileImage')
      .populate('teamMembers.userId', 'fullName studentId profileImage');

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
