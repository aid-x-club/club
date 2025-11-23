import { useState, useCallback } from 'react';
import axios from 'axios';

/**
 * Hook for GitHub OAuth integration
 * Handles login flow and project creation
 */
export const useGitHubIntegration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [githubUser, setGithubUser] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  /**
   * Initiate GitHub OAuth login
   */
  const initiateLogin = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(`${API_URL}/api/github/login`);
      const { loginUrl } = response.data;

      // Redirect to GitHub
      window.location.href = loginUrl;
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      setError(`Failed to initiate login: ${message}`);
      console.error('GitHub login error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Handle GitHub OAuth callback
   * Call this in your callback route component
   */
  const handleCallback = useCallback(async (code) => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(`${API_URL}/api/github/callback`, {
        params: { code },
      });

      if (response.data.success) {
        const user = response.data.user;
        setGithubUser(user);

        // Store in localStorage or context
        localStorage.setItem('githubUser', JSON.stringify(user));
        localStorage.setItem('githubConnected', 'true');

        return user;
      } else {
        throw new Error(response.data.error || 'GitHub callback failed');
      }
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      setError(`GitHub callback failed: ${message}`);
      console.error('GitHub callback error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new project repository
   */
  const createProject = useCallback(
    async (templateName, projectName, studentUsername = githubUser?.username) => {
      try {
        if (!studentUsername) {
          throw new Error('Student GitHub username not available');
        }

        setLoading(true);
        setError('');

        const response = await axios.post(`${API_URL}/api/github/create-project`, {
          templateOwner: 'aid-x-club',
          templateRepo: templateName,
          newRepoName: projectName,
          studentGithubUsername: studentUsername,
        });

        if (response.data.success) {
          return response.data.repository;
        } else {
          throw new Error(response.data.error || 'Failed to create project');
        }
      } catch (err) {
        const message = err.response?.data?.error || err.message;
        setError(`Project creation failed: ${message}`);
        console.error('Project creation error:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [githubUser]
  );

  /**
   * Check if user is connected to GitHub
   */
  const isConnected = useCallback(() => {
    const stored = localStorage.getItem('githubUser');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setGithubUser(user);
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  }, []);

  /**
   * Disconnect GitHub account
   */
  const disconnect = useCallback(() => {
    setGithubUser(null);
    localStorage.removeItem('githubUser');
    localStorage.removeItem('githubConnected');
  }, []);

  return {
    githubUser,
    loading,
    error,
    initiateLogin,
    handleCallback,
    createProject,
    isConnected,
    disconnect,
  };
};
