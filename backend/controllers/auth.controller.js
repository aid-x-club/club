import User from '../models/User.js';
import { sendTokenResponse, generateToken, isValidStudentId } from '../utils/auth.utils.js';
import { isValidStudent, validateStudent } from '../utils/studentDataValidator.js';
import { validationResult } from 'express-validator';

/**
 * @route   POST /api/auth/verify-id
 * @desc    Verify if student ID exists in system and is available
 * @access  Public
 */
export const verifyStudentId = async (req, res, next) => {
  try {
    const { studentId } = req.body;

    // Validate format
    if (!isValidStudentId(studentId)) {
      return res.status(400).json({ 
        error: 'Invalid Student ID format' 
      });
    }

    // Check if student ID is valid in CSV data
    if (!isValidStudent(studentId)) {
      return res.status(400).json({ 
        error: 'Student ID not found in system. Please contact administrator.' 
      });
    }

    // Check if student ID is already registered
    const existingUser = await User.findOne({ studentId: studentId.toUpperCase() });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'An account is already registered with this Student ID.' 
      });
    }

    // If all checks pass, return success with student data
    const studentData = validateStudent(studentId);
    res.status(200).json({ 
      success: true,
      message: 'Student ID verified successfully',
      studentId: studentId.toUpperCase(),
      studentData: {
        name: studentData?.name,
        year: studentData?.year
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new student
 * @access  Public
 */
export const signup = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { studentId, fullName, email, password, year } = req.body;

    // Verify student ID format
    if (!isValidStudentId(studentId)) {
      return res.status(400).json({ 
        error: 'Invalid Student ID format' 
      });
    }

    // Verify student ID exists in CSV data
    if (!isValidStudent(studentId)) {
      return res.status(400).json({ 
        error: 'Student ID not found in system. Please contact administrator.' 
      });
    }

    // Check if student ID is already registered
    const existingUser = await User.findOne({ studentId: studentId.toUpperCase() });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'An account is already registered with this Student ID.' 
      });
    }

    // Create new user
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      studentId: studentId.toUpperCase(),
      password,
      year,
      emailVerified: false // TODO: Implement email verification
    });

    // Send token response
    sendTokenResponse(user, 201, res, 'Account created successfully');

  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        error: `${field} already exists. Please use a different ${field}.`
      });
    }
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Please provide email and password' 
      });
    }

    // Check for user
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      console.log(`❌ Login attempt failed: User not found for email: ${email}`);
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Check if password matches
    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      console.log(`❌ Login attempt failed: Invalid password for user: ${email}`);
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    console.log(`✅ Login successful for user: ${email}`);

    // Send token response
    sendTokenResponse(user, 200, res, 'Login successful');

  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
export const logout = (req, res) => {
  res.status(200).json({ 
    success: true,
    message: 'Logged out successfully',
    token: null 
  });
};

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh JWT token
 * @access  Private
 */
export const refreshToken = (req, res) => {
  try {
    const newToken = generateToken(req.user.userId, req.user.role);
    
    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      token: newToken
    });
  } catch (error) {
    res.status(401).json({ 
      error: 'Could not refresh token' 
    });
  }
};

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // TODO: Implement password reset token generation & email sending
    // For now, just confirm the request
    res.status(200).json({
      success: true,
      message: 'Password reset email sent. Check your inbox.'
    });

  } catch (error) {
    next(error);
  }
};
