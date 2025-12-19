import express from 'express';
import { body } from 'express-validator';
import {
  getCurrentUser,
  updateProfile,
  getUserProfile,
  getUserProjects,
  getUserEvents,
  connectGitHub,
  disconnectGitHub
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/users/me
 * Get current user profile
 */
router.get('/me', protect, getCurrentUser);

/**
 * PUT /api/users/me
 * Update user profile
 */
router.put(
  '/me',
  protect,
  body('fullName').optional().trim().isLength({ min: 3 }),
  body('phone').optional().isMobilePhone(),
  body('year').optional().isIn(['1st', '2nd', '3rd', '4th']),
  updateProfile
);

/**
 * GET /api/users/me/projects
 * Get user's projects
 */
router.get('/me/projects', protect, getUserProjects);

/**
 * GET /api/users/me/events
 * Get user's event enrollments
 */
router.get('/me/events', protect, getUserEvents);

/**
 * POST /api/users/github/connect
 * Connect GitHub account
 */
router.post(
  '/github/connect',
  protect,
  body('githubUsername').trim().notEmpty(),
  body('githubAccessToken').notEmpty(),
  connectGitHub
);

/**
 * POST /api/users/github/disconnect
 * Disconnect GitHub account
 */
router.post('/github/disconnect', protect, disconnectGitHub);

/**
 * GET /api/users/:id
 * Get public user profile
 */
router.get('/:id', getUserProfile);

/**
 * PUT /api/users/:id
 * Update user profile by ID (for admin/self)
 */
router.put('/:id', protect, updateProfile);

/**
 * PUT /api/users/:id/notifications
 * Update user notification preferences
 */
router.put('/:id/notifications', protect, updateProfile);

export default router;
