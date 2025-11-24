import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import ShootingStars from '../../components/ui/ShootingStars';
import Meteors from '../../components/ui/Meteors';
import { MenuContainer, MenuItem } from '../../components/ui/fluid-menu';
import SimpleTextRotate from "../../components/ui/simple-text-rotate";
import { NotFound } from "../../components/ui/ghost-404-page";
import { NotFoundPage } from "../../components/ui/404-page-not-found";
import { Navbar } from '../../components/ui/mini-navbar';
import { ProfileDropdown } from '../../components/ui/profile-dropdown';
import { handleAsyncError } from '../../utils/error-handler';
import { Menu as MenuIcon, X, Briefcase, Calendar, Star, Github, Plus, GitBranch, Users, ExternalLink, CheckCircle, AlertCircle, ArrowLeft, Home, BookOpen } from 'lucide-react';
import LearnAndBuild from '../../components/apps/LearnAndBuild';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [githubConnected, setGithubConnected] = useState(false);
  const [userStats, setUserStats] = useState({
    projects: 0,
    aidxProjects: 0,
    importedProjects: 0,
    events: 0,
    contributions: 0
  });
  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);
  const [githubRepos, setGithubRepos] = useState([]);
  const [activeApp, setActiveApp] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, [user, token]);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Check GitHub connection - check both localStorage and actual user data
      const localStorageConnected = localStorage.getItem('githubConnected') === 'true';
      const hasGithubData = user?.githubUsername || user?.githubId;
      // For testing - always show 404 page when GitHub isn't connected
      const isConnected = localStorageConnected && hasGithubData;
      
      console.log('GitHub connection check:', {
        localStorage: localStorageConnected,
        hasGithubData: !!hasGithubData,
        user: user,
        finalResult: isConnected
      });
      
      // Set GitHub connection status naturally
      setGithubConnected(isConnected);

      // Only fetch if API URL is available and token exists
      const apiUrl = import.meta.env.VITE_API_URL;
      if (apiUrl && token) {
        try {
          const headers = { Authorization: `Bearer ${token}` };

          // Fetch user projects with timeout
          const projectsRes = await Promise.race([
            axios.get(`${apiUrl}/api/projects/my-projects`, { headers }),
            new Promise(resolve => setTimeout(() => resolve({ data: [] }), 3000))
          ]);

          // Fetch user events with timeout
          const eventsRes = await Promise.race([
            axios.get(`${apiUrl}/api/events/my-events`, { headers }),
            new Promise(resolve => setTimeout(() => resolve({ data: [] }), 3000))
          ]);

          setProjects(projectsRes.data || []);
          setEvents(eventsRes.data || []);

          setUserStats({
            projects: projectsRes.data?.length || 0,
            aidxProjects: projectsRes.data?.filter(p => p.type === 'aidx')?.length || 0,
            importedProjects: projectsRes.data?.filter(p => p.type === 'imported')?.length || 0,
            events: eventsRes.data?.length || 0,
            contributions: (projectsRes.data?.length || 0) + (eventsRes.data?.length || 0)
          });
        } catch (apiError) {
          // Silently handle API errors - set empty data
          console.log('Backend not available, using empty data');
          setProjects([]);
          setEvents([]);
          setUserStats({
            projects: 0,
            aidxProjects: 0,
            importedProjects: 0,
            events: 0,
            contributions: 0
          });
        }
      } else {
        // No API URL or token - set empty data
        setProjects([]);
        setEvents([]);
        setUserStats({
          projects: 0,
          aidxProjects: 0,
          importedProjects: 0,
          events: 0,
          contributions: 0
        });
      }
    } catch (err) {
      console.error('Dashboard initialization error:', err);
      // Set empty data on any error
      setProjects([]);
      setEvents([]);
      setUserStats({
        projects: 0,
        aidxProjects: 0,
        importedProjects: 0,
        events: 0,
        contributions: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubConnect = () => {
    navigate('/github/login');
  };

  const handleDisconnectGitHub = async () => {
    try {
      await axios.post('/api/github/disconnect', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Clear GitHub data
      localStorage.removeItem('githubConnected');
      localStorage.removeItem('githubUsername');
      localStorage.removeItem('githubAvatar');
      localStorage.removeItem('githubToken');
      
      setGithubConnected(false);
      setGithubRepos([]);
      setUserStats(prev => ({ ...prev, aidxProjects: 0, importedProjects: 0 }));
      
      alert('GitHub disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting GitHub:', error);
      alert('Failed to disconnect GitHub');
    }
  };

  const handleAppClick = (appName) => {
    setActiveApp(appName);
  };

  const handleCloseApp = () => {
    setActiveApp(null);
  };

  const renderActiveApp = () => {
    if (!activeApp) return null;

    switch (activeApp) {
      case 'Learn & Build':
        return (
          <LearnAndBuild 
            onClose={handleCloseApp} 
            user={user} 
            isAdmin={user?.role === 'admin' || user?.role === 'coordinator'}
          />
        );
      default:
        return null;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!user) {
    console.log('No user found, showing loading');
    return <div className="dashboard-loading">Loading user data...</div>;
  }

  if (loading) {
    console.log('Dashboard is loading');
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  console.log('Rendering dashboard with user:', user?.fullName);
  return (
    <div className="student-dashboard">
      {/* Mini Navigation Bar */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Profile Dropdown - Fixed Position */}
      <aside className="stats-sidebar">
        <ProfileDropdown 
          onLogout={handleLogout}
          setActiveTab={setActiveTab}
          data={{
            name: user?.fullName || 'AID-X Member',
            email: localStorage.getItem('githubUsername') || 'github_username',
            avatar: user?.profilePicture || localStorage.getItem('githubAvatar') || `https://github.com/${localStorage.getItem('githubUsername')}.png?size=36`,
            subscription: "PRO",
            rank: "Silver"
          }}
        />
      </aside>

      <div className="dashboard-layout">
        {/* Main Content */}
        <main className="main-content">
          {/* ===== OVERVIEW TAB ===== */}
          {activeTab === 'overview' && (
            <div className="overview-section">
              {/* Always show apps regardless of GitHub connection */}
              <div className="welcome-message">
                <h1>Welcome back, {user.fullName}!</h1>
                <p>
                  <SimpleTextRotate 
                    texts={[
                      "What would you like to work on today?",
                      "Ready to innovate with AID-X Club?",
                      "Let's build something amazing together!",
                      "Explore projects and collaborate with peers",
                      "Discover new opportunities and expand your skills",
                      "Connect with talented developers and innovators"
                    ]}
                    rotationInterval={3000}
                    className="text-xl text-gray-300"
                  />  
                </p>
              </div>
              
              {/* Mac-style App Drawer */}
              <div className="mac-app-drawer">
                <div className="drawer-header">
                  <h3 className="drawer-title">Workspace</h3>
                </div>
                
                <div className="apps-container">
                  {/* Row 1 */}
                  <div className="app-item" onClick={() => handleAppClick('Learn & Build')}>
                    <div className="app-icon-mac">
                      <img src="/icons/Learn & Build.png" alt="Learn & Build" />
                    </div>
                    <span className="app-name">Learn & Build</span>
                  </div>
                  
                  <div className="app-item">
                    <div className="app-icon-mac">
                      <img src="/icons/My Projects.png" alt="My Projects" />
                    </div>
                    <span className="app-name">My Projects</span>
                  </div>
                  
                  <div className="app-item">
                    <div className="app-icon-mac">
                      <img src="/icons/Deployment Hub.png" alt="Deployment Hub" />
                    </div>
                    <span className="app-name">Deployment Hub</span>
                  </div>
                  
                  <div className="app-item">
                    <div className="app-icon-mac">
                      <img src="/icons/Team Workspace.png" alt="Team Workspace" />
                    </div>
                    <span className="app-name">Team Workspace</span>
                  </div>
                  
                  {/* Row 2 */}
                  <div className="app-item">
                    <div className="app-icon-mac">
                      <img src="/icons/Events & Workshops.png" alt="Events & Workshops" />
                    </div>
                    <span className="app-name">Events & Workshops</span>
                  </div>
                  
                  <div className="app-item">
                    <div className="app-icon-mac">
                      <img src="/icons/Portfolio Profiles.png" alt="Portfolio Profiles" />
                    </div>
                    <span className="app-name">Portfolio Profiles</span>
                  </div>
                  
                  <div className="app-item">
                    <div className="app-icon-mac">
                      <img src="/icons/leaderbaord.png" alt="Leaderboard" />
                    </div>
                    <span className="app-name">Leaderboard</span>
                  </div>
                  
                  <div className="app-item">
                    <div className="app-icon-mac">
                      <img src="/icons/Career Path Roadmaps.png" alt="Career Roadmaps" />
                    </div>
                    <span className="app-name">Career Roadmaps</span>
                  </div>
                  
                  {/* Row 3 */}
                  <div className="app-item">
                    <div className="app-icon-mac">
                      <img src="/icons/AI Help Desk.png" alt="AI Help Desk" />
                    </div>
                    <span className="app-name">AI Help Desk</span>
                  </div>
                  
                  <div className="app-item">
                    <div className="app-icon-mac">
                      <img src="/icons/Opportunities Hub.png" alt="Opportunities" />
                    </div>
                    <span className="app-name">Opportunities</span>
                  </div>
                </div>
              </div>
              
                          </div>
          )}

          {/* ===== ACTIVE APP MODAL ===== */}
          {activeApp && (
            <div className="app-modal-overlay" onClick={handleCloseApp}>
              <div className="app-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="app-modal-header">
                  <h2 className="app-modal-title">
                    {activeApp === 'Learn & Build' && (
                      <>
                        <BookOpen className="w-5 h-5" />
                        Learn & Build
                      </>
                    )}
                  </h2>
                  <button onClick={handleCloseApp} className="app-modal-close">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="app-modal-content">
                  {renderActiveApp()}
                </div>
              </div>
            </div>
          )}

          {/* ===== PROJECTS TAB ===== */}
          {activeTab === 'projects' && (
            <div className="projects-section">
              <div className="section-header">
                <div className="header-top">
                  <h2>My Projects</h2>
                  {githubConnected && (
                    <button 
                      onClick={() => navigate('/create-project')}
                      className="btn btn-primary"
                      title="Create a new project"
                    >
                      <Plus size={18} />
                      <span>New Project</span>
                    </button>
                  )}
                </div>
              </div>

              {!githubConnected ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <AlertCircle size={48} />
                  </div>
                  <h3>Connect GitHub to Create Projects</h3>
                  <p>Please connect your GitHub account first to manage projects.</p>
                  <div className="empty-actions">
                    <button 
                      onClick={handleGitHubConnect}
                      className="btn btn-primary"
                      title="Connect GitHub account"
                    >
                      <Github size={18} />
                      <span>Connect GitHub</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('overview')}
                      className="btn btn-secondary"
                      title="Go back to overview"
                    >
                      <ArrowLeft size={18} />
                      <span>Back to Overview</span>
                    </button>
                  </div>
                </div>
              ) : projects.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Briefcase size={48} />
                  </div>
                  <h3>No Projects Yet</h3>
                  <p>Start by creating your first project or importing from GitHub.</p>
                  <div className="empty-actions">
                    <button 
                      onClick={() => navigate('/create-project')}
                      className="btn btn-primary"
                      title="Create your first project"
                    >
                      <Plus size={18} />
                      <span>Create Your First Project</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('overview')}
                      className="btn btn-secondary"
                      title="Go back to overview"
                    >
                      <ArrowLeft size={18} />
                      <span>Back to Overview</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* AID-X Projects */}
                  {userStats.aidxProjects > 0 && (
                    <div className="projects-group">
                      <h3 className="group-title">AID-X Projects</h3>
                      <div className="projects-grid">
                        {projects.filter(p => p.type === 'aidx').map(project => (
                          <div key={project.id} className="project-card">
                            <div className="project-header">
                              <h4>{project.name}</h4>
                              <span className={`status-badge ${project.status?.toLowerCase()}`}>
                                {project.status || 'Active'}
                              </span>
                            </div>
                            <p className="project-description">{project.description}</p>
                            <div className="project-meta">
                              <small>Team: {project.team?.length || 1} members</small>
                            </div>
                            <div className="project-actions">
                              <button className="action-link">
                                <ExternalLink size={16} />
                                Open on GitHub
                              </button>
                              <button className="action-link">
                                <Users size={16} />
                                Add Teammate
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Imported Projects */}
                  {userStats.importedProjects > 0 && (
                    <div className="projects-group">
                      <h3 className="group-title">Imported GitHub Projects</h3>
                      <div className="projects-grid">
                        {projects.filter(p => p.type === 'imported').map(project => (
                          <div key={project.id} className="project-card imported">
                            <div className="project-header">
                              <h4>{project.name}</h4>
                              <span className="badge-imported">Imported</span>
                            </div>
                            <p className="project-description">{project.description}</p>
                            <div className="project-meta">
                              <small>Linked from: {project.source}</small>
                            </div>
                            <div className="project-actions">
                              <button className="action-link">
                                <ExternalLink size={16} />
                                View on GitHub
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ===== EVENTS TAB ===== */}
          {activeTab === 'events' && (
            <div className="events-section">
              <div className="section-header">
                <h2>Upcoming Events</h2>
              </div>

              {events.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Calendar size={48} />
                  </div>
                  <h3>No Events Yet</h3>
                  <p>Check back soon for upcoming workshops and hackathons!</p>
                  <div className="empty-actions">
                    <button 
                      onClick={() => setActiveTab('overview')}
                      className="btn btn-primary"
                      title="Go back to overview"
                    >
                      <ArrowLeft size={18} />
                      <span>Back to Overview</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="events-grid">
                  {events.map(event => (
                    <div key={event.id} className="event-card">
                      <div className="event-header">
                        <h4>{event.name}</h4>
                        <span className="event-date">{event.date}</span>
                      </div>
                      <p className="event-description">{event.description}</p>
                      <div className="event-actions">
                        <button 
                          onClick={() => navigate(`/events/${event.id}`)}
                          className="btn btn-secondary btn-small"
                          title="View event details"
                        >
                          <ExternalLink size={16} />
                          <span>View Details</span>
                        </button>
                        <button 
                          className="btn btn-primary btn-small"
                          title="Register for this event"
                        >
                          <CheckCircle size={16} />
                          <span>Register</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===== PROFILE TAB ===== */}
          {activeTab === 'profile' && (
            <div className="profile-section">
              <div className="profile-card">
                <h2>My Profile</h2>
                
                {/* Enhanced Profile Section */}
                <div className="profile-group">
                  <h3>Profile Information</h3>
                  <div className="profile-enhanced">
                    <div className="profile-avatar">
                      <img 
                        src={user?.profilePicture || localStorage.getItem('githubAvatar') || `https://github.com/${localStorage.getItem('githubUsername')}.png?size=100`}
                        alt="Profile Avatar"
                        className="avatar-img"
                      />
                    </div>
                    <div className="profile-details">
                      <div className="profile-name">
                        <h4>{user.fullName}</h4>
                        <span className="profile-badge">Student</span>
                      </div>
                      <div className="profile-info">
                        <p><strong>Student ID:</strong> {user.studentId || 'Not provided'}</p>
                        <p><strong>Year & Section:</strong> {user.year || 'Not provided'} • {user.section || 'N/A'}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>GitHub:</strong> @{localStorage.getItem('githubUsername') || 'Not connected'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GitHub Integration */}
                <div className="profile-group">
                  <h3>GitHub Integration</h3>
                  <div className="github-settings">
                    {githubConnected ? (
                      <>
                        <div className="setting-item">
                          <div className="setting-info">
                            <p><strong>GitHub Status:</strong> Connected</p>
                            <small>Username: {localStorage.getItem('githubUsername')}</small>
                          </div>
                          <button 
                            onClick={handleDisconnectGitHub}
                            className="btn btn-danger-small"
                          >
                            Disconnect GitHub
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="setting-item">
                        <div className="setting-info">
                          <p><strong>GitHub Status:</strong> Not Connected</p>
                          <small>Connect to manage projects</small>
                        </div>
                        <button 
                          onClick={handleGitHubConnect}
                          className="btn btn-primary"
                        >
                          Connect GitHub
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== RANK TAB ===== */}
          {activeTab === 'rank' && (
            <div className="profile-section">
              <div className="profile-card">
                <h2>Rank & Achievements</h2>
                
                {/* Rank Section */}
                <div className="profile-group">
                  <h3>Current Rank</h3>
                  <div className="rank-section">
                    <div className="rank-display">
                      <div className="rank-icon">🏆</div>
                      <div className="rank-info">
                        <h4>Silver Member</h4>
                        <div className="rank-progress">
                          <div className="progress-bar">
                            <div className="progress-fill" style={{width: '65%'}}></div>
                          </div>
                          <span className="progress-text">650 / 1000 XP</span>
                        </div>
                        <p className="rank-description">Active contributor with 12 projects</p>
                      </div>
                    </div>
                    
                    <div className="achievements-grid">
                      <div className="achievement-badge">
                        <div className="badge-icon">⭐</div>
                        <span>First Project</span>
                      </div>
                      <div className="achievement-badge">
                        <div className="badge-icon">🚀</div>
                        <span>Early Adopter</span>
                      </div>
                      <div className="achievement-badge">
                        <div className="badge-icon">💡</div>
                        <span>Innovator</span>
                      </div>
                      <div className="achievement-badge">
                        <div className="badge-icon">🤝</div>
                        <span>Team Player</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rank Statistics */}
                <div className="profile-group">
                  <h3>Statistics</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <div className="stat-number">12</div>
                      <div className="stat-label">Projects</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">8</div>
                      <div className="stat-label">Contributions</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">4</div>
                      <div className="stat-label">Events</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">650</div>
                      <div className="stat-label">Total XP</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== SETTINGS TAB ===== */}
          {activeTab === 'settings' && (
            <div className="profile-section">
              <div className="profile-card">
                <h2>Account Settings</h2>
                
                {/* Profile Settings */}
                <div className="profile-group">
                  <h3>Profile Settings</h3>
                  <div className="settings-list">
                    <div className="setting-item">
                      <div className="setting-info">
                        <p><strong>Display Name</strong></p>
                        <small>Update how your name appears to others</small>
                      </div>
                      <button className="btn btn-secondary-small">
                        Edit
                      </button>
                    </div>
                    <div className="setting-item">
                      <div className="setting-info">
                        <p><strong>Profile Picture</strong></p>
                        <small>Change your profile image</small>
                      </div>
                      <button className="btn btn-secondary-small">
                        Change
                      </button>
                    </div>
                    <div className="setting-item">
                      <div className="setting-info">
                        <p><strong>Bio</strong></p>
                        <small>Add a short description about yourself</small>
                      </div>
                      <button className="btn btn-secondary-small">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="profile-group">
                  <h3>Security</h3>
                  <div className="settings-list">
                    <div className="setting-item">
                      <div className="setting-info">
                        <p><strong>Password</strong></p>
                        <small>Last changed 3 months ago</small>
                      </div>
                      <button className="btn btn-secondary-small">
                        Change
                      </button>
                    </div>
                    <div className="setting-item">
                      <div className="setting-info">
                        <p><strong>Email Address</strong></p>
                        <small>{user.email}</small>
                      </div>
                      <button className="btn btn-secondary-small">
                        Update
                      </button>
                    </div>
                    <div className="setting-item">
                      <div className="setting-info">
                        <p><strong>Two-Factor Authentication</strong></p>
                        <small>Add an extra layer of security</small>
                      </div>
                      <button className="btn btn-secondary-small">
                        Enable
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="profile-group">
                  <h3>Preferences</h3>
                  <div className="settings-list">
                    <div className="setting-item">
                      <div className="setting-info">
                        <p><strong>Email Notifications</strong></p>
                        <small>Receive updates about your projects</small>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <div className="setting-item">
                      <div className="setting-info">
                        <p><strong>Dark Mode</strong></p>
                        <small>Use dark theme across the platform</small>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

                  </main>
      </div>
      
          {/* Shooting Stars Background Effect */}
      <ShootingStars
        minSpeed={30}
        maxSpeed={60}
        minDelay={500}
        maxDelay={1500}
      />
      <ShootingStars
        minSpeed={25}
        maxSpeed={50}
        minDelay={800}
        maxDelay={2000}
      />
      <ShootingStars
        minSpeed={35}
        maxSpeed={70}
        minDelay={600}
        maxDelay={1800}
      />
      
      {/* Meteors Effect */}
      <Meteors number={15} />
    </div>
  );
};

export default StudentDashboard;
