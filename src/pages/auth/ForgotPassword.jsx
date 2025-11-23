import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate email
      if (!email || !email.includes('@')) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // Make forgot password request
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        { email }
      );

      setSuccess('Password reset link has been sent to your email!');
      setSubmitted(true);
      setEmail('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send reset link. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="accent-gradient"></div>

      <div className="forgot-password-box">
        <div className="forgot-password-header">
          <h1>Reset Password</h1>
          <p>Enter your email to receive a password reset link</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {!submitted ? (
          <>
            <form onSubmit={handleSubmit} className="forgot-password-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="your.email@college.edu"
                  value={email}
                  onChange={handleChange}
                  disabled={loading}
                  autoFocus
                />
                <small>We'll send a reset link to this email</small>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <p className="form-footer">
              Remember your password?{' '}
              <Link to="/login">Go back to login</Link>
            </p>
          </>
        ) : (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Check your email</h2>
            <p>We've sent a password reset link to your email address.</p>
            <p className="small-text">If you don't see the email, check your spam folder.</p>
            <Link to="/login" className="btn-primary">
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
