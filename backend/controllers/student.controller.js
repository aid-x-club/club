// TODO: Replace Mongoose models with Supabase queries
import { supabase } from '../config/supabase.js';

// import User from '../models/User.js';
// import Event from '../models/Event.js';
// import Project from '../models/Project.js';
// import EventRegistration from '../models/EventRegistration.js';
// import Achievement from '../models/Achievement.js';
// import UserAchievement from '../models/UserAchievement.js';
// import Resource from '../models/Resource.js';
// import Announcement from '../models/Announcement.js';
// import Notification from '../models/Notification.js';

// Get Dashboard Stats
export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get event count
        const eventCount = await EventRegistration.countDocuments({
            user: userId,
            status: 'attended'
        });

        // Get project count
        const projectCount = await Project.countDocuments({
            createdBy: userId,
            status: { $in: ['approved', 'published'] }
        });

        // Get achievement count
        const achievementCount = await UserAchievement.countDocuments({
            user: userId,
            isUnlocked: true
        });

        // Get user points
        const user = await User.findById(userId).select('points createdAt');
        const membershipDays = Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24));

        // Get recent activity
        const recentRegistrations = await EventRegistration.find({ user: userId })
            .populate('event', 'title eventDate')
            .sort({ registeredAt: -1 })
            .limit(5);

        const recentProjects = await Project.find({ createdBy: userId })
            .select('title status createdAt')
            .sort({ createdAt: -1 })
            .limit(5);

        const activity = [
            ...recentRegistrations.map(reg => ({
                type: 'event_registration',
                title: `Registered for ${reg.event.title}`,
                date: reg.registeredAt
            })),
            ...recentProjects.map(proj => ({
                type: 'project_submission',
                title: `Submitted project: ${proj.title}`,
                date: proj.createdAt
            }))
        ].sort((a, b) => b.date - a.date).slice(0, 10);

        res.json({
            success: true,
            stats: {
                eventsAttended: eventCount,
                projectsSubmitted: projectCount,
                achievementsEarned: achievementCount,
                points: user.points || 0,
                membershipDays
            },
            activity
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard stats',
            error: error.message
        });
    }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

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
        console.error('Get user profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user profile',
            error: error.message
        });
    }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const {
            fullName,
            rollNumber,
            bio,
            phone,
            skills,
            interests,
            githubUsername,
            linkedinProfile
        } = req.body;

        const updateData = {
            fullName,
            rollNumber,
            bio,
            phone,
            skills: skills ? skills.split(',').map(s => s.trim()) : undefined,
            interests: interests ? interests.split(',').map(i => i.trim()) : undefined,
            githubUsername,
            linkedinProfile,
            updatedAt: Date.now()
        };

        // Remove undefined fields
        Object.keys(updateData).forEach(key =>
            updateData[key] === undefined && delete updateData[key]
        );

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
};

// Change Password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        const user = await User.findById(req.user._id).select('+password');

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to change password',
            error: error.message
        });
    }
};

// Update Settings
export const updateSettings = async (req, res) => {
    try {
        const userId = req.user._id;
        const { notificationSettings, privacySettings } = req.body;

        const updateData = {};
        if (notificationSettings) updateData.notificationSettings = notificationSettings;
        if (privacySettings) updateData.privacySettings = privacySettings;
        updateData.updatedAt = Date.now();

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select('-password');

        res.json({
            success: true,
            message: 'Settings updated successfully',
            user
        });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update settings',
            error: error.message
        });
    }
};

// Get Events
export const getEvents = async (req, res) => {
    try {
        const { type = 'upcoming' } = req.query;
        const userId = req.user._id;
        let query = {};

        if (type === 'upcoming') {
            query.eventDate = { $gte: new Date() };
            query.status = 'published';
        } else if (type === 'past') {
            query.eventDate = { $lt: new Date() };
        }

        const events = await Event.find(query)
            .sort({ eventDate: type === 'upcoming' ? 1 : -1 })
            .limit(50);

        // Get user's registrations
        const registrations = await EventRegistration.find({ user: userId })
            .select('event status');

        const registrationMap = {};
        registrations.forEach(reg => {
            registrationMap[reg.event.toString()] = reg.status;
        });

        const eventsWithStatus = events.map(event => ({
            ...event.toObject(),
            registrationStatus: registrationMap[event._id.toString()] || null
        }));

        res.json({
            success: true,
            events: eventsWithStatus
        });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch events',
            error: error.message
        });
    }
};

// Get My Registered Events
export const getMyEvents = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status } = req.query;

        const query = { user: userId };
        if (status) query.status = status;

        const registrations = await EventRegistration.find(query)
            .populate('event')
            .sort({ registeredAt: -1 });

        res.json({
            success: true,
            registrations
        });
    } catch (error) {
        console.error('Get my events error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch registered events',
            error: error.message
        });
    }
};

