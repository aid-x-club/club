import Event from '../models/Event.js';
import User from '../models/User.js';

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (coordinator/admin)
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      shortDescription,
      eventType,
      category,
      startDate,
      endDate,
      location,
      maxParticipants,
      registrationDeadline,
      tags,
    } = req.body;

    // Validate required fields
    if (!title || !description || !eventType || !category || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Create event
    const event = await Event.create({
      title,
      description,
      shortDescription,
      eventType,
      category,
      startDate,
      endDate,
      location: location || {},
      maxParticipants,
      registrationDeadline,
      tags: tags || [],
      organizer: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get all events with filtering
// @route   GET /api/events
// @access  Public
export const getAllEvents = async (req, res) => {
  try {
    const { category, eventType, status, sort, page = 1, limit = 10, search } = req.query;

    let query = { visibility: 'public' };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by event type
    if (eventType) {
      query.eventType = eventType;
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
    let sortOption = { startDate: 1 };
    if (sort === 'trending') {
      sortOption = { likes: -1, registrationCount: -1 };
    } else if (sort === 'recent') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'upcoming') {
      sortOption = { startDate: 1 };
    }

    // Execute query
    const events = await Event.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize)
      .populate('organizer', 'fullName studentId profileImage')
      .select('-registeredUsers');

    const total = await Event.countDocuments(query);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      pages: Math.ceil(total / pageSize),
      data: events,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'fullName studentId profileImage email')
      .populate('registeredUsers.userId', 'fullName studentId profileImage');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Increment views
    event.views += 1;
    await event.save();

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get user's registered events
// @route   GET /api/events/user/registered
// @access  Private
export const getUserRegisteredEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNum - 1) * pageSize;

    const events = await Event.find({
      'registeredUsers.userId': req.user.id,
    })
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate('organizer', 'fullName studentId profileImage');

    const total = await Event.countDocuments({
      'registeredUsers.userId': req.user.id,
    });

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      data: events,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get organizer's events
// @route   GET /api/events/organizer/:userId
// @access  Public
export const getOrganizerEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNum - 1) * pageSize;

    const events = await Event.find({
      organizer: req.params.userId,
      visibility: 'public',
    })
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate('organizer', 'fullName studentId profileImage');

    const total = await Event.countDocuments({
      organizer: req.params.userId,
      visibility: 'public',
    });

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      data: events,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (organizer only)
export const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check authorization
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'title',
      'description',
      'shortDescription',
      'eventType',
      'category',
      'status',
      'startDate',
      'endDate',
      'location',
      'maxParticipants',
      'registrationDeadline',
      'coverImage',
      'tags',
      'speakers',
      'visibility',
      'agendaUrl',
      'materialsUrl',
      'recordingUrl',
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    event = await event.save();

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (organizer only)
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check authorization
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event',
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Event deleted',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Register user for event
// @route   POST /api/events/:id/register
// @access  Private
export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check registration deadline
    if (event.registrationDeadline && new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline has passed',
      });
    }

    // Check if user is already registered
    if (event.registeredUsers.some(user => user.userId.toString() === req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'User is already registered',
      });
    }

    // Check capacity
    if (event.maxParticipants && event.registeredUsers.length >= event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Event is full',
      });
    }

    event.registeredUsers.push({ userId: req.user.id });
    event.registrationCount = event.registeredUsers.length;
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Registered for event',
      data: event,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Unregister user from event
// @route   DELETE /api/events/:id/register
// @access  Private
export const unregisterFromEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    event.registeredUsers = event.registeredUsers.filter(
      user => user.userId.toString() !== req.user.id
    );
    event.registrationCount = event.registeredUsers.length;
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Unregistered from event',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Mark attendance
// @route   POST /api/events/:id/attendance/:userId
// @access  Private (organizer only)
export const markAttendance = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check authorization
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to mark attendance',
      });
    }

    const userReg = event.registeredUsers.find(
      user => user.userId.toString() === req.params.userId
    );

    if (!userReg) {
      return res.status(404).json({
        success: false,
        message: 'User is not registered for this event',
      });
    }

    userReg.attended = true;
    userReg.attendedAt = Date.now();
    event.attendanceCount = event.registeredUsers.filter(u => u.attended).length;
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Attendance marked',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Like an event
// @route   POST /api/events/:id/like
// @access  Private
export const likeEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const alreadyLiked = event.likedBy.includes(req.user.id);

    if (alreadyLiked) {
      event.likedBy = event.likedBy.filter(id => id.toString() !== req.user.id);
      event.likes -= 1;
    } else {
      event.likedBy.push(req.user.id);
      event.likes += 1;
    }

    await event.save();

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likes: event.likes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Save an event
// @route   POST /api/events/:id/save
// @access  Private
export const saveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const alreadySaved = event.savedBy.includes(req.user.id);

    if (alreadySaved) {
      event.savedBy = event.savedBy.filter(id => id.toString() !== req.user.id);
    } else {
      event.savedBy.push(req.user.id);
    }

    await event.save();

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

// @desc    Get featured events
// @route   GET /api/events/featured
// @access  Public
export const getFeaturedEvents = async (req, res) => {
  try {
    const events = await Event.find({
      isFeatured: true,
      visibility: 'public',
    })
      .sort({ startDate: 1 })
      .limit(6)
      .populate('organizer', 'fullName studentId profileImage');

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get upcoming events
// @route   GET /api/events/upcoming
// @access  Public
export const getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({
      visibility: 'public',
      status: 'upcoming',
      startDate: { $gte: new Date() },
    })
      .sort({ startDate: 1 })
      .limit(6)
      .populate('organizer', 'fullName studentId profileImage');

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
