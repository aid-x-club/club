import {
  exchangeOAuthCode,
  getUserProfile,
  generateInstallationToken,
  createRepoFromTemplate,
  addCollaborator,
  verifyWebhookSignature,
} from '../services/github.service.js';

/**
 * Initiate GitHub OAuth login
 * Redirects user to GitHub for authorization
 */
export const initiateGitHubLogin = (req, res) => {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_CALLBACK_URL;

    if (!clientId || !redirectUri) {
      return res.status(500).json({ error: 'GitHub OAuth not configured' });
    }

    const scope = 'user:email read:user'; // Minimal scopes for user info
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    res.json({ authUrl });
  } catch (error) {
    console.error('Error initiating GitHub login:', error);
    res.status(500).json({ error: 'Failed to initiate GitHub login' });
  }
};

/**
 * GitHub OAuth callback
 * Exchange authorization code for access token and retrieve user info
 */
export const githubCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Missing authorization code' });
    }

    // Exchange code for access token
    const accessToken = await exchangeOAuthCode(code);

    // Get user profile
    const userProfile = await getUserProfile(accessToken);

    // TODO: In production with Supabase, save/update user here
    // For now, we return the profile and let frontend store it

    res.json({
      success: true,
      user: {
        username: userProfile.username,
        userId: userProfile.userId,
        name: userProfile.name,
        avatarUrl: userProfile.avatarUrl,
        email: userProfile.email,
      },
      message: 'GitHub connected successfully',
    });
  } catch (error) {
    console.error('Error in GitHub callback:', error);
    res.status(500).json({ error: error.message || 'GitHub callback failed' });
  }
};

/**
 * Create a new project repository from template
 * Only callable with valid GitHub installation
 */
export const createProjectRepository = async (req, res) => {
  try {
    const { templateOwner, templateRepo, newRepoName, studentGithubUsername } = req.body;

    // Validate required fields
    if (!templateOwner || !templateRepo || !newRepoName || !studentGithubUsername) {
      return res.status(400).json({
        error: 'Missing required fields: templateOwner, templateRepo, newRepoName, studentGithubUsername',
      });
    }

    // Get installation ID (org installation)
    const installationId = process.env.GITHUB_INSTALLATION_ID;
    if (!installationId) {
      return res.status(500).json({
        error: 'GitHub App not installed on organization',
      });
    }

    // Generate installation token
    const installationToken = await generateInstallationToken(installationId);

    // Create repository from template
    const newRepo = await createRepoFromTemplate(
      installationToken,
      templateOwner,
      templateRepo,
      newRepoName,
      true // private repo
    );

    // Add student as collaborator
    const orgName = process.env.GITHUB_ORG || 'aid-x-club';
    await addCollaborator(installationToken, orgName, newRepoName, studentGithubUsername, 'push');

    res.status(201).json({
      success: true,
      repository: {
        name: newRepo.name,
        url: newRepo.url,
        fullName: newRepo.fullName,
        collaborator: studentGithubUsername,
      },
      message: 'Project repository created successfully',
    });
  } catch (error) {
    console.error('Error creating project repository:', error);
    res.status(500).json({ error: error.message || 'Failed to create project repository' });
  }
};

/**
 * Webhook endpoint for GitHub App events
 * Verifies signature and processes events
 */
export const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-hub-signature-256'];
    const eventType = req.headers['x-github-event'];
    const payload = JSON.stringify(req.body);

    // Verify webhook signature
    if (!verifyWebhookSignature(payload, signature)) {
      console.warn('Invalid webhook signature received');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Log supported event types
    const supportedEvents = ['installation', 'installation_repositories', 'repository'];
    if (!supportedEvents.includes(eventType)) {
      console.log(`Received unsupported event type: ${eventType}`);
      return res.status(200).json({ message: 'Event received but not processed' });
    }

    // Process based on event type
    switch (eventType) {
      case 'installation':
        console.log('Installation event:', req.body.action);
        // Handle installation created/deleted
        if (req.body.action === 'created') {
          console.log(`GitHub App installed on: ${req.body.installation.account.login}`);
        } else if (req.body.action === 'deleted') {
          console.log(`GitHub App uninstalled from: ${req.body.installation.account.login}`);
        }
        break;

      case 'installation_repositories':
        console.log('Installation repositories event:', req.body.action);
        // Handle repository added/removed to installation
        if (req.body.action === 'added') {
          console.log(`Repositories added to installation:`, req.body.repositories_added);
        } else if (req.body.action === 'removed') {
          console.log(`Repositories removed from installation:`, req.body.repositories_removed);
        }
        break;

      case 'repository':
        console.log('Repository event:', req.body.action);
        // Handle repository events (created, deleted, etc.)
        console.log(`Repository ${req.body.action}: ${req.body.repository.full_name}`);
        break;

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
};

/**
 * Get GitHub login URL (for frontend)
 * Can be used as an alternative to redirecting directly
 */
export const getGitHubLoginUrl = (req, res) => {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_CALLBACK_URL;

    if (!clientId || !redirectUri) {
      return res.status(500).json({ error: 'GitHub OAuth not configured' });
    }

    const scope = 'user:email read:user';
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    res.json({ loginUrl: authUrl });
  } catch (error) {
    console.error('Error getting GitHub login URL:', error);
    res.status(500).json({ error: 'Failed to get login URL' });
  }
};
