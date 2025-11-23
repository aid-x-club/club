import React, { useState } from 'react';
import { useGitHubIntegration } from '../../hooks/useGitHubIntegration';
import './CreateProject.css';

/**
 * Create Project Component
 * Allows students to create a new project from a template
 * 
 * Usage: <CreateProjectForm />
 */
export const CreateProjectForm = () => {
  const { githubUser, createProject, loading, error } = useGitHubIntegration();
  const [formData, setFormData] = useState({
    projectName: '',
    template: 'template-starter',
  });
  const [success, setSuccess] = useState(null);
  const [result, setResult] = useState(null);

  const templates = [
    { id: 'template-starter', name: 'Starter Template', description: 'Basic project structure' },
    { id: 'template-react', name: 'React Template', description: 'React with Vite' },
    { id: 'template-node', name: 'Node.js Template', description: 'Node.js Express server' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setResult(null);

    if (!githubUser) {
      alert('Please connect your GitHub account first');
      return;
    }

    if (!formData.projectName.trim()) {
      alert('Please enter a project name');
      return;
    }

    try {
      const repo = await createProject(formData.template, formData.projectName);
      setSuccess(true);
      setResult(repo);
      setFormData({ projectName: '', template: 'template-starter' });
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  if (!githubUser) {
    return (
      <div className="create-project-disabled">
        <p>Please connect your GitHub account to create projects</p>
      </div>
    );
  }

  return (
    <div className="create-project-container">
      <h2>Create New Project</h2>

      {error && (
        <div className="alert alert-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && result && (
        <div className="alert alert-success">
          <strong>Success!</strong> Your project has been created.
          <br />
          <a href={result.url} target="_blank" rel="noopener noreferrer">
            View on GitHub: {result.fullName}
          </a>
        </div>
      )}

      <form onSubmit={handleSubmit} className="create-project-form">
        <div className="form-group">
          <label htmlFor="template">Select Template</label>
          <select
            id="template"
            name="template"
            value={formData.template}
            onChange={handleChange}
            disabled={loading}
          >
            {templates.map(t => (
              <option key={t.id} value={t.id}>
                {t.name} - {t.description}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="projectName">Project Name</label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            placeholder="e.g., my-awesome-project"
            value={formData.projectName}
            onChange={handleChange}
            disabled={loading}
            pattern="^[a-z0-9-]+$"
            title="Use only lowercase letters, numbers, and hyphens"
          />
          <small>Must contain only lowercase letters, numbers, and hyphens</small>
        </div>

        <button type="submit" className="btn-create" disabled={loading}>
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>

      {result && (
        <div className="project-details">
          <h3>Project Created</h3>
          <p><strong>Name:</strong> {result.name}</p>
          <p><strong>Repository:</strong> <a href={result.url} target="_blank" rel="noopener noreferrer">{result.fullName}</a></p>
          <p><strong>Your Access:</strong> Push access</p>
        </div>
      )}
    </div>
  );
};

export default CreateProjectForm;
