import User from '../models/User.js';

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user.getPublicProfile()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/users/me
 * @desc    Update user profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { fullName, bio, phone, profileImage, year, section } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        fullName: fullName || undefined,
        bio: bio || undefined,
        phone: phone || undefined,
        profileImage: profileImage || undefined,
        year: year || undefined,
        section: section || undefined,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user.getPublicProfile()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users/:id
 * @desc    Get public user profile
 * @access  Public
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user.getPublicProfile()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users/me/projects
 * @desc    Get user's projects
 * @access  Private
 */
export const getUserProjects = async (req, res, next) => {
  try {
    // TODO: Implement when Project model is created
    res.status(200).json({
      success: true,
      message: 'User projects endpoint - to be implemented',
      data: []
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/users/me/events
 * @desc    Get user's event enrollments
 * @access  Private
 */
export const getUserEvents = async (req, res, next) => {
  try {
    // TODO: Implement when Event and Enrollment models are created
    res.status(200).json({
      success: true,
      message: 'User events endpoint - to be implemented',
      data: []
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/users/github/connect
 * @desc    Connect GitHub account
 * @access  Private
 */
export const connectGitHub = async (req, res, next) => {
  try {
    const { githubUsername, githubAccessToken } = req.body;

    if (!githubUsername || !githubAccessToken) {
      return res.status(400).json({ 
        error: 'GitHub username and access token are required' 
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        githubUsername,
        githubAccessToken, // In production, encrypt this
        githubConnected: true,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'GitHub account connected successfully',
      data: user.getPublicProfile()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/users/github/disconnect
 * @desc    Disconnect GitHub account
 * @access  Private
 */
export const disconnectGitHub = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        githubUsername: null,
        githubAccessToken: null,
        githubConnected: false,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'GitHub account disconnected successfully',
      data: user.getPublicProfile()
    });
  } catch (error) {
    next(error);
  }
};
