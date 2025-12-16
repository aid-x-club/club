import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Globe, 
  Server, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Settings, 
  Trash2, 
  Eye, 
  Copy, 
  Github, 
  Terminal, 
  Activity, 
  Zap, 
  Shield, 
  ChevronRight, 
  ArrowLeft, 
  Plus,
  Filter,
  Search,
  Code,
  Database,
  Cloud
} from 'lucide-react';
import './DeploymentHub.css';

const DeploymentHub = ({ onClose, user, isAdmin = false }) => {
  const [deployments, setDeployments] = useState([]);
  const [selectedDeployment, setSelectedDeployment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, success, failed, in-progress
  const [filterPlatform, setFilterPlatform] = useState('all'); // all, vercel, netlify, railway, render
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deploymentLogs, setDeploymentLogs] = useState({});
  const [isRedeploying, setIsRedeploying] = useState(new Set());

  // Sample data - in real app this would come from API
  useEffect(() => {
    setDeployments([
      {
        id: 1,
        projectId: 1,
        projectName: 'Personal Portfolio',
        projectType: 'frontend',
        platform: 'vercel',
        status: 'success',
        url: 'https://portfolio-john.vercel.app',
        deployedAt: '2024-01-20T10:30:00Z',
        lastUpdated: '2024-01-22T15:45:00Z',
        githubRepo: 'https://github.com/johndoe/portfolio',
        buildTime: '2m 15s',
        environment: 'production',
        branch: 'main',
        commits: 45,
        size: '12.5 MB',
        logs: [
          { timestamp: '2024-01-22T15:45:00Z', level: 'info', message: 'Deployment started' },
          { timestamp: '2024-01-22T15:45:30Z', level: 'info', message: 'Building application...' },
          { timestamp: '2024-01-22T15:47:15Z', level: 'success', message: 'Build completed successfully' },
          { timestamp: '2024-01-22T15:47:30Z', level: 'success', message: 'Deployment completed' }
        ]
      },
      {
        id: 2,
        projectId: 2,
        projectName: 'Task Management App',
        projectType: 'backend',
        platform: 'railway',
        status: 'success',
        url: 'https://taskmanager-api.railway.app',
        deployedAt: '2024-01-18T14:20:00Z',
        lastUpdated: '2024-01-21T09:15:00Z',
        githubRepo: 'https://github.com/team/taskmanager',
        buildTime: '3m 45s',
        environment: 'production',
        branch: 'main',
        commits: 67,
        size: '45.2 MB',
        logs: [
          { timestamp: '2024-01-21T09:15:00Z', level: 'info', message: 'Deployment triggered' },
          { timestamp: '2024-01-21T09:15:20Z', level: 'info', message: 'Installing dependencies...' },
          { timestamp: '2024-01-21T09:18:45Z', level: 'success', message: 'Application deployed successfully' }
        ]
      },
      {
        id: 3,
        projectId: 3,
        projectName: 'E-Commerce Platform',
        projectType: 'fullstack',
        platform: 'netlify',
        status: 'in-progress',
        url: null,
        deployedAt: '2024-01-22T16:00:00Z',
        lastUpdated: '2024-01-22T16:00:00Z',
        githubRepo: 'https://github.com/johndoe/ecommerce',
        buildTime: 'Building...',
        environment: 'production',
        branch: 'main',
        commits: 23,
        size: 'Calculating...',
        logs: [
          { timestamp: '2024-01-22T16:00:00Z', level: 'info', message: 'Deployment initiated' },
          { timestamp: '2024-01-22T16:00:15Z', level: 'info', message: 'Cloning repository...' },
          { timestamp: '2024-01-22T16:01:30Z', level: 'info', message: 'Installing dependencies...' }
        ]
      },
      {
        id: 4,
        projectId: 4,
        projectName: 'Weather Dashboard',
        projectType: 'frontend',
        platform: 'vercel',
        status: 'failed',
        url: null,
        deployedAt: '2024-01-19T11:00:00Z',
        lastUpdated: '2024-01-19T11:05:00Z',
        githubRepo: 'https://github.com/johndoe/weather',
        buildTime: 'Failed',
        environment: 'production',
        branch: 'main',
        commits: 15,
        size: 'N/A',
        logs: [
          { timestamp: '2024-01-19T11:00:00Z', level: 'info', message: 'Deployment started' },
          { timestamp: '2024-01-19T11:01:00Z', level: 'error', message: 'Build failed: Module not found' },
          { timestamp: '2024-01-19T11:05:00Z', level: 'error', message: 'Deployment failed' }
        ]
      }
    ]);
  }, []);

  const filteredDeployments = deployments.filter(deployment => {
    const matchesSearch = deployment.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deployment.platform.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || deployment.status === filterStatus;
    const matchesPlatform = filterPlatform === 'all' || deployment.platform === filterPlatform;
    
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const handleDeploy = (project) => {
    setSelectedProject(project);
    setShowDeployModal(true);
  };

  const handleRedeploy = async (deploymentId) => {
    setIsRedeploying(prev => new Set(prev).add(deploymentId));
    
    // Simulate redeployment
    setTimeout(() => {
      setDeployments(prev => prev.map(dep => 
        dep.id === deploymentId 
          ? { 
              ...dep, 
              status: 'in-progress', 
              lastUpdated: new Date().toISOString(),
              logs: [
                { timestamp: new Date().toISOString(), level: 'info', message: 'Redeployment started' },
                ...dep.logs
              ]
            }
          : dep
      ));
      
      // Simulate deployment completion
      setTimeout(() => {
        setDeployments(prev => prev.map(dep => 
          dep.id === deploymentId 
            ? { 
                ...dep, 
                status: 'success', 
                lastUpdated: new Date().toISOString(),
                logs: [
                  { timestamp: new Date().toISOString(), level: 'success', message: 'Redeployment completed successfully' },
                  ...dep.logs
                ]
              }
            : dep
        ));
        setIsRedeploying(prev => {
          const newSet = new Set(prev);
          newSet.delete(deploymentId);
          return newSet;
        });
      }, 3000);
    }, 1000);
  };

  const handleViewLogs = (deploymentId) => {
    const deployment = deployments.find(d => d.id === deploymentId);
    if (deployment) {
      setDeploymentLogs(prev => ({
        ...prev,
        [deploymentId]: deployment.logs
      }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'status-success';
      case 'failed': return 'status-failed';
      case 'in-progress': return 'status-progress';
      default: return 'status-default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'vercel': return <Zap className="w-4 h-4" />;
      case 'netlify': return <Globe className="w-4 h-4" />;
      case 'railway': return <Server className="w-4 h-4" />;
      case 'render': return <Cloud className="w-4 h-4" />;
      default: return <Server className="w-4 h-4" />;
    }
  };

  const getProjectTypeIcon = (type) => {
    switch (type) {
      case 'frontend': return <Code className="w-4 h-4" />;
      case 'backend': return <Database className="w-4 h-4" />;
      case 'fullstack': return <Globe className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  const renderDeploymentsList = () => (
    <div className="deployment-hub-container">
      <div className="deployments-header">
        <div className="header-left">
          <h1>Deployment Hub</h1>
          <p>Manage and monitor all your project deployments</p>
        </div>
        
        <div className="header-actions">
          <button onClick={() => handleDeploy({})} className="btn btn-primary">
            <Rocket className="w-4 h-4" />
            New Deployment
          </button>
        </div>
      </div>

      <div className="content-controls">
        <div className="search-filter">
          <div className="search-bar">
            <Search className="w-5 h-5" />
            <input
              type="text"
              placeholder="Search deployments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-dropdown">
            <Filter className="w-4 h-4" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>
          
          <div className="filter-dropdown">
            <Cloud className="w-4 h-4" />
            <select value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)}>
              <option value="all">All Platforms</option>
              <option value="vercel">Vercel</option>
              <option value="netlify">Netlify</option>
              <option value="railway">Railway</option>
              <option value="render">Render</option>
            </select>
          </div>
        </div>
      </div>

      <div className="deployments-grid">
        {filteredDeployments.map(deployment => (
          <div key={deployment.id} className="deployment-card">
            <div className="deployment-header">
              <div className="deployment-icon">
                {getProjectTypeIcon(deployment.projectType)}
              </div>
              <div className="deployment-meta">
                <span className={`status ${getStatusColor(deployment.status)}`}>
                  {getStatusIcon(deployment.status)}
                  {deployment.status.charAt(0).toUpperCase() + deployment.status.slice(1)}
                </span>
                <span className="platform">
                  {getPlatformIcon(deployment.platform)}
                  {deployment.platform.charAt(0).toUpperCase() + deployment.platform.slice(1)}
                </span>
              </div>
              <div className="deployment-actions">
                {deployment.status === 'success' && deployment.url && (
                  <a 
                    href={deployment.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="action-link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
            
            <div className="deployment-content">
              <h3>{deployment.projectName}</h3>
              <div className="deployment-info">
                <span className="project-type">
                  {getProjectTypeIcon(deployment.projectType)}
                  {deployment.projectType.charAt(0).toUpperCase() + deployment.projectType.slice(1)}
                </span>
                <span className="branch">
                  <Github className="w-3 h-3" />
                  {deployment.branch}
                </span>
                <span className="environment">
                  <Shield className="w-3 h-3" />
                  {deployment.environment}
                </span>
              </div>
              
              {deployment.url && (
                <div className="deployment-url">
                  <Globe className="w-4 h-4" />
                  <a href={deployment.url} target="_blank" rel="noopener noreferrer">
                    {deployment.url}
                  </a>
                  <button 
                    onClick={() => navigator.clipboard.writeText(deployment.url)}
                    className="copy-btn"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              <div className="deployment-stats">
                <div className="stat-item">
                  <Terminal className="w-3 h-3" />
                  <span>{deployment.buildTime}</span>
                  <label>Build Time</label>
                </div>
                <div className="stat-item">
                  <Activity className="w-3 h-3" />
                  <span>{deployment.commits}</span>
                  <label>Commits</label>
                </div>
                <div className="stat-item">
                  <Server className="w-3 h-3" />
                  <span>{deployment.size}</span>
                  <label>Size</label>
                </div>
              </div>
              
              <div className="deployment-dates">
                <span className="date">
                  <Clock className="w-3 h-3" />
                  Deployed {new Date(deployment.deployedAt).toLocaleDateString()}
                </span>
                <span className="date">
                  <RefreshCw className="w-3 h-3" />
                  Updated {new Date(deployment.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="deployment-footer">
              <button 
                onClick={() => setSelectedDeployment(deployment)}
                className="btn btn-secondary"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
              
              <div className="action-buttons">
                <button 
                  onClick={() => handleRedeploy(deployment.id)}
                  disabled={isRedeploying.has(deployment.id)}
                  className="btn btn-outline"
                >
                  <RefreshCw className={`w-4 h-4 ${isRedeploying.has(deployment.id) ? 'spinning' : ''}`} />
                  {isRedeploying.has(deployment.id) ? 'Redeploying...' : 'Redeploy'}
                </button>
                
                <button 
                  onClick={() => handleViewLogs(deployment.id)}
                  className="btn btn-outline"
                >
                  <Terminal className="w-4 h-4" />
                  Logs
                </button>
                
                {isAdmin && (
                  <button className="btn btn-outline danger">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {filteredDeployments.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <Rocket className="w-12 h-12" />
            </div>
            <h3>No deployments found</h3>
            <p>Start by deploying your first project</p>
            <button onClick={() => handleDeploy({})} className="btn btn-primary">
              <Rocket className="w-4 h-4" />
              Deploy Project
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderDeploymentDetails = () => {
    if (!selectedDeployment) return null;

    return (
      <div className="deployment-details">
        <div className="details-header">
          <button onClick={() => setSelectedDeployment(null)} className="back-btn">
            <ArrowLeft className="w-5 h-5" />
            Back to Deployments
          </button>
          
          <div className="deployment-title">
            <h2>{selectedDeployment.projectName}</h2>
            <div className="deployment-badges">
              <span className={`status ${getStatusColor(selectedDeployment.status)}`}>
                {getStatusIcon(selectedDeployment.status)}
                {selectedDeployment.status}
              </span>
              <span className="platform">
                {getPlatformIcon(selectedDeployment.platform)}
                {selectedDeployment.platform}
              </span>
              <span className="project-type">
                {getProjectTypeIcon(selectedDeployment.projectType)}
                {selectedDeployment.projectType}
              </span>
            </div>
          </div>
        </div>

        <div className="details-content">
          {selectedDeployment.url && (
            <div className="live-url-section">
              <h3>Live URL</h3>
              <div className="url-display">
                <Globe className="w-5 h-5" />
                <a href={selectedDeployment.url} target="_blank" rel="noopener noreferrer">
                  {selectedDeployment.url}
                </a>
                <button 
                  onClick={() => navigator.clipboard.writeText(selectedDeployment.url)}
                  className="copy-btn"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <a 
                  href={selectedDeployment.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="visit-btn"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit
                </a>
              </div>
            </div>
          )}

          <div className="deployment-overview">
            <h3>Deployment Overview</h3>
            <div className="overview-grid">
              <div className="overview-item">
                <Github className="w-5 h-5" />
                <div>
                  <strong>Repository</strong>
                  <a href={selectedDeployment.githubRepo} target="_blank" rel="noopener noreferrer">
                    {selectedDeployment.githubRepo}
                  </a>
                </div>
              </div>
              <div className="overview-item">
                <Terminal className="w-5 h-5" />
                <div>
                  <strong>Build Time</strong>
                  <p>{selectedDeployment.buildTime}</p>
                </div>
              </div>
              <div className="overview-item">
                <Activity className="w-5 h-5" />
                <div>
                  <strong>Commits</strong>
                  <p>{selectedDeployment.commits} commits</p>
                </div>
              </div>
              <div className="overview-item">
                <Server className="w-5 h-5" />
                <div>
                  <strong>Bundle Size</strong>
                  <p>{selectedDeployment.size}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="deployment-logs">
            <div className="logs-header">
              <h3>Deployment Logs</h3>
              <button onClick={() => handleViewLogs(selectedDeployment.id)} className="btn btn-secondary">
                <RefreshCw className="w-4 h-4" />
                Refresh Logs
              </button>
            </div>
            
            <div className="logs-container">
              {deploymentLogs[selectedDeployment.id] || selectedDeployment.logs ? (
                <div className="logs-list">
                  {(deploymentLogs[selectedDeployment.id] || selectedDeployment.logs).map((log, index) => (
                    <div key={index} className={`log-entry ${log.level}`}>
                      <span className="timestamp">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="level">{log.level.toUpperCase()}</span>
                      <span className="message">{log.message}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-logs">
                  <Terminal className="w-8 h-8" />
                  <p>No logs available</p>
                </div>
              )}
            </div>
          </div>

          <div className="deployment-actions">
            <button 
              onClick={() => handleRedeploy(selectedDeployment.id)}
              disabled={isRedeploying.has(selectedDeployment.id)}
              className="btn btn-primary"
            >
              <RefreshCw className={`w-4 h-4 ${isRedeploying.has(selectedDeployment.id) ? 'spinning' : ''}`} />
              {isRedeploying.has(selectedDeployment.id) ? 'Redeploying...' : 'Redeploy'}
            </button>
            
            {isAdmin && (
              <div className="admin-actions">
                <button className="btn btn-outline">
                  <Settings className="w-4 h-4" />
                  Configure
                </button>
                <button className="btn btn-outline danger">
                  <Trash2 className="w-4 h-4" />
                  Delete Deployment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderDeployModal = () => (
    <div className="modal-overlay" onClick={() => setShowDeployModal(false)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New Deployment</h2>
          <button onClick={() => setShowDeployModal(false)} className="modal-close">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="deploy-form">
            <div className="form-group">
              <label>Select Project</label>
              <select>
                <option value="">Choose a project...</option>
                <option value="1">Personal Portfolio</option>
                <option value="2">Task Management App</option>
                <option value="3">E-Commerce Platform</option>
                <option value="4">Weather Dashboard</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Project Type</label>
              <div className="type-selector">
                <button type="button" className="type-option active">
                  <Code className="w-4 h-4" />
                  Frontend
                </button>
                <button type="button" className="type-option">
                  <Database className="w-4 h-4" />
                  Backend
                </button>
                <button type="button" className="type-option">
                  <Globe className="w-4 h-4" />
                  Full Stack
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label>Deployment Platform</label>
              <div className="platform-grid">
                <button type="button" className="platform-option active">
                  <Zap className="w-6 h-6" />
                  <span>Vercel</span>
                  <small>Best for frontend</small>
                </button>
                <button type="button" className="platform-option">
                  <Globe className="w-6 h-6" />
                  <span>Netlify</span>
                  <small>Static sites</small>
                </button>
                <button type="button" className="platform-option">
                  <Server className="w-6 h-6" />
                  <span>Railway</span>
                  <small>Backend services</small>
                </button>
                <button type="button" className="platform-option">
                  <Cloud className="w-6 h-6" />
                  <span>Render</span>
                  <small>Full stack apps</small>
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label>Branch</label>
              <select>
                <option value="main">main</option>
                <option value="develop">develop</option>
                <option value="feature/new">feature/new</option>
              </select>
            </div>
            
            <div className="form-actions">
              <button onClick={() => setShowDeployModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={() => {
                setShowDeployModal(false);
                // In real app, this would trigger the deployment
                console.log('Starting deployment...');
              }} className="btn btn-primary">
                <Rocket className="w-4 h-4" />
                Start Deployment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {selectedDeployment ? renderDeploymentDetails() : renderDeploymentsList()}
      {showDeployModal && renderDeployModal()}
    </>
  );
};

export default DeploymentHub;
