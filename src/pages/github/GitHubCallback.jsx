import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './GitHubCallback.css';

export default function GitHubCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState('');
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls in React StrictMode
    if (!hasProcessed.current) {
      hasProcessed.current = true;
      handleCallback();
    }
  }, []);

  const handleCallback = async () => {
    try {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        setError(`GitHub authorization failed: ${errorParam}`);
        setStatus('error');
        return;
      }

      if (!code) {
        setError('No authorization code received from GitHub');
        setStatus('error');
        return;
      }

      // Verify state for CSRF protection
      const savedState = localStorage.getItem('github_oauth_state');
      if (savedState && state !== savedState) {
        setError('Invalid state parameter - possible CSRF attack');
        setStatus('error');
        return;
      }

      // Clear saved state
      localStorage.removeItem('github_oauth_state');

      console.log('Processing GitHub callback with code:', code);

      // Send code to backend
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/github/callback`,
        {
          params: { code, state },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      console.log('Callback response:', response.data);

      if (response.data.success) {
        setStatus('success');

        // Get user role from localStorage to determine redirect
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const dashboardPath = user.role === 'coordinator' ? '/admin/dashboard' : '/student/dashboard';

        // Redirect to appropriate dashboard after 2 seconds
        setTimeout(() => {
          navigate(dashboardPath, {
            state: {
              message: `GitHub connected as ${response.data.githubUsername}`,
              githubConnected: true
            }
          });
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to connect GitHub account');
        setStatus('error');
      }
    } catch (err) {
      console.error('Callback error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to connect GitHub account');
      setStatus('error');
    }
  };

  return (
    <div className="github-callback-container">
      <div className="github-callback-card">
        {status === 'processing' && (
          <>
            <div className="callback-spinner"></div>
            <h2>Connecting GitHub Account...</h2>
            <p>Please wait while we complete the connection</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="callback-success-icon">✓</div>
            <h2>GitHub Connected Successfully!</h2>
            <p>Redirecting you to dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="callback-error-icon">✕</div>
            <h2>Connection Failed</h2>
            <p className="error-message">{error}</p>
            <div className="error-actions">
              <button
                onClick={() => {
                  const user = JSON.parse(localStorage.getItem('user') || '{}');
                  const dashboardPath = user.role === 'coordinator' ? '/admin/dashboard' : '/student/dashboard';
                  navigate(dashboardPath);
                }}
                className="btn-back"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn-retry"
              >
                Try Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
