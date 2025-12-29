// TODO: Replace Mongoose models with Supabase queries
import { supabase } from '../config/supabase.js';

// import User from '../models/User.js';

/**
 * Get all users (Admin/Coordinator only)
 * GET /api/admin/users
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            users,
            count: users.length
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
};

/**
 * Get user by ID
 * GET /api/admin/users/:id
 */
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user'
        });
    }
};

/**
 * Create new user
 * POST /api/admin/users
 */
export const createUser = async (req, res) => {
    try {
        const { name, email, password, rollNumber, role, isActive } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password, // Will be hashed by pre-save hook
            rollNumber,
            role: role || 'student',
            isActive: typeof isActive !== 'undefined' ? isActive : true
        });

        await user.save();

        // Return user without password
        const newUser = await User.findById(user._id).select('-password');

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: newUser
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create user'
        });
    }
};

/**
 * Update user
 * PUT /api/admin/users/:id
 */
export const updateUser = async (req, res) => {
    try {
        const { name, email, rollNumber, role, isActive } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (rollNumber) user.rollNumber = rollNumber;
        if (role) user.role = role;
        if (typeof isActive !== 'undefined') user.isActive = isActive;

        await user.save();

        // Return user without password
        const updatedUser = await User.findById(user._id).select('-password');

        res.json({
            success: true,
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user'
        });
    }
};

/**
 * Delete user
 * DELETE /api/admin/users/:id
 */
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent deleting yourself
        const currentUserId = req.user.userId || req.user.id || req.user._id;
        if (user._id.toString() === currentUserId.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user'
        });
    }
};

/**
 * Toggle user status (active/inactive)
 * PATCH /api/admin/users/:id/status
 */
export const toggleUserStatus = async (req, res) => {
    try {
        const { isActive } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.isActive = isActive;
        await user.save();

        res.json({
            success: true,
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
            user: {
                _id: user._id,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error('Error toggling user status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user status'
        });
    }
};

/**
 * Get user statistics
 * GET /api/admin/users/stats
 */
export const getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const students = await User.countDocuments({ role: 'student' });
        const coordinators = await User.countDocuments({ role: 'coordinator' });
        const admins = await User.countDocuments({ role: 'admin' });
        const githubConnected = await User.countDocuments({ githubConnected: true });

        res.json({
            success: true,
            stats: {
                total: totalUsers,
                active: activeUsers,
                inactive: totalUsers - activeUsers,
                students,
                coordinators,
                admins,
                githubConnected
            }
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user statistics'
        });
    }
};
