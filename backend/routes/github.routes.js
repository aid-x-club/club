import express from 'express';
import {
  initiateGitHubLogin,
  handleGitHubCallback,
  createProjectRepository,
  handleGitHubWebhook,
  getGitHubStatus,
  disconnectGitHub
} from '../controllers/github.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/github/login
 * Initiate GitHub OAuth flow - returns authorization URL
 */
router.get('/login', initiateGitHubLogin);

/**
 * GET /api/github/callback
 * GitHub OAuth callback endpoint
 * Expected query params: code, state
 * Requires authentication (user must be logged in)
 */
router.get('/callback', protect, handleGitHubCallback);

/**
 * POST /api/github/create-project
 * Create a new project repository from template
 * Requires authentication
 * Body:
 *   - templateOwner: string (default: "aid-x-club")
 *   - templateRepo: string (required)
 *   - newRepoName: string (required)
 *   - studentGithubUsername: string (required)
 *   - isPrivate: boolean (default: true)
 */
router.post('/create-project', protect, createProjectRepository);

/**
 * POST /api/github/webhook
 * Webhook endpoint for GitHub App events
 * Verifies signature and processes events
 * No authentication required (verified by signature)
 */
router.post('/webhook', handleGitHubWebhook);

/**
 * GET /api/github/status
 * Get GitHub connection status for current user
 * Requires authentication
 */
router.get('/status', protect, getGitHubStatus);

/**
 * POST /api/github/disconnect
 * Disconnect GitHub account from user profile
 * Requires authentication
 */
router.post('/disconnect', protect, disconnectGitHub);

export default router;
