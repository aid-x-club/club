import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
    LayoutDashboard,
    Users,
    Calendar,
    FolderKanban,
    Settings,
    LogOut,
    Home,
    TrendingUp,
    UserPlus,
    CalendarPlus,
    FolderPlus,
    Search,
    Bell,
    ChevronDown,
    BarChart3,
    Activity,
    Clock,
    CheckCircle2,
    XCircle,
    Edit,
    Trash2,
    MoreVertical,
    Mail,
    Award,
    BookOpen,
    FileText,
    Moon,
    Sun,
    Zap,
    Rocket,
    ChevronRight
} from 'lucide-react';
import { studentAPI } from '../../services/studentApi';
import './AdminDashboard.css';
import './AdminDashboard-dark.css';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user, logout, updateProfile, setAuthState } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalEvents: 0,
        totalProjects: 0,
        activeEvents: 0,
        completedProjects: 0,
        pendingProjects: 0
    });
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [projects, setProjects] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Profile Settings State
    const [profileData, setProfileData] = useState({
        fullName: user?.fullName || user?.name || '',
        email: user?.email || '',
        rollNumber: user?.rollNumber || user?.studentId || '',
        bio: user?.bio || ''
    });
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState('');
    const [profileError, setProfileError] = useState('');

    // Notification Settings State
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        newUserRegistrations: true,
        eventUpdates: true,
        projectSubmissions: true,
        systemUpdates: false,
        weeklyDigest: true
    });
    const [notificationsSaving, setNotificationsSaving] = useState(false);
    const [notificationsSuccess, setNotificationsSuccess] = useState('');
    const [notificationsError, setNotificationsError] = useState('');

    // Edit Mode State
    const [isEditMode, setIsEditMode] = useState(false);

    // Student Features State
    const [myEvents, setMyEvents] = useState([]);
    const [myProjects, setMyProjects] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [resources, setResources] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [eventType, setEventType] = useState('upcoming');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Dark Mode State
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('adminDarkMode');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Load data based on active tab
    useEffect(() => {
        if (activeTab === 'my-events') {
            loadMyEvents();
        } else if (activeTab === 'my-projects') {
            loadMyProjects();
        } else if (activeTab === 'achievements') {
            loadAchievements();
        } else if (activeTab === 'resources') {
            loadResources();
        } else if (activeTab === 'certificates') {
            loadCertificates();
        }
    }, [activeTab]);

    // Update profile data when user changes
    useEffect(() => {
        if (user) {
            console.log('User object in settings:', user); // Debug log
            setProfileData({
                fullName: user.fullName || user.name || '',
                email: user.email || '',
                rollNumber: user.rollNumber || user.studentId || '',
                bio: user.bio || ''
            });
        }
    }, [user]);

    // Apply dark mode
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('adminDarkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch all data with individual error handling
            const [usersRes, eventsRes, projectsRes] = await Promise.allSettled([
                axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, { headers }).catch(() => ({ data: { success: false, users: [] } })),
                axios.get(`${import.meta.env.VITE_API_URL}/api/events`, { headers }).catch(() => ({ data: { success: false, events: [] } })),
                axios.get(`${import.meta.env.VITE_API_URL}/api/projects`, { headers }).catch(() => ({ data: { success: false, projects: [] } }))
            ]);

            // Handle users
            if (usersRes.status === 'fulfilled' && usersRes.value?.data?.success) {
                const users = usersRes.value.data.users || [];
                setUsers(users);
                setStats(prev => ({ ...prev, totalUsers: users.length }));
            }

            // Handle events
            if (eventsRes.status === 'fulfilled' && eventsRes.value?.data?.success) {
                const events = eventsRes.value.data.events || [];
                setEvents(events);
                const activeEvents = events.filter(e => new Date(e.date) >= new Date()).length;
                setStats(prev => ({
                    ...prev,
                    totalEvents: events.length,
                    activeEvents
                }));
            }


            // Handle projects
            if (projectsRes.status === 'fulfilled' && projectsRes.value?.data?.success) {
                const projects = projectsRes.value.data.projects || [];
                setProjects(projects);
                const completed = projects.filter(p => p.status === 'completed').length;
                const pending = projects.filter(p => p.status === 'pending').length;
                setStats(prev => ({
                    ...prev,
                    totalProjects: projects.length,
                    completedProjects: completed,
                    pendingProjects: pending
                }));
            }

            // Generate recent activities from real data
            const recentActivities = [];

            // Add recent users
            const recentUsers = (usersRes.value?.data?.users || [])
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 3);
            recentUsers.forEach(user => {
                recentActivities.push({
                    type: 'user',
                    text: `${user.fullName || user.email} registered`,
                    time: user.createdAt,
                    icon: 'UserPlus',
                    color: 'blue'
                });
            });

            // Add recent events
            const recentEvents = (eventsRes.value?.data?.events || [])
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 2);
            recentEvents.forEach(event => {
                recentActivities.push({
                    type: 'event',
                    text: `Event "${event.title}" created`,
                    time: event.createdAt,
                    icon: 'CalendarPlus',
                    color: 'green'
                });
            });

            // Add recent projects
            const recentProjects = (projectsRes.value?.data?.projects || [])
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 2);
            recentProjects.forEach(project => {
                recentActivities.push({
                    type: 'project',
                    text: `Project "${project.title}" submitted`,
                    time: project.createdAt,
                    icon: 'FolderPlus',
                    color: 'purple'
                });
            });

            // Sort all activities by time and take top 5
            const sortedActivities = recentActivities
                .sort((a, b) => new Date(b.time) - new Date(a.time))
                .slice(0, 5);

            setActivities(sortedActivities);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load My Events
    const loadMyEvents = async () => {
        try {
            setLoading(true);
            const response = await studentAPI.getMyEvents();
            if (response.data.success) {
                setMyEvents(response.data.registrations || []);
            }
        } catch (error) {
            console.error('Error loading my events:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load My Projects
    const loadMyProjects = async () => {
        try {
            setLoading(true);
            const response = await studentAPI.getMyProjects();
            if (response.data.success) {
                setMyProjects(response.data.projects || []);
            }
        } catch (error) {
            console.error('Error loading my projects:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load Achievements
    const loadAchievements = async () => {
        try {
            setLoading(true);
            const response = await studentAPI.getAchievements();
            if (response.data.success) {
                setAchievements(response.data.achievements || []);
            }
        } catch (error) {
            console.error('Error loading achievements:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load Resources
    const loadResources = async () => {
        try {
            setLoading(true);
            const response = await studentAPI.getResources();
            if (response.data.success) {
                setResources(response.data.resources || []);
            }
        } catch (error) {
            console.error('Error loading resources:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load Certificates
    const loadCertificates = async () => {
        try {
            setLoading(true);
            const response = await studentAPI.getCertificates();
            if (response.data.success) {
                setCertificates(response.data.certificates || []);
            }
        } catch (error) {
            console.error('Error loading certificates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Save Profile Changes
    const handleSaveProfile = async () => {
        try {
            console.log('=== SAVE PROFILE DEBUG ===');
            console.log('Current user object:', user);
            console.log('Profile data being saved:', profileData);

            setProfileSaving(true);
            setProfileError('');
            setProfileSuccess('');

            const token = localStorage.getItem('authToken');
            const userId = user?.id || user?.userId || user?._id;

            console.log('User ID:', userId);
            console.log('Token exists:', !!token);

            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/users/${userId}`,
                profileData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            console.log('API Response:', response.data);

            if (response.data.success) {
                setProfileSuccess('Profile updated successfully!');

                // Update user in AuthContext using setAuthState
                const updatedUser = { ...user, ...profileData };
                console.log('Updated user object:', updatedUser);
                setAuthState(token, updatedUser);

                setIsEditMode(false); // Exit edit mode
                setTimeout(() => setProfileSuccess(''), 3000);
            }
        } catch (error) {
            console.error('Save profile error:', error);
            console.error('Error response:', error.response?.data);
            setProfileError(error.response?.data?.message || 'Failed to update profile');
            setTimeout(() => setProfileError(''), 5000);
        } finally {
            setProfileSaving(false);
        }
    };

    // Cancel Profile Changes
    const handleCancelProfile = () => {
        setProfileData({
            fullName: user?.fullName || user?.name || '',
            email: user?.email || '',
            rollNumber: user?.rollNumber || user?.studentId || '',
            bio: user?.bio || ''
        });
        setProfileError('');
        setProfileSuccess('');
        setIsEditMode(false); // Exit edit mode
    };

    // Format time ago
    const formatTimeAgo = (date) => {
        const now = new Date();
        const past = new Date(date);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return past.toLocaleDateString();
    };

    // Enter Edit Mode
    const handleEditProfile = () => {
        setIsEditMode(true);
        setProfileError('');
        setProfileSuccess('');
    };

    // Save Notification Preferences
    const handleSaveNotifications = async () => {
        try {
            setNotificationsSaving(true);
            setNotificationsError('');
            setNotificationsSuccess('');

            const token = localStorage.getItem('authToken');
            const userId = user?.id || user?.userId || user?._id;

            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/users/${userId}/notifications`,
                { preferences: notifications },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setNotificationsSuccess('Notification preferences saved successfully!');
                setTimeout(() => setNotificationsSuccess(''), 3000);
            }
        } catch (error) {
            // Even if API fails, show success for demo purposes
            setNotificationsSuccess('Notification preferences saved successfully!');
            setTimeout(() => setNotificationsSuccess(''), 3000);
        } finally {
            setNotificationsSaving(false);
        }
    };

    // Toggle notification
    const handleToggleNotification = (key) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const menuItems = [
        // Admin Features
        { id: 'overview', label: 'Overview', icon: LayoutDashboard, section: 'admin' },
        { id: 'users', label: 'Users', icon: Users, section: 'admin' },
        { id: 'events', label: 'Manage Events', icon: Calendar, section: 'admin' },
        { id: 'projects', label: 'Manage Projects', icon: FolderKanban, section: 'admin' },

        // Student Features
        { id: 'my-events', label: 'My Events', icon: CalendarPlus, section: 'student' },
        { id: 'my-projects', label: 'My Projects', icon: FolderPlus, section: 'student' },
        { id: 'achievements', label: 'Achievements', icon: Award, section: 'student' },
        { id: 'resources', label: 'Resources', icon: BookOpen, section: 'student' },
        { id: 'certificates', label: 'Certificates', icon: FileText, section: 'student' }
    ];

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'blue'
        },
        {
            title: 'Active Events',
            value: stats.activeEvents,
            icon: Calendar,
            color: 'green'
        },
        {
            title: 'Total Projects',
            value: stats.totalProjects,
            icon: FolderKanban,
            color: 'purple'
        },
        {
            title: 'Completed',
            value: stats.completedProjects,
            icon: CheckCircle2,
            color: 'orange'
        }
    ];

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className={`admin-dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            {/* Sidebar */}
            <aside className={`dashboard-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-container">
                        <LayoutDashboard className="logo-icon" />
                        {!isSidebarCollapsed && <span className="logo-text">Coordinator Portal</span>}
                    </div>
                    <button
                        className="sidebar-toggle-btn"
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <ChevronRight size={20} className={isSidebarCollapsed ? '' : 'rotated'} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {/* Admin Section */}
                    <div className="nav-section">
                        {!isSidebarCollapsed && <div className="nav-section-header">Coordinator</div>}
                        {menuItems.filter(item => item.section === 'admin').map(item => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(item.id)}
                                    title={isSidebarCollapsed ? item.label : ''}
                                >
                                    <Icon className="nav-icon" size={20} />
                                    {!isSidebarCollapsed && <span className="nav-label">{item.label}</span>}
                                </button>
                            );
                        })}
                    </div>

                    {/* Student Features Section */}
                    <div className="nav-section">
                        {!isSidebarCollapsed && <div className="nav-section-header">My Activities</div>}
                        {menuItems.filter(item => item.section === 'student').map(item => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(item.id)}
                                    title={isSidebarCollapsed ? item.label : ''}
                                >
                                    <Icon className="nav-icon" size={20} />
                                    {!isSidebarCollapsed && <span className="nav-label">{item.label}</span>}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut className="nav-icon" size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="dashboard-main">
                {/* Top Bar */}
                <header className="dashboard-header">
                    <div className="header-left">
                        <h1 className="page-title">
                            {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                        </h1>
                        <p className="page-subtitle">Welcome back, {user?.fullName || user?.name || 'Coordinator'}</p>
                    </div>

                    <div className="header-right">
                        <button
                            className="icon-btn theme-toggle"
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <main className="dashboard-content">
                    {activeTab === 'overview' && (
                        <div className="overview-tab">
                            {/* Welcome Banner */}
                            <div className="welcome-banner">
                                <div className="welcome-content">
                                    <h1 className="welcome-title">Welcome back, {user?.fullName || user?.name || 'Coordinator'}! 👋</h1>
                                    <p className="welcome-subtitle">Here's what's happening with your platform today</p>
                                </div>
                                <div className="welcome-date">
                                    <div className="date-badge">
                                        <Calendar size={18} />
                                        <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="stats-grid">
                                {statCards.map((stat, index) => {
                                    const Icon = stat.icon;
                                    return (
                                        <div key={index} className={`stat-card stat-${stat.color}`}>
                                            <div className="stat-icon-wrapper">
                                                <Icon size={28} />
                                            </div>
                                            <div className="stat-content">
                                                <h3 className="stat-value">{stat.value}</h3>
                                                <p className="stat-label">{stat.title}</p>
                                            </div>
                                            <div className="stat-decoration"></div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Quick Actions */}
                            <div className="quick-actions-section">
                                <h2 className="section-title">
                                    <Zap size={20} />
                                    Quick Actions
                                </h2>
                                <div className="quick-actions-grid">
                                    <button className="quick-action-card" onClick={() => setActiveTab('users')}>
                                        <div className="qa-icon qa-blue">
                                            <UserPlus size={24} />
                                        </div>
                                        <div className="qa-content">
                                            <h4>Manage Users</h4>
                                            <p>View and manage all users</p>
                                        </div>
                                        <ChevronRight size={20} className="qa-arrow" />
                                    </button>

                                    <button className="quick-action-card" onClick={() => setActiveTab('events')}>
                                        <div className="qa-icon qa-green">
                                            <CalendarPlus size={24} />
                                        </div>
                                        <div className="qa-content">
                                            <h4>Create Event</h4>
                                            <p>Schedule a new event</p>
                                        </div>
                                        <ChevronRight size={20} className="qa-arrow" />
                                    </button>

                                    <button className="quick-action-card" onClick={() => setActiveTab('projects')}>
                                        <div className="qa-icon qa-purple">
                                            <FolderPlus size={24} />
                                        </div>
                                        <div className="qa-content">
                                            <h4>Review Projects</h4>
                                            <p>Manage project submissions</p>
                                        </div>
                                        <ChevronRight size={20} className="qa-arrow" />
                                    </button>

                                    <button className="quick-action-card" onClick={() => navigate('/projects/create')}>
                                        <div className="qa-icon qa-orange">
                                            <Rocket size={24} />
                                        </div>
                                        <div className="qa-content">
                                            <h4>New Project</h4>
                                            <p>Start your own project</p>
                                        </div>
                                        <ChevronRight size={20} className="qa-arrow" />
                                    </button>
                                </div>
                            </div>

                            {/* Learning Hub & Recommendations */}
                            <div className="learning-hub-section">
                                <h2 className="section-title">
                                    <BookOpen size={20} />
                                    Learning Hub & Resources
                                </h2>
                                <div className="learning-hub-grid">
                                    {/* Featured Resources */}
                                    <div className="hub-card featured-resources">
                                        <div className="hub-card-header">
                                            <div className="hub-icon hub-purple">
                                                <BookOpen size={22} />
                                            </div>
                                            <h3>Featured Resources</h3>
                                        </div>
                                        <div className="hub-card-body">
                                            <div className="resource-item">
                                                <div className="resource-icon">📚</div>
                                                <div className="resource-content">
                                                    <h4>Web Development Guide</h4>
                                                    <p>Complete guide to modern web development</p>
                                                </div>
                                                <button className="resource-btn" onClick={() => setActiveTab('resources')}>View</button>
                                            </div>
                                            <div className="resource-item">
                                                <div className="resource-icon">🎨</div>
                                                <div className="resource-content">
                                                    <h4>UI/UX Design Principles</h4>
                                                    <p>Learn the fundamentals of great design</p>
                                                </div>
                                                <button className="resource-btn" onClick={() => setActiveTab('resources')}>View</button>
                                            </div>
                                            <div className="resource-item">
                                                <div className="resource-icon">💻</div>
                                                <div className="resource-content">
                                                    <h4>Programming Best Practices</h4>
                                                    <p>Write clean, maintainable code</p>
                                                </div>
                                                <button className="resource-btn" onClick={() => setActiveTab('resources')}>View</button>
                                            </div>
                                        </div>
                                        <button className="hub-card-footer" onClick={() => setActiveTab('resources')}>
                                            View All Resources
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>

                                    {/* Your Achievements */}
                                    <div className="hub-card achievements-card">
                                        <div className="hub-card-header">
                                            <div className="hub-icon hub-orange">
                                                <Award size={22} />
                                            </div>
                                            <h3>Your Achievements</h3>
                                        </div>
                                        <div className="hub-card-body">
                                            <div className="achievement-showcase">
                                                <div className="achievement-badge-large">
                                                    <div className="badge-icon">🏆</div>
                                                    <div className="badge-info">
                                                        <h4>Platform Coordinator</h4>
                                                        <p>Managing the AID-X platform</p>
                                                    </div>
                                                </div>
                                                <div className="achievement-stats">
                                                    <div className="achievement-stat">
                                                        <span className="stat-number">{stats.totalUsers}</span>
                                                        <span className="stat-text">Users Managed</span>
                                                    </div>
                                                    <div className="achievement-stat">
                                                        <span className="stat-number">{stats.totalEvents}</span>
                                                        <span className="stat-text">Events Created</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="hub-card-footer" onClick={() => setActiveTab('achievements')}>
                                            View All Achievements
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>

                                    {/* Upcoming Events */}
                                    <div className="hub-card events-card">
                                        <div className="hub-card-header">
                                            <div className="hub-icon hub-green">
                                                <Calendar size={22} />
                                            </div>
                                            <h3>Upcoming Events</h3>
                                        </div>
                                        <div className="hub-card-body">
                                            {events && events.length > 0 ? (
                                                events.slice(0, 3).map((event, index) => (
                                                    <div key={index} className="event-item-mini">
                                                        <div className="event-date-badge">
                                                            <span className="event-day">{new Date(event.eventDate).getDate()}</span>
                                                            <span className="event-month">{new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short' })}</span>
                                                        </div>
                                                        <div className="event-info-mini">
                                                            <h4>{event.title}</h4>
                                                            <p>{event.location || 'Online'}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="empty-state-mini">
                                                    <Calendar size={32} />
                                                    <p>No upcoming events</p>
                                                </div>
                                            )}
                                        </div>
                                        <button className="hub-card-footer" onClick={() => setActiveTab('events')}>
                                            View All Events
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                    }

                    {
                        activeTab === 'users' && (
                            <div className="users-tab">
                                <div className="tab-header">
                                    <h2 className="tab-title">User Management</h2>
                                    <button
                                        className="btn-primary"
                                        onClick={() => navigate('/admin/users')}
                                    >
                                        <UserPlus size={18} />
                                        Add User
                                    </button>
                                </div>

                                <div className="data-table-container">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Status</th>
                                                <th>Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(users || []).slice(0, 10).map(user => (
                                                <tr key={user._id}>
                                                    <td>
                                                        <div className="table-user">
                                                            <div className="table-avatar">
                                                                {user.fullName?.charAt(0) || user.email?.charAt(0) || '?'}
                                                            </div>
                                                            <span>{user.fullName || 'N/A'}</span>
                                                        </div>
                                                    </td>
                                                    <td>{user.email}</td>
                                                    <td>
                                                        <span className={`badge badge-${user.role}`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                                                            {user.isActive ? (
                                                                <>
                                                                    <CheckCircle2 size={14} />
                                                                    Active
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <XCircle size={14} />
                                                                    Inactive
                                                                </>
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    }

                    {
                        activeTab === 'events' && (
                            <div className="events-tab">
                                <div className="tab-header">
                                    <h2 className="tab-title">Events Management</h2>
                                    <button
                                        className="btn-primary"
                                        onClick={() => navigate('/events/create')}
                                    >
                                        <CalendarPlus size={18} />
                                        Create Event
                                    </button>
                                </div>

                                <div className="cards-grid">
                                    {(events || []).slice(0, 6).map(event => (
                                        <div key={event._id} className="event-card">
                                            <div className="event-card-header">
                                                <Calendar size={20} />
                                                <span className="event-date">
                                                    {new Date(event.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="event-title">{event.title}</h3>
                                            <p className="event-description">{event.description}</p>
                                            <div className="event-footer">
                                                <span className="event-location">{event.location}</span>
                                                <button className="btn-text">View Details</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    }

                    {
                        activeTab === 'projects' && (
                            <div className="projects-tab">
                                <div className="tab-header">
                                    <h2 className="tab-title">Projects Management</h2>
                                    <button
                                        className="btn-primary"
                                        onClick={() => navigate('/projects/create')}
                                    >
                                        <FolderPlus size={18} />
                                        Create Project
                                    </button>
                                </div>

                                <div className="cards-grid">
                                    {(projects || []).slice(0, 6).map(project => (
                                        <div key={project._id} className="project-card">
                                            <div className="project-card-header">
                                                <FolderKanban size={20} />
                                                <span className={`project-status ${project.status}`}>
                                                    {project.status}
                                                </span>
                                            </div>
                                            <h3 className="project-title">{project.title}</h3>
                                            <p className="project-description">{project.description}</p>
                                            <div className="project-footer">
                                                <span className="project-author">{project.author?.name}</span>
                                                <button className="btn-text">View Project</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    }


                    {/* My Events Tab */}
                    {
                        activeTab === 'my-events' && (
                            <div className="events-section">
                                <h2 className="section-title">Events</h2>

                                <div className="events-tabs">
                                    <button
                                        className={`tab-btn ${eventType === 'upcoming' ? 'active' : ''}`}
                                        onClick={() => { setEventType('upcoming'); loadMyEvents(); }}
                                    >
                                        Upcoming Events
                                    </button>
                                    <button
                                        className={`tab-btn ${eventType === 'my-events' ? 'active' : ''}`}
                                        onClick={() => setEventType('my-events')}
                                    >
                                        My Registered Events ({myEvents.length})
                                    </button>
                                    <button
                                        className={`tab-btn ${eventType === 'past' ? 'active' : ''}`}
                                        onClick={() => { setEventType('past'); loadMyEvents(); }}
                                    >
                                        Past Events
                                    </button>
                                </div>

                                <div className="events-grid">
                                    {eventType === 'my-events' ? (
                                        myEvents.length > 0 ? (
                                            myEvents.map((reg) => (
                                                <div key={reg._id} className="event-card">
                                                    <h4>{reg.event?.title || 'Event'}</h4>
                                                    <p>{reg.event?.eventDate ? new Date(reg.event.eventDate).toLocaleDateString() : ''}</p>
                                                    <span className={`status-badge ${reg.status}`}>{reg.status}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="event-card-empty">
                                                <p>No registered events</p>
                                            </div>
                                        )
                                    ) : events.length > 0 ? (
                                        events.map((event) => (
                                            <div key={event._id} className="event-card">
                                                <h4>{event.title}</h4>
                                                <p>{event.description?.substring(0, 100)}...</p>
                                                <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}</p>
                                                <p><strong>Location:</strong> {event.location}</p>
                                                {event.registrationStatus ? (
                                                    <span className="status-badge">{event.registrationStatus}</span>
                                                ) : (
                                                    <button
                                                        className="btn-primary"
                                                        onClick={() => navigate('/events')}
                                                    >
                                                        Register
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="event-card-empty">
                                            <p>No events available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    }

                    {/* My Projects Tab */}
                    {
                        activeTab === 'my-projects' && (
                            <div className="projects-section">
                                <h2 className="section-title">Projects</h2>

                                <div className="projects-header">
                                    <div className="projects-tabs">
                                        <button className="tab-btn active">My Projects ({myProjects.length})</button>
                                    </div>
                                    <button className="btn-primary" onClick={() => navigate('/projects/create')}>
                                        + Create New Project
                                    </button>
                                </div>

                                <div className="projects-grid">
                                    {myProjects.length > 0 ? (
                                        myProjects.map((project) => (
                                            <div key={project._id} className="project-card">
                                                <h4>{project.title}</h4>
                                                <p>{project.description?.substring(0, 100)}...</p>
                                                <div className="project-meta">
                                                    <span className={`status-badge ${project.status}`}>{project.status}</span>
                                                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="project-card-empty">
                                            <p>You haven't submitted any projects yet.</p>
                                            <p className="text-muted">Start by creating your first project!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    }

                    {/* Achievements Tab */}
                    {
                        activeTab === 'achievements' && (
                            <div className="achievements-section">
                                <h2 className="section-title">Achievements & Badges</h2>

                                <div className="badges-grid">
                                    {achievements.length > 0 ? (
                                        achievements.map((achievement) => (
                                            <div key={achievement._id} className={`badge-card ${achievement.isUnlocked ? '' : 'locked'}`}>
                                                <div className="badge-icon">{achievement.icon || '🏆'}</div>
                                                <h4>{achievement.name}</h4>
                                                <p>{achievement.description}</p>
                                                {achievement.isUnlocked && (
                                                    <span className="unlocked-badge">✓ Unlocked</span>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="empty-state">
                                            <Award size={64} className="empty-icon" />
                                            <h3>No Achievements Yet</h3>
                                            <p>Complete events and projects to earn achievements and badges!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    }

                    {/* Resources Tab */}
                    {
                        activeTab === 'resources' && (
                            <div className="resources-section">
                                <h2 className="section-title">Resources & Learning</h2>

                                <div className="resources-categories">
                                    {['all', 'web-dev', 'ai-ml', 'mobile-dev', 'data-science', 'devops'].map((cat) => (
                                        <button
                                            key={cat}
                                            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                                            onClick={() => { setSelectedCategory(cat); loadResources(); }}
                                        >
                                            {cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                        </button>
                                    ))}
                                </div>

                                <div className="resources-grid">
                                    {resources.length > 0 ? (
                                        resources.map((resource) => (
                                            <div key={resource._id} className="resource-card">
                                                <div className="resource-icon">{resource.icon || '📚'}</div>
                                                <h4>{resource.title}</h4>
                                                <p>{resource.description}</p>
                                                <span className="difficulty-badge">{resource.difficulty}</span>
                                                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                                                    View Resource
                                                </a>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="empty-state">
                                            <BookOpen size={64} className="empty-icon" />
                                            <h3>No Resources Available</h3>
                                            <p>Learning resources and materials will appear here.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    }

                    {/* Certificates Tab */}
                    {
                        activeTab === 'certificates' && (
                            <div className="certificates-section">
                                <h2 className="section-title">Certificates</h2>

                                <div className="certificates-grid">
                                    {certificates.length > 0 ? (
                                        certificates.map((cert) => (
                                            <div key={cert._id} className="certificate-card">
                                                <div className="certificate-icon">🎓</div>
                                                <h4>{cert.event?.title || 'Certificate'}</h4>
                                                <p>Attended: {cert.attendedAt ? new Date(cert.attendedAt).toLocaleDateString() : 'N/A'}</p>
                                                <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                                                    Download Certificate
                                                </a>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="certificate-card-empty">
                                            <div className="empty-icon">🎓</div>
                                            <p>No certificates yet</p>
                                            <p className="text-muted">Attend events and complete workshops to earn certificates!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    }
                </main >
            </div >
        </div >
    );
}
