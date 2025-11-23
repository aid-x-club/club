import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGitHubIntegration } from '../../hooks/useGitHubIntegration';

/**
 * GitHub OAuth Callback Component
 * Handles the redirect from GitHub after user authorizes the app
 * 
 * Usage: Add route: <Route path="/github/callback" element={<GitHubCallback />} />
 */
export const GitHubCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleCallback, loading, error } = useGitHubIntegration();

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      console.error('GitHub error:', errorParam);
      navigate('/login?error=github_auth_failed');
      return;
    }

    if (!code) {
      navigate('/login');
      return;
    }

    // Handle callback
    handleCallback(code)
      .then((user) => {
        console.log('GitHub connected:', user);
        // Redirect to dashboard or profile
        navigate('/student/dashboard', { 
          state: { githubConnected: true, user } 
        });
      })
      .catch((err) => {
        console.error('Callback error:', err);
        navigate('/login?error=github_callback_failed');
      });
  }, [searchParams, handleCallback, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {loading && (
        <>
          <h2>Connecting to GitHub...</h2>
          <p>Please wait while we authenticate your account.</p>
        </>
      )}
      {error && (
        <>
          <h2 style={{ color: 'red' }}>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/login')}>Back to Login</button>
        </>
      )}
    </div>
  );
};

export default GitHubCallback;
