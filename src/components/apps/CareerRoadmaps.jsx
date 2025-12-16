import React, { useState, useEffect } from 'react';
import { 
  Map, 
  Target, 
  BookOpen, 
  Briefcase, 
  Code, 
  Database, 
  Shield, 
  Smartphone, 
  Brain, 
  BarChart, 
  Globe, 
  Users, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Circle, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  ExternalLink, 
  Clock, 
  Star, 
  TrendingUp, 
  Award, 
  Play, 
  FileText, 
  Link, 
  FolderOpen, 
  Tag, 
  Calendar, 
  User, 
  Search, 
  Filter, 
  X, 
  Save, 
  Eye, 
  EyeOff,
  GitBranch,
  Layers,
  Navigation,
  Compass,
  Route,
  Zap,
  Cpu,
  Cloud,
  Lock,
  Unlock
} from 'lucide-react';
import './CareerRoadmaps.css';

const CareerRoadmaps = ({ onClose, user, isAdmin = false }) => {
  const [viewMode, setViewMode] = useState('browse'); // browse, my-progress, admin
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [expandedStages, setExpandedStages] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRoadmap, setEditingRoadmap] = useState(null);
  const [roadmaps, setRoadmaps] = useState([]);
  const [userProgress, setUserProgress] = useState({});

  // Sample data - in real app this would come from API
  useEffect(() => {
    setRoadmaps([
      {
        id: 1,
        title: 'Frontend Developer',
        description: 'Build modern, responsive user interfaces and web applications',
        category: 'development',
        difficulty: 'beginner',
        duration: '6-12 months',
        icon: 'Code',
        color: '#3b82f6',
        stages: [
          {
            id: 1,
            title: 'Foundation',
            description: 'Learn the basics of web development',
            duration: '2-3 months',
            steps: [
              {
                id: 1,
                title: 'HTML & CSS Fundamentals',
                description: 'Master the building blocks of web pages',
                type: 'learning',
                duration: '4 weeks',
                resources: [
                  { title: 'HTML Basics', type: 'learn-topic', id: 'html-basics' },
                  { title: 'CSS Styling', type: 'learn-topic', id: 'css-styling' },
                  { title: 'Responsive Design', type: 'learn-topic', id: 'responsive-design' }
                ],
                projects: [
                  { title: 'Personal Portfolio', type: 'project-template', id: 'portfolio-template' }
                ]
              },
              {
                id: 2,
                title: 'JavaScript Essentials',
                description: 'Learn programming fundamentals with JavaScript',
                type: 'learning',
                duration: '6 weeks',
                resources: [
                  { title: 'JavaScript Basics', type: 'learn-topic', id: 'js-basics' },
                  { title: 'DOM Manipulation', type: 'learn-topic', id: 'dom-manipulation' },
                  { title: 'Async JavaScript', type: 'learn-topic', id: 'async-js' }
                ],
                projects: [
                  { title: 'Interactive To-Do List', type: 'project-template', id: 'todo-template' }
                ]
              }
            ]
          },
          {
            id: 2,
            title: 'Modern Frameworks',
            description: 'Master React and modern frontend tools',
            duration: '3-4 months',
            steps: [
              {
                id: 3,
                title: 'React Fundamentals',
                description: 'Learn component-based development with React',
                type: 'learning',
                duration: '6 weeks',
                resources: [
                  { title: 'React Components', type: 'learn-topic', id: 'react-components' },
                  { title: 'State Management', type: 'learn-topic', id: 'state-management' },
                  { title: 'React Hooks', type: 'learn-topic', id: 'react-hooks' }
                ],
                projects: [
                  { title: 'Weather App', type: 'project-template', id: 'weather-template' }
                ]
              },
              {
                id: 4,
                title: 'Advanced React & Tools',
                description: 'Master advanced concepts and development tools',
                type: 'learning',
                duration: '4 weeks',
                resources: [
                  { title: 'React Router', type: 'learn-topic', id: 'react-router' },
                  { title: 'Testing React Apps', type: 'learn-topic', id: 'react-testing' },
                  { title: 'Performance Optimization', type: 'learn-topic', id: 'react-performance' }
                ],
                projects: [
                  { title: 'E-commerce Site', type: 'project-template', id: 'ecommerce-template' }
                ]
              }
            ]
          },
          {
            id: 3,
            title: 'Professional Skills',
            description: 'Develop production-ready applications',
            duration: '2-3 months',
            steps: [
              {
                id: 5,
                title: 'State Management & Architecture',
                description: 'Learn advanced state management and application architecture',
                type: 'learning',
                duration: '4 weeks',
                resources: [
                  { title: 'Redux Toolkit', type: 'learn-topic', id: 'redux-toolkit' },
                  { title: 'Application Architecture', type: 'learn-topic', id: 'app-architecture' },
                  { title: 'Performance Monitoring', type: 'learn-topic', id: 'performance-monitoring' }
                ],
                projects: [
                  { title: 'Social Media Dashboard', type: 'project-template', id: 'dashboard-template' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 2,
        title: 'Backend Developer',
        description: 'Build server-side applications and APIs',
        category: 'development',
        difficulty: 'intermediate',
        duration: '8-14 months',
        icon: 'Database',
        color: '#10b981',
        stages: [
          {
            id: 1,
            title: 'Server Fundamentals',
            description: 'Learn server-side programming basics',
            duration: '3-4 months',
            steps: [
              {
                id: 6,
                title: 'Node.js & Express',
                description: 'Build RESTful APIs with Node.js',
                type: 'learning',
                duration: '8 weeks',
                resources: [
                  { title: 'Node.js Basics', type: 'learn-topic', id: 'nodejs-basics' },
                  { title: 'Express Framework', type: 'learn-topic', id: 'express-framework' },
                  { title: 'REST APIs', type: 'learn-topic', id: 'rest-apis' }
                ],
                projects: [
                  { title: 'Blog API', type: 'project-template', id: 'blog-api-template' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 3,
        title: 'Full-Stack Developer',
        description: 'Master both frontend and backend development',
        category: 'development',
        difficulty: 'advanced',
        duration: '12-18 months',
        icon: 'Layers',
        color: '#8b5cf6',
        stages: [
          {
            id: 1,
            title: 'Full Stack Foundation',
            description: 'Combine frontend and backend skills',
            duration: '4-6 months',
            steps: [
              {
                id: 7,
                title: 'MERN Stack Development',
                description: 'Build complete applications with MongoDB, Express, React, Node.js',
                type: 'learning',
                duration: '12 weeks',
                resources: [
                  { title: 'MongoDB Basics', type: 'learn-topic', id: 'mongodb-basics' },
                  { title: 'Full Stack Integration', type: 'learn-topic', id: 'fullstack-integration' },
                  { title: 'Authentication & Security', type: 'learn-topic', id: 'auth-security' }
                ],
                projects: [
                  { title: 'Task Management System', type: 'project-template', id: 'task-system-template' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 4,
        title: 'AI/ML Engineer',
        description: 'Build intelligent systems and machine learning models',
        category: 'ai-ml',
        difficulty: 'advanced',
        duration: '18-24 months',
        icon: 'Brain',
        color: '#f59e0b',
        stages: [
          {
            id: 1,
            title: 'Machine Learning Basics',
            description: 'Introduction to ML and data science',
            duration: '6-8 months',
            steps: [
              {
                id: 8,
                title: 'Python for Data Science',
                description: 'Learn Python libraries for data analysis',
                type: 'learning',
                duration: '8 weeks',
                resources: [
                  { title: 'Python Basics', type: 'learn-topic', id: 'python-basics' },
                  { title: 'NumPy & Pandas', type: 'learn-topic', id: 'numpy-pandas' },
                  { title: 'Data Visualization', type: 'learn-topic', id: 'data-viz' }
                ],
                projects: [
                  { title: 'Data Analysis Project', type: 'project-template', id: 'data-analysis-template' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 5,
        title: 'Data Analyst',
        description: 'Analyze data and provide business insights',
        category: 'data',
        difficulty: 'intermediate',
        duration: '6-12 months',
        icon: 'BarChart',
        color: '#ef4444',
        stages: [
          {
            id: 1,
            title: 'Data Analysis Fundamentals',
            description: 'Learn data analysis techniques and tools',
            duration: '3-4 months',
            steps: [
              {
                id: 9,
                title: 'SQL & Data Warehousing',
                description: 'Master SQL and database concepts',
                type: 'learning',
                duration: '6 weeks',
                resources: [
                  { title: 'SQL Fundamentals', type: 'learn-topic', id: 'sql-fundamentals' },
                  { title: 'Database Design', type: 'learn-topic', id: 'database-design' },
                  { title: 'Data Warehousing', type: 'learn-topic', id: 'data-warehousing' }
                ],
                projects: [
                  { title: 'Sales Dashboard', type: 'project-template', id: 'sales-dashboard-template' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 6,
        title: 'Cybersecurity',
        description: 'Protect systems and networks from digital attacks',
        category: 'security',
        difficulty: 'advanced',
        duration: '12-18 months',
        icon: 'Shield',
        color: '#6366f1',
        stages: [
          {
            id: 1,
            title: 'Security Fundamentals',
            description: 'Learn cybersecurity basics and best practices',
            duration: '4-6 months',
            steps: [
              {
                id: 10,
                title: 'Network Security',
                description: 'Understand network security protocols and threats',
                type: 'learning',
                duration: '8 weeks',
                resources: [
                  { title: 'Network Basics', type: 'learn-topic', id: 'network-basics' },
                  { title: 'Security Protocols', type: 'learn-topic', id: 'security-protocols' },
                  { title: 'Threat Analysis', type: 'learn-topic', id: 'threat-analysis' }
                ],
                projects: [
                  { title: 'Security Audit Tool', type: 'project-template', id: 'security-audit-template' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 7,
        title: 'Mobile App Developer',
        description: 'Build native and cross-platform mobile applications',
        category: 'mobile',
        difficulty: 'intermediate',
        duration: '8-14 months',
        icon: 'Smartphone',
        color: '#22c55e',
        stages: [
          {
            id: 1,
            title: 'Mobile Development Basics',
            description: 'Learn mobile app development fundamentals',
            duration: '4-6 months',
            steps: [
              {
                id: 11,
                title: 'React Native',
                description: 'Build cross-platform mobile apps with React Native',
                type: 'learning',
                duration: '10 weeks',
                resources: [
                  { title: 'React Native Basics', type: 'learn-topic', id: 'rn-basics' },
                  { title: 'Mobile UI/UX', type: 'learn-topic', id: 'mobile-ui' },
                  { title: 'App Deployment', type: 'learn-topic', id: 'app-deployment' }
                ],
                projects: [
                  { title: 'Weather Mobile App', type: 'project-template', id: 'weather-mobile-template' }
                ]
              }
            ]
          }
        ]
      }
    ]);

    // Initialize user progress
    setUserProgress({
      'frontend': {
        trackId: 1,
        completedSteps: [1, 2],
        currentStage: 2,
        startedAt: '2024-01-15',
        lastActivity: '2024-01-22'
      }
    });

    setCompletedSteps([1, 2]);
  }, []);

  const filteredRoadmaps = roadmaps.filter(roadmap => {
    const matchesSearch = roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         roadmap.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || roadmap.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getIconComponent = (iconName) => {
    const icons = {
      Code, Database, Layers, Brain, BarChart, Shield, Smartphone, Globe, Users, Settings
    };
    return icons[iconName] || Code;
  };

  const toggleStageExpansion = (trackId, stageId) => {
    const key = `${trackId}-${stageId}`;
    setExpandedStages(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleStepCompletion = (stepId) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const handleStartTrack = (trackId) => {
    const track = roadmaps.find(r => r.id === trackId);
    setSelectedTrack(track);
    setViewMode('my-progress');
  };

  const handleViewTrack = (track) => {
    setSelectedTrack(track);
  };

  const getStepProgress = (trackId) => {
    const track = roadmaps.find(r => r.id === trackId);
    if (!track) return 0;
    
    const totalSteps = track.stages.flatMap(stage => stage.steps).length;
    const completed = completedSteps.filter(stepId => 
      track.stages.flatMap(stage => stage.steps).some(step => step.id === stepId)
    ).length;
    
    return totalSteps > 0 ? (completed / totalSteps) * 100 : 0;
  };

  const renderBrowseView = () => (
    <div className="roadmaps-browse">
      <div className="browse-header">
        <h1>Career Path Roadmaps</h1>
        <p>Choose your learning path and follow structured roadmaps to achieve your career goals</p>
      </div>

      <div className="browse-controls">
        <div className="search-filter">
          <div className="search-bar">
            <Search className="w-5 h-5" />
            <input
              type="text"
              placeholder="Search career tracks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="category-filter">
            <Filter className="w-4 h-4" />
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="development">Development</option>
              <option value="ai-ml">AI/ML</option>
              <option value="data">Data</option>
              <option value="security">Security</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>
        </div>
        
        {isAdmin && (
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Create Roadmap
          </button>
        )}
      </div>

      <div className="roadmaps-grid">
        {filteredRoadmaps.map(roadmap => (
          <div key={roadmap.id} className="roadmap-card">
            <div className="roadmap-header">
              <div className="roadmap-icon" style={{ backgroundColor: roadmap.color }}>
                {React.createElement(getIconComponent(roadmap.icon), { className: "w-6 h-6" })}
              </div>
              <div className="roadmap-info">
                <h3>{roadmap.title}</h3>
                <p>{roadmap.description}</p>
                <div className="roadmap-meta">
                  <span className="difficulty">{roadmap.difficulty}</span>
                  <span className="duration">{roadmap.duration}</span>
                  <span className="stages">{roadmap.stages.length} stages</span>
                </div>
              </div>
            </div>
            
            <div className="roadmap-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${getStepProgress(roadmap.id)}%` }}
                />
              </div>
              <span className="progress-text">{Math.round(getStepProgress(roadmap.id))}% complete</span>
            </div>
            
            <div className="roadmap-actions">
              <button onClick={() => handleViewTrack(roadmap)} className="btn btn-secondary">
                <Eye className="w-4 h-4" />
                View Details
              </button>
              <button onClick={() => handleStartTrack(roadmap.id)} className="btn btn-primary">
                <Play className="w-4 h-4" />
                Start Track
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTrackDetails = () => {
    if (!selectedTrack) return null;

    return (
      <div className="track-details">
        <div className="track-header">
          <button onClick={() => setSelectedTrack(null)} className="back-btn">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Roadmaps
          </button>
          
          <div className="track-info">
            <div className="track-icon" style={{ backgroundColor: selectedTrack.color }}>
              {React.createElement(getIconComponent(selectedTrack.icon), { className: "w-8 h-8" })}
            </div>
            <div className="track-details">
              <h1>{selectedTrack.title}</h1>
              <p>{selectedTrack.description}</p>
              <div className="track-meta">
                <span className="difficulty">{selectedTrack.difficulty}</span>
                <span className="duration">{selectedTrack.duration}</span>
                <span className="stages">{selectedTrack.stages.length} stages</span>
              </div>
            </div>
          </div>
        </div>

        <div className="stages-container">
          {selectedTrack.stages.map((stage, stageIndex) => {
            const isExpanded = expandedStages[`${selectedTrack.id}-${stage.id}`];
            const stageSteps = stage.steps;
            const completedStageSteps = stageSteps.filter(step => completedSteps.includes(step.id));
            const stageProgress = stageSteps.length > 0 ? (completedStageSteps.length / stageSteps.length) * 100 : 0;

            return (
              <div key={stage.id} className="stage-card">
                <div 
                  className="stage-header"
                  onClick={() => toggleStageExpansion(selectedTrack.id, stage.id)}
                >
                  <div className="stage-info">
                    <h3>Stage {stageIndex + 1}: {stage.title}</h3>
                    <p>{stage.description}</p>
                    <div className="stage-meta">
                      <span className="duration">{stage.duration}</span>
                      <span className="steps-count">{stageSteps.length} steps</span>
                    </div>
                  </div>
                  
                  <div className="stage-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${stageProgress}%` }}
                      />
                    </div>
                    <span className="progress-text">{Math.round(stageProgress)}%</span>
                  </div>
                  
                  <div className="stage-toggle">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="steps-container">
                    {stageSteps.map((step, stepIndex) => {
                      const isCompleted = completedSteps.includes(step.id);
                      
                      return (
                        <div key={step.id} className={`step-card ${isCompleted ? 'completed' : ''}`}>
                          <div className="step-header">
                            <button 
                              onClick={() => toggleStepCompletion(step.id)}
                              className="step-checkbox"
                            >
                              {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                            </button>
                            
                            <div className="step-info">
                              <h4>Step {stepIndex + 1}: {step.title}</h4>
                              <p>{step.description}</p>
                              <div className="step-meta">
                                <span className="type">{step.type}</span>
                                <span className="duration">{step.duration}</span>
                              </div>
                            </div>
                            
                            <div className="step-actions">
                              {step.resources.length > 0 && (
                                <button className="btn btn-outline">
                                  <BookOpen className="w-4 h-4" />
                                  Learning Resources
                                </button>
                              )}
                              {step.projects.length > 0 && (
                                <button className="btn btn-outline">
                                  <Briefcase className="w-4 h-4" />
                                  Projects
                                </button>
                              )}
                            </div>
                          </div>

                          {(step.resources.length > 0 || step.projects.length > 0) && (
                            <div className="step-content">
                              {step.resources.length > 0 && (
                                <div className="resources-section">
                                  <h5>Learning Resources</h5>
                                  <div className="resources-list">
                                    {step.resources.map((resource, index) => (
                                      <div key={index} className="resource-item">
                                        <BookOpen className="w-4 h-4" />
                                        <span>{resource.title}</span>
                                        <ExternalLink className="w-3 h-3" />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {step.projects.length > 0 && (
                                <div className="projects-section">
                                  <h5>Recommended Projects</h5>
                                  <div className="projects-list">
                                    {step.projects.map((project, index) => (
                                      <div key={index} className="project-item">
                                        <Briefcase className="w-4 h-4" />
                                        <span>{project.title}</span>
                                        <ExternalLink className="w-3 h-3" />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMyProgress = () => (
    <div className="my-progress">
      <div className="progress-header">
        <h1>My Learning Progress</h1>
        <p>Track your journey through different career paths</p>
      </div>

      <div className="active-tracks">
        <h2>Active Learning Tracks</h2>
        <div className="tracks-grid">
          {Object.values(userProgress).map(progress => {
            const track = roadmaps.find(r => r.id === progress.trackId);
            if (!track) return null;

            return (
              <div key={progress.trackId} className="progress-card">
                <div className="progress-card-header">
                  <div className="track-icon" style={{ backgroundColor: track.color }}>
                    {React.createElement(getIconComponent(track.icon), { className: "w-6 h-6" })}
                  </div>
                  <div className="track-info">
                    <h3>{track.title}</h3>
                    <p>Started: {new Date(progress.startedAt).toLocaleDateString()}</p>
                    <p>Last Activity: {new Date(progress.lastActivity).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="progress-overview">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${getStepProgress(progress.trackId)}%` }}
                    />
                  </div>
                  <span className="progress-text">{Math.round(getStepProgress(progress.trackId))}% complete</span>
                </div>
                
                <div className="progress-stats">
                  <div className="stat">
                    <CheckCircle className="w-4 h-4" />
                    <span>{completedSteps.length} steps completed</span>
                  </div>
                  <div className="stat">
                    <Target className="w-4 h-4" />
                    <span>Current Stage: {progress.currentStage}</span>
                  </div>
                </div>
                
                <button onClick={() => handleViewTrack(track)} className="btn btn-primary">
                  <Eye className="w-4 h-4" />
                  Continue Learning
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="completed-steps">
        <h2>Recently Completed</h2>
        <div className="completed-list">
          {completedSteps.slice(-5).reverse().map(stepId => {
            // Find the step from all roadmaps
            let step = null;
            let track = null;
            
            for (const roadmap of roadmaps) {
              for (const stage of roadmap.stages) {
                const foundStep = stage.steps.find(s => s.id === stepId);
                if (foundStep) {
                  step = foundStep;
                  track = roadmap;
                  break;
                }
              }
              if (step) break;
            }
            
            if (!step) return null;
            
            return (
              <div key={stepId} className="completed-item">
                <CheckCircle className="w-4 h-4 completed" />
                <div className="completed-content">
                  <h4>{step.title}</h4>
                  <p>{track.title}</p>
                </div>
                <span className="completion-date">Completed recently</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderAdminView = () => (
    <div className="admin-view">
      <div className="admin-header">
        <h1>Roadmap Management</h1>
        <p>Create and manage career path roadmaps</p>
      </div>

      <div className="admin-actions">
        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Create New Roadmap
        </button>
      </div>

      <div className="roadmaps-management">
        <h2>Manage Roadmaps</h2>
        <div className="roadmaps-list">
          {roadmaps.map(roadmap => (
            <div key={roadmap.id} className="roadmap-management-card">
              <div className="roadmap-header">
                <div className="roadmap-icon" style={{ backgroundColor: roadmap.color }}>
                  {React.createElement(getIconComponent(roadmap.icon), { className: "w-6 h-6" })}
                </div>
                <div className="roadmap-info">
                  <h3>{roadmap.title}</h3>
                  <p>{roadmap.description}</p>
                  <div className="roadmap-meta">
                    <span className="category">{roadmap.category}</span>
                    <span className="difficulty">{roadmap.difficulty}</span>
                    <span className="stages">{roadmap.stages.length} stages</span>
                  </div>
                </div>
              </div>
              
              <div className="roadmap-stats">
                <div className="stat">
                  <Users className="w-4 h-4" />
                  <span>0 enrolled</span>
                </div>
                <div className="stat">
                  <TrendingUp className="w-4 h-4" />
                  <span>0% avg completion</span>
                </div>
              </div>
              
              <div className="roadmap-management-actions">
                <button onClick={() => {
                  setEditingRoadmap(roadmap);
                  setShowCreateModal(true);
                }} className="btn btn-secondary">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="btn btn-outline">
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button className="btn btn-danger">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCreateModal = () => (
    <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingRoadmap ? 'Edit Roadmap' : 'Create New Roadmap'}</h2>
          <button onClick={() => {
            setShowCreateModal(false);
            setEditingRoadmap(null);
          }} className="modal-close">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label>Roadmap Title</label>
              <input
                type="text"
                placeholder="e.g., Frontend Developer"
                defaultValue={editingRoadmap?.title || ''}
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Describe the career path and what students will learn..."
                rows={3}
                defaultValue={editingRoadmap?.description || ''}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select defaultValue={editingRoadmap?.category || ''}>
                  <option value="">Select category</option>
                  <option value="development">Development</option>
                  <option value="ai-ml">AI/ML</option>
                  <option value="data">Data</option>
                  <option value="security">Security</option>
                  <option value="mobile">Mobile</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Difficulty</label>
                <select defaultValue={editingRoadmap?.difficulty || ''}>
                  <option value="">Select difficulty</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  placeholder="e.g., 6-12 months"
                  defaultValue={editingRoadmap?.duration || ''}
                />
              </div>
              
              <div className="form-group">
                <label>Icon</label>
                <select defaultValue={editingRoadmap?.icon || 'Code'}>
                  <option value="Code">Code</option>
                  <option value="Database">Database</option>
                  <option value="Layers">Layers</option>
                  <option value="Brain">Brain</option>
                  <option value="BarChart">BarChart</option>
                  <option value="Shield">Shield</option>
                  <option value="Smartphone">Smartphone</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Stages & Steps</h3>
            <div className="stages-editor">
              <div className="stage-item">
                <div className="stage-header">
                  <h4>Stage 1: Foundation</h4>
                  <button className="btn btn-outline">
                    <Plus className="w-3 h-3" />
                    Add Step
                  </button>
                </div>
                <div className="steps-editor">
                  <div className="step-item">
                    <input type="text" placeholder="Step title" />
                    <textarea placeholder="Step description" rows={2} />
                    <div className="step-meta">
                      <input type="text" placeholder="Duration" />
                      <select>
                        <option value="learning">Learning</option>
                        <option value="project">Project</option>
                        <option value="assessment">Assessment</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <button className="btn btn-outline">
              <Plus className="w-4 h-4" />
              Add Stage
            </button>
          </div>
        </div>
        
        <div className="modal-footer">
          <button onClick={() => {
            setShowCreateModal(false);
            setEditingRoadmap(null);
          }} className="btn btn-secondary">
            Cancel
          </button>
          <button className="btn btn-primary">
            <Save className="w-4 h-4" />
            {editingRoadmap ? 'Update Roadmap' : 'Create Roadmap'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="career-roadmaps-container">
        <div className="roadmaps-nav">
          <button 
            className={`nav-btn ${viewMode === 'browse' ? 'active' : ''}`}
            onClick={() => setViewMode('browse')}
          >
            <Map className="w-4 h-4" />
            Browse Roadmaps
          </button>
          <button 
            className={`nav-btn ${viewMode === 'my-progress' ? 'active' : ''}`}
            onClick={() => setViewMode('my-progress')}
          >
            <TrendingUp className="w-4 h-4" />
            My Progress
          </button>
          {isAdmin && (
            <button 
              className={`nav-btn ${viewMode === 'admin' ? 'active' : ''}`}
              onClick={() => setViewMode('admin')}
            >
              <Settings className="w-4 h-4" />
              Manage
            </button>
          )}
        </div>
        
        <div className="roadmaps-content">
          {viewMode === 'browse' && !selectedTrack && renderBrowseView()}
          {selectedTrack && renderTrackDetails()}
          {viewMode === 'my-progress' && renderMyProgress()}
          {viewMode === 'admin' && renderAdminView()}
        </div>
      </div>
      
      {showCreateModal && renderCreateModal()}
    </>
  );
};

export default CareerRoadmaps;
