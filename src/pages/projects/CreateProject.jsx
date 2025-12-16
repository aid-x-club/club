import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './CreateProject.css';

export default function CreateProject() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'web',
    technologies: '',
    repositoryUrl: '',
    liveUrl: '',
    documentationUrl: '',
    startDate: '',
    endDate: '',
  });

  if (!isAuthenticated) {
    return (
      <div className="create-project-container">
        <div className="auth-required">
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.category) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      const submitData = {
        ...formData,
        technologies: formData.technologies
          .split(',')
          .map(t => t.trim())
          .filter(t => t),
      };

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
      setTimeout(() => {
        navigate(`/project/${response.data.data._id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-project-page">
      <div className="create-project-header">
        <h1>Create New Project</h1>
        <p>Share your amazing project with the AID-X community</p>
      </div>

      <form onSubmit={handleSubmit} className="create-project-form">
        <div className="form-container">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Project Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter project title"
                maxLength="100"
                disabled={loading}
                required
              />
              <small>{formData.title.length}/100</small>
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
                <option value="web">Web Development</option>
                <option value="mobile">Mobile App</option>
                <option value="ai-ml">AI & Machine Learning</option>
                <option value="blockchain">Blockchain</option>
                <option value="iot">IoT</option>
                <option value="game">Game Development</option>
                <option value="desktop">Desktop App</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your project in detail..."
              rows="6"
              maxLength="5000"
              disabled={loading}
              required
            />
            <small>{formData.description.length}/5000</small>
          </div>

          <div className="form-group">
            <label htmlFor="shortDescription">Short Description</label>
            <input
              type="text"
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="One-line summary of your project"
              maxLength="200"
              disabled={loading}
            />
            <small>{formData.shortDescription.length}/200</small>
          </div>

          <div className="form-group">
            <label htmlFor="technologies">Technologies (comma-separated)</label>
            <input
              type="text"
              id="technologies"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, MongoDB, Tailwind CSS"
              disabled={loading}
            />
            <small>Separate multiple technologies with commas</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="repositoryUrl">Repository URL</label>
              <input
                type="url"
                id="repositoryUrl"
                name="repositoryUrl"
                value={formData.repositoryUrl}
                onChange={handleChange}
                placeholder="https://github.com/username/repo"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="liveUrl">Live Demo URL</label>
              <input
                type="url"
                id="liveUrl"
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleChange}
                placeholder="https://your-project.com"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="documentationUrl">Documentation URL</label>
            <input
              type="url"
              id="documentationUrl"
              name="documentationUrl"
              value={formData.documentationUrl}
              onChange={handleChange}
              placeholder="https://docs.your-project.com"
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
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
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
