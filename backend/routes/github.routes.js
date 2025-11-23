import express from 'express';
import {
  initiateGitHubLogin,
  githubCallback,
  createProjectRepository,
  handleWebhook,
  getGitHubLoginUrl,
} from '../controllers/github.controller.js';

const router = express.Router();

/**
 * GET /api/github/login
 * Get GitHub OAuth login URL
 */
router.get('/login', getGitHubLoginUrl);

/**
 * GET /api/github/callback
 * GitHub OAuth callback endpoint
 * Expected query params: code, state
 */
router.get('/callback', githubCallback);

/**
 * POST /api/github/create-project
 * Create a new project repository from template
 * Body:
 *   - templateOwner: string (e.g., "aid-x-club")
 *   - templateRepo: string (e.g., "template-starter")
 *   - newRepoName: string (e.g., "my-project")
 *   - studentGithubUsername: string
 */
router.post('/create-project', createProjectRepository);

/**
 * POST /api/github/webhook
 * Webhook endpoint for GitHub App events
 * Verifies signature and processes events
 */
router.post('/webhook', handleWebhook);

export default router;
