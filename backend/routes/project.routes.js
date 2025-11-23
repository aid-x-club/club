import express from 'express';
import { body, validationResult, query } from 'express-validator';
import {
  createProject,
  getAllProjects,
  getProjectById,
  getUserProjects,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember,
  likeProject,
  saveProject,
  getFeaturedProjects,
  getTrendingProjects
} from '../controllers/project.controller.js';
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
router.get('/trending', getTrendingProjects);
router.get('/featured', getFeaturedProjects);

router.get(
  '/',
  [
    query('category').optional().trim(),
    query('status').optional().trim(),
    query('sort').optional().isIn(['trending', 'recent', 'popular']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().trim().isLength({ min: 1 }),
  ],
  handleValidationErrors,
  getAllProjects
);

router.get('/:id', getProjectById);
router.get('/user/:userId', getUserProjects);

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
    body('category')
      .isIn([
        'web',
        'mobile',
        'ai-ml',
        'blockchain',
        'iot',
        'game',
        'desktop',
        'other',
      ])
      .withMessage('Invalid category'),
    body('technologies').optional().isArray(),
    body('repositoryUrl')
      .optional()
      .isURL()
      .withMessage('Invalid repository URL'),
    body('liveUrl').optional().isURL().withMessage('Invalid live URL'),
  ],
  handleValidationErrors,
  createProject
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
    body('category')
      .optional()
      .isIn([
        'web',
        'mobile',
        'ai-ml',
        'blockchain',
        'iot',
        'game',
        'desktop',
        'other',
      ])
      .withMessage('Invalid category'),
  ],
  handleValidationErrors,
  updateProject
);

router.delete('/:id', protect, deleteProject);

// Team member routes
router.post(
  '/:id/members',
  protect,
  [body('userId').isMongoId().withMessage('Invalid user ID')],
  handleValidationErrors,
  addTeamMember
);

router.delete(
  '/:id/members/:userId',
  protect,
  removeTeamMember
);

// Social engagement routes
router.post('/:id/like', protect, likeProject);
router.post('/:id/save', protect, saveProject);

export default router;
