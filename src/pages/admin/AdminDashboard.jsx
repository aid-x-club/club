import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalEvents: 0,
        totalProjects: 0,
        activeEvents: 0,
        pendingApprovals: 0,
        totalRegistrations: 0
    });
    const [users, setUsers] = useState([]);
    const [events, setEvents] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Check if user is admin
    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'coordinator')) {
            navigate('/');
        }
    }, [user, navigate]);

    // Fetch dashboard data
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch stats, users, events, and projects
            // This is a placeholder - adjust based on your API endpoints
            const [statsRes, usersRes, eventsRes, projectsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
                    headers: { Authorization: `Bearer ${user?.token}` }
                }).catch(() => ({ data: { data: stats } })),
                axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
                    headers: { Authorization: `Bearer ${user?.token}` }
                }).catch(() => ({ data: { data: [] } })),
                axios.get(`${import.meta.env.VITE_API_URL}/api/events`, {
                    headers: { Authorization: `Bearer ${user?.token}` }
                }).catch(() => ({ data: { data: [] } })),
                axios.get(`${import.meta.env.VITE_API_URL}/api/projects`, {
                    headers: { Authorization: `Bearer ${user?.token}` }
                }).catch(() => ({ data: { data: [] } }))
            ]);

            setStats(statsRes.data.data || {
                totalUsers: 150,
                totalEvents: 25,
                totalProjects: 89,
                activeEvents: 8,
                pendingApprovals: 12,
                totalRegistrations: 456
            });
            setUsers(usersRes.data.data || []);
            setEvents(eventsRes.data.data || []);
            setProjects(projectsRes.data.data || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            fetchDashboardData();
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/events/${eventId}`, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            fetchDashboardData();
        } catch (error) {
            alert('Failed to delete event');
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}`, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            fetchDashboardData();
        } catch (error) {
            alert('Failed to delete project');
        }
    };

    const handleUpdateUserRole = async (userId, newRole) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/role`,
                { role: newRole },
                { headers: { Authorization: `Bearer ${user?.token}` } }
            );
            fetchDashboardData();
        } catch (error) {
            alert('Failed to update user role');
        }
    };

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="admin-loading">
                    <div className="spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* Top Navigation */}
            <nav className="admin-navbar">
                <div className="admin-nav-left">
                    <h1 className="admin-logo">🛡️ Admin Dashboard</h1>
                </div>
                <div className="admin-nav-right">
                    <span className="admin-user-info">
                        {user?.fullName} ({user?.role})
                    </span>
                    <button onClick={() => navigate('/')} className="admin-btn admin-btn-secondary">
                        🏠 Home
                    </button>
                    <button onClick={logout} className="admin-btn admin-btn-danger">
                        🚪 Logout
                    </button>
                </div>
            </nav>

            {/* Sidebar */}
            <div className="admin-layout">
                <aside className="admin-sidebar">
                    <button
                        className={`admin-sidebar-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        📊 Overview
                    </button>
                    <button
                        className={`admin-sidebar-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        👥 Users
                    </button>
                    <button
                        className={`admin-sidebar-btn ${activeTab === 'events' ? 'active' : ''}`}
                        onClick={() => setActiveTab('events')}
                    >
                        📅 Events
                    </button>
                    <button
                        className={`admin-sidebar-btn ${activeTab === 'projects' ? 'active' : ''}`}
                        onClick={() => setActiveTab('projects')}
                    >
                        🚀 Projects
                    </button>
                    <button
                        className={`admin-sidebar-btn ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        ⚙️ Settings
                    </button>
                </aside>

                {/* Main Content */}
                <main className="admin-content">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="admin-tab-content">
                            <h2 className="admin-section-title">Dashboard Overview</h2>

                            <div className="admin-stats-grid">
                                <div className="admin-stat-card">
                                    <div className="stat-icon">👥</div>
                                    <div className="stat-info">
                                        <h3>{stats.totalUsers}</h3>
                                        <p>Total Users</p>
                                    </div>
                                </div>
                                <div className="admin-stat-card">
                                    <div className="stat-icon">📅</div>
                                    <div className="stat-info">
                                        <h3>{stats.totalEvents}</h3>
                                        <p>Total Events</p>
                                    </div>
                                </div>
                                <div className="admin-stat-card">
                                    <div className="stat-icon">🚀</div>
                                    <div className="stat-info">
                                        <h3>{stats.totalProjects}</h3>
                                        <p>Total Projects</p>
                                    </div>
                                </div>
                                <div className="admin-stat-card">
                                    <div className="stat-icon">✅</div>
                                    <div className="stat-info">
                                        <h3>{stats.activeEvents}</h3>
                                        <p>Active Events</p>
                                    </div>
                                </div>
                                <div className="admin-stat-card">
                                    <div className="stat-icon">⏳</div>
                                    <div className="stat-info">
                                        <h3>{stats.pendingApprovals}</h3>
                                        <p>Pending Approvals</p>
                                    </div>
                                </div>
                                <div className="admin-stat-card">
                                    <div className="stat-icon">🎫</div>
                                    <div className="stat-info">
                                        <h3>{stats.totalRegistrations}</h3>
                                        <p>Event Registrations</p>
                                    </div>
                                </div>
                            </div>

                            <div className="admin-quick-actions">
                                <h3>Quick Actions</h3>
                                <div className="quick-actions-grid">
                                    <button onClick={() => navigate('/create-event')} className="quick-action-btn">
                                        ➕ Create Event
                                    </button>
                                    <button onClick={() => navigate('/create-project')} className="quick-action-btn">
                                        ➕ Create Project
                                    </button>
                                    <button onClick={() => setActiveTab('users')} className="quick-action-btn">
                                        👥 Manage Users
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div className="admin-tab-content">
                            <div className="admin-section-header">
                                <h2 className="admin-section-title">User Management</h2>
                                <button className="admin-btn admin-btn-primary">➕ Add User</button>
                            </div>

                            <div className="admin-table-container">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Student ID</th>
                                            <th>Joined</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length > 0 ? (
                                            users.map(user => (
                                                <tr key={user._id}>
                                                    <td>{user.fullName}</td>
                                                    <td>{user.email}</td>
                                                    <td>
                                                        <select
                                                            value={user.role}
                                                            onChange={(e) => handleUpdateUserRole(user._id, e.target.value)}
                                                            className="role-select"
                                                        >
                                                            <option value="student">Student</option>
                                                            <option value="coordinator">Coordinator</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                    </td>
                                                    <td>{user.studentId}</td>
                                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <button
                                                            onClick={() => handleDeleteUser(user._id)}
                                                            className="admin-btn-icon admin-btn-danger-icon"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="no-data">No users found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Events Tab */}
                    {activeTab === 'events' && (
                        <div className="admin-tab-content">
                            <div className="admin-section-header">
                                <h2 className="admin-section-title">Event Management</h2>
                                <button onClick={() => navigate('/create-event')} className="admin-btn admin-btn-primary">
                                    ➕ Create Event
                                </button>
                            </div>

                            <div className="admin-cards-grid">
                                {events.length > 0 ? (
                                    events.map(event => (
                                        <div key={event._id} className="admin-event-card">
                                            <div className="event-card-header">
                                                <h3>{event.title}</h3>
                                                <span className={`event-status status-${event.status}`}>
                                                    {event.status}
                                                </span>
                                            </div>
                                            <p className="event-card-meta">
                                                📅 {new Date(event.startDate).toLocaleDateString()}
                                            </p>
                                            <p className="event-card-meta">
                                                📍 {event.location?.venue || 'Online'}
                                            </p>
                                            <p className="event-card-meta">
                                                👥 {event.registrationCount || 0} registered
                                            </p>
                                            <div className="event-card-actions">
                                                <button
                                                    onClick={() => navigate(`/event/${event._id}`)}
                                                    className="admin-btn admin-btn-sm admin-btn-secondary"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteEvent(event._id)}
                                                    className="admin-btn admin-btn-sm admin-btn-danger"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-data-card">No events found</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Projects Tab */}
                    {activeTab === 'projects' && (
                        <div className="admin-tab-content">
                            <div className="admin-section-header">
                                <h2 className="admin-section-title">Project Management</h2>
                                <button onClick={() => navigate('/create-project')} className="admin-btn admin-btn-primary">
                                    ➕ Create Project
                                </button>
                            </div>

                            <div className="admin-cards-grid">
                                {projects.length > 0 ? (
                                    projects.map(project => (
                                        <div key={project._id} className="admin-project-card">
                                            <div className="project-card-header">
                                                <h3>{project.title}</h3>
                                                <span className={`project-status status-${project.status}`}>
                                                    {project.status}
                                                </span>
                                            </div>
                                            <p className="project-card-desc">{project.description?.substring(0, 100)}...</p>
                                            <div className="project-card-tags">
                                                {project.tags?.slice(0, 3).map((tag, idx) => (
                                                    <span key={idx} className="project-tag">{tag}</span>
                                                ))}
                                            </div>
                                            <p className="project-card-meta">
                                                ❤️ {project.likes || 0} likes
                                            </p>
                                            <div className="project-card-actions">
                                                <button
                                                    onClick={() => navigate(`/project/${project._id}`)}
                                                    className="admin-btn admin-btn-sm admin-btn-secondary"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProject(project._id)}
                                                    className="admin-btn admin-btn-sm admin-btn-danger"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-data-card">No projects found</div>
                                )}
                            </div>
                        </div>
                    )}



                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="admin-tab-content">
                            <h2 className="admin-section-title">Settings</h2>

                            <div className="settings-section">
                                <div className="settings-card">
                                    <h3>General Settings</h3>
                                    <div className="settings-form">
                                        <div className="form-group">
                                            <label>Club Name</label>
                                            <input type="text" defaultValue="AID-X Club" className="form-input" />
                                        </div>
                                        <div className="form-group">
                                            <label>Contact Email</label>
                                            <input type="email" defaultValue="contact@aidxclub.com" className="form-input" />
                                        </div>
                                        <div className="form-group">
                                            <label>Website Description</label>
                                            <textarea className="form-textarea" rows="4" defaultValue="Official website of AID-X Club"></textarea>
                                        </div>
                                        <button className="admin-btn admin-btn-primary">Save Changes</button>
                                    </div>
                                </div>

                                <div className="settings-card">
                                    <h3>Event Settings</h3>
                                    <div className="settings-form">
                                        <div className="form-group">
                                            <label className="checkbox-label">
                                                <input type="checkbox" defaultChecked />
                                                <span>Require approval for new events</span>
                                            </label>
                                        </div>
                                        <div className="form-group">
                                            <label className="checkbox-label">
                                                <input type="checkbox" defaultChecked />
                                                <span>Send email notifications for event registrations</span>
                                            </label>
                                        </div>
                                        <div className="form-group">
                                            <label>Maximum participants per event</label>
                                            <input type="number" defaultValue="100" className="form-input" />
                                        </div>
                                        <button className="admin-btn admin-btn-primary">Save Changes</button>
                                    </div>
                                </div>

                                <div className="settings-card">
                                    <h3>Project Settings</h3>
                                    <div className="settings-form">
                                        <div className="form-group">
                                            <label className="checkbox-label">
                                                <input type="checkbox" defaultChecked />
                                                <span>Require approval for new projects</span>
                                            </label>
                                        </div>
                                        <div className="form-group">
                                            <label className="checkbox-label">
                                                <input type="checkbox" />
                                                <span>Allow anonymous project submissions</span>
                                            </label>
                                        </div>
                                        <button className="admin-btn admin-btn-primary">Save Changes</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
