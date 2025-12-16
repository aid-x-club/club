import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Award, 
  Star, 
  Target, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Rocket, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Zap, 
  Shield, 
  Crown, 
  Medal, 
  Gem, 
  Flame, 
  Bolt, 
  Heart, 
  Code, 
  GitBranch, 
  Users2, 
  Eye, 
  BarChart, 
  Activity, 
  MapPin, 
  Search, 
  Filter, 
  CalendarDays, 
  UserPlus, 
  Building, 
  Globe, 
  Settings,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  Gift,
  Sparkles,
  Flag
} from 'lucide-react';
import './LeaderboardAchievements.css';

const LeaderboardAchievements = ({ onClose, user, isAdmin = false }) => {
  const [viewMode, setViewMode] = useState('leaderboard'); // leaderboard, achievements, my-progress
  const [timeFilter, setTimeFilter] = useState('all-time'); // all-time, month, week
  const [categoryFilter, setCategoryFilter] = useState('all'); // all, projects, deployments, events, collaborations
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [achievementsData, setAchievementsData] = useState([]);
  const [myProgressData, setMyProgressData] = useState(null);
  const [topPerformers, setTopPerformers] = useState([]);

  // Sample data - in real app this would come from API
  useEffect(() => {
    // Leaderboard data
    setLeaderboardData([
      {
        id: 1,
        name: 'Sarah Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
        rank: 1,
        previousRank: 3,
        score: 2850,
        stats: {
          projects: 12,
          deployments: 8,
          events: 15,
          collaborations: 6
        },
        badges: 12,
        streak: 45,
        lastActive: '2024-01-22',
        change: 'up'
      },
      {
        id: 2,
        name: 'Mike Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
        rank: 2,
        previousRank: 2,
        score: 2720,
        stats: {
          projects: 10,
          deployments: 7,
          events: 12,
          collaborations: 5
        },
        badges: 10,
        streak: 30,
        lastActive: '2024-01-22',
        change: 'same'
      },
      {
        id: 3,
        name: 'Emily Davis',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
        rank: 3,
        previousRank: 1,
        score: 2680,
        stats: {
          projects: 11,
          deployments: 6,
          events: 14,
          collaborations: 8
        },
        badges: 11,
        streak: 28,
        lastActive: '2024-01-21',
        change: 'down'
      },
      {
        id: 4,
        name: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
        rank: 4,
        previousRank: 5,
        score: 2450,
        stats: {
          projects: 8,
          deployments: 5,
          events: 10,
          collaborations: 4
        },
        badges: 8,
        streak: 21,
        lastActive: '2024-01-22',
        change: 'up'
      },
      {
        id: 5,
        name: 'Jane Smith',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
        rank: 5,
        previousRank: 4,
        score: 2380,
        stats: {
          projects: 9,
          deployments: 4,
          events: 11,
          collaborations: 3
        },
        badges: 9,
        streak: 18,
        lastActive: '2024-01-20',
        change: 'down'
      },
      {
        id: 6,
        name: 'Alex Wilson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
        rank: 6,
        previousRank: 8,
        score: 2250,
        stats: {
          projects: 7,
          deployments: 6,
          events: 9,
          collaborations: 5
        },
        badges: 7,
        streak: 15,
        lastActive: '2024-01-22',
        change: 'up'
      },
      {
        id: 7,
        name: 'Lisa Brown',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
        rank: 7,
        previousRank: 6,
        score: 2100,
        stats: {
          projects: 6,
          deployments: 3,
          events: 8,
          collaborations: 4
        },
        badges: 6,
        streak: 12,
        lastActive: '2024-01-19',
        change: 'down'
      },
      {
        id: 8,
        name: 'Tom Martinez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom',
        rank: 8,
        previousRank: 10,
        score: 1980,
        stats: {
          projects: 5,
          deployments: 4,
          events: 7,
          collaborations: 3
        },
        badges: 5,
        streak: 10,
        lastActive: '2024-01-22',
        change: 'up'
      }
    ]);

    // Achievements data
    setAchievementsData([
      {
        id: 1,
        name: 'First Project',
        description: 'Created your first project',
        icon: 'Briefcase',
        category: 'projects',
        difficulty: 'bronze',
        points: 100,
        earned: true,
        earnedAt: '2024-01-15',
        progress: 100
      },
      {
        id: 2,
        name: 'Deployment Master',
        description: 'Deployed 5 projects successfully',
        icon: 'Rocket',
        category: 'deployments',
        difficulty: 'silver',
        points: 250,
        earned: true,
        earnedAt: '2024-01-20',
        progress: 100
      },
      {
        id: 3,
        name: 'Team Player',
        description: 'Collaborated on 3 projects',
        icon: 'Users2',
        category: 'collaborations',
        difficulty: 'bronze',
        points: 150,
        earned: true,
        earnedAt: '2024-01-18',
        progress: 100
      },
      {
        id: 4,
        name: 'Event Enthusiast',
        description: 'Attended 10 club events',
        icon: 'Calendar',
        category: 'events',
        difficulty: 'silver',
        points: 200,
        earned: true,
        earnedAt: '2024-01-22',
        progress: 100
      },
      {
        id: 5,
        name: 'Code Warrior',
        description: 'Created 10 projects',
        icon: 'Code',
        category: 'projects',
        difficulty: 'gold',
        points: 500,
        earned: false,
        progress: 80,
        current: 8,
        target: 10
      },
      {
        id: 6,
        name: 'Deployment Expert',
        description: 'Deployed 10 projects',
        icon: 'Rocket',
        category: 'deployments',
        difficulty: 'gold',
        points: 600,
        earned: false,
        progress: 50,
        current: 5,
        target: 10
      },
      {
        id: 7,
        name: 'Collaboration King',
        description: 'Collaborated on 5 projects',
        icon: 'Users2',
        category: 'collaborations',
        difficulty: 'silver',
        points: 300,
        earned: false,
        progress: 80,
        current: 4,
        target: 5
      },
      {
        id: 8,
        name: 'Workshop Warrior',
        description: 'Completed 5 workshops',
        icon: 'Target',
        category: 'events',
        difficulty: 'silver',
        points: 250,
        earned: false,
        progress: 60,
        current: 3,
        target: 5
      },
      {
        id: 9,
        name: 'Streak Master',
        description: '30-day activity streak',
        icon: 'Flame',
        category: 'engagement',
        difficulty: 'gold',
        points: 400,
        earned: false,
        progress: 70,
        current: 21,
        target: 30
      },
      {
        id: 10,
        name: 'Club Champion',
        description: 'Reach top 5 in leaderboard',
        icon: 'Trophy',
        category: 'leaderboard',
        difficulty: 'platinum',
        points: 1000,
        earned: false,
        progress: 80,
        current: 4,
        target: 5
      }
    ]);

    // Current user's progress
    setMyProgressData({
      rank: 4,
      previousRank: 5,
      score: 2450,
      badges: 8,
      streak: 21,
      stats: {
        projects: 8,
        deployments: 5,
        events: 10,
        collaborations: 4
      },
      recentActivity: [
        { type: 'project', title: 'Weather Dashboard', date: '2024-01-22', points: 50 },
        { type: 'deployment', title: 'Task Management App', date: '2024-01-20', points: 30 },
        { type: 'event', title: 'React Workshop', date: '2024-01-18', points: 20 },
        { type: 'collaboration', title: 'E-commerce Site', date: '2024-01-15', points: 40 }
      ]
    });

    // Top performers for admin view
    setTopPerformers([
      {
        id: 1,
        name: 'Sarah Chen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
        monthlyScore: 850,
        achievements: ['First Project', 'Deployment Master', 'Team Player'],
        growth: '+15%'
      },
      {
        id: 2,
        name: 'Mike Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
        monthlyScore: 720,
        achievements: ['Event Enthusiast', 'Code Warrior'],
        growth: '+12%'
      },
      {
        id: 3,
        name: 'Emily Davis',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
        monthlyScore: 680,
        achievements: ['First Project', 'Team Player'],
        growth: '+8%'
      }
    ]);
  }, [user]);

  const filteredLeaderboard = leaderboardData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || 
      (categoryFilter === 'projects' && student.stats.projects > 0) ||
      (categoryFilter === 'deployments' && student.stats.deployments > 0) ||
      (categoryFilter === 'events' && student.stats.events > 0) ||
      (categoryFilter === 'collaborations' && student.stats.collaborations > 0);
    return matchesSearch && matchesCategory;
  });

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-300" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <span className="rank-number">#{rank}</span>;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'bronze': return 'difficulty-bronze';
      case 'silver': return 'difficulty-silver';
      case 'gold': return 'difficulty-gold';
      case 'platinum': return 'difficulty-platinum';
      default: return 'difficulty-default';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'bronze': return <Shield className="w-4 h-4" />;
      case 'silver': return <Star className="w-4 h-4" />;
      case 'gold': return <Trophy className="w-4 h-4" />;
      case 'platinum': return <Gem className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'projects': return <Briefcase className="w-4 h-4" />;
      case 'deployments': return <Rocket className="w-4 h-4" />;
      case 'events': return <Calendar className="w-4 h-4" />;
      case 'collaborations': return <Users2 className="w-4 h-4" />;
      case 'engagement': return <Flame className="w-4 h-4" />;
      case 'leaderboard': return <Trophy className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const renderLeaderboard = () => (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <div className="header-left">
          <h1>Leaderboard</h1>
          <p>Club performance rankings and achievements</p>
        </div>
        
        <div className="header-actions">
          <div className="time-filter">
            <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
              <option value="all-time">All Time</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
            </select>
          </div>
        </div>
      </div>

      <div className="controls-section">
        <div className="search-filter">
          <div className="search-bar">
            <Search className="w-5 h-5" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="category-filter">
            <Filter className="w-4 h-4" />
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="projects">Projects</option>
              <option value="deployments">Deployments</option>
              <option value="events">Events</option>
              <option value="collaborations">Collaborations</option>
            </select>
          </div>
        </div>
      </div>

      <div className="leaderboard-content">
        <div className="top-podium">
          {filteredLeaderboard.slice(0, 3).map((student, index) => (
            <div key={student.id} className={`podium-item rank-${student.rank}`}>
              <div className="podium-avatar">
                <img src={student.avatar} alt={student.name} />
                <div className="rank-badge">
                  {getRankIcon(student.rank)}
                </div>
              </div>
              <div className="podium-info">
                <h3>{student.name}</h3>
                <div className="score-display">
                  <span className="score">{student.score.toLocaleString()}</span>
                  <span className="points">points</span>
                </div>
                <div className="rank-change">
                  {student.change === 'up' && <ChevronUp className="w-4 h-4 text-green-400" />}
                  {student.change === 'down' && <ChevronDown className="w-4 h-4 text-red-400" />}
                  {student.change === 'same' && <span className="text-gray-400">—</span>}
                  <span className="change-text">
                    {student.change === 'up' && `+${student.previousRank - student.rank}`}
                    {student.change === 'down' && `${student.previousRank - student.rank}`}
                    {student.change === 'same' && 'Same'}
                  </span>
                </div>
              </div>
              <div className="podium-stats">
                <div className="stat">
                  <Briefcase className="w-4 h-4" />
                  <span>{student.stats.projects}</span>
                </div>
                <div className="stat">
                  <Rocket className="w-4 h-4" />
                  <span>{student.stats.deployments}</span>
                </div>
                <div className="stat">
                  <Calendar className="w-4 h-4" />
                  <span>{student.stats.events}</span>
                </div>
                <div className="stat">
                  <Users2 className="w-4 h-4" />
                  <span>{student.stats.collaborations}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="leaderboard-list">
          {filteredLeaderboard.slice(3).map((student) => (
            <div key={student.id} className="leaderboard-item">
              <div className="rank-cell">
                <span className="rank-number">#{student.rank}</span>
                {student.change === 'up' && <ChevronUp className="w-4 h-4 text-green-400" />}
                {student.change === 'down' && <ChevronDown className="w-4 h-4 text-red-400" />}
                {student.change === 'same' && <span className="text-gray-400">—</span>}
              </div>
              
              <div className="student-cell" onClick={() => {
                setSelectedStudent(student);
                setShowStudentModal(true);
              }}>
                <img src={student.avatar} alt={student.name} />
                <div className="student-info">
                  <h4>{student.name}</h4>
                  <div className="student-meta">
                    <span className="badges">
                      <Award className="w-3 h-3" />
                      {student.badges} badges
                    </span>
                    <span className="streak">
                      <Flame className="w-3 h-3" />
                      {student.streak} day streak
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="score-cell">
                <span className="score">{student.score.toLocaleString()}</span>
                <span className="points">points</span>
              </div>
              
              <div className="stats-cell">
                <div className="mini-stats">
                  <div className="mini-stat">
                    <Briefcase className="w-3 h-3" />
                    <span>{student.stats.projects}</span>
                  </div>
                  <div className="mini-stat">
                    <Rocket className="w-3 h-3" />
                    <span>{student.stats.deployments}</span>
                  </div>
                  <div className="mini-stat">
                    <Calendar className="w-3 h-3" />
                    <span>{student.stats.events}</span>
                  </div>
                  <div className="mini-stat">
                    <Users2 className="w-3 h-3" />
                    <span>{student.stats.collaborations}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="achievements-container">
      <div className="achievements-header">
        <h1>Achievements & Badges</h1>
        <p>Earn badges by completing milestones and challenges</p>
      </div>

      <div className="achievements-stats">
        <div className="stat-card">
          <Award className="w-6 h-6" />
          <span>{achievementsData.filter(a => a.earned).length}</span>
          <label>Earned</label>
        </div>
        <div className="stat-card">
          <Target className="w-6 h-6" />
          <span>{achievementsData.length - achievementsData.filter(a => a.earned).length}</span>
          <label>In Progress</label>
        </div>
        <div className="stat-card">
          <Star className="w-6 h-6" />
          <span>{achievementsData.reduce((sum, a) => sum + (a.earned ? a.points : 0), 0)}</span>
          <label>Total Points</label>
        </div>
      </div>

      <div className="achievements-grid">
        {achievementsData.map((achievement) => (
          <div key={achievement.id} className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}>
            <div className="achievement-header">
              <div className={`achievement-icon ${getDifficultyColor(achievement.difficulty)}`}>
                {getDifficultyIcon(achievement.difficulty)}
              </div>
              <div className="achievement-meta">
                <span className={`difficulty ${getDifficultyColor(achievement.difficulty)}`}>
                  {achievement.difficulty}
                </span>
                <span className="points">+{achievement.points} pts</span>
              </div>
            </div>
            
            <div className="achievement-content">
              <h3>{achievement.name}</h3>
              <p>{achievement.description}</p>
              
              <div className="achievement-category">
                {getCategoryIcon(achievement.category)}
                <span>{achievement.category}</span>
              </div>
              
              {achievement.earned ? (
                <div className="earned-info">
                  <CheckCircle className="w-4 h-4" />
                  <span>Earned on {new Date(achievement.earnedAt).toLocaleDateString()}</span>
                </div>
              ) : (
                <div className="progress-info">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                  <span className="progress-text">
                    {achievement.current}/{achievement.target} ({achievement.progress}%)
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMyProgress = () => (
    <div className="my-progress-container">
      <div className="progress-header">
        <h1>My Progress</h1>
        <p>Track your performance and achievements</p>
      </div>

      {myProgressData && (
        <>
          <div className="progress-overview">
            <div className="overview-card">
              <div className="rank-display">
                <div className="rank-number">#{myProgressData.rank}</div>
                <div className="rank-change">
                  {myProgressData.previousRank > myProgressData.rank ? (
                    <>
                      <ChevronUp className="w-5 h-5 text-green-400" />
                      <span>Up {myProgressData.previousRank - myProgressData.rank} positions</span>
                    </>
                  ) : myProgressData.previousRank < myProgressData.rank ? (
                    <>
                      <ChevronDown className="w-5 h-5 text-red-400" />
                      <span>Down {myProgressData.rank - myProgressData.previousRank} positions</span>
                    </>
                  ) : (
                    <span>Same position</span>
                  )}
                </div>
              </div>
              
              <div className="score-display">
                <span className="score">{myProgressData.score.toLocaleString()}</span>
                <span className="label">Total Points</span>
              </div>
              
              <div className="stats-grid">
                <div className="stat">
                  <Briefcase className="w-5 h-5" />
                  <span>{myProgressData.stats.projects}</span>
                  <label>Projects</label>
                </div>
                <div className="stat">
                  <Rocket className="w-5 h-5" />
                  <span>{myProgressData.stats.deployments}</span>
                  <label>Deployments</label>
                </div>
                <div className="stat">
                  <Calendar className="w-5 h-5" />
                  <span>{myProgressData.stats.events}</span>
                  <label>Events</label>
                </div>
                <div className="stat">
                  <Users2 className="w-5 h-5" />
                  <span>{myProgressData.stats.collaborations}</span>
                  <label>Collaborations</label>
                </div>
              </div>
            </div>
            
            <div className="streak-card">
              <div className="streak-icon">
                <Flame className="w-8 h-8" />
              </div>
              <div className="streak-info">
                <span className="streak-number">{myProgressData.streak}</span>
                <span className="streak-label">Day Streak</span>
              </div>
            </div>
            
            <div className="badges-card">
              <div className="badges-icon">
                <Award className="w-8 h-8" />
              </div>
              <div className="badges-info">
                <span className="badges-number">{myProgressData.badges}</span>
                <span className="badges-label">Badges Earned</span>
              </div>
            </div>
          </div>

          <div className="recent-activity">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              {myProgressData.recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === 'project' && <Briefcase className="w-4 h-4" />}
                    {activity.type === 'deployment' && <Rocket className="w-4 h-4" />}
                    {activity.type === 'event' && <Calendar className="w-4 h-4" />}
                    {activity.type === 'collaboration' && <Users2 className="w-4 h-4" />}
                  </div>
                  <div className="activity-content">
                    <h4>{activity.title}</h4>
                    <span className="activity-date">{new Date(activity.date).toLocaleDateString()}</span>
                  </div>
                  <div className="activity-points">
                    <span className="points">+{activity.points}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderAdminAnalytics = () => (
    <div className="admin-analytics-container">
      <div className="analytics-header">
        <h1>Performance Analytics</h1>
        <p>Comprehensive insights on student engagement and achievements</p>
      </div>

      <div className="top-performers">
        <h2>Top Performers This Month</h2>
        <div className="performers-grid">
          {topPerformers.map((performer) => (
            <div key={performer.id} className="performer-card">
              <div className="performer-header">
                <img src={performer.avatar} alt={performer.name} />
                <div className="performer-info">
                  <h3>{performer.name}</h3>
                  <div className="growth-indicator positive">
                    <TrendingUp className="w-3 h-3" />
                    <span>{performer.growth}</span>
                  </div>
                </div>
              </div>
              
              <div className="performer-stats">
                <div className="monthly-score">
                  <span className="score">{performer.monthlyScore}</span>
                  <span className="label">Monthly Score</span>
                </div>
                
                <div className="achievements">
                  <span className="label">Recent Achievements:</span>
                  <div className="achievement-list">
                    {performer.achievements.map((achievement, index) => (
                      <span key={index} className="achievement-tag">{achievement}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="analytics-overview">
        <h2>Club Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <Users className="w-6 h-6" />
            <span>{leaderboardData.length}</span>
            <label>Total Students</label>
          </div>
          <div className="stat-card">
            <Briefcase className="w-6 h-6" />
            <span>{leaderboardData.reduce((sum, s) => sum + s.stats.projects, 0)}</span>
            <label>Total Projects</label>
          </div>
          <div className="stat-card">
            <Rocket className="w-6 h-6" />
            <span>{leaderboardData.reduce((sum, s) => sum + s.stats.deployments, 0)}</span>
            <label>Total Deployments</label>
          </div>
          <div className="stat-card">
            <Calendar className="w-6 h-6" />
            <span>{leaderboardData.reduce((sum, s) => sum + s.stats.events, 0)}</span>
            <label>Event Attendance</label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudentModal = () => {
    if (!selectedStudent) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowStudentModal(false)}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{selectedStudent.name}'s Profile</h2>
            <button onClick={() => setShowStudentModal(false)} className="modal-close">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="modal-content">
            <div className="student-profile">
              <div className="profile-header">
                <img src={selectedStudent.avatar} alt={selectedStudent.name} />
                <div className="profile-info">
                  <h3>{selectedStudent.name}</h3>
                  <div className="rank-info">
                    <span className="rank">Rank #{selectedStudent.rank}</span>
                    <span className="score">{selectedStudent.score.toLocaleString()} points</span>
                  </div>
                </div>
              </div>
              
              <div className="profile-stats">
                <div className="stat">
                  <Briefcase className="w-5 h-5" />
                  <span>{selectedStudent.stats.projects}</span>
                  <label>Projects</label>
                </div>
                <div className="stat">
                  <Rocket className="w-5 h-5" />
                  <span>{selectedStudent.stats.deployments}</span>
                  <label>Deployments</label>
                </div>
                <div className="stat">
                  <Calendar className="w-5 h-5" />
                  <span>{selectedStudent.stats.events}</span>
                  <label>Events</label>
                </div>
                <div className="stat">
                  <Users2 className="w-5 h-5" />
                  <span>{selectedStudent.stats.collaborations}</span>
                  <label>Collaborations</label>
                </div>
              </div>
              
              <div className="achievements-showcase">
                <h4>Achievements</h4>
                <div className="badges-display">
                  {Array.from({ length: selectedStudent.badges }).map((_, index) => (
                    <div key={index} className="badge-icon">
                      <Award className="w-6 h-6" />
                    </div>
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
      <div className="leaderboard-achievements-container">
        <div className="app-nav">
          <button 
            className={`nav-btn ${viewMode === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setViewMode('leaderboard')}
          >
            <Trophy className="w-4 h-4" />
            Leaderboard
          </button>
          <button 
            className={`nav-btn ${viewMode === 'achievements' ? 'active' : ''}`}
            onClick={() => setViewMode('achievements')}
          >
            <Award className="w-4 h-4" />
            Achievements
          </button>
          <button 
            className={`nav-btn ${viewMode === 'my-progress' ? 'active' : ''}`}
            onClick={() => setViewMode('my-progress')}
          >
            <BarChart className="w-4 h-4" />
            My Progress
          </button>
          {isAdmin && (
            <button 
              className={`nav-btn ${viewMode === 'analytics' ? 'active' : ''}`}
              onClick={() => setViewMode('analytics')}
            >
              <Activity className="w-4 h-4" />
              Analytics
            </button>
          )}
        </div>
        
        <div className="app-content">
          {viewMode === 'leaderboard' && renderLeaderboard()}
          {viewMode === 'achievements' && renderAchievements()}
          {viewMode === 'my-progress' && renderMyProgress()}
          {viewMode === 'analytics' && renderAdminAnalytics()}
        </div>
      </div>
      
      {showStudentModal && renderStudentModal()}
    </>
  );
};

export default LeaderboardAchievements;