// Register for Event
export const registerForEvent = async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.user._id;

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if already registered
        const existing = await EventRegistration.findOne({
            user: userId,
            event: eventId
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Already registered for this event'
            });
        }

        // Create registration
        const registration = await EventRegistration.create({
            user: userId,
            event: eventId
        });

        // Create notification
        await Notification.create({
            user: userId,
            type: 'event',
            title: 'Event Registration Successful',
            message: `You have successfully registered for ${event.title}`,
            icon: '✅'
        });

        res.json({
            success: true,
            message: 'Successfully registered for event',
            registration
        });
    } catch (error) {
        console.error('Register for event error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to register for event',
            error: error.message
        });
    }
};

// Cancel Event Registration
export const cancelEventRegistration = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user._id;

        const registration = await EventRegistration.findOneAndUpdate(
            { user: userId, event: eventId },
            { status: 'cancelled' },
            { new: true }
        );

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        res.json({
            success: true,
            message: 'Registration cancelled successfully'
        });
    } catch (error) {
        console.error('Cancel registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel registration',
            error: error.message
        });
    }
};

// Get My Projects
export const getMyProjects = async (req, res) => {
    try {
        const userId = req.user._id;
        const projects = await Project.find({ createdBy: userId })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            projects
        });
    } catch (error) {
        console.error('Get my projects error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch projects',
            error: error.message
        });
    }
};

// Get All Projects (Browse)
export const getAllProjects = async (req, res) => {
    try {
        const { category, technology, search } = req.query;
        const query = { status: { $in: ['approved', 'published'] } };

        if (category) query.category = category;
        if (technology) query.technologies = technology;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const projects = await Project.find(query)
            .populate('createdBy', 'fullName profileImage')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({
            success: true,
            projects
        });
    } catch (error) {
        console.error('Get all projects error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch projects',
            error: error.message
        });
    }
};

// Get Achievements
export const getAchievements = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get all achievements
        const allAchievements = await Achievement.find({ isActive: true });

        // Get user's achievement progress
        const userAchievements = await UserAchievement.find({ user: userId })
            .populate('achievement');

        const achievementMap = {};
        userAchievements.forEach(ua => {
            achievementMap[ua.achievement._id.toString()] = {
                progress: ua.progress,
                isUnlocked: ua.isUnlocked,
                unlockedAt: ua.unlockedAt
            };
        });

        const achievementsWithProgress = allAchievements.map(ach => ({
            ...ach.toObject(),
            progress: achievementMap[ach._id.toString()]?.progress || 0,
            isUnlocked: achievementMap[ach._id.toString()]?.isUnlocked || false,
            unlockedAt: achievementMap[ach._id.toString()]?.unlockedAt || null
        }));

        // Get user stats
        const user = await User.findById(userId).select('points achievementCount');

        res.json({
            success: true,
            achievements: achievementsWithProgress,
            stats: {
                totalAchievements: allAchievements.length,
                unlockedAchievements: user.achievementCount || 0,
                totalPoints: user.points || 0
            }
        });
    } catch (error) {
        console.error('Get achievements error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch achievements',
            error: error.message
        });
    }
};

// Get Leaderboard
export const getLeaderboard = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const leaderboard = await User.find({ role: 'student' })
            .select('fullName profileImage points achievementCount projectCount eventCount')
            .sort({ points: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            leaderboard
        });
    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch leaderboard',
            error: error.message
        });
    }
};

// Get Resources
export const getResources = async (req, res) => {
    try {
        const { category, type, search } = req.query;
        const query = { isPublished: true };

        if (category && category !== 'all') query.category = category;
        if (type) query.type = type;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const resources = await Resource.find(query)
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({
            success: true,
            resources
        });
    } catch (error) {
        console.error('Get resources error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch resources',
            error: error.message
        });
    }
};

// Get Announcements
export const getAnnouncements = async (req, res) => {
    try {
        const { category } = req.query;
        const query = {
            isPublished: true,
            targetAudience: { $in: ['all', 'students'] }
        };

        if (category) query.category = category;

        const announcements = await Announcement.find(query)
            .populate('author', 'fullName')
            .sort({ publishedAt: -1 })
            .limit(20);

        res.json({
            success: true,
            announcements
        });
    } catch (error) {
        console.error('Get announcements error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch announcements',
            error: error.message
        });
    }
};

// Get Notifications
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const { limit = 20 } = req.query;

        const notifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        const unreadCount = await Notification.countDocuments({
            user: userId,
            isRead: false
        });

        res.json({
            success: true,
            notifications,
            unreadCount
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch notifications',
            error: error.message
        });
    }
};

// Mark Notification as Read
export const markNotificationRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user._id;

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, user: userId },
            { isRead: true, readAt: Date.now() },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.json({
            success: true,
            notification
        });
    } catch (error) {
        console.error('Mark notification read error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark notification as read',
            error: error.message
        });
    }
};

// Get Certificates
export const getCertificates = async (req, res) => {
    try {
        const userId = req.user._id;

        const certificates = await EventRegistration.find({
            user: userId,
            certificateIssued: true
        })
            .populate('event', 'title eventDate')
            .select('event certificateUrl attendedAt')
            .sort({ attendedAt: -1 });

        res.json({
            success: true,
            certificates
        });
    } catch (error) {
        console.error('Get certificates error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch certificates',
            error: error.message
        });
    }
};
