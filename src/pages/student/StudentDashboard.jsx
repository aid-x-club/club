import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    if (!token || !user) {
      navigate('/login');
    }
  }, [navigate]);

  if (!user) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="student-dashboard">
      {/* Top Navigation */}
      <nav className="student-navbar">
        <div className="student-nav-left">
          <h1 className="student-logo">👨‍🎓 Student Dashboard</h1>
        </div>
        <div className="student-nav-right">
          <span className="student-user-info">
            {user?.fullName || 'Student'}
          </span>
          <button onClick={handleGoHome} className="student-btn student-btn-secondary">
            🏠 Home
          </button>
          <button onClick={handleLogout} className="student-btn student-btn-danger">
            🚪 Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="student-content">
        <div className="welcome-section">
          <h2>Welcome back, {user?.fullName}!</h2>
          <p>Your student dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
