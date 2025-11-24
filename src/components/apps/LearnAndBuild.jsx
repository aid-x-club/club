import React, { useState, useEffect } from 'react';
import { BookOpen, Code, Terminal, Rocket, CheckCircle, Clock, Users, Play, Edit, Trash2, Plus, Search, Filter, ChevronRight, ArrowLeft, Star, Lock, Unlock } from 'lucide-react';
import './LearnAndBuild.css';

const LearnAndBuild = ({ onClose, user, isAdmin = false }) => {
  const [activeView, setActiveView] = useState('content'); // content only
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isEditMode, setIsEditMode] = useState(false);
  const [topics, setTopics] = useState([]);
  const [completedTopics, setCompletedTopics] = useState(new Set());

  // Sample data - in real app this would come from API
  useEffect(() => {
    setTopics([
      {
        id: 1,
        title: 'Git Fundamentals',
        category: 'version-control',
        difficulty: 'beginner',
        duration: '45 min',
        description: 'Learn the basics of Git version control',
        icon: <Terminal className="w-5 h-5" />,
        steps: [
          { title: 'Introduction to Git', content: 'Git is a distributed version control system...', type: 'text' },
          { title: 'Basic Commands', content: 'git init, git add, git commit...', commands: ['git init', 'git add .', 'git commit -m "Initial commit"'], type: 'commands' },
          { title: 'Branching', content: 'Understanding branches and merging...', type: 'text' },
          { title: 'Practice Exercise', content: 'Create your first repository...', type: 'exercise' }
        ],
        relatedProject: 'Personal Portfolio'
      },
      {
        id: 2,
        title: 'React Components',
        category: 'frontend',
        difficulty: 'intermediate',
        duration: '90 min',
        description: 'Master React components and props',
        icon: <Code className="w-5 h-5" />,
        steps: [
          { title: 'Component Basics', content: 'Understanding functional components...', type: 'text' },
          { title: 'Props and State', content: 'How to pass data and manage state...', type: 'text' },
          { title: 'Hooks Deep Dive', content: 'useState, useEffect, and custom hooks...', type: 'text' },
          { title: 'Build a Component', content: 'Create a reusable card component...', type: 'exercise' }
        ],
        relatedProject: 'Task Manager App'
      },
      {
        id: 3,
        title: 'Deployment Basics',
        category: 'devops',
        difficulty: 'intermediate',
        duration: '60 min',
        description: 'Deploy your applications to production',
        icon: <Rocket className="w-5 h-5" />,
        steps: [
          { title: 'Deployment Concepts', content: 'Understanding deployment pipelines...', type: 'text' },
          { title: 'Vercel Deployment', content: 'Deploy React apps to Vercel...', commands: ['npm run build', 'vercel --prod'], type: 'commands' },
          { title: 'Environment Variables', content: 'Managing environment variables...', type: 'text' },
          { title: 'Deploy Your App', content: 'Deploy your first application...', type: 'exercise' }
        ],
        relatedProject: 'Blog Platform'
      }
    ]);
  }, []);

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || topic.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  const handleMarkComplete = (topicId) => {
    const newCompleted = new Set(completedTopics);
    if (newCompleted.has(topicId)) {
      newCompleted.delete(topicId);
    } else {
      newCompleted.add(topicId);
    }
    setCompletedTopics(newCompleted);
  };

  const handleStartProject = (projectName) => {
    // Navigate to project creation or existing project
    console.log(`Starting project: ${projectName}`);
  };

  const renderTopicsList = () => (
    <div className="learn-build-container">
      <div className="learn-build-header">
        <div className="header-left">
          <div>
            <p>Master new skills and build amazing projects</p>
          </div>
        </div>
        
        {isAdmin && (
          <button onClick={() => setIsEditMode(!isEditMode)} className="edit-mode-btn">
            <Edit className="w-4 h-4" />
            {isEditMode ? 'Exit Edit' : 'Edit Mode'}
          </button>
        )}
      </div>

      <div className="content-controls">
        <div className="search-filter">
          <div className="search-bar">
            <Search className="w-5 h-5" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-dropdown">
            <Filter className="w-4 h-4" />
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="version-control">Version Control</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="devops">DevOps</option>
            </select>
          </div>
        </div>

              </div>

      <div className="content-grid">
        <div className="topics-grid">
          {filteredTopics.map(topic => (
              <div key={topic.id} className="topic-card">
                <div className="topic-header">
                  <div className="topic-icon">{topic.icon}</div>
                  <div className="topic-meta">
                    <span className={`difficulty ${topic.difficulty}`}>{topic.difficulty}</span>
                    <span className="duration"><Clock className="w-3 h-3" /> {topic.duration}</span>
                  </div>
                  {completedTopics.has(topic.id) && (
                    <div className="completed-badge">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                <div className="topic-content">
                  <h3>{topic.title}</h3>
                  <p>{topic.description}</p>
                  
                  <div className="topic-stats">
                    <span><BookOpen className="w-3 h-3" /> {topic.steps.length} steps</span>
                    {topic.relatedProject && (
                      <span><Code className="w-3 h-3" /> {topic.relatedProject}</span>
                    )}
                  </div>
                </div>

                <div className="topic-actions">
                  <button onClick={() => handleTopicClick(topic)} className="primary-btn">
                    Start Learning
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  
                  {isEditMode && (
                    <div className="edit-actions">
                      <button className="edit-btn"><Edit className="w-3 h-3" /></button>
                      <button className="delete-btn"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  )}
                  
                  {!isEditMode && (
                    <button 
                      onClick={() => handleMarkComplete(topic.id)}
                      className={`complete-btn ${completedTopics.has(topic.id) ? 'completed' : ''}`}
                    >
                      {completedTopics.has(topic.id) ? (
                        <><CheckCircle className="w-4 h-4" /> Completed</>
                      ) : (
                        <><Lock className="w-4 h-4" /> Mark Complete</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {isEditMode && (
              <div className="add-new-card">
                <Plus className="w-8 h-8" />
                <p>Add New Topic</p>
              </div>
            )}
          </div>
      </div>
    </div>
  );

  const renderContentView = () => {
    const content = selectedTopic;
    if (!content) return null;

    return (
      <div className="content-view">
        <div className="content-header">
          <button onClick={() => setSelectedTopic(null)} className="back-btn">
            <ArrowLeft className="w-5 h-5" />
            Back to Topics
          </button>
          
          <div className="content-title">
            <h2>{content.title}</h2>
            <p>{content.description}</p>
          </div>
        </div>

        <div className="content-body">
          {selectedTopic && (
            <div className="topic-content-view">
              <div className="steps-list">
                {content.steps.map((step, index) => (
                  <div key={index} className="step-card">
                    <div className="step-header">
                      <span className="step-number">{index + 1}</span>
                      <h3>{step.title}</h3>
                    </div>
                    
                    <div className="step-content">
                      {step.type === 'text' && (
                        <div className="text-content">
                          <p>{step.content}</p>
                        </div>
                      )}
                      
                      {step.type === 'commands' && (
                        <div className="commands-content">
                          <p>{step.content}</p>
                          <div className="commands-list">
                            {step.commands.map((cmd, cmdIndex) => (
                              <div key={cmdIndex} className="command-block">
                                <code>{cmd}</code>
                                <button className="copy-btn">Copy</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {step.type === 'exercise' && (
                        <div className="exercise-content">
                          <p>{step.content}</p>
                          <div className="exercise-actions">
                            <button className="start-exercise-btn">
                              <Play className="w-4 h-4" />
                              Start Exercise
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {content.relatedProject && (
                <div className="related-project">
                  <h3>Related Project</h3>
                  <div className="project-card">
                    <div className="project-info">
                      <h4>{content.relatedProject}</h4>
                      <p>Apply what you've learned by building this project</p>
                    </div>
                    <button 
                      onClick={() => handleStartProject(content.relatedProject)}
                      className="start-project-btn"
                    >
                      <Rocket className="w-4 h-4" />
                      Start Project
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return selectedTopic ? renderContentView() : renderTopicsList();
};

export default LearnAndBuild;
