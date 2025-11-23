import axios from 'axios';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// GitHub API base URL
const GITHUB_API_URL = 'https://api.github.com';

/**
 * Generate a GitHub App installation access token
 * Uses the app's private key to create a JWT, then exchanges it for an installation token
 */
export const generateInstallationToken = async (installationId) => {
  try {
    const privateKey = process.env.GITHUB_PRIVATE_KEY;
    const appId = process.env.GITHUB_APP_ID;

    if (!privateKey || !appId) {
      throw new Error('Missing GitHub App credentials (GITHUB_PRIVATE_KEY or GITHUB_APP_ID)');
    }

    // Create JWT for app authentication
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iat: now,
      exp: now + 600, // JWT valid for 10 minutes
      iss: appId,
    };

    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

    // Exchange JWT for installation token
    const response = await axios.post(
      `${GITHUB_API_URL}/app/installations/${installationId}/access_tokens`,
      {},
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.token;
  } catch (error) {
    console.error('Error generating installation token:', error.message);
    throw new Error(`Failed to generate GitHub installation token: ${error.message}`);
  }
};

/**
 * Exchange GitHub OAuth code for access token
 */
export const exchangeOAuthCode = async (code) => {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Missing GitHub OAuth credentials');
    }

    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (response.data.error) {
      throw new Error(response.data.error_description || response.data.error);
    }

    return response.data.access_token;
  } catch (error) {
    console.error('Error exchanging OAuth code:', error.message);
    throw new Error(`Failed to exchange OAuth code: ${error.message}`);
  }
};

/**
 * Get authenticated user's GitHub profile
 */
export const getUserProfile = async (accessToken) => {
  try {
    const response = await axios.get(`${GITHUB_API_URL}/user`, {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    return {
      username: response.data.login,
      userId: response.data.id,
      name: response.data.name,
      avatarUrl: response.data.avatar_url,
      email: response.data.email,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    throw new Error(`Failed to fetch GitHub profile: ${error.message}`);
  }
};

/**
 * Create a new repository from a template
 */
export const createRepoFromTemplate = async (
  installationToken,
  templateOwner,
  templateRepo,
  newRepoName,
  isPrivate = true
) => {
  try {
    // Get organization from environment
    const orgName = process.env.GITHUB_ORG || 'aid-x-club';

    const response = await axios.post(
      `${GITHUB_API_URL}/repos/${templateOwner}/${templateRepo}/generate`,
      {
        owner: orgName,
        name: newRepoName,
        description: `Project: ${newRepoName} created via AID-X Club Portal`,
        private: isPrivate,
        include_all_branches: false,
      },
      {
        headers: {
          Authorization: `token ${installationToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    return {
      name: response.data.name,
      url: response.data.html_url,
      fullName: response.data.full_name,
      id: response.data.id,
    };
  } catch (error) {
    console.error('Error creating repo from template:', error.message);
    if (error.response?.data) {
      console.error('GitHub API error:', error.response.data);
    }
    throw new Error(`Failed to create repository: ${error.message}`);
  }
};

/**
 * Add collaborator to repository
 */
export const addCollaborator = async (
  installationToken,
  owner,
  repo,
  username,
  permission = 'push'
) => {
  try {
    const response = await axios.put(
      `${GITHUB_API_URL}/repos/${owner}/${repo}/collaborators/${username}`,
      {
        permission, // 'pull', 'push', 'admin', 'maintain', 'triage'
      },
      {
        headers: {
          Authorization: `token ${installationToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    return {
      username,
      permission,
      status: response.status,
    };
  } catch (error) {
    console.error('Error adding collaborator:', error.message);
    throw new Error(`Failed to add collaborator: ${error.message}`);
  }
};

/**
 * Verify webhook signature
 */
export const verifyWebhookSignature = (payload, signature) => {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    console.warn('GITHUB_WEBHOOK_SECRET not configured, skipping verification');
    return true;
  }

  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');

  return crypto.timingSafeEqual(digest, signature);
};

/**
 * Get installation ID for the organization
 * Required to generate installation tokens
 */
export const getOrgInstallationId = async (appToken) => {
  try {
    const orgName = process.env.GITHUB_ORG || 'aid-x-club';

    const response = await axios.get(
      `${GITHUB_API_URL}/orgs/${orgName}/installation`,
      {
        headers: {
          Authorization: `Bearer ${appToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    return response.data.id;
  } catch (error) {
    console.error('Error getting organization installation:', error.message);
    throw new Error(`Failed to get organization installation: ${error.message}`);
  }
};
