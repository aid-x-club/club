import express from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    getUserStats
} from '../controllers/admin.controller.js';
import { protect, isCoordinator } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and coordinator/admin role
router.use(protect);
router.use(isCoordinator);

/**
 * GET /api/admin/users/stats
 * Get user statistics
 */
router.get('/users/stats', getUserStats);

/**
 * GET /api/admin/users
 * Get all users
 */
router.get('/users', getAllUsers);

/**
 * POST /api/admin/users
 * Create new user
 */
router.post('/users', createUser);

/**
 * GET /api/admin/users/:id
 * Get user by ID
 */
router.get('/users/:id', getUserById);

/**
 * PUT /api/admin/users/:id
 * Update user
 */
router.put('/users/:id', updateUser);

/**
 * DELETE /api/admin/users/:id
 * Delete user
 */
router.delete('/users/:id', deleteUser);

/**
 * PATCH /api/admin/users/:id/status
 * Toggle user active status
 */
router.patch('/users/:id/status', toggleUserStatus);

export default router;
