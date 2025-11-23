import express from 'express';
import { body } from 'express-validator';
import {
  verifyStudentId,
  signup,
  login,
  logout,
  refreshToken,
  forgotPassword
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/auth/verify-id
 * Verify student ID before signup
 */
router.post(
  '/verify-id',
  body('studentId')
    .trim()
    .notEmpty().withMessage('Student ID is required'),
  verifyStudentId
);

/**
 * POST /api/auth/signup
 * Register new student
 */
router.post(
  '/signup',
  // Validation rules
  body('studentId')
    .trim()
    .notEmpty().withMessage('Student ID is required'),
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('email')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])/).withMessage('Password must contain at least one lowercase letter')
    .matches(/^(?=.*[A-Z])/).withMessage('Password must contain at least one uppercase letter')
    .matches(/^(?=.*\d)/).withMessage('Password must contain at least one number'),
  body('year')
    .isIn(['1st', '2nd', '3rd', '4th']).withMessage('Invalid year. Must be one of: 1st, 2nd, 3rd, 4th'),
  
  signup
);

/**
 * POST /api/auth/login
 * Login user
 */
router.post(
  '/login',
  body('email')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  login
);

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', protect, logout);

/**
 * POST /api/auth/refresh-token
 * Refresh JWT token
 */
router.post('/refresh-token', protect, refreshToken);

/**
 * POST /api/auth/forgot-password
 * Send password reset email
 */
router.post(
  '/forgot-password',
  body('email')
    .isEmail().withMessage('Invalid email address'),
  
  forgotPassword
);

export default router;
