import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users,
    UserPlus,
    Search,
    Filter,
    RefreshCw,
    Edit,
    Trash2,
    CheckCircle2,
    XCircle,
    X,
    Mail,
    Key,
    IdCard,
    Shield,
    ToggleLeft,
    ToggleRight,
    TrendingUp,
    UserCheck,
    UserX,
    Crown
} from 'lucide-react';
import './UserManagement.css';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        rollNumber: '',
        role: 'student',
        isActive: true
    });
    const [stats, setStats] = useState({
        total: 0,
        students: 0,
        coordinators: 0,
        admins: 0,
        active: 0,
        inactive: 0
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, roleFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/admin/users`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setUsers(response.data.users);
                calculateStats(response.data.users);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (userList) => {
        const stats = {
            total: userList.length,
            students: userList.filter(u => u.role === 'student').length,
            coordinators: userList.filter(u => u.role === 'coordinator').length,
            admins: userList.filter(u => u.role === 'admin').length,
            active: userList.filter(u => u.isActive).length,
            inactive: userList.filter(u => !u.isActive).length
        };
        setStats(stats);
    };

    const filterUsers = () => {
        let filtered = users;

        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => user.role === roleFilter);
        }

        setFilteredUsers(filtered);
    };

    const handleEditUser = (user) => {
        setSelectedUser({ ...user });
        setShowEditModal(true);
    };

    const handleUpdateUser = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/admin/users/${selectedUser._id}`,
                selectedUser,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setUsers(users.map(u => u._id === selectedUser._id ? response.data.user : u));
                setShowEditModal(false);
                setSelectedUser(null);
                setSuccess('User updated successfully!');
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setUsers(users.filter(u => u._id !== userId));
            setSuccess('User deleted successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/status`,
                { isActive: !currentStatus },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setUsers(users.map(u => u._id === userId ? { ...u, isActive: !currentStatus } : u));
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update user status');
        }
    };

    const handleAddUser = async () => {
        try {
            if (!newUser.name || !newUser.email || !newUser.password) {
                setError('Please fill in all required fields');
                return;
            }

            const token = localStorage.getItem('authToken');
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/admin/users`,
                newUser,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setUsers([response.data.user, ...users]);
                setShowAddModal(false);
                setNewUser({
                    name: '',
                    email: '',
                    password: '',
                    rollNumber: '',
                    role: 'student',
                    isActive: true
                });
                setSuccess('User created successfully!');
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user');
        }
    };

    if (loading) {
        return (
            <div className="um-loading">
                <div className="um-spinner"></div>
                <p>Loading users...</p>
            </div>
        );
    }

    const statCards = [
        { title: 'Total Users', value: stats.total, icon: Users, color: 'blue', change: '+12%' },
        { title: 'Students', value: stats.students, icon: UserCheck, color: 'green', change: '+8%' },
        { title: 'Coordinators', value: stats.coordinators, icon: Shield, color: 'purple', change: '+5%' },
        { title: 'Admins', value: stats.admins, icon: Crown, color: 'orange', change: '+2%' }
    ];

    return (
        <div className="user-management-pro">
            {/* Header */}
            <div className="um-header">
                <div className="um-header-left">
                    <h1 className="um-title">
                        <Users size={28} />
                        User Management
                    </h1>
                    <p className="um-subtitle">Manage all users and their permissions</p>
                </div>
                <button className="um-btn-primary" onClick={() => setShowAddModal(true)}>
                    <UserPlus size={18} />
                    Add New User
                </button>
            </div>

            {/* Alerts */}
            {error && (
                <div className="um-alert um-alert-error">
                    <XCircle size={20} />
                    <span>{error}</span>
                    <button onClick={() => setError('')}>
                        <X size={16} />
                    </button>
                </div>
            )}

            {success && (
                <div className="um-alert um-alert-success">
                    <CheckCircle2 size={20} />
                    <span>{success}</span>
                    <button onClick={() => setSuccess('')}>
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Stats Grid */}
            <div className="um-stats-grid">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className={`um-stat-card um-stat-${stat.color}`}>
                            <div className="um-stat-header">
                                <div className="um-stat-icon">
                                    <Icon size={24} />
                                </div>
                                <span className="um-stat-change">
                                    <TrendingUp size={14} />
                                    {stat.change}
                                </span>
                            </div>
                            <div className="um-stat-body">
                                <h3 className="um-stat-value">{stat.value}</h3>
                                <p className="um-stat-label">{stat.title}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="um-filters">
                <div className="um-search-box">
                    <Search className="um-search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or roll number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="um-search-input"
                    />
                </div>

                <div className="um-filter-group">
                    <Filter size={18} />
                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="um-select">
                        <option value="all">All Roles</option>
                        <option value="student">Students</option>
                        <option value="coordinator">Coordinators</option>
                        <option value="admin">Admins</option>
                    </select>
                </div>

                <button className="um-btn-secondary" onClick={fetchUsers}>
                    <RefreshCw size={18} />
                    Refresh
                </button>
            </div>

            {/* Users Table */}
            <div className="um-table-container">
                <table className="um-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Roll Number</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>GitHub</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="um-no-data">
                                    <UserX size={48} />
                                    <p>No users found</p>
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="um-user-cell">
                                            <div className="um-avatar">
                                                {user.profileImage ? (
                                                    <img src={user.profileImage} alt={user.name} />
                                                ) : (
                                                    <span>{user.name?.charAt(0) || '?'}</span>
                                                )}
                                            </div>
                                            <span className="um-user-name">{user.name || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>{user.rollNumber || '-'}</td>
                                    <td>
                                        <span className={`um-badge um-badge-${user.role}`}>
                                            {user.role === 'admin' && <Crown size={12} />}
                                            {user.role === 'coordinator' && <Shield size={12} />}
                                            {user.role === 'student' && <UserCheck size={12} />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className={`um-status-btn ${user.isActive ? 'active' : 'inactive'}`}
                                            onClick={() => handleToggleStatus(user._id, user.isActive)}
                                        >
                                            {user.isActive ? (
                                                <>
                                                    <ToggleRight size={16} />
                                                    Active
                                                </>
                                            ) : (
                                                <>
                                                    <ToggleLeft size={16} />
                                                    Inactive
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td>
                                        {user.githubConnected ? (
                                            <a
                                                href={`https://github.com/${user.githubUsername}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="um-github-link"
                                            >
                                                @{user.githubUsername}
                                            </a>
                                        ) : (
                                            <span className="um-text-muted">Not connected</span>
                                        )}
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="um-actions">
                                            <button
                                                className="um-action-btn"
                                                onClick={() => handleEditUser(user)}
                                                title="Edit user"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="um-action-btn um-action-danger"
                                                onClick={() => handleDeleteUser(user._id)}
                                                title="Delete user"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {showEditModal && selectedUser && (
                <div className="um-modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="um-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="um-modal-header">
                            <h2>
                                <Edit size={20} />
                                Edit User
                            </h2>
                            <button className="um-modal-close" onClick={() => setShowEditModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="um-modal-body">
                            <div className="um-form-group">
                                <label>
                                    <Users size={16} />
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={selectedUser.name || ''}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div className="um-form-group">
                                <label>
                                    <Mail size={16} />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={selectedUser.email || ''}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                    placeholder="Enter email address"
                                />
                            </div>

                            <div className="um-form-group">
                                <label>
                                    <IdCard size={16} />
                                    Roll Number
                                </label>
                                <input
                                    type="text"
                                    value={selectedUser.rollNumber || ''}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, rollNumber: e.target.value })}
                                    placeholder="Enter roll number"
                                />
                            </div>

                            <div className="um-form-group">
                                <label>
                                    <Shield size={16} />
                                    Role
                                </label>
                                <select
                                    value={selectedUser.role}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                                >
                                    <option value="student">Student</option>
                                    <option value="coordinator">Coordinator</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="um-form-group um-checkbox-group">
                                <label className="um-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={selectedUser.isActive || false}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, isActive: e.target.checked })}
                                    />
                                    <span>Active User</span>
                                </label>
                            </div>
                        </div>

                        <div className="um-modal-footer">
                            <button className="um-btn-cancel" onClick={() => setShowEditModal(false)}>
                                Cancel
                            </button>
                            <button className="um-btn-save" onClick={handleUpdateUser}>
                                <CheckCircle2 size={18} />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Modal */}
            {showAddModal && (
                <div className="um-modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="um-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="um-modal-header">
                            <h2>
                                <UserPlus size={20} />
                                Add New User
                            </h2>
                            <button className="um-modal-close" onClick={() => setShowAddModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="um-modal-body">
                            <div className="um-form-group">
                                <label>
                                    <Users size={16} />
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div className="um-form-group">
                                <label>
                                    <Mail size={16} />
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    placeholder="Enter email address"
                                />
                            </div>

                            <div className="um-form-group">
                                <label>
                                    <Key size={16} />
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    placeholder="Enter password"
                                />
                            </div>

                            <div className="um-form-group">
                                <label>
                                    <IdCard size={16} />
                                    Roll Number
                                </label>
                                <input
                                    type="text"
                                    value={newUser.rollNumber}
                                    onChange={(e) => setNewUser({ ...newUser, rollNumber: e.target.value })}
                                    placeholder="Enter roll number (optional)"
                                />
                            </div>

                            <div className="um-form-group">
                                <label>
                                    <Shield size={16} />
                                    Role
                                </label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                >
                                    <option value="student">Student</option>
                                    <option value="coordinator">Coordinator</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="um-form-group um-checkbox-group">
                                <label className="um-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={newUser.isActive}
                                        onChange={(e) => setNewUser({ ...newUser, isActive: e.target.checked })}
                                    />
                                    <span>Active User</span>
                                </label>
                            </div>
                        </div>

                        <div className="um-modal-footer">
                            <button className="um-btn-cancel" onClick={() => setShowAddModal(false)}>
                                Cancel
                            </button>
                            <button className="um-btn-save" onClick={handleAddUser}>
                                <UserPlus size={18} />
                                Create User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
