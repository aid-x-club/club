import React, { useState } from 'react';
import { useGitHubIntegration } from '../../hooks/useGitHubIntegration';
import './GitHubConnect.css';

/**
 * GitHub Connect Button Component
 * Allows students to connect their GitHub account
 * 
 * Usage: <GitHubConnectButton />
 */
export const GitHubConnectButton = () => {
  const { initiateLogin, loading, error, githubUser, disconnect } = useGitHubIntegration();
  const [showDisconnect, setShowDisconnect] = useState(false);

  if (githubUser) {
    return (
      <div className="github-connected">
        <div className="github-user-info">
          <img 
            src={githubUser.avatarUrl} 
            alt={githubUser.username}
            className="github-avatar"
          />
          <div className="github-user-details">
            <p className="github-username">✓ {githubUser.username}</p>
            <p className="github-name">{githubUser.name}</p>
          </div>
        </div>
        {showDisconnect && (
          <button 
            className="btn-disconnect"
            onClick={() => {
              disconnect();
              setShowDisconnect(false);
            }}
          >
            Disconnect
          </button>
        )}
        <button 
          className="btn-manage"
          onClick={() => setShowDisconnect(!showDisconnect)}
        >
          {showDisconnect ? 'Cancel' : 'Manage'}
        </button>
      </div>
    );
  }

  return (
    <div className="github-connect">
      <button 
        className="btn-github-connect"
        onClick={initiateLogin}
        disabled={loading}
      >
        {loading ? 'Connecting...' : 'Connect GitHub'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default GitHubConnectButton;
