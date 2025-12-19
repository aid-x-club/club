import jwt from 'jsonwebtoken';
import axios from 'axios';
import crypto from 'crypto';

// GitHub App Configuration
const GITHUB_APP_ID = '2336011';
const GITHUB_CLIENT_ID = 'Iv23lirQH6xRiB6W3KXz';

class GitHubService {
  constructor() {
    this.clientSecret = process.env.GITHUB_CLIENT_SECRET;
    this.privateKey = process.env.GITHUB_PRIVATE_KEY;
    this.webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

    // Debug logging
    console.log('🔍 GitHub Service Initialization:');
    console.log('  - Client Secret:', this.clientSecret ? `Set (${this.clientSecret.substring(0, 10)}...)` : 'NOT SET');
    console.log('  - Private Key:', this.privateKey ? `Set (${this.privateKey.substring(0, 50)}...)` : 'NOT SET');
    console.log('  - Webhook Secret:', this.webhookSecret ? 'Set' : 'NOT SET');

    if (!this.clientSecret) {
      console.warn('⚠️  GITHUB_CLIENT_SECRET not set');
    }
    if (!this.privateKey) {
      console.warn('⚠️  GITHUB_PRIVATE_KEY not set');
    }
  }

  /**
   * Generate JWT for GitHub App authentication
   */
  generateJWT() {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iat: now - 60, // Issued 60 seconds in the past to account for clock drift
      exp: now + (10 * 60), // Expires in 10 minutes
      iss: GITHUB_APP_ID
    };

    return jwt.sign(payload, this.privateKey, { algorithm: 'RS256' });
  }

  /**
   * Get installation access token for the GitHub App
   */
  async getInstallationToken(installationId) {
    try {
      const jwtToken = this.generateJWT();

      const response = await axios.post(
        `https://api.github.com/app/installations/${installationId}/access_tokens`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
          }
        }
      );

      return response.data.token;
    } catch (error) {
      console.error('Error getting installation token:', error.response?.data || error.message);
      throw new Error('Failed to get installation token');
    }
  }

  /**
   * Get the installation ID for the organization
   */
  async getInstallationId() {
    try {
      const jwtToken = this.generateJWT();

      const response = await axios.get(
        'https://api.github.com/app/installations',
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
          }
        }
      );

      // Return the first installation (should be aid-x-club organization)
      if (response.data.length > 0) {
        return response.data[0].id;
      }

      throw new Error('No installations found');
    } catch (error) {
      console.error('Error getting installation ID:', error.response?.data || error.message);
      throw new Error('Failed to get installation ID');
    }
  }

  /**
   * Exchange OAuth code for access token
   */
  async exchangeCodeForToken(code) {
    try {
      console.log('🔄 Exchanging code for token...');
      console.log('  - Client ID:', GITHUB_CLIENT_ID);
      console.log('  - Client Secret:', this.clientSecret ? 'SET' : 'NOT SET');
      console.log('  - Code:', code);

      const response = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: GITHUB_CLIENT_ID,
          client_secret: this.clientSecret,
          code: code
        },
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      console.log('✅ Token exchange response:', response.data);

      if (response.data.error) {
        throw new Error(`GitHub OAuth error: ${response.data.error_description || response.data.error}`);
      }

      return response.data.access_token;
    } catch (error) {
      console.error('❌ Error exchanging code for token:', error.response?.data || error.message);
      throw new Error('Failed to exchange code for token');
    }
  }

  /**
   * Get GitHub user information
   */
  async getGitHubUser(accessToken) {
    try {
      const response = await axios.get(
        'https://api.github.com/user',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/vnd.github+json'
          }
        }
      );

      return {
        id: response.data.id,
        username: response.data.login,
        name: response.data.name,
        email: response.data.email,
        avatarUrl: response.data.avatar_url
      };
    } catch (error) {
      console.error('Error getting GitHub user:', error.response?.data || error.message);
      throw new Error('Failed to get GitHub user');
    }
  }

  /**
   * Create repository from template
   */
  async createRepositoryFromTemplate(params) {
    const { templateOwner, templateRepo, newRepoName, studentGithubUsername, isPrivate = true } = params;

    try {
      // Get installation token
      const installationId = await this.getInstallationId();
      const installationToken = await this.getInstallationToken(installationId);

      // Create repository from template
      const createRepoResponse = await axios.post(
        `https://api.github.com/repos/${templateOwner}/${templateRepo}/generate`,
        {
          owner: templateOwner,
          name: newRepoName,
          description: `Project repository for ${studentGithubUsername}`,
          private: isPrivate,
          include_all_branches: false
        },
        {
          headers: {
            'Authorization': `Bearer ${installationToken}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
          }
        }
      );

      const repoFullName = createRepoResponse.data.full_name;
      const repoUrl = createRepoResponse.data.html_url;

      // Add student as collaborator with push permissions
      await axios.put(
        `https://api.github.com/repos/${repoFullName}/collaborators/${studentGithubUsername}`,
        {
          permission: 'push'
        },
        {
          headers: {
            'Authorization': `Bearer ${installationToken}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
          }
        }
      );

      return {
        repoName: newRepoName,
        repoFullName: repoFullName,
        repoUrl: repoUrl,
        collaboratorAdded: true
      };
    } catch (error) {
      console.error('Error creating repository:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create repository');
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload, signature) {
    if (!this.webhookSecret) {
      console.warn('⚠️  Webhook secret not configured, skipping verification');
      return true;
    }

    const hmac = crypto.createHmac('sha256', this.webhookSecret);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(digest)
    );
  }

  /**
   * Get GitHub OAuth authorization URL
   */
  getAuthorizationUrl(state) {
    // Use environment-specific callback URL
    const callbackUrl = process.env.NODE_ENV === 'production'
      ? 'https://aid-xclub.vercel.app/github/callback'
      : 'http://localhost:5173/github/callback';

    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: callbackUrl,
      scope: 'user:email',
      state: state
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }
}

// Export the class itself, not an instance
export default GitHubService;
