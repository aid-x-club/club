import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Lottie from 'lottie-react';
import codingAnimation from '../../assets/Coding.json';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [backgroundAnimation] = useState(codingAnimation);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate inputs
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (!formData.email.includes('@')) {
        setError('Please enter a valid email');
        setLoading(false);
        return;
      }

      // Make login request
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );

      // Validate response
      if (!response.data || !response.data.token || !response.data.user) {
        throw new Error('Invalid response from server');
      }

      // Store token and user data
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Store remember me preference
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('rememberEmail', formData.email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('rememberEmail');
      }

      setSuccess('Login successful! Redirecting...');
      
      // Get the intended redirect URL or use default based on role
      const redirectPath = localStorage.getItem('redirectPath');
      
      // Redirect based on user role or intended path
      setTimeout(() => {
        if (redirectPath) {
          localStorage.removeItem('redirectPath');
          navigate(redirectPath);
        } else if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (user.role === 'coordinator') {
          navigate('/coordinator/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }, 1000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Pre-fill email if remember me was previously checked
  const rememberEmail = localStorage.getItem('rememberEmail') || '';
  const wasRemembered = localStorage.getItem('rememberMe') === 'true';

  return (
    <div className="login-container">
      <div className="accent-gradient"></div>

      {/* Background Animation */}
      {backgroundAnimation && (
        <div className="login-background-animation">
          <Lottie animationData={backgroundAnimation} loop={true} />
        </div>
      )}

      <div className="login-box">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Login to your AID-X account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your@gmail.com"
              value={rememberEmail && wasRemembered ? rememberEmail : formData.email}
              onChange={handleChange}
              disabled={loading}
              autoFocus
            />
            <small>Use your registered email</small>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            <small>
              <Link to="/forgot-password" className="forgot-link">
                Forgot your password?
              </Link>
            </small>
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              disabled={loading}
            />
            <label htmlFor="rememberMe">Remember me on this device</label>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="form-footer">
          Don't have an account?{' '}
          <Link to="/signup">Create one here</Link>
        </p>
      </div>
    </div>
  );
}
