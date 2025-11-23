import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './ProjectDetail.css';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/projects/${id}`
      );
      setProject(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setActionLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/projects/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      setLiked(!liked);
      setProject(prev => ({
        ...prev,
        likes: liked ? prev.likes - 1 : prev.likes + 1,
      }));
    } catch (err) {
      console.error('Failed to like project:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setActionLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/projects/${id}/save`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      setSaved(!saved);
    } catch (err) {
      console.error('Failed to save project:', err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="project-detail-loading">
        <div className="spinner"></div>
        <p>Loading project...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-detail-error">
        <h2>{error || 'Project not found'}</h2>
        <button onClick={() => navigate('/projects')} className="btn-back">
          ← Back to Projects
        </button>
      </div>
    );
  }

  const isOwner = isAuthenticated && user?.id === project.createdBy._id;

  return (
    <div className="project-detail">
      {/* Hero Section */}
      <div className="project-hero">
        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.title}
            className="hero-image"
          />
        ) : (
          <div className="hero-placeholder"></div>
        )}

        <div className="hero-overlay">
          <div className="hero-content">
            <button
              onClick={() => navigate('/projects')}
              className="btn-back"
            >
              ← Back to Projects
            </button>
            <h1>{project.title}</h1>
            <div className="project-meta-hero">
              <span className={`status-badge status-${project.status}`}>
                {project.status}
              </span>
              <span className="category-badge">{project.category}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="project-container">
        <div className="project-main">
          {/* Description */}
          <section className="section">
            <h2>About this project</h2>
            <p className="description">{project.description}</p>
          </section>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <section className="section">
              <h2>Technologies Used</h2>
              <div className="tech-list">
                {project.technologies.map((tech, idx) => (
                  <span key={idx} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Team Members */}
          {project.teamMembers && project.teamMembers.length > 0 && (
            <section className="section">
              <h2>Team Members</h2>
              <div className="team-members">
                {project.teamMembers.map((member) => (
                  <div key={member.userId._id} className="team-member">
                    {member.userId.profileImage && (
                      <img
                        src={member.userId.profileImage}
                        alt={member.userId.fullName}
                        className="member-avatar"
                      />
                    )}
                    <div className="member-info">
                      <p className="member-name">{member.userId.fullName}</p>
                      <p className="member-role">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Links */}
          <section className="section">
            <h2>Links</h2>
            <div className="links">
              {project.repositoryUrl && (
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-btn github"
                >
                  🔗 GitHub Repository
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-btn live"
                >
                  🚀 Live Demo
                </a>
              )}
              {project.documentationUrl && (
                <a
                  href={project.documentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-btn docs"
                >
                  📖 Documentation
                </a>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="project-sidebar">
          {/* Creator Card */}
          <div className="card creator-card">
            <h3>Created By</h3>
            <div className="creator-info">
              {project.createdBy.profileImage && (
                <img
                  src={project.createdBy.profileImage}
                  alt={project.createdBy.fullName}
                  className="creator-avatar"
                />
              )}
              <div>
                <p className="creator-name">{project.createdBy.fullName}</p>
                <p className="creator-id">{project.createdBy.studentId}</p>
              </div>
            </div>
            {isOwner && (
              <button className="btn-edit">✏️ Edit Project</button>
            )}
          </div>

          {/* Stats Card */}
          <div className="card stats-card">
            <h3>Stats</h3>
            <div className="stat-item">
              <span className="stat-label">Views</span>
              <span className="stat-value">{project.views}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Likes</span>
              <span className="stat-value">{project.likes}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Team Size</span>
              <span className="stat-value">{project.teamMembers?.length || 1}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="card action-buttons">
            <button
              onClick={handleLike}
              disabled={actionLoading}
              className={`action-btn ${liked ? 'liked' : ''}`}
            >
              ❤️ {liked ? 'Liked' : 'Like'}
            </button>
            <button
              onClick={handleSave}
              disabled={actionLoading}
              className={`action-btn ${saved ? 'saved' : ''}`}
            >
              🔖 {saved ? 'Saved' : 'Save'}
            </button>
          </div>

          {/* Project Info */}
          <div className="card info-card">
            <h3>Project Info</h3>
            {project.startDate && (
              <div className="info-item">
                <span className="info-label">Start Date</span>
                <span className="info-value">
                  {new Date(project.startDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {project.endDate && (
              <div className="info-item">
                <span className="info-label">End Date</span>
                <span className="info-value">
                  {new Date(project.endDate).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="info-item">
              <span className="info-label">Visibility</span>
              <span className="info-value">{project.visibility}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Created</span>
              <span className="info-value">
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
