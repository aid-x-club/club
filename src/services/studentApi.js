import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Get auth token
const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

// Configure axios defaults
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Student Dashboard API
export const studentAPI = {
    // Dashboard
    getDashboardStats: () => api.get('/student/dashboard/stats'),

    // Profile
    getProfile: () => api.get('/student/profile'),
    updateProfile: (data) => api.put('/student/profile', data),
    changePassword: (data) => api.put('/student/profile/password', data),
    updateSettings: (data) => api.put('/student/settings', data),

    // Events
    getEvents: (type = 'upcoming') => api.get(`/student/events?type=${type}`),
    getMyEvents: (status) => api.get(`/student/events/my-events${status ? `?status=${status}` : ''}`),
    registerForEvent: (eventId) => api.post('/student/events/register', { eventId }),
    cancelEventRegistration: (eventId) => api.delete(`/student/events/register/${eventId}`),

    // Projects
    getMyProjects: () => api.get('/student/projects/my-projects'),
    getAllProjects: (params) => api.get('/student/projects/browse', { params }),

    // Achievements
    getAchievements: () => api.get('/student/achievements'),
    getLeaderboard: (limit = 10) => api.get(`/student/leaderboard?limit=${limit}`),

    // Resources
    getResources: (params) => api.get('/student/resources', { params }),

    // Communication
    getAnnouncements: (category) => api.get(`/student/announcements${category ? `?category=${category}` : ''}`),
    getNotifications: (limit = 20) => api.get(`/student/notifications?limit=${limit}`),
    markNotificationRead: (notificationId) => api.put(`/student/notifications/${notificationId}/read`),

    // Certificates
    getCertificates: () => api.get('/student/certificates')
};

export default api;
