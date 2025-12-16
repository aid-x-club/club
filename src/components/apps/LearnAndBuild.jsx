import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Code, 
  Terminal, 
  Rocket, 
  CheckCircle, 
  Clock, 
  Users, 
  Play, 
  PlayCircle,
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  ArrowLeft, 
  Star, 
  Lock, 
  Unlock,
  TrendingUp,
  Award,
  Calendar,
  BarChart3,
  User,
  Bell,
  Settings,
  Home,
  Target,
  MessageSquare,
  Crown,
  Video,
  DollarSign,
  ThumbsUp,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import './LearnAndBuild.css';

const LearnAndBuild = ({ onClose, user, isAdmin = false }) => {
  console.log('LearnAndBuild component mounted');
  
  const [activeNav, setActiveNav] = useState('dashboard');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [learningMode, setLearningMode] = useState('content'); // 'content' or 'video'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isEditMode, setIsEditMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userProgress, setUserProgress] = useState({
    completedCourses: 12,
    totalCourses: 25,
    weeklyWatchTime: 8.5,
    currentStreak: 7,
    achievements: 15,
    totalWatchTime: 156
  });
  const [topics, setTopics] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced sample data with courses and lessons
  useEffect(() => {
    // Lessons with YouTube videos
    setLessons([
      {
        id: 1,
        title: 'Introduction to React',
        category: 'frontend',
        description: 'Learn the basics of React programming',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: '15 min',
        addedBy: 'Sarah Johnson',
        addedDate: '2024-01-15',
        tags: ['react', 'javascript', 'frontend']
      },
      {
        id: 2,
        title: 'Git Fundamentals',
        category: 'version-control',
        description: 'Understanding Git version control basics',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: '20 min',
        addedBy: 'Mike Chen',
        addedDate: '2024-01-14',
        tags: ['git', 'version-control', 'development']
      },
      {
        id: 3,
        title: 'CSS Grid Layout',
        category: 'frontend',
        description: 'Master CSS Grid for modern layouts',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: '25 min',
        addedBy: 'Alex Kumar',
        addedDate: '2024-01-13',
        tags: ['css', 'grid', 'layout']
      }
    ]);

    // Comprehensive courses with content and video options
    setCourses([
      {
        id: 1,
        title: 'Git & GitHub Fundamentals',
        category: 'version-control',
        difficulty: 'beginner',
        duration: '8 hours',
        instructor: 'Mike Chen',
        rating: 4.9,
        students: 3456,
        price: 69.99,
        image: 'https://picsum.photos/seed/gitcourse/400/250',
        description: 'Complete guide to Git version control and GitHub collaboration',
        progress: 40,
        timeLeft: '4h 45min',
        topics: [
          {
            id: 1,
            title: 'Introduction to Version Control',
            content: {
              text: 'Version control is a system that records changes to a file or set of files over time so that you can recall specific versions later. Git is a distributed version control system, which means that every developer has a full copy of the entire project history on their local machine.',
              notes: `# Version Control Basics

## What is Version Control?
- System that tracks changes in files over time
- Allows collaboration among multiple developers
- Maintains history of all changes

## Why Use Version Control?
- **Backup**: Every change is recorded
- **Collaboration**: Multiple people can work together
- **Tracking**: Know who changed what and when
- **Recovery**: Go back to previous versions if needed`,
              codeExamples: [
                {
                  title: 'Basic Git Commands',
                  code: `# Initialize a new repository
git init

# Check status
git status

# Add files to staging
git add filename.txt
git add . # Add all files

# Commit changes
git commit -m "Your commit message"`
                }
              ]
            },
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: '45 min',
            completed: false
          },
          {
            id: 2,
            title: 'Basic Git Commands',
            content: {
              text: 'Learn the fundamental Git commands that you\'ll use every day. These commands form the foundation of your Git workflow and are essential for any developer working with version control.',
              notes: `# Basic Git Commands

## Essential Commands

### git init
Initializes a new Git repository in the current directory.

### git status
Shows the status of changes in the working directory.

### git add
Adds files to the staging area.

### git commit
Records changes to the repository.

### git push
Pushes changes to a remote repository.`,
              codeExamples: [
                {
                  title: 'Daily Git Workflow',
                  code: `# 1. Check current status
git status

# 2. Add changes
git add .

# 3. Commit with descriptive message
git commit -m "feat: Add user authentication feature"

# 4. Push to remote
git push origin main`
                }
              ]
            },
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: '60 min',
            completed: false
          },
          {
            id: 3,
            title: 'Working with Branches',
            content: {
              text: 'Branching is one of Git\'s most powerful features. Learn how to create, switch between, and merge branches to manage different features and fixes in your project.',
              notes: `# Git Branches

## What are Branches?
Branches are independent lines of development that diverge from the main codebase.

## Branch Commands

### Create a new branch
\`\`\`bash
git branch feature-name
\`\`\`

### Switch to a branch
\`\`\`bash
git checkout feature-name
\`\`\`

### Create and switch in one command
\`\`\`bash
git checkout -b feature-name
\`\`\``,
              codeExamples: [
                {
                  title: 'Branch Workflow',
                  code: `# Create and switch to new branch
git checkout -b feature/user-login

# Make changes and commit
git add .
git commit -m "Add login form"

# Switch back to main
git checkout main

# Merge the feature
git merge feature/user-login`
                }
              ]
            },
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: '90 min',
            completed: false
          }
        ]
      },
      {
        id: 2,
        title: 'React Development Mastery',
        category: 'frontend',
        difficulty: 'intermediate',
        duration: '12 hours',
        instructor: 'Sarah Johnson',
        rating: 4.8,
        students: 2341,
        price: 89.99,
        image: 'https://picsum.photos/seed/reactcourse/400/250',
        description: 'Master React from basics to advanced concepts including hooks and state management',
        progress: 25,
        timeLeft: '6h 30min',
        topics: [
          {
            id: 1,
            title: 'React Fundamentals',
            content: {
              text: 'React is a JavaScript library for building user interfaces. Learn the core concepts including components, props, and state.',
              notes: `# React Fundamentals

## What is React?
- JavaScript library for building UIs
- Created by Facebook
- Component-based architecture
- Virtual DOM for performance

## Key Concepts

### Components
Reusable building blocks that encapsulate HTML, CSS, and JavaScript.

### Props
Read-only data passed from parent to child components.

### State
Mutable data that can trigger re-renders when changed.`,
              codeExamples: [
                {
                  title: 'Functional Component',
                  code: `import React, { useState } from 'react';

function Welcome({ name }) {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default Welcome;`
                }
              ]
            },
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: '75 min',
            completed: false
          }
        ]
      }
    ]);
    setIsLoading(false);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'lessons', label: 'Lessons', icon: PlayCircle },
    { id: 'courses', label: 'Courses', icon: BookOpen },
  ];

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || lesson.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const inProgressCourses = courses.filter(course => course.progress > 0 && course.progress < 100);
  const recommendedCourses = courses.filter(course => course.progress === 0).slice(0, 3);

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

  const handleEnrollCourse = (courseId) => {
    // Handle course enrollment
    const course = topics.find(t => t.id === courseId);
    if (course) {
      setTopics(prev => prev.map(t => 
        t.id === courseId 
          ? { ...t, progress: 1, timeLeft: `${t.duration} left` }
          : t
      ));
    }
  };

  const handleCourseClick = (course) => {
    // Handle course card click - could navigate to course details
    setSelectedTopic(course);
    setActiveNav('lessons');
  };

  const handleNavClick = (navId) => {
    setActiveNav(navId);
    // Could add navigation logic here
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setUserProgress(prev => ({
        ...prev,
        weeklyWatchTime: prev.weeklyWatchTime + 0.1
      }));
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const renderSidebar = () => (
    <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="logo-text">Learn & Build</span>
        </div>
        <button 
          className="sidebar-toggle"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => handleNavClick(item.id)}
          >
            <item.icon className="w-5 h-5" />
            <span className="nav-label">{item.label}</span>
            {item.badge && (
              <span className="nav-badge">{item.badge}</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );

  const renderLessonsView = () => (
    <div className="lessons-container">
      <div className="section-header">
        <h2>Video Lessons</h2>
        {isAdmin && (
          <button className="add-lesson-btn">
            <Plus className="w-4 h-4" />
            Add Lesson
          </button>
        )}
      </div>
      
      <div className="lessons-grid">
        {filteredLessons.map(lesson => (
          <div key={lesson.id} className="lesson-card" onClick={() => setSelectedLesson(lesson)}>
            <div className="lesson-thumbnail">
              <div className="video-preview">
                <Video className="w-12 h-12" />
              </div>
              <span className="duration-badge">{lesson.duration}</span>
            </div>
            <div className="lesson-content">
              <h3>{lesson.title}</h3>
              <p>{lesson.description}</p>
              <div className="lesson-meta">
                <span className="added-by">Added by {lesson.addedBy}</span>
                <span className="added-date">{lesson.addedDate}</span>
              </div>
              <div className="lesson-tags">
                {lesson.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedLesson && (
        <div className="lesson-view-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedLesson.title}</h3>
              <button className="close-modal" onClick={() => setSelectedLesson(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="video-container">
              <iframe
                src={selectedLesson.videoUrl}
                title={selectedLesson.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="lesson-details">
              <p>{selectedLesson.description}</p>
              <div className="lesson-info">
                <span>Duration: {selectedLesson.duration}</span>
                <span>Added by: {selectedLesson.addedBy}</span>
                <span>Date: {selectedLesson.addedDate}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  const renderCoursesView = () => (
    <div className="courses-container">
      <div className="section-header">
        <h2>Courses</h2>
        {isAdmin && (
          <button className="add-course-btn">
            <Plus className="w-4 h-4" />
            Add Course
          </button>
        )}
      </div>
      
      <div className="courses-grid">
        {filteredCourses.map(course => (
          <div key={course.id} className="course-card" onClick={() => setSelectedCourse(course)}>
            <div className="course-image">
              <img src={course.image} alt={course.title} />
              <div className="course-overlay">
                <BookOpen className="w-8 h-8" />
              </div>
              {course.progress > 0 && (
                <div className="progress-badge">
                  {course.progress}%
                </div>
              )}
            </div>
            <div className="course-content">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="course-meta">
                <span className="instructor">{course.instructor}</span>
                <span className="rating">
                  <Star className="w-4 h-4" />
                  {course.rating}
                </span>
              </div>
              <div className="course-stats">
                <span className="duration">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </span>
                <span className="students">
                  <Users className="w-4 h-4" />
                  {course.students} students
                </span>
              </div>
              {course.progress > 0 && (
                <div className="course-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="progress-text">{course.progress}% Complete</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {selectedCourse && (
        <div className="course-view-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedCourse.title}</h3>
              <button className="close-modal" onClick={() => setSelectedCourse(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="learning-mode-selector">
              <button 
                className={`mode-btn ${learningMode === 'content' ? 'active' : ''}`}
                onClick={() => setLearningMode('content')}
              >
                <BookOpen className="w-4 h-4" />
                Content Learning
              </button>
              <button 
                className={`mode-btn ${learningMode === 'video' ? 'active' : ''}`}
                onClick={() => setLearningMode('video')}
              >
                <Video className="w-4 h-4" />
                Video Learning
              </button>
            </div>
            
            <div className="course-topics">
              {selectedCourse.topics.map(topic => (
                <div key={topic.id} className="topic-item">
                  <div className="topic-header">
                    <h4>{topic.title}</h4>
                    <span className="topic-duration">{topic.duration}</span>
                  </div>
                  
                  {learningMode === 'content' ? (
                    <div className="content-learning">
                      <div className="topic-text">
                        <p>{topic.content.text}</p>
                      </div>
                      
                      {topic.content.notes && (
                        <div className="topic-notes">
                          <h5>Notes</h5>
                          <pre className="notes-content">{topic.content.notes}</pre>
                        </div>
                      )}
                      
                      {topic.content.codeExamples && topic.content.codeExamples.map((example, idx) => (
                        <div key={idx} className="code-example">
                          <h6>{example.title}</h6>
                          <pre className="code-block">
                            <code>{example.code}</code>
                          </pre>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="video-learning">
                      <div className="video-container">
                        <iframe
                          src={topic.videoUrl}
                          title={topic.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
  const renderDashboard = () => (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Learning Center</h1>
          <div className="search-bar">
            <Search className="w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses and lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="header-right">
          <button className="notifications-btn">
            <Bell className="w-5 h-5" />
            <span className="notification-badge">3</span>
          </button>
          <div className="user-profile">
            <div className="user-avatar">
              <User className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="main-content">
          <section className="continue-learning">
            <h2>Continue Learning</h2>
            <div className="courses-grid">
              {inProgressCourses.map(course => (
                <div key={course.id} className="course-card in-progress" onClick={() => {setSelectedCourse(course); setActiveNav('courses');}}>
                  <div className="course-image">
                    <img src={course.image} alt={course.title} />
                    <div className="course-overlay">
                      <BookOpen className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="course-content">
                    <h3>{course.title}</h3>
                    <div className="course-meta">
                      <span className="instructor">{course.instructor}</span>
                      <span className="rating">
                        <Star className="w-4 h-4" />
                        {course.rating}
                      </span>
                    </div>
                    <div className="course-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <span className="progress-text">{course.progress}% Complete</span>
                    </div>
                    <div className="course-stats">
                      <span className="time-left">
                        <Clock className="w-4 h-4" />
                        {course.timeLeft} left
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="recommended-courses">
            <h2>Recommended Courses For You</h2>
            <div className="courses-grid">
              {recommendedCourses.map(course => (
                <div key={course.id} className="course-card recommended" onClick={() => {setSelectedCourse(course); setActiveNav('courses');}}>
                  <div className="course-image">
                    <img src={course.image} alt={course.title} />
                    <div className="course-overlay">
                      <BookOpen className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="course-content">
                    <h3>{course.title}</h3>
                    <div className="course-meta">
                      <span className="instructor">{course.instructor}</span>
                      <span className="rating">
                        <Star className="w-4 h-4" />
                        {course.rating}
                      </span>
                    </div>
                    <div className="course-footer">
                      <span className="price">${course.price}</span>
                      <button className="enroll-btn" onClick={(e) => { e.stopPropagation(); handleEnrollCourse(course.id); }}>
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
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

  return (
    <div className="learn-build-app">
      {isLoading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '1.5rem',
          color: '#000000'
        }}>
          Loading Learn & Build...
        </div>
      ) : (
        <>
          {renderSidebar()}
          
          <div className="main-content-area">
            {activeNav === 'dashboard' && renderDashboard()}
            {activeNav === 'lessons' && renderLessonsView()}
            {activeNav === 'courses' && renderCoursesView()}
            {!['dashboard', 'lessons', 'courses'].includes(activeNav) && (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Page not found</h2>
                <p>Please select a valid navigation item</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LearnAndBuild;
