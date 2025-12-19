import express from 'express';
import {
    getDashboardStats,
    getUserProfile,
    updateUserProfile,
    changePassword,
    updateSettings,
    getEvents,
    getMyEvents,
    registerForEvent,
    cancelEventRegistration,
    getMyProjects,
    getAllProjects,
    getAchievements,
    getLeaderboard,
    getResources,
    getAnnouncements,
    getNotifications,
    markNotificationRead,
    getCertificates
} from '../controllers/student.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Profile
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.put('/profile/password', changePassword);
router.put('/settings', updateSettings);

// Events
router.get('/events', getEvents);
router.get('/events/my-events', getMyEvents);
router.post('/events/register', registerForEvent);
router.delete('/events/register/:eventId', cancelEventRegistration);

// Projects
router.get('/projects/my-projects', getMyProjects);
router.get('/projects/browse', getAllProjects);

// Achievements
router.get('/achievements', getAchievements);
router.get('/leaderboard', getLeaderboard);

// Resources
router.get('/resources', getResources);

// Communication
router.get('/announcements', getAnnouncements);
router.get('/notifications', getNotifications);
router.put('/notifications/:notificationId/read', markNotificationRead);

// Certificates
router.get('/certificates', getCertificates);

export default router;
