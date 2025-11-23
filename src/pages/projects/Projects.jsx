import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import './Projects.css';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || '';
  const status = searchParams.get('status') || '';
  const sort = searchParams.get('sort') || 'recent';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';

  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, [category, status, sort, page, search]);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
      });

      if (category) params.append('category', category);
      if (status) params.append('status', status);
      if (sort) params.append('sort', sort);
      if (search) params.append('search', search);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/projects?${params}`
      );

      setProjects(response.data.data);
      setTotal(response.data.total);
      setPages(response.data.pages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(filterType, value);
    } else {
      newParams.delete(filterType);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (query) {
      newParams.set('search', query);
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const goToPage = (pageNum) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', pageNum);
    setSearchParams(newParams);
  };

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>Projects Showcase</h1>
        <p>Discover amazing projects from our club members</p>
      </div>

      <div className="projects-container">
        {/* Sidebar Filters */}
        <aside className="projects-sidebar">
          <div className="filter-group">
            <h3>Search</h3>
            <input
              type="text"
              placeholder="Search projects..."
              defaultValue={search}
              onChange={handleSearch}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <h3>Category</h3>
            <select
              value={category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
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

          <div className="filter-group">
            <h3>Status</h3>
            <select
              value={status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>

          <div className="filter-group">
            <h3>Sort By</h3>
            <select
              value={sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="filter-select"
            >
              <option value="recent">Most Recent</option>
              <option value="trending">Trending</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </aside>

        {/* Main Content */}
        <main className="projects-main">
          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading projects...</p>
            </div>
          ) : projects.length > 0 ? (
            <>
              <div className="projects-grid">
                {projects.map((project) => (
                  <a
                    key={project._id}
                    href={`/project/${project._id}`}
                    className="project-card"
                  >
                    {project.coverImage && (
                      <div className="project-image">
                        <img
                          src={project.coverImage}
                          alt={project.title}
                        />
                      </div>
                    )}

                    <div className="project-content">
                      <div className="project-header">
                        <h3>{project.title}</h3>
                        <span className={`status-badge status-${project.status}`}>
                          {project.status}
                        </span>
                      </div>

                      <p className="project-description">
                        {project.shortDescription || project.description.substring(0, 100)}...
                      </p>

                      <div className="project-meta">
                        <div className="category-tag">{project.category}</div>
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="tech-tags">
                            {project.technologies.slice(0, 2).map((tech, idx) => (
                              <span key={idx} className="tech-tag">
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 2 && (
                              <span className="tech-tag">
                                +{project.technologies.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="project-footer">
                        <div className="project-stats">
                          <span className="stat">
                            👁️ {project.views}
                          </span>
                          <span className="stat">
                            ❤️ {project.likes}
                          </span>
                          <span className="stat">
                            👥 {project.teamMembers?.length || 1}
                          </span>
                        </div>

                        {project.createdBy && (
                          <div className="project-creator">
                            {project.createdBy.profileImage && (
                              <img
                                src={project.createdBy.profileImage}
                                alt={project.createdBy.fullName}
                                className="creator-avatar"
                              />
                            )}
                            <span>{project.createdBy.fullName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    className="pagination-btn"
                  >
                    ← Previous
                  </button>

                  <div className="page-numbers">
                    {Array.from({ length: pages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`page-number ${
                            page === pageNum ? 'active' : ''
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() => goToPage(page + 1)}
                    disabled={page === pages}
                    className="pagination-btn"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <p>No projects found</p>
              <p>Try adjusting your filters</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
