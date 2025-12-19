import GitHubService from '../services/github.service.js';
import User from '../models/User.js';
import crypto from 'crypto';

// Create service instance lazily (after env vars are loaded)
let githubService = null;
function getGitHubService() {
  if (!githubService) {
    githubService = new GitHubService();
  }
  return githubService;
}

/**
 * Initiate GitHub OAuth flow
 * GET /api/github/login
 */
export const initiateGitHubLogin = async (req, res) => {
  try {
    console.log('🔗 Initiating GitHub login...');

    // Generate a random state for CSRF protection
    const state = crypto.randomBytes(16).toString('hex');

    // Store state in session or return it to frontend to store
    const authUrl = getGitHubService().getAuthorizationUrl(state);

    console.log('✅ GitHub auth URL generated:', authUrl);

    res.json({
      success: true,
      authUrl,
      state
    });
  } catch (error) {
    console.error('❌ Error initiating GitHub login:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate GitHub login',
      error: error.message
    });
  }
};

/**
 * Handle GitHub OAuth callback
 * GET /api/github/callback
 */
export const handleGitHubCallback = async (req, res) => {
  try {
    console.log('📥 GitHub callback received');
    console.log('  - User authenticated:', !!req.user);
    console.log('  - req.user:', JSON.stringify(req.user));

    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required'
      });
    }

    // Exchange code for access token
    const accessToken = await getGitHubService().exchangeCodeForToken(code);
    console.log('✅ Access token received');

    // Get GitHub user information
    const githubUser = await getGitHubService().getGitHubUser(accessToken);
    console.log('✅ GitHub user fetched:', githubUser.username);

    // Update user in database with GitHub information
    if (req.user) {
      // Handle different JWT payload structures
      const userId = req.user.id || req.user.userId || req.user._id;
      console.log('  - Extracted user ID:', userId);

      const user = await User.findById(userId);
      if (user) {
        console.log('📝 Updating user in database...');
        user.githubUsername = githubUser.username;
        user.githubId = githubUser.id.toString();
        user.githubConnected = true;
        user.githubAvatarUrl = githubUser.avatarUrl;
        await user.save();
        console.log('✅ User updated successfully');
      } else {
        console.warn('⚠️  User not found in database');
      }
    } else {
      console.warn('⚠️  No authenticated user in request');
    }

    res.json({
      success: true,
      message: 'GitHub account connected successfully',
      githubUsername: githubUser.username,
      githubId: githubUser.id,
      githubConnected: true
    });
  } catch (error) {
    console.error('❌ Error handling GitHub callback:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to connect GitHub account'
    });
  }
};

/**
 * Create repository from template
 * POST /api/github/create-project
 */
export const createProjectRepository = async (req, res) => {
  try {
    const {
      templateOwner = 'aid-x-club',
      templateRepo,
      newRepoName,
      studentGithubUsername,
      isPrivate = true
    } = req.body;

    // Validation
    if (!templateRepo || !newRepoName || !studentGithubUsername) {
      return res.status(400).json({
        success: false,
        message: 'Template repo, new repo name, and student GitHub username are required'
      });
    }

    // Create repository from template
    const result = await getGitHubService().createRepositoryFromTemplate({
      templateOwner,
      templateRepo,
      newRepoName,
      studentGithubUsername,
      isPrivate
    });

    res.json({
      success: true,
      message: 'Repository created successfully',
      data: result
    });
  } catch (error) {
    console.error('Error creating project repository:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create repository'
    });
  }
};

/**
 * Handle GitHub webhooks
 * POST /api/github/webhook
 */
export const handleGitHubWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-hub-signature-256'];
    const event = req.headers['x-github-event'];
    const payload = JSON.stringify(req.body);

    // Verify webhook signature
    if (signature) {
      const isValid = getGitHubService().verifyWebhookSignature(payload, signature);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return res.status(401).json({
          success: false,
          message: 'Invalid signature'
        });
      }
    }

    console.log(`📥 Received GitHub webhook: ${event}`);

    // Handle different event types
    switch (event) {
      case 'installation':
        console.log('Installation event:', {
          action: req.body.action,
          installation_id: req.body.installation?.id
        });
        break;

      case 'installation_repositories':
        console.log('Installation repositories event:', {
          action: req.body.action,
          repositories_added: req.body.repositories_added?.length || 0,
          repositories_removed: req.body.repositories_removed?.length || 0
        });
        break;

      case 'repository':
        console.log('Repository event:', {
          action: req.body.action,
          repository: req.body.repository?.full_name
        });
        break;

      case 'push':
        console.log('Push event:', {
          repository: req.body.repository?.full_name,
          ref: req.body.ref,
          commits: req.body.commits?.length || 0
        });
        break;

      case 'pull_request':
        console.log('Pull request event:', {
          action: req.body.action,
          repository: req.body.repository?.full_name,
          pr_number: req.body.pull_request?.number
        });
        break;

      default:
        console.log(`Unhandled event type: ${event}`);
    }

    // Acknowledge receipt
    res.status(200).json({
      success: true,
      message: 'Webhook received'
    });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process webhook'
    });
  }
};

/**
 * Get GitHub connection status
 * GET /api/github/status
 */
export const getGitHubStatus = async (req, res) => {
  try {
    console.log('🔍 Checking GitHub status...');
    console.log('  - req.user:', JSON.stringify(req.user));

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // Handle different JWT payload structures
    const userId = req.user.id || req.user.userId || req.user._id;
    console.log('  - Extracted user ID:', userId);

    const user = await User.findById(userId);

    if (!user) {
      console.warn('⚠️  User not found with ID:', userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('✅ GitHub status:', {
      connected: user.githubConnected,
      username: user.githubUsername
    });

    res.json({
      success: true,
      githubConnected: user.githubConnected || false,
      githubUsername: user.githubUsername || null,
      githubId: user.githubId || null
    });
  } catch (error) {
    console.error('❌ Error getting GitHub status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get GitHub status'
    });
  }
};

/**
 * Disconnect GitHub account
 * POST /api/github/disconnect
 */
export const disconnectGitHub = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // Handle different JWT payload structures
    const userId = req.user.id || req.user.userId || req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.githubUsername = null;
    user.githubId = null;
    user.githubConnected = false;
    user.githubAvatarUrl = null;
    await user.save();

    res.json({
      success: true,
      message: 'GitHub account disconnected successfully'
    });
  } catch (error) {
    console.error('Error disconnecting GitHub:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disconnect GitHub account'
    });
  }
};
