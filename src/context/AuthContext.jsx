import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        // Set default header for axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (err) {
        console.error('Failed to restore auth state:', err);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password }
      );

      const { token: newToken, user: userData } = response.data;

      // Store in localStorage
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update context
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return userData;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
  };

  const signup = async (studentId, email, password, year, section, fullName) => {
    try {
      // Step 1: Verify student ID
      const verifyResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-id`,
        { studentId }
      );

      if (!verifyResponse.data.valid) {
        throw new Error('Student ID verification failed');
      }

      // Step 2: Create account
      const signupResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          studentId,
          email,
          password,
          year,
          section,
          fullName,
        }
      );

      const { token: newToken, user: userData } = signupResponse.data;

      // Store in localStorage
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update context
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return userData;
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      throw new Error(message);
    }
  };

  // Set auth state without making API call (for when login is done in component)
  const setAuthState = (newToken, userData) => {
    // Store in localStorage
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('user', JSON.stringify(userData));

    // Update context
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);

    // Set axios default header
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('rememberEmail');

    // Clear context
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    // Remove axios default header
    delete axios.defaults.headers.common['Authorization'];
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/refresh-token`
      );

      const { token: newToken } = response.data;

      // Update localStorage and context
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      return newToken;
    } catch (error) {
      // If refresh fails, logout user
      logout();
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        { email }
      );
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      throw new Error(message);
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/me`,
        userData
      );

      const updatedUser = response.data;

      // Update localStorage and context
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return updatedUser;
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      throw new Error(message);
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/me`
      );

      const updatedUser = response.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return updatedUser;
    } catch (error) {
      throw new Error('Failed to fetch user data');
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    setAuthState,
    refreshToken,
    forgotPassword,
    updateProfile,
    getCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
