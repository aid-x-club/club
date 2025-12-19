import { useState, useEffect } from 'react';
import axios from 'axios';
import './GitHubConnect.css';

export default function GitHubConnect({ onConnectionChange }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [githubStatus, setGithubStatus] = useState({
    connected: false,
    username: null,
    githubId: null
  });

  useEffect(() => {
    checkGitHubStatus();
  }, []);

  const checkGitHubStatus = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/github/status`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      if (response.data.success) {
        setGithubStatus({
          connected: response.data.githubConnected,
          username: response.data.githubUsername,
          githubId: response.data.githubId
        });

        if (onConnectionChange) {
          onConnectionChange(response.data.githubConnected, response.data.githubUsername);
        }
      }
    } catch (err) {
      console.error('Error checking GitHub status:', err);
    }
  };

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/github/login`
      );

      if (response.data.success) {
        localStorage.setItem('github_oauth_state', response.data.state);
        window.location.href = response.data.authUrl;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate GitHub connection');
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect your GitHub account?')) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/github/disconnect`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      if (response.data.success) {
        setGithubStatus({
          connected: false,
          username: null,
          githubId: null
        });

        if (onConnectionChange) {
          onConnectionChange(false, null);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to disconnect GitHub account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="github-connect-container">
      <div className="github-connect-header">
        <div className="github-icon">
          <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </div>
        <div className="github-connect-info">
          <h3>GitHub Account</h3>
          <p>Connect your GitHub account to create and manage projects</p>
        </div>
      </div>

      {error && (
        <div className="github-error">
          ❌ {error}
        </div>
      )}

      {githubStatus.connected ? (
        <div className="github-connected">
          <div className="github-status-badge">
            <span className="status-icon">✓</span>
            <span className="status-text">Connected</span>
          </div>
          <div className="github-username">
            <strong>GitHub Username:</strong> {githubStatus.username}
          </div>
          <button
            onClick={handleDisconnect}
            disabled={loading}
            className="btn-disconnect"
          >
            {loading ? 'Disconnecting...' : 'Disconnect GitHub'}
          </button>
        </div>
      ) : (
        <div className="github-not-connected">
          <div className="github-status-badge not-connected">
            <span className="status-icon">○</span>
            <span className="status-text">Not Connected</span>
          </div>
          <p className="github-connect-description">
            Connect your GitHub account to start creating projects from templates
          </p>
          <button
            onClick={handleConnect}
            disabled={loading}
            className="btn-connect-github"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Connecting...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                Connect GitHub Account
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
