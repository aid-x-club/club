import React, { useState, useEffect } from 'react';
import { 
  User, 
  Edit, 
  Camera, 
  Github, 
  ExternalLink, 
  Code, 
  Briefcase, 
  Star, 
  Eye, 
  EyeOff, 
  Share, 
  Download, 
  Settings, 
  Plus, 
  X, 
  Save, 
  Tag, 
  Award, 
  TrendingUp, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Users, 
  Target, 
  Zap, 
  Shield, 
  Rocket, 
  Heart, 
  MessageSquare,
  Copy,
  CheckCircle,
  Clock,
  BarChart
} from 'lucide-react';
import './PortfolioProfiles.css';

const PortfolioProfiles = ({ onClose, user, isAdmin = false }) => {
  const [viewMode, setViewMode] = useState('my-profile'); // my-profile, browse, highlights
  const [isEditing, setIsEditing] = useState(false);
  const [visibilityMode, setVisibilityMode] = useState('public'); // public, private
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkills, setFilterSkills] = useState('all');
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    githubUrl: '',
    linkedinUrl: '',
    websiteUrl: '',
    skills: [],
    projects: [],
    stats: {
      projectsCount: 0,
      deploymentsCount: 0,
      skillsCount: 0,
      collaborationsCount: 0
    },
    joinedDate: '',
    lastActive: '',
    featuredProjects: []
  });

  const [editData, setEditData] = useState({
    bio: '',
    skills: [],
    email: '',
    phone: '',
    location: '',
    githubUrl: '',
    linkedinUrl: '',
    websiteUrl: ''
  });

  // Sample data - in real app this would come from API
  useEffect(() => {
    // Current user's profile
    setProfileData({
      name: user?.name || 'John Doe',
      bio: 'Passionate full-stack developer with expertise in React, Node.js, and cloud technologies. Love building innovative solutions and collaborating on exciting projects.',
      email: user?.email || 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      githubUrl: 'https://github.com/johndoe',
      linkedinUrl: 'https://linkedin.com/in/johndoe',
      websiteUrl: 'https://johndoe.dev',
      skills: [
        { name: 'React', level: 'advanced', category: 'frontend' },
        { name: 'JavaScript', level: 'advanced', category: 'frontend' },
        { name: 'Node.js', level: 'intermediate', category: 'backend' },
        { name: 'Python', level: 'intermediate', category: 'backend' },
        { name: 'PostgreSQL', level: 'intermediate', category: 'database' },
        { name: 'Docker', level: 'beginner', category: 'devops' },
        { name: 'AWS', level: 'beginner', category: 'cloud' },
        { name: 'TypeScript', level: 'intermediate', category: 'frontend' }
      ],
      projects: [
        {
          id: 1,
          name: 'Personal Portfolio',
          description: 'Modern portfolio website built with React and TypeScript',
          technologies: ['React', 'TypeScript', 'Tailwind CSS'],
          deployedUrl: 'https://johndoe.dev',
          githubUrl: 'https://github.com/johndoe/portfolio',
          status: 'completed',
          createdAt: '2024-01-15',
          featured: true
        },
        {
          id: 2,
          name: 'Task Management App',
          description: 'Full-stack task management application with real-time updates',
          technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
          deployedUrl: 'https://taskmanager.johndoe.dev',
          githubUrl: 'https://github.com/johndoe/task-manager',
          status: 'completed',
          createdAt: '2024-01-10',
          featured: true
        },
        {
          id: 3,
          name: 'Weather Dashboard',
          description: 'Real-time weather monitoring dashboard with data visualization',
          technologies: ['React', 'Chart.js', 'OpenWeather API'],
          deployedUrl: null,
          githubUrl: 'https://github.com/johndoe/weather-dashboard',
          status: 'in-progress',
          createdAt: '2024-01-20',
          featured: false
        }
      ],
      stats: {
        projectsCount: 3,
        deploymentsCount: 2,
        skillsCount: 8,
        collaborationsCount: 5
      },
      joinedDate: '2023-09-15',
      lastActive: '2024-01-22',
      featuredProjects: [1, 2]
    });

    // Other student profiles for browsing
    setOtherProfiles([
      {
        id: 2,
        name: 'Jane Smith',
        bio: 'UI/UX designer turned frontend developer. Passionate about creating beautiful and functional user interfaces.',
        skills: ['React', 'Vue.js', 'CSS', 'Figma', 'UI Design', 'JavaScript'],
        projectsCount: 5,
        deploymentsCount: 4,
        visibility: 'public',
        featured: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        bio: 'Backend developer specializing in scalable systems and cloud architecture.',
        skills: ['Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'MongoDB'],
        projectsCount: 7,
        deploymentsCount: 6,
        visibility: 'public',
        featured: false,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'
      },
      {
        id: 4,
        name: 'Sarah Wilson',
        bio: 'Full-stack developer with a focus on mobile applications and progressive web apps.',
        skills: ['React Native', 'Flutter', 'React', 'Node.js', 'Firebase'],
        projectsCount: 4,
        deploymentsCount: 3,
        visibility: 'private',
        featured: false,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
      }
    ]);
  }, [user]);

  const [otherProfiles, setOtherProfiles] = useState([]);

  const handleSaveProfile = () => {
    setProfileData(prev => ({
      ...prev,
      ...editData
    }));
    setIsEditing(false);
  };

  const handleAddSkill = (skillName, level = 'intermediate', category = 'frontend') => {
    if (!editData.skills.find(skill => skill.name === skillName)) {
      setEditData(prev => ({
        ...prev,
        skills: [...prev.skills, { name: skillName, level, category }]
      }));
    }
  };

  const handleRemoveSkill = (skillName) => {
    setEditData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.name !== skillName)
    }));
  };

  const handleVisibilityToggle = () => {
    setVisibilityMode(prev => prev === 'public' ? 'private' : 'public');
  };

  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/portfolio/${profileData.name.toLowerCase().replace(/\s+/g, '-')}`;
    navigator.clipboard.writeText(profileUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleViewProfile = (profile) => {
    setSelectedProfile(profile);
    setShowPreviewModal(true);
  };

  const getSkillLevelColor = (level) => {
    switch (level) {
      case 'advanced': return 'level-advanced';
      case 'intermediate': return 'level-intermediate';
      case 'beginner': return 'level-beginner';
      default: return 'level-default';
    }
  };

  const getSkillCategoryColor = (category) => {
    switch (category) {
      case 'frontend': return 'category-frontend';
      case 'backend': return 'category-backend';
      case 'database': return 'category-database';
      case 'devops': return 'category-devops';
      case 'cloud': return 'category-cloud';
      default: return 'category-default';
    }
  };

  const renderMyProfile = () => (
    <div className="portfolio-container">
      <div className="profile-header">
        <div className="header-left">
          <h1>My Portfolio Profile</h1>
          <p>Showcase your skills and projects</p>
        </div>
        
        <div className="header-actions">
          <div className="visibility-toggle">
            <button
              onClick={handleVisibilityToggle}
              className={`visibility-btn ${visibilityMode}`}
            >
              {visibilityMode === 'public' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {visibilityMode === 'public' ? 'Public' : 'Private'}
            </button>
          </div>
          
          <button onClick={() => setShowShareModal(true)} className="btn btn-secondary">
            <Share className="w-4 h-4" />
            Share Profile
          </button>
          
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="btn btn-primary">
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {isEditing ? renderEditProfile() : renderViewProfile()}
    </div>
  );

  const renderViewProfile = () => (
    <div className="profile-content">
      <div className="profile-main">
        <div className="profile-card">
          <div className="profile-header-card">
            <div className="profile-avatar">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.name}`} alt={profileData.name} />
              <button className="avatar-edit">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div className="profile-info">
              <h2>{profileData.name}</h2>
              <p className="profile-bio">{profileData.bio}</p>
              
              <div className="profile-contact">
                {profileData.email && (
                  <div className="contact-item">
                    <Mail className="w-4 h-4" />
                    <span>{profileData.email}</span>
                  </div>
                )}
                {profileData.phone && (
                  <div className="contact-item">
                    <Phone className="w-4 h-4" />
                    <span>{profileData.phone}</span>
                  </div>
                )}
                {profileData.location && (
                  <div className="contact-item">
                    <MapPin className="w-4 h-4" />
                    <span>{profileData.location}</span>
                  </div>
                )}
              </div>
              
              <div className="profile-links">
                {profileData.githubUrl && (
                  <a href={profileData.githubUrl} target="_blank" rel="noopener noreferrer" className="social-link">
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {profileData.linkedinUrl && (
                  <a href={profileData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="social-link">
                    <Users className="w-5 h-5" />
                  </a>
                )}
                {profileData.websiteUrl && (
                  <a href={profileData.websiteUrl} target="_blank" rel="noopener noreferrer" className="social-link">
                    <Globe className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
          
          <div className="profile-stats">
            <div className="stat-item">
              <Briefcase className="w-5 h-5" />
              <span>{profileData.stats.projectsCount}</span>
              <label>Projects</label>
            </div>
            <div className="stat-item">
              <Rocket className="w-5 h-5" />
              <span>{profileData.stats.deploymentsCount}</span>
              <label>Deployments</label>
            </div>
            <div className="stat-item">
              <Code className="w-5 h-5" />
              <span>{profileData.stats.skillsCount}</span>
              <label>Skills</label>
            </div>
            <div className="stat-item">
              <Users className="w-5 h-5" />
              <span>{profileData.stats.collaborationsCount}</span>
              <label>Collaborations</label>
            </div>
          </div>
        </div>
        
        <div className="skills-section">
          <h3>Skills & Technologies</h3>
          <div className="skills-grid">
            {profileData.skills.map((skill, index) => (
              <div key={index} className="skill-card">
                <div className="skill-header">
                  <span className="skill-name">{skill.name}</span>
                  <span className={`skill-level ${getSkillLevelColor(skill.level)}`}>
                    {skill.level}
                  </span>
                </div>
                <span className={`skill-category ${getSkillCategoryColor(skill.category)}`}>
                  {skill.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="projects-section">
        <h3>Projects</h3>
        <div className="projects-grid">
          {profileData.projects.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <h4>{project.name}</h4>
                {project.featured && <Star className="w-4 h-4 featured" />}
              </div>
              <p>{project.description}</p>
              <div className="project-tech">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="tech-tag">{tech}</span>
                ))}
              </div>
              <div className="project-links">
                {project.deployedUrl && (
                  <a href={project.deployedUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                    <ExternalLink className="w-3 h-3" />
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                    <Github className="w-3 h-3" />
                    Code
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEditProfile = () => (
    <div className="edit-profile">
      <div className="edit-header">
        <h2>Edit Profile</h2>
        <div className="edit-actions">
          <button onClick={() => setIsEditing(false)} className="btn btn-secondary">
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button onClick={handleSaveProfile} className="btn btn-primary">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
      
      <div className="edit-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label>Bio / Introduction</label>
            <textarea
              placeholder="Tell us about yourself..."
              rows={4}
              value={editData.bio}
              onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={editData.phone}
                onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="City, Country"
              value={editData.location}
              onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>Social Links</h3>
          <div className="form-row">
            <div className="form-group">
              <label>GitHub</label>
              <input
                type="url"
                placeholder="https://github.com/username"
                value={editData.githubUrl}
                onChange={(e) => setEditData(prev => ({ ...prev, githubUrl: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>LinkedIn</label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={editData.linkedinUrl}
                onChange={(e) => setEditData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Personal Website</label>
            <input
              type="url"
              placeholder="https://yourwebsite.com"
              value={editData.websiteUrl}
              onChange={(e) => setEditData(prev => ({ ...prev, websiteUrl: e.target.value }))}
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>Skills & Technologies</h3>
          <div className="skills-manager">
            <div className="current-skills">
              {editData.skills.map((skill, index) => (
                <div key={index} className="skill-item">
                  <span className="skill-name">{skill.name}</span>
                  <span className={`skill-level ${getSkillLevelColor(skill.level)}`}>
                    {skill.level}
                  </span>
                  <button onClick={() => handleRemoveSkill(skill.name)} className="remove-skill">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="add-skill">
              <div className="skill-input-group">
                <input
                  type="text"
                  placeholder="Add new skill..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      handleAddSkill(e.target.value.trim());
                      e.target.value = '';
                    }
                  }}
                />
                <select onChange={(e) => {
                  const input = e.target.previousElementSibling;
                  if (input.value.trim()) {
                    handleAddSkill(input.value.trim(), e.target.value);
                    input.value = '';
                  }
                }}>
                  <option value="">Level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              
              <div className="quick-skills">
                <span className="quick-skills-label">Quick add:</span>
                {['React', 'Node.js', 'Python', 'TypeScript', 'Docker', 'AWS'].map(skill => (
                  <button
                    key={skill}
                    onClick={() => handleAddSkill(skill)}
                    className="quick-skill-btn"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBrowseProfiles = () => (
    <div className="browse-container">
      <div className="browse-header">
        <h1>Browse Student Portfolios</h1>
        <p>Discover talented students and their projects</p>
      </div>
      
      <div className="browse-controls">
        <div className="search-filter">
          <div className="search-bar">
            <Search className="w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-dropdown">
            <Filter className="w-4 h-4" />
            <select value={filterSkills} onChange={(e) => setFilterSkills(e.target.value)}>
              <option value="all">All Skills</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="fullstack">Full Stack</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="profiles-grid">
        {otherProfiles
          .filter(profile => 
            profile.visibility === 'public' && 
            (profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             profile.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
          )
          .map(profile => (
            <div key={profile.id} className="profile-card-browse">
              <div className="browse-profile-header">
                <img src={profile.avatar} alt={profile.name} />
                <div className="profile-info">
                  <h3>{profile.name}</h3>
                  <p>{profile.bio}</p>
                </div>
                {profile.featured && <Star className="w-4 h-4 featured" />}
              </div>
              
              <div className="profile-stats-browse">
                <div className="stat">
                  <Briefcase className="w-4 h-4" />
                  <span>{profile.projectsCount}</span>
                  <label>Projects</label>
                </div>
                <div className="stat">
                  <Rocket className="w-4 h-4" />
                  <span>{profile.deploymentsCount}</span>
                  <label>Deployments</label>
                </div>
              </div>
              
              <div className="profile-skills">
                {profile.skills.slice(0, 4).map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
                {profile.skills.length > 4 && (
                  <span className="skill-tag more">+{profile.skills.length - 4}</span>
                )}
              </div>
              
              <button onClick={() => handleViewProfile(profile)} className="btn btn-secondary">
                <Eye className="w-4 h-4" />
                View Profile
              </button>
            </div>
          ))}
      </div>
    </div>
  );

  const renderHighlights = () => (
    <div className="highlights-container">
      <div className="highlights-header">
        <h1>Student Highlights</h1>
        <p>Featured student portfolios and exceptional work</p>
      </div>
      
      <div className="highlights-grid">
        {otherProfiles
          .filter(profile => profile.featured && profile.visibility === 'public')
          .map(profile => (
            <div key={profile.id} className="highlight-card">
              <div className="highlight-badge">
                <Award className="w-4 h-4" />
                Featured
              </div>
              
              <div className="highlight-content">
                <img src={profile.avatar} alt={profile.name} />
                <h3>{profile.name}</h3>
                <p>{profile.bio}</p>
                
                <div className="highlight-stats">
                  <div className="highlight-stat">
                    <Briefcase className="w-4 h-4" />
                    <span>{profile.projectsCount} Projects</span>
                  </div>
                  <div className="highlight-stat">
                    <Rocket className="w-4 h-4" />
                    <span>{profile.deploymentsCount} Deployments</span>
                  </div>
                </div>
                
                <div className="highlight-skills">
                  {profile.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
                
                <button onClick={() => handleViewProfile(profile)} className="btn btn-primary">
                  <Eye className="w-4 h-4" />
                  View Full Profile
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const renderShareModal = () => (
    <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Share Your Profile</h2>
          <button onClick={() => setShowShareModal(false)} className="modal-close">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="share-options">
            <div className="share-link">
              <label>Profile Link</label>
              <div className="link-input">
                <input
                  type="text"
                  value={`${window.location.origin}/portfolio/${profileData.name.toLowerCase().replace(/\s+/g, '-')}`}
                  readOnly
                />
                <button onClick={handleShareProfile} className="copy-btn">
                  {copiedLink ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedLink ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            
            <div className="share-settings">
              <label>Visibility</label>
              <div className="visibility-options">
                <button
                  onClick={() => setVisibilityMode('public')}
                  className={`visibility-option ${visibilityMode === 'public' ? 'active' : ''}`}
                >
                  <Eye className="w-4 h-4" />
                  <div>
                    <strong>Public</strong>
                    <span>Visible to everyone</span>
                  </div>
                </button>
                <button
                  onClick={() => setVisibilityMode('private')}
                  className={`visibility-option ${visibilityMode === 'private' ? 'active' : ''}`}
                >
                  <EyeOff className="w-4 h-4" />
                  <div>
                    <strong>Private</strong>
                    <span>Only visible to you and admins</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreviewModal = () => {
    if (!selectedProfile) return null;
    
    return (
      <div className="modal-overlay" onClick={() => setShowPreviewModal(false)}>
        <div className="modal-container preview-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{selectedProfile.name}'s Portfolio</h2>
            <button onClick={() => setShowPreviewModal(false)} className="modal-close">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="modal-content">
            <div className="preview-content">
              <div className="preview-header">
                <img src={selectedProfile.avatar} alt={selectedProfile.name} />
                <div className="preview-info">
                  <h3>{selectedProfile.name}</h3>
                  <p>{selectedProfile.bio}</p>
                  
                  <div className="preview-stats">
                    <div className="stat">
                      <Briefcase className="w-4 h-4" />
                      <span>{selectedProfile.projectsCount}</span>
                      <label>Projects</label>
                    </div>
                    <div className="stat">
                      <Rocket className="w-4 h-4" />
                      <span>{selectedProfile.deploymentsCount}</span>
                      <label>Deployments</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="preview-skills">
                <h4>Skills</h4>
                <div className="skills-list">
                  {selectedProfile.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="portfolio-profiles-container">
        <div className="profiles-nav">
          <button 
            className={`nav-btn ${viewMode === 'my-profile' ? 'active' : ''}`}
            onClick={() => setViewMode('my-profile')}
          >
            <User className="w-4 h-4" />
            My Profile
          </button>
          <button 
            className={`nav-btn ${viewMode === 'browse' ? 'active' : ''}`}
            onClick={() => setViewMode('browse')}
          >
            <Eye className="w-4 h-4" />
            Browse
          </button>
          {isAdmin && (
            <button 
              className={`nav-btn ${viewMode === 'highlights' ? 'active' : ''}`}
              onClick={() => setViewMode('highlights')}
            >
              <Star className="w-4 h-4" />
              Highlights
            </button>
          )}
        </div>
        
        <div className="profiles-content">
          {viewMode === 'my-profile' && renderMyProfile()}
          {viewMode === 'browse' && renderBrowseProfiles()}
          {viewMode === 'highlights' && renderHighlights()}
        </div>
      </div>
      
      {showShareModal && renderShareModal()}
      {showPreviewModal && renderPreviewModal()}
    </>
  );
};

export default PortfolioProfiles;
