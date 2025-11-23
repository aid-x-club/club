import express from 'express';
import { body, validationResult, query } from 'express-validator';
import {
  createEvent,
  getAllEvents,
  getEventById,
  getUserRegisteredEvents,
  getOrganizerEvents,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  markAttendance,
  likeEvent,
  saveEvent,
  getFeaturedEvents,
  getUpcomingEvents
} from '../controllers/event.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array(),
    });
  }
  next();
};

// Public routes
router.get('/featured', getFeaturedEvents);
router.get('/upcoming', getUpcomingEvents);

router.get(
  '/',
  [
    query('category').optional().trim(),
    query('eventType').optional().trim(),
    query('status').optional().isIn(['upcoming', 'ongoing', 'completed', 'cancelled']),
    query('sort').optional().isIn(['trending', 'recent', 'upcoming']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().trim().isLength({ min: 1 }),
  ],
  handleValidationErrors,
  getAllEvents
);

router.get('/:id', getEventById);
router.get('/organizer/:userId', getOrganizerEvents);

// Private routes (require authentication)
router.post(
  '/',
  protect,
  [
    body('title')
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),
    body('description')
      .trim()
      .isLength({ min: 10 })
      .withMessage('Description must be at least 10 characters'),
    body('eventType')
      .isIn(['workshop', 'hackathon', 'seminar', 'webinar', 'meetup', 'competition', 'conference', 'other'])
      .withMessage('Invalid event type'),
    body('category')
      .isIn(['web', 'mobile', 'ai-ml', 'blockchain', 'iot', 'game', 'general', 'other'])
      .withMessage('Invalid category'),
    body('startDate')
      .isISO8601()
      .withMessage('Invalid start date'),
    body('endDate')
      .isISO8601()
      .withMessage('Invalid end date'),
  ],
  handleValidationErrors,
  createEvent
);

router.put(
  '/:id',
  protect,
  [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10 })
      .withMessage('Description must be at least 10 characters'),
    body('eventType')
      .optional()
      .isIn(['workshop', 'hackathon', 'seminar', 'webinar', 'meetup', 'competition', 'conference', 'other'])
      .withMessage('Invalid event type'),
  ],
  handleValidationErrors,
  updateEvent
);

router.delete('/:id', protect, deleteEvent);

// Registration routes
router.post('/:id/register', protect, registerForEvent);
router.delete('/:id/register', protect, unregisterFromEvent);
router.get('/user/registered', protect, getUserRegisteredEvents);

// Attendance routes
router.post('/:id/attendance/:userId', protect, markAttendance);

// Social engagement routes
router.post('/:id/like', protect, likeEvent);
router.post('/:id/save', protect, saveEvent);

export default router;
