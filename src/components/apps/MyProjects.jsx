import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Github, 
  ExternalLink, 
  Users, 
  Search, 
  Filter, 
  Calendar, 
  Star, 
  GitBranch, 
  Rocket, 
  FolderOpen, 
  UserPlus, 
  Settings, 
  Trash2, 
  Edit, 
  Eye,
  Copy,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Code,
  Globe,
  Shield
} from 'lucide-react';
import './MyProjects.css';

const MyProjects = ({ onClose, user, isAdmin = false }) => {
  const [projects, setProjects] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, created, collaborated, templates
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
  const [selectedProjectForCollab, setSelectedProjectForCollab] = useState(null);
  const [collaboratorRollNumber, setCollaboratorRollNumber] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  // Sample data - in real app this would come from API
  useEffect(() => {
    // Sample projects
    setProjects([
      {
        id: 1,
        name: 'Personal Portfolio',
        description: 'A modern portfolio website built with React and Tailwind CSS',
        type: 'created',
        status: 'active',
        createdAt: '2024-01-15',
        lastUpdated: '2024-01-20',
        githubUrl: 'https://github.com/username/portfolio',
        deploymentUrl: 'https://portfolio.vercel.app',
        collaborators: [
          { id: 1, name: 'John Doe', rollNumber: '2021001', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
          { id: 2, name: 'Jane Smith', rollNumber: '2021002', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' }
        ],
        technologies: ['React', 'Tailwind CSS', 'Vercel'],
        stars: 12,
        forks: 3,
        commits: 45,
        template: false
      },
      {
        id: 2,
        name: 'Task Management App',
        description: 'Full-stack task management application with real-time updates',
        type: 'collaborated',
        status: 'active',
        createdAt: '2024-01-10',
        lastUpdated: '2024-01-18',
        githubUrl: 'https://github.com/team/taskmanager',
        deploymentUrl: 'https://taskmanager.app',
        collaborators: [
          { id: 1, name: 'Mike Johnson', rollNumber: '2021003', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
          { id: 2, name: 'Sarah Wilson', rollNumber: '2021004', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
          { id: 3, name: 'You', rollNumber: user?.rollNumber || '2021005', avatar: user?.profilePicture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=You' }
        ],
        technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
        stars: 8,
        forks: 2,
        commits: 67,
        template: false
      },
      {
        id: 3,
        name: 'E-Commerce Platform',
        description: 'Online shopping platform with payment integration',
        type: 'created',
        status: 'development',
        createdAt: '2024-01-05',
        lastUpdated: '2024-01-22',
        githubUrl: 'https://github.com/username/ecommerce',
        deploymentUrl: null,
        collaborators: [],
        technologies: ['React', 'Stripe', 'Express', 'PostgreSQL'],
        stars: 5,
        forks: 1,
        commits: 23,
        template: false
      },
      {
        id: 4,
        name: 'Weather Dashboard',
        description: 'Real-time weather monitoring dashboard with alerts',
        type: 'template',
        status: 'template',
        createdAt: '2024-01-01',
        lastUpdated: '2024-01-01',
        githubUrl: null,
        deploymentUrl: null,
        collaborators: [],
        technologies: ['React', 'Weather API', 'Chart.js'],
        stars: 0,
        forks: 0,
        commits: 0,
        template: true,
        templateAuthor: 'AID-X Club',
        templateDescription: 'Perfect for learning API integration and data visualization'
      }
    ]);

    // Sample templates
    setTemplates([
      {
        id: 1,
        name: 'Weather Dashboard',
        description: 'Real-time weather monitoring dashboard with alerts',
        technologies: ['React', 'Weather API', 'Chart.js'],
        difficulty: 'beginner',
        estimatedTime: '2-3 hours',
        author: 'AID-X Club',
        uses: 45,
        rating: 4.8
      },
      {
        id: 2,
        name: 'Blog Platform',
        description: 'Full-featured blogging platform with markdown support',
        technologies: ['React', 'Node.js', 'MongoDB', 'Markdown'],
        difficulty: 'intermediate',
        estimatedTime: '4-5 hours',
        author: 'AID-X Club',
        uses: 32,
        rating: 4.6
      },
      {
        id: 3,
        name: 'Chat Application',
        description: 'Real-time chat app with rooms and direct messaging',
        technologies: ['React', 'Socket.io', 'Node.js', 'Redis'],
        difficulty: 'advanced',
        estimatedTime: '6-8 hours',
        author: 'AID-X Club',
        uses: 28,
        rating: 4.9
      }
    ]);
  }, [user]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'created') return matchesSearch && project.type === 'created';
    if (filterType === 'collaborated') return matchesSearch && project.type === 'collaborated';
    if (filterType === 'templates') return matchesSearch && project.template;
    
    return matchesSearch;
  });

  const handleCreateProject = (template = null) => {
    console.log('Creating project with template:', template);
    setShowCreateModal(false);
    setShowTemplates(false);
    // In real app, this would create the project and add it to the list
  };

  const handleAddCollaborator = () => {
    if (!collaboratorRollNumber.trim()) return;
    
    console.log('Adding collaborator:', collaboratorRollNumber, 'to project:', selectedProjectForCollab?.id);
    
    // In real app, this would:
    // 1. Send request to backend to find student by roll number
    // 2. Add them as collaborator to the project
    // 3. Send notification to the student
    
    setCollaboratorRollNumber('');
    setShowCollaboratorModal(false);
    setSelectedProjectForCollab(null);
  };

  const handleOpenCollaboratorModal = (project) => {
    setSelectedProjectForCollab(project);
    setShowCollaboratorModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'development': return 'status-development';
      case 'template': return 'status-template';
      default: return 'status-default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'development': return <Clock className="w-4 h-4" />;
      case 'template': return <Code className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const renderProjectsList = () => (
    <div className="my-projects-container">
      <div className="projects-header">
        <div className="header-left">
          <h1>My Projects</h1>
          <p>Manage all your projects in one place</p>
        </div>
        
        <div className="header-actions">
          <button onClick={() => setShowTemplates(true)} className="btn btn-secondary">
            <FolderOpen className="w-4 h-4" />
            Use Template
          </button>
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </div>

      <div className="content-controls">
        <div className="search-filter">
          <div className="search-bar">
            <Search className="w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-dropdown">
            <Filter className="w-4 h-4" />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Projects</option>
              <option value="created">Created by Me</option>
              <option value="collaborated">Collaborations</option>
              {isAdmin && <option value="templates">Templates</option>}
            </select>
          </div>
        </div>
      </div>

      <div className="projects-grid">
        {filteredProjects.map(project => (
          <div key={project.id} className="project-card">
            <div className="project-header">
              <div className="project-icon">
                {project.template ? <FolderOpen className="w-6 h-6" /> : <Github className="w-6 h-6" />}
              </div>
              <div className="project-meta">
                <span className={`status ${getStatusColor(project.status)}`}>
                  {getStatusIcon(project.status)}
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
                <span className="project-type">
                  {project.type === 'created' && 'Created'}
                  {project.type === 'collaborated' && 'Collaborating'}
                  {project.type === 'template' && 'Template'}
                </span>
              </div>
              {!project.template && (
                <div className="project-stats">
                  <span className="stat"><Star className="w-3 h-3" /> {project.stars}</span>
                  <span className="stat"><GitBranch className="w-3 h-3" /> {project.forks}</span>
                </div>
              )}
            </div>
            
            <div className="project-content">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              
              <div className="project-technologies">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="tech-tag">{tech}</span>
                ))}
              </div>
              
              {project.template && (
                <div className="template-info">
                  <p><strong>Author:</strong> {project.templateAuthor}</p>
                  <p>{project.templateDescription}</p>
                  <div className="template-stats">
                    <span><Users className="w-3 h-3" /> {project.uses} uses</span>
                    <span><Star className="w-3 h-3" /> {project.rating}</span>
                  </div>
                </div>
              )}
              
              {!project.template && (
                <div className="project-dates">
                  <span className="date"><Calendar className="w-3 h-3" /> Created {new Date(project.createdAt).toLocaleDateString()}</span>
                  <span className="date"><Clock className="w-3 h-3" /> Updated {new Date(project.lastUpdated).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className="project-collaborators">
              {project.collaborators.length > 0 && (
                <div className="collaborators-list">
                  <Users className="w-4 h-4" />
                  <div className="collaborator-avatars">
                    {project.collaborators.slice(0, 3).map(collab => (
                      <img 
                        key={collab.id} 
                        src={collab.avatar} 
                        alt={collab.name}
                        title={collab.name}
                        className="collaborator-avatar"
                      />
                    ))}
                    {project.collaborators.length > 3 && (
                      <span className="more-collaborators">+{project.collaborators.length - 3}</span>
                    )}
                  </div>
                  <span className="collaborator-count">{project.collaborators.length} collaborators</span>
                </div>
              )}
            </div>

            <div className="project-actions">
              {project.template ? (
                <button 
                  onClick={() => handleCreateProject(project)}
                  className="btn btn-primary"
                >
                  <Copy className="w-4 h-4" />
                  Use Template
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => setSelectedProject(project)}
                    className="btn btn-secondary"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  
                  <div className="action-links">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="action-link">
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.deploymentUrl && (
                      <a href={project.deploymentUrl} target="_blank" rel="noopener noreferrer" className="action-link">
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  
                  {project.type === 'created' && (
                    <button 
                      onClick={() => handleOpenCollaboratorModal(project)}
                      className="btn btn-outline"
                    >
                      <UserPlus className="w-4 h-4" />
                      Add Collaborator
                    </button>
                  )}
                  
                  {isEditMode && (
                    <div className="edit-actions">
                      <button className="edit-btn"><Edit className="w-3 h-3" /></button>
                      <button className="delete-btn"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
        
        {filteredProjects.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <FolderOpen className="w-12 h-12" />
            </div>
            <h3>No projects found</h3>
            <p>Start by creating your first project or using a template</p>
            <div className="empty-actions">
              <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
                <Plus className="w-4 h-4" />
                Create Project
              </button>
              <button onClick={() => setShowTemplates(true)} className="btn btn-secondary">
                <FolderOpen className="w-4 h-4" />
                Browse Templates
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderProjectDetails = () => {
    if (!selectedProject) return null;

    return (
      <div className="project-details">
        <div className="details-header">
          <button onClick={() => setSelectedProject(null)} className="back-btn">
            <ArrowLeft className="w-5 h-5" />
            Back to Projects
          </button>
          
          <div className="project-title">
            <h2>{selectedProject.name}</h2>
            <div className="project-badges">
              <span className={`status ${getStatusColor(selectedProject.status)}`}>
                {getStatusIcon(selectedProject.status)}
                {selectedProject.status}
              </span>
              <span className="project-type">
                {selectedProject.type === 'created' && 'Created by Me'}
                {selectedProject.type === 'collaborated' && 'Collaboration'}
              </span>
            </div>
          </div>
        </div>

        <div className="details-content">
          <div className="project-overview">
            <h3>Overview</h3>
            <p>{selectedProject.description}</p>
            
            <div className="project-links">
              {selectedProject.githubUrl && (
                <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="link-btn">
                  <Github className="w-4 h-4" />
                  View Repository
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {selectedProject.deploymentUrl && (
                <a href={selectedProject.deploymentUrl} target="_blank" rel="noopener noreferrer" className="link-btn">
                  <Globe className="w-4 h-4" />
                  Visit Website
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <div className="project-technologies-section">
            <h3>Technologies Used</h3>
            <div className="tech-tags">
              {selectedProject.technologies.map((tech, index) => (
                <span key={index} className="tech-tag">{tech}</span>
              ))}
            </div>
          </div>

          <div className="project-stats-section">
            <h3>Project Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <Star className="w-5 h-5" />
                <span>{selectedProject.stars}</span>
                <label>Stars</label>
              </div>
              <div className="stat-item">
                <GitBranch className="w-5 h-5" />
                <span>{selectedProject.forks}</span>
                <label>Forks</label>
              </div>
              <div className="stat-item">
                <Code className="w-5 h-5" />
                <span>{selectedProject.commits}</span>
                <label>Commits</label>
              </div>
              <div className="stat-item">
                <Users className="w-5 h-5" />
                <span>{selectedProject.collaborators.length}</span>
                <label>Collaborators</label>
              </div>
            </div>
          </div>

          <div className="project-timeline">
            <h3>Timeline</h3>
            <div className="timeline-item">
              <Calendar className="w-4 h-4" />
              <div>
                <strong>Created</strong>
                <p>{new Date(selectedProject.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="timeline-item">
              <Clock className="w-4 h-4" />
              <div>
                <strong>Last Updated</strong>
                <p>{new Date(selectedProject.lastUpdated).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {selectedProject.collaborators.length > 0 && (
            <div className="collaborators-section">
              <h3>Collaborators</h3>
              <div className="collaborators-grid">
                {selectedProject.collaborators.map(collab => (
                  <div key={collab.id} className="collaborator-card">
                    <img src={collab.avatar} alt={collab.name} className="collaborator-avatar" />
                    <div className="collaborator-info">
                      <h4>{collab.name}</h4>
                      <p>{collab.rollNumber}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTemplatesModal = () => (
    <div className="modal-overlay" onClick={() => setShowTemplates(false)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Project Templates</h2>
          <button onClick={() => setShowTemplates(false)} className="modal-close">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="templates-grid">
            {templates.map(template => (
              <div key={template.id} className="template-card">
                <div className="template-header">
                  <div className="template-icon">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <div className="template-meta">
                    <span className={`difficulty ${template.difficulty}`}>{template.difficulty}</span>
                    <span className="time"><Clock className="w-3 h-3" /> {template.estimatedTime}</span>
                  </div>
                </div>
                
                <div className="template-content">
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                  
                  <div className="template-technologies">
                    {template.technologies.map((tech, index) => (
                      <span key={index} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  
                  <div className="template-stats">
                    <span><Users className="w-3 h-3" /> {template.uses} uses</span>
                    <span><Star className="w-3 h-3" /> {template.rating}</span>
                  </div>
                </div>

                <div className="template-actions">
                  <button onClick={() => handleCreateProject(template)} className="btn btn-primary">
                    <Copy className="w-4 h-4" />
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCreateModal = () => (
    <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Project</h2>
          <button onClick={() => setShowCreateModal(false)} className="modal-close">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="modal-content">
          <form className="create-project-form">
            <div className="form-group">
              <label>Project Name</label>
              <input type="text" placeholder="Enter project name" />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea placeholder="Describe your project" rows={3}></textarea>
            </div>
            
            <div className="form-group">
              <label>Technologies</label>
              <input type="text" placeholder="React, Node.js, MongoDB (comma separated)" />
            </div>
            
            <div className="form-actions">
              <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="button" onClick={() => handleCreateProject()} className="btn btn-primary">
                <Plus className="w-4 h-4" />
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderCollaboratorModal = () => (
    <div className="modal-overlay" onClick={() => setShowCollaboratorModal(false)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Collaborator</h2>
          <button onClick={() => setShowCollaboratorModal(false)} className="modal-close">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="collaborator-form">
            <p>Add a collaborator to <strong>{selectedProjectForCollab?.name}</strong></p>
            
            <div className="form-group">
              <label>Roll Number</label>
              <input
                type="text"
                placeholder="Enter student roll number"
                value={collaboratorRollNumber}
                onChange={(e) => setCollaboratorRollNumber(e.target.value)}
              />
              <small>The system will automatically identify the student and grant access</small>
            </div>
            
            <div className="form-actions">
              <button onClick={() => setShowCollaboratorModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleAddCollaborator} className="btn btn-primary">
                <UserPlus className="w-4 h-4" />
                Add Collaborator
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {selectedProject ? renderProjectDetails() : renderProjectsList()}
      
      {showTemplates && renderTemplatesModal()}
      {showCreateModal && renderCreateModal()}
      {showCollaboratorModal && renderCollaboratorModal()}
    </>
  );
};

export default MyProjects;
