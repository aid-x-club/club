import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      }}>
        <div style={{
          color: '#ff007b',
          fontSize: '1.5vw',
          fontWeight: 'bold',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}>
          Loading...
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect based on actual role
    if (user?.role === 'admin' || user?.role === 'coordinator') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      }}>
        <div style={{
          color: '#ff007b',
          fontSize: '1.5vw',
          fontWeight: 'bold',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}>
          Loading...
        </div>
      </div>
    );
  }

  // If user is already authenticated, redirect to their dashboard
  if (isAuthenticated && user) {
    if (user.role === 'admin' || user.role === 'coordinator') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
