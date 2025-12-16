import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  FileText, 
  Link, 
  Upload, 
  Search, 
  Filter, 
  Calendar, 
  Tag, 
  MessageSquare, 
  UserPlus, 
  Settings, 
  Archive, 
  Lock, 
  Unlock, 
  ChevronRight, 
  ArrowLeft, 
  Eye, 
  Copy, 
  Download,
  FolderOpen,
  CheckSquare,
  Square,
  MoreVertical,
  Activity,
  Target,
  Briefcase,
  Star,
  TrendingUp
} from 'lucide-react';
import './TeamWorkspace.css';

const TeamWorkspace = ({ onClose, user, isAdmin = false }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [workspaceData, setWorkspaceData] = useState(null);
  const [activeView, setActiveView] = useState('overview'); // overview, tasks, notes, files, team
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, todo, in-progress, done
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignee: '', priority: 'medium' });
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: [] });

  // Sample data - in real app this would come from API
  useEffect(() => {
    // Projects the user has access to (created or collaborated)
    setProjects([
      {
        id: 1,
        name: 'Personal Portfolio',
        description: 'Modern portfolio website with React',
        role: 'owner', // owner, collaborator, viewer
        teamSize: 3,
        lastActivity: '2024-01-22T15:30:00Z',
        progress: 75,
        tasksCount: { todo: 2, inProgress: 3, done: 8 },
        unreadUpdates: 2
      },
      {
        id: 2,
        name: 'Task Management App',
        description: 'Full-stack task management application',
        role: 'collaborator',
        teamSize: 4,
        lastActivity: '2024-01-22T14:15:00Z',
        progress: 60,
        tasksCount: { todo: 5, inProgress: 4, done: 12 },
        unreadUpdates: 0
      },
      {
        id: 3,
        name: 'Weather Dashboard',
        description: 'Real-time weather monitoring dashboard',
        role: 'collaborator',
        teamSize: 2,
        lastActivity: '2024-01-21T10:45:00Z',
        progress: 90,
        tasksCount: { todo: 1, inProgress: 1, done: 10 },
        unreadUpdates: 1
      }
    ]);
  }, [user]);

  // Load workspace data when project is selected
  useEffect(() => {
    if (selectedProject) {
      // Sample workspace data
      setWorkspaceData({
        project: selectedProject,
        tasks: [
          {
            id: 1,
            title: 'Design homepage layout',
            description: 'Create responsive design for the main landing page',
            status: 'done',
            priority: 'high',
            assignee: { id: 1, name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
            createdBy: { id: 2, name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' },
            createdAt: '2024-01-20T10:00:00Z',
            updatedAt: '2024-01-22T15:30:00Z',
            tags: ['design', 'frontend', 'urgent']
          },
          {
            id: 2,
            title: 'Implement user authentication',
            description: 'Add login and registration functionality',
            status: 'in-progress',
            priority: 'high',
            assignee: { id: 3, name: 'Mike Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
            createdBy: { id: 1, name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
            createdAt: '2024-01-21T09:00:00Z',
            updatedAt: '2024-01-22T14:15:00Z',
            tags: ['backend', 'security', 'feature']
          },
          {
            id: 3,
            title: 'Write API documentation',
            description: 'Document all API endpoints with examples',
            status: 'todo',
            priority: 'medium',
            assignee: null,
            createdBy: { id: 2, name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' },
            createdAt: '2024-01-22T11:00:00Z',
            updatedAt: '2024-01-22T11:00:00Z',
            tags: ['documentation', 'api']
          },
          {
            id: 4,
            title: 'Optimize database queries',
            description: 'Improve performance of slow database operations',
            status: 'in-progress',
            priority: 'medium',
            assignee: { id: 4, name: 'Sarah Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
            createdBy: { id: 3, name: 'Mike Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
            createdAt: '2024-01-22T13:00:00Z',
            updatedAt: '2024-01-22T16:00:00Z',
            tags: ['performance', 'database', 'optimization']
          }
        ],
        notes: [
          {
            id: 1,
            title: 'Meeting Notes - Client Feedback',
            content: 'Client loved the design but wants:\n1. Dark mode toggle\n2. Mobile app version\n3. Social media integration\n\nAction items: Research dark mode implementation, create mobile wireframes.',
            author: { id: 1, name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
            createdAt: '2024-01-22T10:00:00Z',
            updatedAt: '2024-01-22T10:00:00Z',
            tags: ['meeting', 'client', 'feedback'],
            pinned: true
          },
          {
            id: 2,
            title: 'Technical Architecture Decisions',
            content: 'Decided to use:\n- Frontend: React with TypeScript\n- Backend: Node.js with Express\n- Database: PostgreSQL\n- Deployment: Vercel + Railway\n\nReasoning: Good balance of performance and developer experience.',
            author: { id: 2, name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' },
            createdAt: '2024-01-20T15:00:00Z',
            updatedAt: '2024-01-22T14:00:00Z',
            tags: ['architecture', 'technical', 'decision'],
            pinned: false
          },
          {
            id: 3,
            title: 'Bug Fixes - Week 3',
            content: 'Fixed issues:\n✓ Login form validation\n✓ Image upload error\n✓ Mobile responsive bug\n\nPending:\n○ Search functionality issues\n○ Performance optimization',
            author: { id: 3, name: 'Mike Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
            createdAt: '2024-01-21T11:00:00Z',
            updatedAt: '2024-01-21T16:30:00Z',
            tags: ['bugs', 'fixes', 'weekly'],
            pinned: false
          }
        ],
        files: [
          {
            id: 1,
            name: 'Project Requirements.pdf',
            type: 'pdf',
            size: '2.5 MB',
            uploadedBy: { id: 1, name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
            uploadedAt: '2024-01-20T09:00:00Z',
            url: '#'
          },
          {
            id: 2,
            name: 'Design Mockups.fig',
            type: 'figma',
            size: '15.2 MB',
            uploadedBy: { id: 2, name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' },
            uploadedAt: '2024-01-21T14:00:00Z',
            url: '#'
          },
          {
            id: 3,
            name: 'Database Schema.sql',
            type: 'sql',
            size: '45 KB',
            uploadedBy: { id: 3, name: 'Mike Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
            uploadedAt: '2024-01-22T11:30:00Z',
            url: '#'
          }
        ],
        team: [
          {
            id: 1,
            name: 'John Doe',
            role: 'Project Lead',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
            email: 'john@example.com',
            joinedAt: '2024-01-15T00:00:00Z',
            lastActive: '2024-01-22T15:30:00Z',
            status: 'online'
          },
          {
            id: 2,
            name: 'Jane Smith',
            role: 'Frontend Developer',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
            email: 'jane@example.com',
            joinedAt: '2024-01-16T00:00:00Z',
            lastActive: '2024-01-22T14:15:00Z',
            status: 'online'
          },
          {
            id: 3,
            name: 'Mike Johnson',
            role: 'Backend Developer',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
            email: 'mike@example.com',
            joinedAt: '2024-01-17T00:00:00Z',
            lastActive: '2024-01-22T16:00:00Z',
            status: 'online'
          },
          {
            id: 4,
            name: 'Sarah Wilson',
            role: 'UI/UX Designer',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            email: 'sarah@example.com',
            joinedAt: '2024-01-18T00:00:00Z',
            lastActive: '2024-01-22T13:45:00Z',
            status: 'away'
          }
        ],
        links: [
          {
            id: 1,
            title: 'Figma Design System',
            url: 'https://figma.com/file/example',
            description: 'Complete design system with components',
            addedBy: { id: 2, name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' },
            addedAt: '2024-01-20T10:00:00Z',
            tags: ['design', 'figma', 'components']
          },
          {
            id: 2,
            title: 'API Documentation',
            url: 'https://api.example.com/docs',
            description: 'Interactive API documentation',
            addedBy: { id: 3, name: 'Mike Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
            addedAt: '2024-01-21T15:00:00Z',
            tags: ['api', 'documentation', 'backend']
          }
        ]
      });
    }
  }, [selectedProject]);

  const filteredTasks = workspaceData?.tasks?.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleCreateTask = () => {
    if (!newTask.title.trim()) return;
    
    const task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      status: 'todo',
      priority: newTask.priority,
      assignee: newTask.assignee ? workspaceData.team.find(m => m.id === parseInt(newTask.assignee)) : null,
      createdBy: { id: user?.id, name: user?.name, avatar: user?.profilePicture },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: []
    };
    
    setWorkspaceData(prev => ({
      ...prev,
      tasks: [task, ...prev.tasks]
    }));
    
    setNewTask({ title: '', description: '', assignee: '', priority: 'medium' });
    setShowTaskModal(false);
  };

  const handleUpdateTaskStatus = (taskId, newStatus) => {
    setWorkspaceData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId
          ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
          : task
      )
    }));
  };

  const handleCreateNote = () => {
    if (!newNote.title.trim()) return;
    
    const note = {
      id: Date.now(),
      title: newNote.title,
      content: newNote.content,
      author: { id: user?.id, name: user?.name, avatar: user?.profilePicture },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: newNote.tags,
      pinned: false
    };
    
    setWorkspaceData(prev => ({
      ...prev,
      notes: [note, ...prev.notes]
    }));
    
    setNewNote({ title: '', content: '', tags: [] });
    setShowNoteModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return 'status-done';
      case 'in-progress': return 'status-progress';
      case 'todo': return 'status-todo';
      default: return 'status-default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'todo': return <Square className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-default';
    }
  };

  const renderProjectsList = () => (
    <div className="team-workspace-container">
      <div className="workspace-header">
        <div className="header-left">
          <h1>Team Workspaces</h1>
          <p>Collaborate and manage your project teams</p>
        </div>
        
        <div className="header-actions">
          <button className="btn btn-secondary">
            <Users className="w-4 h-4" />
            Join Workspace
          </button>
        </div>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card" onClick={() => setSelectedProject(project)}>
            <div className="project-header">
              <div className="project-icon">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="project-meta">
                <span className={`role ${project.role}`}>
                  {project.role === 'owner' && <Star className="w-3 h-3" />}
                  {project.role.charAt(0).toUpperCase() + project.role.slice(1)}
                </span>
                {project.unreadUpdates > 0 && (
                  <span className="unread-badge">{project.unreadUpdates}</span>
                )}
              </div>
              <div className="project-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <span className="progress-text">{project.progress}%</span>
              </div>
            </div>
            
            <div className="project-content">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              
              <div className="project-stats">
                <div className="stat-item">
                  <Users className="w-4 h-4" />
                  <span>{project.teamSize}</span>
                  <label>Team</label>
                </div>
                <div className="stat-item">
                  <CheckSquare className="w-4 h-4" />
                  <span>{project.tasksCount.done}</span>
                  <label>Done</label>
                </div>
                <div className="stat-item">
                  <Clock className="w-4 h-4" />
                  <span>{project.tasksCount.inProgress}</span>
                  <label>In Progress</label>
                </div>
                <div className="stat-item">
                  <Square className="w-4 h-4" />
                  <span>{project.tasksCount.todo}</span>
                  <label>To Do</label>
                </div>
              </div>
              
              <div className="project-footer">
                <span className="last-activity">
                  <Activity className="w-3 h-3" />
                  Last active {new Date(project.lastActivity).toLocaleDateString()}
                </span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
        
        {projects.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <Users className="w-12 h-12" />
            </div>
            <h3>No workspaces yet</h3>
            <p>Join a project team to access its workspace</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderWorkspace = () => {
    if (!workspaceData) return null;

    const renderOverview = () => (
      <div className="workspace-overview">
        <div className="overview-header">
          <h2>Project Overview</h2>
          <div className="overview-stats">
            <div className="stat-card">
              <CheckSquare className="w-5 h-5" />
              <span>{workspaceData.tasks.filter(t => t.status === 'done').length}</span>
              <label>Completed</label>
            </div>
            <div className="stat-card">
              <Clock className="w-5 h-5" />
              <span>{workspaceData.tasks.filter(t => t.status === 'in-progress').length}</span>
              <label>In Progress</label>
            </div>
            <div className="stat-card">
              <Square className="w-5 h-5" />
              <span>{workspaceData.tasks.filter(t => t.status === 'todo').length}</span>
              <label>To Do</label>
            </div>
            <div className="stat-card">
              <TrendingUp className="w-5 h-5" />
              <span>{Math.round((workspaceData.tasks.filter(t => t.status === 'done').length / workspaceData.tasks.length) * 100)}%</span>
              <label>Progress</label>
            </div>
          </div>
        </div>

        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {workspaceData.tasks.slice(0, 5).map(task => (
              <div key={task.id} className="activity-item">
                <div className="activity-icon">
                  {getStatusIcon(task.status)}
                </div>
                <div className="activity-content">
                  <p>
                    <strong>{task.assignee?.name || 'Unassigned'}</strong>
                    {task.status === 'done' && ' completed '}
                    {task.status === 'in-progress' && ' started '}
                    {task.status === 'todo' && ' created '}
                    <strong>{task.title}</strong>
                  </p>
                  <span>{new Date(task.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    const renderTasks = () => (
      <div className="workspace-tasks">
        <div className="tasks-header">
          <h2>Tasks</h2>
          <div className="tasks-controls">
            <div className="search-filter">
              <Search className="w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-dropdown">
              <Filter className="w-4 h-4" />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            
            <button onClick={() => setShowTaskModal(true)} className="btn btn-primary">
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </div>

        <div className="tasks-list">
          {filteredTasks.map(task => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <div className="task-status">
                  <button 
                    onClick={() => handleUpdateTaskStatus(task.id, 
                      task.status === 'todo' ? 'in-progress' : 
                      task.status === 'in-progress' ? 'done' : 'todo'
                    )}
                    className={`status-btn ${getStatusColor(task.status)}`}
                  >
                    {getStatusIcon(task.status)}
                  </button>
                </div>
                
                <div className="task-priority">
                  <span className={`priority ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                
                <div className="task-actions">
                  <button className="action-btn">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="task-content">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                
                <div className="task-meta">
                  {task.assignee && (
                    <div className="assignee">
                      <img src={task.assignee.avatar} alt={task.assignee.name} />
                      <span>{task.assignee.name}</span>
                    </div>
                  )}
                  
                  <div className="task-dates">
                    <span className="date">
                      <Calendar className="w-3 h-3" />
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {task.tags.length > 0 && (
                  <div className="task-tags">
                    {task.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    const renderNotes = () => (
      <div className="workspace-notes">
        <div className="notes-header">
          <h2>Notes & Updates</h2>
          <button onClick={() => setShowNoteModal(true)} className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Add Note
          </button>
        </div>

        <div className="notes-list">
          {workspaceData.notes.map(note => (
            <div key={note.id} className={`note-card ${note.pinned ? 'pinned' : ''}`}>
              <div className="note-header">
                <div className="note-author">
                  <img src={note.author.avatar} alt={note.author.name} />
                  <div>
                    <strong>{note.author.name}</strong>
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="note-actions">
                  {note.pinned && <Target className="w-4 h-4" />}
                  <button className="action-btn">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="note-content">
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                
                {note.tags.length > 0 && (
                  <div className="note-tags">
                    {note.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    const renderFiles = () => (
      <div className="workspace-files">
        <div className="files-header">
          <h2>Shared Files</h2>
          <button onClick={() => setShowFileModal(true)} className="btn btn-primary">
            <Upload className="w-4 h-4" />
            Upload File
          </button>
        </div>

        <div className="files-list">
          {workspaceData.files.map(file => (
            <div key={file.id} className="file-card">
              <div className="file-icon">
                <FileText className="w-8 h-8" />
              </div>
              
              <div className="file-info">
                <h3>{file.name}</h3>
                <div className="file-meta">
                  <span>{file.size}</span>
                  <span>•</span>
                  <span>Uploaded by {file.uploadedBy.name}</span>
                  <span>•</span>
                  <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="file-actions">
                <a href={file.url} download className="btn btn-outline">
                  <Download className="w-4 h-4" />
                </a>
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    const renderTeam = () => (
      <div className="workspace-team">
        <div className="team-header">
          <h2>Team Members</h2>
          <button className="btn btn-secondary">
            <UserPlus className="w-4 h-4" />
            Invite Member
          </button>
        </div>

        <div className="team-grid">
          {workspaceData.team.map(member => (
            <div key={member.id} className="member-card">
              <div className="member-avatar">
                <img src={member.avatar} alt={member.name} />
                <span className={`status-indicator ${member.status}`} />
              </div>
              
              <div className="member-info">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
                <span className="member-email">{member.email}</span>
              </div>
              
              <div className="member-meta">
                <span className="join-date">
                  <Calendar className="w-3 h-3" />
                  Joined {new Date(member.joinedAt).toLocaleDateString()}
                </span>
                <span className="last-active">
                  <Activity className="w-3 h-3" />
                  Last active {new Date(member.lastActive).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div className="workspace-container">
        <div className="workspace-header">
          <div className="header-left">
            <button onClick={() => setSelectedProject(null)} className="back-btn">
              <ArrowLeft className="w-5 h-5" />
              Back to Workspaces
            </button>
            
            <div className="project-title">
              <h2>{workspaceData.project.name}</h2>
              <div className="project-badges">
                <span className="team-size">
                  <Users className="w-4 h-4" />
                  {workspaceData.team.length} members
                </span>
                <span className="role">
                  {workspaceData.project.role}
                </span>
              </div>
            </div>
          </div>
          
          <div className="header-actions">
            {isAdmin && (
              <button className="btn btn-outline">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            )}
          </div>
        </div>

        <div className="workspace-nav">
          <button 
            className={`nav-btn ${activeView === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveView('overview')}
          >
            <Target className="w-4 h-4" />
            Overview
          </button>
          <button 
            className={`nav-btn ${activeView === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveView('tasks')}
          >
            <CheckSquare className="w-4 h-4" />
            Tasks
          </button>
          <button 
            className={`nav-btn ${activeView === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveView('notes')}
          >
            <FileText className="w-4 h-4" />
            Notes
          </button>
          <button 
            className={`nav-btn ${activeView === 'files' ? 'active' : ''}`}
            onClick={() => setActiveView('files')}
          >
            <FolderOpen className="w-4 h-4" />
            Files
          </button>
          <button 
            className={`nav-btn ${activeView === 'team' ? 'active' : ''}`}
            onClick={() => setActiveView('team')}
          >
            <Users className="w-4 h-4" />
            Team
          </button>
        </div>

        <div className="workspace-content">
          {activeView === 'overview' && renderOverview()}
          {activeView === 'tasks' && renderTasks()}
          {activeView === 'notes' && renderNotes()}
          {activeView === 'files' && renderFiles()}
          {activeView === 'team' && renderTeam()}
        </div>
      </div>
    );
  };

  const renderTaskModal = () => (
    <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Task</h2>
          <button onClick={() => setShowTaskModal(false)} className="modal-close">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="task-form">
            <div className="form-group">
              <label>Task Title</label>
              <input
                type="text"
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Describe the task..."
                rows={3}
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Assignee</label>
                <select
                  value={newTask.assignee}
                  onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
                >
                  <option value="">Unassigned</option>
                  {workspaceData?.team.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            
            <div className="form-actions">
              <button onClick={() => setShowTaskModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleCreateTask} className="btn btn-primary">
                <Plus className="w-4 h-4" />
                Create Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNoteModal = () => (
    <div className="modal-overlay" onClick={() => setShowNoteModal(false)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Note</h2>
          <button onClick={() => setShowNoteModal(false)} className="modal-close">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="note-form">
            <div className="form-group">
              <label>Note Title</label>
              <input
                type="text"
                placeholder="Enter note title"
                value={newNote.title}
                onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div className="form-group">
              <label>Content</label>
              <textarea
                placeholder="Write your note..."
                rows={5}
                value={newNote.content}
                onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>
            
            <div className="form-actions">
              <button onClick={() => setShowNoteModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleCreateNote} className="btn btn-primary">
                <Plus className="w-4 h-4" />
                Add Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {selectedProject ? renderWorkspace() : renderProjectsList()}
      {showTaskModal && renderTaskModal()}
      {showNoteModal && renderNoteModal()}
    </>
  );
};

export default TeamWorkspace;
