import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Lottie from 'lottie-react';
import codingSlideLottie from '../../assets/CodingSlide.json';
import './SignUp.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Step 1: ID Verification, Step 2: Account Creation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [animationData, setAnimationData] = useState(null);
  const [backgroundAnimation, setBackgroundAnimation] = useState(codingSlideLottie);

  // Step 1: ID Verification
  const [studentId, setStudentId] = useState('');
  const [verifiedStudentId, setVerifiedStudentId] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);

  // Step 2: Account Creation
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    year: '',
    section: ''
  });

  // Step 1: Verify Student ID
  const handleVerifyId = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-id`,
        { studentId: studentId.toUpperCase() }
      );

      // Use actual student data from CSV via API
      setVerifiedStudentId(studentId.toUpperCase());
      
      // Parse the year to extract the numeric part (e.g., "3rd Year" -> "3rd")
      const yearValue = response.data.studentData?.year?.split(' ')[0] || '';
      
      setStudentDetails({
        fullName: response.data.studentData?.name || 'Unknown',
        year: yearValue,
        section: 'A' // Section not provided in CSV, user will enter it
      });
      setFormData(prev => ({
        ...prev,
        fullName: response.data.studentData?.name || 'Unknown',
        year: yearValue,
        section: ''
      }));

      setSuccess('Student ID verified successfully!');
      setTimeout(() => {
        setStep(2);
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify Student ID');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Create Account
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      const signupData = {
        studentId: verifiedStudentId,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        year: formData.year,
        section: formData.section
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        signupData
      );

      // Store token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setSuccess('Account created successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="signup-container">
      {/* Background Animation */}
      {backgroundAnimation && (
        <div className="signup-background-animation">
          <Lottie animationData={backgroundAnimation} loop={true} />
        </div>
      )}
      
      <div className="signup-box">
        <div className="signup-header">
          <h1>AID-X Club </h1>
          <p>Create Your Account</p>
        </div>

        {/* Lottie Animation - Removed */}

        {/* Error Alert */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Success Alert */}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Step 1: ID Verification */}
        {step === 1 && (
          <form onSubmit={handleVerifyId} className="signup-form">
            <div className="form-group">
              <label htmlFor="studentId">Roll No</label>
              <input
                type="text"
                id="studentId"
                placeholder="e.g., 2X895A72XX"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                required
                disabled={loading}
              />
              <small>Your official student ID from the institution</small>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify ID'}
            </button>

            <p className="form-footer">
              Already have an account? <a href="/login">Login here</a>
            </p>
          </form>
        )}

        {/* Step 2: Account Creation */}
        {step === 2 && (
          <form onSubmit={handleSignup} className="signup-form">
            <div className="verified-badge">
              ✅ ID Verified: {verifiedStudentId}
              <button
                type="button"
                className="btn-change"
                onClick={() => setStep(1)}
              >
                Change
              </button>
            </div>

            {/* Show fetched details */}
            {studentDetails && (
              <div className="student-details">
                <div className="detail-row">
                  <span className="label">Name:</span>
                  <span className="value">{studentDetails.fullName}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Year:</span>
                  <span className="value">{studentDetails.year}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Section:</span>
                  <span className="value">{studentDetails.section}</span>
                </div>
              </div>
            )}

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                name="email"
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleInputChange}
                name="password"
                required
                disabled={loading}
              />
              <small>Must have 8+ characters, include uppercase, lowercase, and numbers</small>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                name="confirmPassword"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="form-footer">
              Already have an account? <a href="/login">Login here</a>
            </p>
          </form>
        )}
      </div>

      {/* Design Accent */}
      <div className="accent-gradient"></div>
    </div>
  );
};

export default SignUp;
