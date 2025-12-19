import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './CreateProject.css';

const TEMPLATES = [
  { value: 'web-starter', label: '🌐 Web Development Starter', description: 'React + Vite + Tailwind CSS' },
  { value: 'mobile-starter', label: '📱 Mobile App Starter', description: 'React Native + Expo' },
  { value: 'ai-ml-starter', label: '🤖 AI/ML Project', description: 'Python + Jupyter + TensorFlow' },
  { value: 'blockchain-starter', label: '⛓️ Blockchain DApp', description: 'Solidity + Hardhat + React' },
  { value: 'iot-starter', label: '🔌 IoT Project', description: 'Arduino + Raspberry Pi' },
  { value: 'game-starter', label: '🎮 Game Development', description: 'Unity + C#' },
  { value: 'fullstack-starter', label: '💻 Full Stack App', description: 'MERN Stack' },
  { value: 'blank', label: '📦 Blank Project', description: 'Start from scratch' },
];

export default function CreateProject() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checkingGitHub, setCheckingGitHub] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [createdRepo, setCreatedRepo] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'web',
    technologies: '',
    template: 'web-starter',
    createGitHubRepo: true,
  });

  useEffect(() => {
    if (isAuthenticated) {
      checkGitHubConnection();
    }
  }, [isAuthenticated]);

  // Helper function to get correct dashboard path based on user role
  const getDashboardPath = () => {
    return user?.role === 'coordinator' ? '/admin/dashboard' : '/student/dashboard';
  };

  const checkGitHubConnection = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/github/status`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      if (response.data.success) {
        setGithubConnected(response.data.githubConnected);
        setGithubUsername(response.data.githubUsername);
      }
    } catch (err) {
      console.error('Error checking GitHub status:', err);
    } finally {
      setCheckingGitHub(false);
    }
  };

  const handleConnectGitHub = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/github/login`
      );

      if (response.data.success) {
        localStorage.setItem('github_oauth_state', response.data.state);
        window.location.href = response.data.authUrl;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate GitHub connection');
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="create-project-container">
        <div className="auth-required">
          <div className="auth-icon">🔒</div>
          <h2>Authentication Required</h2>
          <p>You must be logged in to create a project</p>
          <button onClick={() => navigate('/login')} className="btn-login">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const generateRepoName = () => {
    const rollNumber = user?.rollNumber || 'student';
    const projectName = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${rollNumber}-${projectName}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setCreatedRepo(null);

    try {
      // Validate required fields
      if (!formData.title || !formData.description) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Check GitHub connection if creating repo
      if (formData.createGitHubRepo && !githubConnected) {
        setError('Please connect your GitHub account first');
        setLoading(false);
        return;
      }

      const submitData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        technologies: formData.technologies
          .split(',')
          .map(t => t.trim())
          .filter(t => t),
      };

      // Create GitHub repository if requested
      if (formData.createGitHubRepo && githubConnected) {
        const repoName = generateRepoName();

        const githubResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/github/create-project`,
          {
            templateOwner: 'aid-x-club',
            templateRepo: formData.template,
            newRepoName: repoName,
            studentGithubUsername: githubUsername,
            isPrivate: true
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
          }
        );

        if (githubResponse.data.success) {
          submitData.repositoryUrl = githubResponse.data.data.repoUrl;
          submitData.githubRepoName = githubResponse.data.data.repoName;
          setCreatedRepo(githubResponse.data.data);
        }
      }

      // Create project in database
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/projects`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      setSuccess('Project created successfully!');

      // Don't redirect immediately if repo was created - show the repo info
      if (!createdRepo) {
        setTimeout(() => {
          navigate(getDashboardPath());
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const selectedTemplate = TEMPLATES.find(t => t.value === formData.template);

  return (
    <div className="create-project-page">
      <div className="create-project-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
        <div className="header-content">
          <h1>Create New Project</h1>
          <p>Create a project with automatic GitHub repository setup</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="create-project-form">
        <div className="form-container">
          {error && <div className="error-message">❌ {error}</div>}
          {success && <div className="success-message">✅ {success}</div>}

          {/* GitHub Status */}
          {checkingGitHub ? (
            <div className="github-status-check">
              <span className="spinner"></span> Checking GitHub connection...
            </div>
          ) : (
            <div className={`github-status ${githubConnected ? 'connected' : 'not-connected'}`}>
              {githubConnected ? (
                <>
                  <span className="status-icon">✓</span>
                  <span>GitHub connected as <strong>{githubUsername}</strong></span>
                </>
              ) : (
                <>
                  <span className="status-icon">⚠</span>
                  <span>GitHub not connected. <button type="button" onClick={handleConnectGitHub} disabled={loading} className="link-button">Connect now</button></span>
                </>
              )}
            </div>
          )}

          {/* GitHub Repository Creation */}
          {githubConnected && (
            <div className="form-section">
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="createGitHubRepo"
                    checked={formData.createGitHubRepo}
                    onChange={handleChange}
                  />
                  <span>Create GitHub repository from template</span>
                </label>
                <small>A new private repository will be created under aid-x-club organization</small>
              </div>

              {formData.createGitHubRepo && (
                <>
                  <div className="form-group">
                    <label htmlFor="template">Select Template *</label>
                    <select
                      id="template"
                      name="template"
                      value={formData.template}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    >
                      {TEMPLATES.map(template => (
                        <option key={template.value} value={template.value}>
                          {template.label}
                        </option>
                      ))}
                    </select>
                    {selectedTemplate && (
                      <small className="template-description">
                        {selectedTemplate.description}
                      </small>
                    )}
                  </div>

                  <div className="repo-preview">
                    <strong>Repository Name:</strong>
                    <code>{formData.title ? generateRepoName() : '{rollNumber}-{project-name}'}</code>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Project Details */}
          <div className="form-section">
            <h3 className="section-title">Project Details</h3>

            <div className="form-group">
              <label htmlFor="title">Project Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter your project title"
                maxLength="100"
                disabled={loading}
                required
              />
              <small className="char-count">{formData.title.length}/100</small>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what your project does..."
                rows="6"
                maxLength="2000"
                disabled={loading}
                required
              />
              <small className="char-count">{formData.description.length}/2000</small>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
                required
              >
                <option value="web">🌐 Web Development</option>
                <option value="mobile">📱 Mobile App</option>
                <option value="ai-ml">🤖 AI & Machine Learning</option>
                <option value="blockchain">⛓️ Blockchain</option>
                <option value="iot">🔌 IoT</option>
                <option value="game">🎮 Game Development</option>
                <option value="desktop">💻 Desktop App</option>
                <option value="other">📦 Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="technologies">Technologies Used</label>
              <input
                type="text"
                id="technologies"
                name="technologies"
                value={formData.technologies}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, MongoDB"
                disabled={loading}
              />
              <small>Separate multiple technologies with commas</small>
            </div>
          </div>

          {/* Success - Show Repository Info */}
          {createdRepo && (
            <div className="repo-created-success">
              <h3>🎉 Repository Created Successfully!</h3>
              <div className="repo-info">
                <div className="repo-detail">
                  <strong>Repository:</strong>
                  <a href={createdRepo.repoUrl} target="_blank" rel="noopener noreferrer">
                    {createdRepo.repoFullName}
                  </a>
                </div>
                <div className="repo-detail">
                  <strong>Clone URL:</strong>
                  <code>git clone {createdRepo.repoUrl}.git</code>
                </div>
                <div className="repo-detail">
                  <strong>Access:</strong>
                  <span>✓ You have been added as a collaborator with push access</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate(getDashboardPath())}
                className="btn btn-primary"
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {/* Form Actions */}
          {!createdRepo && (
            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Create Project
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
