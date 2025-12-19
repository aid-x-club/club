import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Calendar,
  FolderKanban,
  LogOut,
  Award,
  BookOpen,
  FileText,
  MessageSquare,
  Moon,
  Sun,
  ChevronRight,
  TrendingUp,
  CalendarPlus,
  FolderPlus,
  Zap,
  Rocket,
  Trophy,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  Download,
  ExternalLink,
  Bell,
  Megaphone,
  Filter,
  Search,
  Edit,
  Save,
  X
} from 'lucide-react';
import { studentAPI } from '../../services/studentApi';
import GitHubConnect from '../../components/github/GitHubConnect';
import './StudentDashboard.css';
import './StudentDashboard-dark.css';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout, setAuthState } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  // State for all features
  const [stats, setStats] = useState({
    eventsAttended: 0,
    projectsSubmitted: 0,
    achievementsEarned: 0,
    points: 0
  });
  const [activity, setActivity] = useState([]);
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [achievementStats, setAchievementStats] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [resources, setResources] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [certificates, setCertificates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [eventType, setEventType] = useState('upcoming');
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('studentDarkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('studentDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    if (!token || !user) {
      navigate('/login');
    }
  }, [navigate]);

  // Load dashboard data
  useEffect(() => {
    if (activeTab === 'overview') {
      loadDashboardData();
    } else if (activeTab === 'profile') {
      loadProfile();
    } else if (activeTab === 'events') {
      loadEvents();
    } else if (activeTab === 'projects') {
      loadProjects();
    } else if (activeTab === 'achievements') {
      loadAchievements();
    } else if (activeTab === 'resources') {
      loadResources();
    } else if (activeTab === 'communication') {
      loadCommunication();
    } else if (activeTab === 'certificates') {
      loadCertificates();
    } else if (activeTab === 'leaderboard') {
      loadLeaderboard();
    }
  }, [activeTab]);

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || user.name || '',
        email: user.email || '',
        rollNumber: user.rollNumber || user.studentId || '',
        phone: user.phone || '',
        bio: user.bio || '',
        skills: user.skills?.join(', ') || '',
        interests: user.interests?.join(', ') || '',
        linkedinProfile: user.linkedinProfile || ''
      });
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getDashboardStats();
      if (response.data.success) {
        setStats(response.data.stats || {
          eventsAttended: 0,
          projectsSubmitted: 0,
          achievementsEarned: 0,
          points: 0
        });
        setActivity(response.data.activity || []);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      // Set default stats on error
      setStats({
        eventsAttended: 0,
        projectsSubmitted: 0,
        achievementsEarned: 0,
        points: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getProfile();
      if (response.data.success) {
        setProfile(response.data.user);
      } else if (user) {
        setProfile(user);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      if (user) {
        setProfile(user);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const [eventsRes, myEventsRes] = await Promise.all([
        studentAPI.getEvents(eventType),
        studentAPI.getMyEvents()
      ]);
      if (eventsRes.data.success) setEvents(eventsRes.data.events || []);
      if (myEventsRes.data.success) setMyEvents(myEventsRes.data.registrations || []);
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
      setMyEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      const [myProjectsRes, allProjectsRes] = await Promise.all([
        studentAPI.getMyProjects(),
        studentAPI.getAllProjects()
      ]);
      if (myProjectsRes.data.success) setProjects(myProjectsRes.data.projects || []);
      if (allProjectsRes.data.success) setAllProjects(allProjectsRes.data.projects || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects([]);
      setAllProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getAchievements();
      if (response.data.success) {
        setAchievements(response.data.achievements || []);
        setAchievementStats(response.data.stats || {});
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
      setAchievements([]);
      setAchievementStats({});
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getLeaderboard();
      if (response.data.success) {
        setLeaderboard(response.data.leaderboard || []);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const loadResources = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getResources({ category: selectedCategory });
      if (response.data.success) setResources(response.data.resources || []);
    } catch (error) {
      console.error('Error loading resources:', error);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCommunication = async () => {
    try {
      setLoading(true);
      const [announcementsRes, notificationsRes] = await Promise.all([
        studentAPI.getAnnouncements(),
        studentAPI.getNotifications()
      ]);
      if (announcementsRes.data.success) setAnnouncements(announcementsRes.data.announcements || []);
      if (notificationsRes.data.success) {
        setNotifications(notificationsRes.data.notifications || []);
        setUnreadCount(notificationsRes.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error loading communication:', error);
      setAnnouncements([]);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const response = await studentAPI.getCertificates();
      if (response.data.success) setCertificates(response.data.certificates || []);
    } catch (error) {
      console.error('Error loading certificates:', error);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveProfile = async () => {
    try {
      setProfileSaving(true);
      setProfileError('');
      setProfileSuccess('');

      const token = localStorage.getItem('authToken');
      const userId = user?.id || user?.userId || user?._id;

      // Process skills and interests
      const dataToSend = {
        ...profileData,
        skills: profileData.skills ? profileData.skills.split(',').map(s => s.trim()).filter(s => s) : [],
        interests: profileData.interests ? profileData.interests.split(',').map(i => i.trim()).filter(i => i) : []
      };

      const response = await studentAPI.updateProfile(dataToSend);

      if (response.data.success) {
        setProfileSuccess('Profile updated successfully!');
        const updatedUser = { ...user, ...response.data.user };
        setAuthState(token, updatedUser);
        setProfile(updatedUser);
        setIsEditMode(false);
        setTimeout(() => setProfileSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Save profile error:', error);
      setProfileError(error.response?.data?.message || 'Failed to update profile');
      setTimeout(() => setProfileError(''), 5000);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleCancelProfile = () => {
    setProfileData({
      fullName: user?.fullName || user?.name || '',
      email: user?.email || '',
      rollNumber: user?.rollNumber || user?.studentId || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      skills: user?.skills?.join(', ') || '',
      interests: user?.interests?.join(', ') || '',
      linkedinProfile: user?.linkedinProfile || ''
    });
    setProfileError('');
    setProfileSuccess('');
    setIsEditMode(false);
  };

  const handleRegisterEvent = async (eventId) => {
    try {
      const response = await studentAPI.registerForEvent(eventId);
      if (response.data.success) {
        alert('Successfully registered for event!');
        loadEvents();
      }
    } catch (error) {
      alert('Failed to register: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleMarkNotificationRead = async (notificationId) => {
    try {
      await studentAPI.markNotificationRead(notificationId);
      loadCommunication();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'certificates', label: 'Certificates', icon: FileText }
  ];

  const statCards = [
    {
      title: 'Events Attended',
      value: stats.eventsAttended || 0,
      icon: Calendar,
      color: 'blue'
    },
    {
      title: 'Projects Submitted',
      value: stats.projectsSubmitted || 0,
      icon: FolderKanban,
      color: 'green'
    },
    {
      title: 'Achievements',
      value: stats.achievementsEarned || 0,
      icon: Award,
      color: 'purple'
    },
    {
      title: 'Total Points',
      value: stats.points || 0,
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  if (!user) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="student-dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <LayoutDashboard className="logo-icon" />
            <span className="logo-text">Student Portal</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-header">My Dashboard</div>
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="nav-icon" size={20} />
                  <span className="nav-label">{item.label}</span>
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
            <p className="page-subtitle">Welcome back, {user?.fullName || user?.name || 'Student'}</p>
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
                  <h1 className="welcome-title">Welcome back, {user?.fullName || user?.name || 'Student'}! 👋</h1>
                  <p className="welcome-subtitle">Here's what's happening with your learning journey today</p>
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
                  <button className="quick-action-card" onClick={() => setActiveTab('events')}>
                    <div className="qa-icon qa-blue">
                      <CalendarPlus size={24} />
                    </div>
                    <div className="qa-content">
                      <h4>Browse Events</h4>
                      <p>Find and register for events</p>
                    </div>
                    <ChevronRight size={20} className="qa-arrow" />
                  </button>

                  <button className="quick-action-card" onClick={() => navigate('/projects/create')}>
                    <div className="qa-icon qa-green">
                      <FolderPlus size={24} />
                    </div>
                    <div className="qa-content">
                      <h4>Create Project</h4>
                      <p>Start a new project</p>
                    </div>
                    <ChevronRight size={20} className="qa-arrow" />
                  </button>

                  <button className="quick-action-card" onClick={() => setActiveTab('resources')}>
                    <div className="qa-icon qa-purple">
                      <BookOpen size={24} />
                    </div>
                    <div className="qa-content">
                      <h4>Learning Resources</h4>
                      <p>Access learning materials</p>
                    </div>
                    <ChevronRight size={20} className="qa-arrow" />
                  </button>

                  <button className="quick-action-card" onClick={() => setActiveTab('achievements')}>
                    <div className="qa-icon qa-orange">
                      <Rocket size={24} />
                    </div>
                    <div className="qa-content">
                      <h4>View Achievements</h4>
                      <p>Track your progress</p>
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
                            <h4>Active Learner</h4>
                            <p>Keep up the great work!</p>
                          </div>
                        </div>
                        <div className="achievement-stats">
                          <div className="achievement-stat">
                            <span className="stat-number">{stats.eventsAttended || 0}</span>
                            <span className="stat-text">Events Joined</span>
                          </div>
                          <div className="achievement-stat">
                            <span className="stat-number">{stats.projectsSubmitted || 0}</span>
                            <span className="stat-text">Projects Created</span>
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
          )}

          {activeTab === 'profile' && (
            <div className="profile-section">
              {loading ? (
                <div className="loading-state">Loading profile...</div>
              ) : !profile ? (
                <div className="profile-card">
                  <p>Unable to load profile. Please try again.</p>
                  <button onClick={loadProfile} className="btn-primary">Retry</button>
                </div>
              ) : (
                <>
                  {/* GitHub Connection */}
                  <GitHubConnect onConnectionChange={(connected, username) => {
                    console.log('GitHub connection changed:', connected, username);
                  }} />

                  <div className="profile-card">
                    <div className="profile-header">
                      <div className="profile-avatar">
                        {profile.fullName?.charAt(0).toUpperCase() || 'S'}
                      </div>
                      <div className="profile-info">
                        <h3>{profile.fullName || 'Student'}</h3>
                        <p>{profile.email}</p>
                        <span className="profile-badge">Student Member</span>
                      </div>
                      {!isEditMode && (
                        <button className="btn-primary" onClick={() => setIsEditMode(true)}>
                          <Edit size={18} />
                          Edit Profile
                        </button>
                      )}
                    </div>

                    {profileSuccess && (
                      <div className="alert alert-success">
                        <CheckCircle2 size={18} />
                        {profileSuccess}
                      </div>
                    )}

                    {profileError && (
                      <div className="alert alert-error">
                        <X size={18} />
                        {profileError}
                      </div>
                    )}

                    {isEditMode ? (
                      <div className="profile-form">
                        <div className="form-group">
                          <label>Full Name</label>
                          <input
                            type="text"
                            value={profileData.fullName}
                            onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Email</label>
                          <input type="email" value={profileData.email} disabled />
                        </div>
                        <div className="form-group">
                          <label>Roll Number</label>
                          <input
                            type="text"
                            value={profileData.rollNumber}
                            onChange={(e) => setProfileData({ ...profileData, rollNumber: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Phone</label>
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Bio</label>
                          <textarea
                            value={profileData.bio}
                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                            rows="4"
                          ></textarea>
                        </div>
                        <div className="form-group">
                          <label>Skills (comma separated)</label>
                          <input
                            type="text"
                            value={profileData.skills}
                            onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Interests (comma separated)</label>
                          <input
                            type="text"
                            value={profileData.interests}
                            onChange={(e) => setProfileData({ ...profileData, interests: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>LinkedIn Profile</label>
                          <input
                            type="url"
                            value={profileData.linkedinProfile}
                            onChange={(e) => setProfileData({ ...profileData, linkedinProfile: e.target.value })}
                          />
                        </div>
                        <div className="form-actions">
                          <button
                            className="btn-secondary"
                            onClick={handleCancelProfile}
                            disabled={profileSaving}
                          >
                            <X size={18} />
                            Cancel
                          </button>
                          <button
                            className="btn-primary"
                            onClick={handleSaveProfile}
                            disabled={profileSaving}
                          >
                            <Save size={18} />
                            {profileSaving ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="profile-view">
                        <div className="profile-view-row">
                          <div className="profile-view-item">
                            <label>Full Name</label>
                            <p>{profile.fullName || 'Not set'}</p>
                          </div>
                          <div className="profile-view-item">
                            <label>Email</label>
                            <p>{profile.email}</p>
                          </div>
                        </div>
                        <div className="profile-view-row">
                          <div className="profile-view-item">
                            <label>Roll Number</label>
                            <p>{profile.rollNumber || 'Not set'}</p>
                          </div>
                          <div className="profile-view-item">
                            <label>Phone</label>
                            <p>{profile.phone || 'Not set'}</p>
                          </div>
                        </div>
                        <div className="profile-view-item">
                          <label>Bio</label>
                          <p>{profile.bio || 'No bio added yet'}</p>
                        </div>
                        <div className="profile-view-item">
                          <label>Skills</label>
                          <p>{profile.skills?.join(', ') || 'No skills added yet'}</p>
                        </div>
                        <div className="profile-view-item">
                          <label>Interests</label>
                          <p>{profile.interests?.join(', ') || 'No interests added yet'}</p>
                        </div>
                        <div className="profile-view-item">
                          <label>LinkedIn Profile</label>
                          <p>{profile.linkedinProfile ? (
                            <a href={profile.linkedinProfile} target="_blank" rel="noopener noreferrer">
                              {profile.linkedinProfile}
                            </a>
                          ) : 'Not set'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="events-section">
              <div className="section-header">
                <h2 className="section-title">
                  <Calendar size={24} />
                  Events
                </h2>
              </div>

              <div className="events-tabs">
                <button
                  className={`tab-btn ${eventType === 'upcoming' ? 'active' : ''}`}
                  onClick={() => { setEventType('upcoming'); loadEvents(); }}
                >
                  <Clock size={18} />
                  Upcoming Events
                </button>
                <button
                  className={`tab-btn ${eventType === 'my-events' ? 'active' : ''}`}
                  onClick={() => setEventType('my-events')}
                >
                  <CheckCircle2 size={18} />
                  My Registered Events ({myEvents.length})
                </button>
                <button
                  className={`tab-btn ${eventType === 'past' ? 'active' : ''}`}
                  onClick={() => { setEventType('past'); loadEvents(); }}
                >
                  <Calendar size={18} />
                  Past Events
                </button>
              </div>

              <div className="cards-grid">
                {loading ? (
                  <div className="loading-state">Loading events...</div>
                ) : eventType === 'my-events' ? (
                  myEvents.length > 0 ? (
                    myEvents.map((reg) => (
                      <div key={reg._id} className="event-card">
                        <div className="event-card-header">
                          <Calendar size={20} />
                          <span className={`status-badge ${reg.status}`}>{reg.status}</span>
                        </div>
                        <h3 className="event-title">{reg.event?.title || 'Event'}</h3>
                        <p className="event-description">{reg.event?.description || 'No description'}</p>
                        <div className="event-footer">
                          <div className="event-meta">
                            <div className="event-meta-item">
                              <Clock size={16} />
                              <span>{reg.event?.eventDate ? new Date(reg.event.eventDate).toLocaleDateString() : 'TBD'}</span>
                            </div>
                            <div className="event-meta-item">
                              <MapPin size={16} />
                              <span>{reg.event?.location || 'Online'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <Calendar size={64} />
                      <h3>No Registered Events</h3>
                      <p>You haven't registered for any events yet</p>
                      <button className="btn-primary" onClick={() => setEventType('upcoming')}>
                        Browse Events
                      </button>
                    </div>
                  )
                ) : events.length > 0 ? (
                  events.map((event) => (
                    <div key={event._id} className="event-card">
                      <div className="event-card-header">
                        <Calendar size={20} />
                        <span className="event-date">
                          {new Date(event.eventDate).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="event-title">{event.title}</h3>
                      <p className="event-description">{event.description?.substring(0, 100)}...</p>
                      <div className="event-footer">
                        <div className="event-meta">
                          <div className="event-meta-item">
                            <MapPin size={16} />
                            <span>{event.location || 'Online'}</span>
                          </div>
                        </div>
                        {event.registrationStatus ? (
                          <span className="status-badge">{event.registrationStatus}</span>
                        ) : (
                          <button
                            className="btn-primary"
                            onClick={() => handleRegisterEvent(event._id)}
                          >
                            Register
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <Calendar size={64} />
                    <h3>No Events Available</h3>
                    <p>There are no {eventType} events at the moment</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="projects-section">
              <div className="section-header">
                <h2 className="section-title">
                  <FolderKanban size={24} />
                  My Projects
                </h2>
                <button className="btn-primary" onClick={() => navigate('/projects/create')}>
                  <FolderPlus size={18} />
                  Create New Project
                </button>
              </div>

              <div className="cards-grid">
                {loading ? (
                  <div className="loading-state">Loading projects...</div>
                ) : projects.length > 0 ? (
                  projects.map((project) => (
                    <div key={project._id} className="project-card">
                      <div className="project-card-header">
                        <FolderKanban size={20} />
                        <span className={`status-badge ${project.status}`}>
                          {project.status}
                        </span>
                      </div>
                      <h3 className="project-title">{project.title}</h3>
                      <p className="project-description">{project.description?.substring(0, 100)}...</p>
                      <div className="project-footer">
                        <div className="project-meta">
                          <div className="project-meta-item">
                            <Clock size={16} />
                            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                          </div>
                          {project.technologies && (
                            <div className="project-tech">
                              {project.technologies.slice(0, 3).map((tech, i) => (
                                <span key={i} className="tech-badge">{tech}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button className="btn-secondary" onClick={() => navigate(`/projects/${project._id}`)}>
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <FolderKanban size={64} />
                    <h3>No Projects Yet</h3>
                    <p>You haven't submitted any projects yet. Start by creating your first project!</p>
                    <button className="btn-primary" onClick={() => navigate('/projects/create')}>
                      <FolderPlus size={18} />
                      Create Your First Project
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="achievements-section">
              <div className="section-header">
                <h2 className="section-title">
                  <Award size={24} />
                  Achievements & Badges
                </h2>
              </div>

              <div className="achievements-stats-grid">
                <div className="achievement-summary-card">
                  <div className="summary-icon">
                    <Award size={32} />
                  </div>
                  <h3>{achievementStats.unlockedAchievements || 0} / {achievementStats.totalAchievements || 0}</h3>
                  <p>Achievements Unlocked</p>
                </div>
                <div className="achievement-summary-card">
                  <div className="summary-icon">
                    <TrendingUp size={32} />
                  </div>
                  <h3>{achievementStats.totalPoints || stats.points || 0}</h3>
                  <p>Total Points</p>
                </div>
                <div className="achievement-summary-card">
                  <div className="summary-icon">
                    <Trophy size={32} />
                  </div>
                  <h3>{leaderboard.findIndex(u => u._id === user._id) + 1 || '-'}</h3>
                  <p>Leaderboard Rank</p>
                </div>
              </div>

              <div className="badges-grid">
                {loading ? (
                  <div className="loading-state">Loading achievements...</div>
                ) : achievements.length > 0 ? (
                  achievements.map((achievement) => (
                    <div key={achievement._id} className={`badge-card ${achievement.isUnlocked ? '' : 'locked'}`}>
                      <div className="badge-icon-large">{achievement.icon || '🏆'}</div>
                      <h4>{achievement.name}</h4>
                      <p>{achievement.description}</p>
                      {achievement.requirement && (
                        <div className="badge-progress">
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{ width: `${Math.min((achievement.progress / achievement.requirement.value) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <span>{achievement.progress || 0} / {achievement.requirement.value}</span>
                        </div>
                      )}
                      {achievement.isUnlocked && (
                        <span className="unlocked-badge">
                          <CheckCircle2 size={16} />
                          Unlocked
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <Award size={64} />
                    <h3>No Achievements Yet</h3>
                    <p>Complete events and projects to earn achievements and badges!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="leaderboard-section">
              <div className="section-header">
                <h2 className="section-title">
                  <Trophy size={24} />
                  Leaderboard
                </h2>
              </div>

              <div className="leaderboard-container">
                {loading ? (
                  <div className="loading-state">Loading leaderboard...</div>
                ) : leaderboard.length > 0 ? (
                  <div className="leaderboard-list">
                    {leaderboard.map((member, index) => (
                      <div
                        key={member._id}
                        className={`leaderboard-item ${member._id === user._id ? 'current-user' : ''} ${index < 3 ? `rank-${index + 1}` : ''}`}
                      >
                        <div className="leaderboard-rank">
                          {index < 3 ? (
                            <div className="rank-medal">
                              {index === 0 && '🥇'}
                              {index === 1 && '🥈'}
                              {index === 2 && '🥉'}
                            </div>
                          ) : (
                            <span className="rank-number">#{index + 1}</span>
                          )}
                        </div>
                        <div className="leaderboard-avatar">
                          {member.fullName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="leaderboard-info">
                          <h4>{member.fullName || 'Unknown User'}</h4>
                          <p>{member.email}</p>
                        </div>
                        <div className="leaderboard-stats">
                          <div className="stat-item">
                            <TrendingUp size={16} />
                            <span>{member.points || 0} pts</span>
                          </div>
                          <div className="stat-item">
                            <Award size={16} />
                            <span>{member.achievementsCount || 0}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <Trophy size={64} />
                    <h3>Leaderboard Coming Soon</h3>
                    <p>The leaderboard will be available once more students join!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="resources-section">
              <div className="section-header">
                <h2 className="section-title">
                  <BookOpen size={24} />
                  Learning Resources
                </h2>
              </div>

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
                {loading ? (
                  <div className="loading-state">Loading resources...</div>
                ) : resources.length > 0 ? (
                  resources.map((resource) => (
                    <div key={resource._id} className="resource-card">
                      <div className="resource-icon-large">{resource.icon || '📚'}</div>
                      <h4>{resource.title}</h4>
                      <p>{resource.description}</p>
                      <span className={`difficulty-badge difficulty-${resource.difficulty?.toLowerCase()}`}>
                        {resource.difficulty || 'Beginner'}
                      </span>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                      >
                        <ExternalLink size={18} />
                        View Resource
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <BookOpen size={64} />
                    <h3>No Resources Available</h3>
                    <p>Learning resources and materials will appear here soon!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'communication' && (
            <div className="communication-section">
              <div className="section-header">
                <h2 className="section-title">
                  <MessageSquare size={24} />
                  Communication & Collaboration
                </h2>
              </div>

              {/* Announcements */}
              <div className="announcements-container">
                <h3 className="subsection-title">
                  <Megaphone size={20} />
                  Announcements
                </h3>
                <div className="announcements-list">
                  {loading ? (
                    <div className="loading-state">Loading announcements...</div>
                  ) : announcements.length > 0 ? (
                    announcements.map((announcement) => (
                      <div key={announcement._id} className="announcement-card">
                        <div className="announcement-header">
                          <h4>{announcement.title}</h4>
                          <span className="announcement-date">
                            {new Date(announcement.publishedAt || announcement.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p>{announcement.content}</p>
                        {announcement.priority && (
                          <span className={`priority-badge priority-${announcement.priority}`}>
                            {announcement.priority}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="empty-state-mini">
                      <Megaphone size={32} />
                      <p>No announcements at this time</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notifications */}
              <div className="notifications-container">
                <h3 className="subsection-title">
                  <Bell size={20} />
                  Notifications {unreadCount > 0 && <span className="unread-count">({unreadCount})</span>}
                </h3>
                <div className="notifications-list">
                  {loading ? (
                    <div className="loading-state">Loading notifications...</div>
                  ) : notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`notification-item ${notification.isRead ? '' : 'unread'}`}
                        onClick={() => !notification.isRead && handleMarkNotificationRead(notification._id)}
                      >
                        <div className="notification-icon-wrapper">
                          <Bell size={20} />
                        </div>
                        <div className="notification-content">
                          <p>{notification.message}</p>
                          <span className="notification-time">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {!notification.isRead && <div className="unread-dot"></div>}
                      </div>
                    ))
                  ) : (
                    <div className="empty-state-mini">
                      <Bell size={32} />
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="certificates-section">
              <div className="section-header">
                <h2 className="section-title">
                  <FileText size={24} />
                  My Certificates
                </h2>
              </div>

              <div className="certificates-grid">
                {loading ? (
                  <div className="loading-state">Loading certificates...</div>
                ) : certificates.length > 0 ? (
                  certificates.map((cert) => (
                    <div key={cert._id} className="certificate-card">
                      <div className="certificate-icon-large">🎓</div>
                      <h4>{cert.event?.title || 'Certificate'}</h4>
                      <p className="certificate-event">Event Certificate</p>
                      <p className="certificate-date">
                        Attended: {cert.attendedAt ? new Date(cert.attendedAt).toLocaleDateString() : 'N/A'}
                      </p>
                      <a
                        href={cert.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                      >
                        <Download size={18} />
                        Download Certificate
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <FileText size={64} />
                    <h3>No Certificates Yet</h3>
                    <p>Attend events and complete workshops to earn certificates!</p>
                    <button className="btn-primary" onClick={() => setActiveTab('events')}>
                      <Calendar size={18} />
                      Browse Events
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
