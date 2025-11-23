import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import ShootingStars from '../../components/ui/ShootingStars';
import Meteors from '../../components/ui/Meteors';
import { MenuContainer, MenuItem } from '../../components/ui/fluid-menu';
import { TextRotate } from '../../components/ui/text-rotate';
import { Navbar } from '../../components/ui/mini-navbar';
import { ProfileDropdown } from '../../components/ui/profile-dropdown';
import ErrorBoundary from '../../components/ui/error-boundary';
import ErrorFallback from '../../components/ui/error-fallback';
import { handleAsyncError } from '../../utils/error-handler';
import { Menu as MenuIcon, X, Briefcase, Calendar, Star, Github, Plus, GitBranch, Users, ExternalLink, CheckCircle, AlertCircle, ArrowLeft, Home } from 'lucide-react';
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

  useEffect(() => {
    fetchAllData();
  }, [user, token]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      // Check GitHub connection
      const isConnected = localStorage.getItem('githubConnected') === 'true';
      setGithubConnected(isConnected);

      // Fetch user projects
      const projectsRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/projects/my-projects`,
        { headers }
      ).catch(() => ({ data: [] }));

      // Fetch user events
      const eventsRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/events/my-events`,
        { headers }
      ).catch(() => ({ data: [] }));

      setProjects(projectsRes.data || []);
      setEvents(eventsRes.data || []);

      setUserStats({
        projects: projectsRes.data?.length || 0,
        aidxProjects: projectsRes.data?.filter(p => p.type === 'aidx')?.length || 0,
        importedProjects: projectsRes.data?.filter(p => p.type === 'imported')?.length || 0,
        events: eventsRes.data?.length || 0,
        contributions: (projectsRes.data?.length || 0) + (eventsRes.data?.length || 0)
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', handleAsyncError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubConnect = () => {
    navigate('/github/login');
  };

  const handleDisconnectGitHub = () => {
    localStorage.removeItem('githubUser');
    localStorage.removeItem('githubConnected');
    localStorage.removeItem('githubAccessToken');
    setGithubConnected(false);
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
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <ErrorFallback>
      <ErrorBoundary>
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
              {/* Main content goes here */}
              <div className="welcome-message">
                <h1>Welcome back, {user.fullName}!</h1>
                <p>
                  <TextRotate 
                    texts={[
                      "What would you like to work on today?",
                      "Ready to innovate with AID-X Club?",
                      "Let's build something amazing together!",
                      "Explore projects and collaborate with peers",
                      "Join our tech community and grow your skills",
                      "Discover hackathons and coding events",
                      "Connect with fellow developers and innovators"
                    ]}
                    rotationInterval={3000}
                    staggerDuration={0.03}
                    mainClassName="text-lg"
                    elementLevelClassName="inline-block"
                  />
                </p>
              </div>

              {/* GitHub Connection Prompt */}
              {!githubConnected ? (
                <div className="github-prompt-card">
                  <div className="prompt-icon">
                    <Github size={40} />
                  </div>
                  <div className="prompt-content">
                    <h2>✅ Step 1: Connect GitHub</h2>
                    <p>Connect your GitHub account to create and manage projects. Until this is done, some actions remain locked.</p>
                    <button 
                      onClick={handleGitHubConnect}
                      className="btn btn-primary"
                    >
                      <Github size={18} />
                      Connect GitHub
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* GitHub Connected Status */}
                  <div className="github-status-card">
                    <div className="status-header">
                      <div className="status-badge">
                        <CheckCircle size={24} />
                        <span>GitHub Connected ✅</span>
                      </div>
                      <button 
                        onClick={handleDisconnectGitHub}
                        className="btn btn-secondary-small"
                      >
                        Disconnect
                      </button>
                    </div>
                    <div className="github-info">
                      <p><strong>GitHub Username:</strong> {localStorage.getItem('githubUsername') || 'Connected'}</p>
                    </div>
                  </div>

                  {/* Import GitHub Projects Section */}
                  <div className="import-projects-card">
                    <div className="section-header">
                      <h3>📦 Import your GitHub Projects</h3>
                      <p>Select which repos you want to link to the portal</p>
                    </div>
                    <div className="repo-list">
                      <p className="placeholder">Your GitHub repositories will appear here</p>
                    </div>
                  </div>
                </>
              )}

              {/* Summary Cards */}
              <div className="summary-cards">
                <div className="summary-card">
                  <div className="card-icon projects-icon">
                    <Briefcase size={32} />
                  </div>
                  <div className="card-content">
                    <h3>My Projects</h3>
                    <p className="card-stat">{userStats.projects}</p>
                    <small className="card-detail">
                      {userStats.aidxProjects} AID-X • {userStats.importedProjects} Imported
                    </small>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="card-icon events-icon">
                    <Calendar size={32} />
                  </div>
                  <div className="card-content">
                    <h3>Events</h3>
                    <p className="card-stat">{userStats.events}</p>
                    <small className="card-detail">Upcoming & Registered</small>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="card-icon contributions-icon">
                    <Star size={32} />
                  </div>
                  <div className="card-content">
                    <h3>Achievements</h3>
                    <p className="card-stat">Future</p>
                    <small className="card-detail">Badges & Certificates</small>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  {githubConnected && (
                    <>
                      <button 
                        onClick={() => navigate('/create-project')}
                        className="action-btn primary"
                      >
                        <Plus size={20} />
                        Start a New Project
                      </button>
                      <button 
                        onClick={() => setActiveTab('projects')}
                        className="action-btn"
                      >
                        <Briefcase size={20} />
                        View My Projects
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => setActiveTab('events')}
                    className="action-btn"
                  >
                    <Calendar size={20} />
                    Browse Events
                  </button>
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
                <h2>Account & Profile</h2>
                
                <div className="profile-group">
                  <h3>Profile Details</h3>
                  <div className="profile-fields">
                    <div className="profile-field">
                      <label>Full Name</label>
                      <p>{user.fullName}</p>
                    </div>
                    <div className="profile-field">
                      <label>Student ID</label>
                      <p>{user.studentId || 'Not provided'}</p>
                    </div>
                    <div className="profile-field">
                      <label>Year & Section</label>
                      <p>{user.year || 'Not provided'} • {user.section || 'N/A'}</p>
                    </div>
                    <div className="profile-field">
                      <label>Email</label>
                      <p>{user.email}</p>
                    </div>
                  </div>
                </div>

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

                <div className="profile-group">
                  <h3>Account Settings</h3>
                  <div className="settings-buttons">
                    <button 
                      className="btn btn-secondary"
                      title="Change your password"
                    >
                      <span>🔐 Change Password</span>
                    </button>
                    <button 
                      className="btn btn-secondary"
                      title="Update your email address"
                    >
                      <span>✉️ Update Email</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('overview')}
                      className="btn btn-secondary-outline"
                      title="Go back to overview"
                    >
                      <ArrowLeft size={18} />
                      <span>Back to Overview</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Announcements Section */}
          {activeTab === 'overview' && (
            <div className="announcements-section">
              <h3>📢 Announcements</h3>
              <div className="announcements-list">
                <div className="announcement-item">
                  <span className="announcement-badge">Workshop</span>
                  <p>New workshops available - React Advanced Patterns</p>
                </div>
                <div className="announcement-item">
                  <span className="announcement-badge">Deadline</span>
                  <p>Project submissions close on December 15th</p>
                </div>
                <div className="announcement-item">
                  <span className="announcement-badge">Opportunity</span>
                  <p>Join the AID-X Hackathon 2025 - Registration open now!</p>
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
      </ErrorBoundary>
    </ErrorFallback>
  );
};

export default StudentDashboard;
