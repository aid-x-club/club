import { supabase } from '../config/supabase.js';
import bcrypt from 'bcryptjs';
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

    // Check if student ID is already registered in Supabase
    const { data: existingUser, error } = await supabase
      .from('users')
      .select('id')
      .eq('enrollment_number', studentId.toUpperCase())
      .single();

    if (existingUser && !error) {
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
    console.error('Verify Student ID Error:', error);
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

    // Check if student ID or email is already registered
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, enrollment_number, email')
      .or(`enrollment_number.eq.${studentId.toUpperCase()},email.eq.${email.toLowerCase()}`)
      .single();

    if (existingUser) {
      if (existingUser.enrollment_number === studentId.toUpperCase()) {
        return res.status(400).json({
          error: 'An account is already registered with this Student ID.'
        });
      }
      if (existingUser.email === email.toLowerCase()) {
        return res.status(400).json({
          error: 'An account is already registered with this email.'
        });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create new user in Supabase
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([
        {
          full_name: fullName,
          email: email.toLowerCase(),
          enrollment_number: studentId.toUpperCase(),
          password_hash: password_hash,
          year: parseInt(year),
          role: 'student',
          is_active: true,
          is_verified: false,
          email_verified: false
        }
      ])
      .select()
      .single();

    if (createError) {
      console.error('Supabase Insert Error:', createError);
      throw createError;
    }

    // Send token response
    sendTokenResponse(newUser, 201, res, 'Account created successfully');

  } catch (error) {
    console.error('Signup Error:', error);
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

    // Check for user in Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      console.log(`❌ Login attempt failed: User not found for email: ${email}`);
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordCorrect) {
      console.log(`❌ Login attempt failed: Invalid password for user: ${email}`);
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Update last login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    console.log(`✅ Login successful for user: ${email}`);

    // Send token response
    sendTokenResponse(user, 200, res, 'Login successful');

  } catch (error) {
    console.error('Login Error:', error);
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

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
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
    console.error('Forgot Password Error:', error);
    next(error);
  }
};
