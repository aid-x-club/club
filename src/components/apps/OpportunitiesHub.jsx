import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Calendar, 
  Clock, 
  MapPin, 
  ExternalLink, 
  Star, 
  Bookmark, 
  BookmarkCheck, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Trophy, 
  Code, 
  Users, 
  Target, 
  Rocket, 
  Lightbulb, 
  Award, 
  Flag, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Save, 
  Globe, 
  Monitor, 
  Building, 
  GraduationCap, 
  Zap, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Info,
  Tag,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Settings
} from 'lucide-react';
import './OpportunitiesHub.css';

const OpportunitiesHub = ({ onClose, user, isAdmin = false }) => {
  const [viewMode, setViewMode] = useState('browse'); // browse, saved, admin
  const [opportunities, setOpportunities] = useState([]);
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('deadline');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [featuredOpportunities, setFeaturedOpportunities] = useState([]);
  const [expandedOpportunity, setExpandedOpportunity] = useState(null);

  // Sample data - in real app this would come from API
  useEffect(() => {
    const sampleOpportunities = [
      {
        id: 1,
        title: 'Google Summer of Code 2024',
        organization: 'Google',
        category: 'open-source',
        type: 'Program',
        description: 'Contribute to open source projects under the guidance of experienced mentors. Get paid for your contributions!',
        mode: 'Online',
        deadline: new Date('2024-03-25'),
        postedDate: new Date('2024-01-15'),
        link: 'https://summerofcode.withgoogle.com/',
        requirements: [
          'Must be 18+ years old',
          'Open to students worldwide',
          'Experience with open source development preferred'
        ],
        benefits: [
          '$3000-6000 stipend',
          'Mentorship from industry experts',
          'Certificate of completion',
          'Network with global community'
        ],
        tags: ['Open Source', 'Mentorship', 'Paid', 'Global'],
        featured: true,
        status: 'active'
      },
      {
        id: 2,
        title: 'HackMIT 2024',
        organization: 'MIT',
        category: 'hackathon',
        type: 'Competition',
        description: 'Join 1000+ hackers for 36 hours of innovation, creativity, and learning at MIT\'s flagship hackathon.',
        mode: 'Offline',
        location: 'Cambridge, Massachusetts, USA',
        deadline: new Date('2024-02-15'),
        postedDate: new Date('2024-01-10'),
        link: 'https://hackmit.org/',
        requirements: [
          'High school or college students',
          'Travel to MIT campus required',
          'Team of up to 4 participants'
        ],
        benefits: [
          'Prizes worth $50,000+',
          'Free food and accommodation',
          'Workshops from tech leaders',
          'Networking opportunities'
        ],
        tags: ['Hackathon', 'Prizes', 'Networking', 'On-site'],
        featured: true,
        status: 'active'
      },
      {
        id: 3,
        title: 'Microsoft Learn Student Ambassador',
        organization: 'Microsoft',
        category: 'program',
        type: 'Ambassador',
        description: 'Lead technical communities, build skills, and get recognized as a Microsoft Learn Student Ambassador.',
        mode: 'Online',
        deadline: new Date('2024-04-30'),
        postedDate: new Date('2024-01-20'),
        link: 'https://studentambassadors.microsoft.com/',
        requirements: [
          '16+ years old',
          'Passionate about technology',
          'Good communication skills',
          'Active on social media'
        ],
        benefits: [
          'Microsoft swag and benefits',
          'Leadership training',
          'Access to Microsoft events',
          'Global recognition'
        ],
        tags: ['Leadership', 'Microsoft', 'Community', 'Global'],
        featured: false,
        status: 'active'
      },
      {
        id: 4,
        title: 'Facebook Hacker Cup',
        organization: 'Meta',
        category: 'competition',
        type: 'Coding Contest',
        description: 'Compete with the world\'s best programmers in Meta\'s annual coding competition.',
        mode: 'Online',
        deadline: new Date('2024-03-10'),
        postedDate: new Date('2024-01-08'),
        link: 'https://www.facebook.com/hackercup/',
        requirements: [
          'Strong problem-solving skills',
          'Knowledge of algorithms and data structures',
          'Any programming language'
        ],
        benefits: [
          '$10,000+ in prizes',
          'Job opportunities at Meta',
          'Global recognition',
          'Exclusive swag'
        ],
        tags: ['Coding', 'Competition', 'Algorithms', 'Prizes'],
        featured: false,
        status: 'active'
      },
      {
        id: 5,
        title: 'GitHub Copilot Challenge',
        organization: 'GitHub',
        category: 'innovation',
        type: 'Challenge',
        description: 'Build innovative projects using GitHub Copilot and showcase your AI-assisted development skills.',
        mode: 'Online',
        deadline: new Date('2024-02-28'),
        postedDate: new Date('2024-01-12'),
        link: 'https://github.com/copilot-challenge',
        requirements: [
          'GitHub account required',
          'Experience with any programming language',
          'Creative project ideas'
        ],
        benefits: [
          'GitHub Pro subscription',
          'Feature in GitHub blog',
          'AI development experience',
          'Community recognition'
        ],
        tags: ['AI', 'GitHub', 'Innovation', 'Future Tech'],
        featured: false,
        status: 'active'
      },
      {
        id: 6,
        title: 'AWS Educate Cloud Challenge',
        organization: 'Amazon Web Services',
        category: 'competition',
        type: 'Cloud Challenge',
        description: 'Build cloud solutions using AWS services and compete for prizes and recognition.',
        mode: 'Online',
        deadline: new Date('2024-03-15'),
        postedDate: new Date('2024-01-18'),
        link: 'https://aws.amazon.com/education/awseducate/',
        requirements: [
          'AWS account',
          'Basic cloud computing knowledge',
          'Team or individual participation'
        ],
        benefits: [
          'AWS credits',
          'Certification vouchers',
          'Job opportunities',
          'Technical mentorship'
        ],
        tags: ['Cloud', 'AWS', 'Infrastructure', 'Enterprise'],
        featured: false,
        status: 'active'
      },
      {
        id: 7,
        title: 'Devfolio Hackathon Series',
        organization: 'Devfolio',
        category: 'hackathon',
        type: 'Competition',
        description: 'Monthly hackathons with different themes and prizes. Join the community and showcase your skills.',
        mode: 'Online',
        deadline: new Date('2024-02-01'), // Monthly
        postedDate: new Date('2024-01-05'),
        link: 'https://devfolio.co/hackathons',
        requirements: [
          'Any programming language',
          'Creative mindset',
          'Team formation encouraged'
        ],
        benefits: [
          'Monthly prizes',
          'Community recognition',
          'Learning opportunities',
          'Portfolio building'
        ],
        tags: ['Monthly', 'Community', 'Learning', 'Flexible'],
        featured: false,
        status: 'active'
      },
      {
        id: 8,
        title: 'Expired: TechCrunch Disrupt 2023',
        organization: 'TechCrunch',
        category: 'competition',
        type: 'Startup Competition',
        description: 'Startup battlefield competition for early-stage companies.',
        mode: 'Offline',
        location: 'San Francisco, USA',
        deadline: new Date('2023-12-01'),
        postedDate: new Date('2023-10-15'),
        link: 'https://techcrunch.com/event/disrupt-2023/',
        requirements: [
          'Early-stage startup',
          'Less than $5M funding',
          'Demo-ready product'
        ],
        benefits: [
          '$100,000 grand prize',
          'Investor exposure',
          'Media coverage',
          'Industry recognition'
        ],
        tags: ['Startup', 'Competition', 'Funding', 'Networking'],
        featured: false,
        status: 'expired'
      }
    ];

    setOpportunities(sampleOpportunities);
    setFeaturedOpportunities(sampleOpportunities.filter(opp => opp.featured));
    setSavedOpportunities([1, 2, 5]); // Sample saved opportunities
  }, []);

  const categories = [
    { id: 'all', name: 'All Opportunities', icon: Briefcase },
    { id: 'hackathon', name: 'Hackathons', icon: Code },
    { id: 'competition', name: 'Competitions', icon: Trophy },
    { id: 'open-source', name: 'Open Source', icon: Users },
    { id: 'program', name: 'Programs', icon: GraduationCap },
    { id: 'innovation', name: 'Innovation', icon: Lightbulb },
    { id: 'internship', name: 'Internships', icon: Building }
  ];

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesCategory = selectedCategory === 'all' || opp.category === selectedCategory;
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    switch (sortBy) {
      case 'deadline':
        return a.deadline - b.deadline;
      case 'posted':
        return b.postedDate - a.postedDate;
      case 'name':
        return a.title.localeCompare(b.title);
      case 'organization':
        return a.organization.localeCompare(b.organization);
      default:
        return 0;
    }
  });

  const toggleSaveOpportunity = (opportunityId) => {
    setSavedOpportunities(prev => 
      prev.includes(opportunityId) 
        ? prev.filter(id => id !== opportunityId)
        : [...prev, opportunityId]
    );
  };

  const isOpportunitySaved = (opportunityId) => savedOpportunities.includes(opportunityId);

  const isOpportunityExpired = (deadline) => deadline < new Date();

  const getDaysUntilDeadline = (deadline) => {
    const now = new Date();
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDeadlineStatus = (deadline) => {
    const days = getDaysUntilDeadline(deadline);
    if (days < 0) return { text: 'Expired', color: 'expired' };
    if (days <= 3) return { text: `${days} days left`, color: 'urgent' };
    if (days <= 7) return { text: `${days} days left`, color: 'soon' };
    return { text: `${days} days left`, color: 'normal' };
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : Briefcase;
  };

  const renderBrowseView = () => (
    <div className="opportunities-browse">
      <div className="browse-header">
        <h1>Opportunities Hub</h1>
        <p>Discover hackathons, competitions, open-source programs, and career opportunities</p>
      </div>

      {/* Featured Opportunities */}
      {featuredOpportunities.length > 0 && (
        <div className="featured-section">
          <h2>Featured Opportunities</h2>
          <div className="featured-grid">
            {featuredOpportunities.map(opp => (
              <div key={opp.id} className="featured-card">
                <div className="featured-badge">
                  <Star className="w-4 h-4" />
                  Featured
                </div>
                <div className="featured-content">
                  <h3>{opp.title}</h3>
                  <p className="organization">{opp.organization}</p>
                  <p className="description">{opp.description}</p>
                  <div className="featured-meta">
                    <span className="category">{categories.find(cat => cat.id === opp.category)?.name}</span>
                    <span className={`deadline ${getDeadlineStatus(opp.deadline).color}`}>
                      {getDeadlineStatus(opp.deadline).text}
                    </span>
                  </div>
                  <div className="featured-actions">
                    <button 
                      onClick={() => toggleSaveOpportunity(opp.id)}
                      className={`save-btn ${isOpportunitySaved(opp.id) ? 'saved' : ''}`}
                    >
                      {isOpportunitySaved(opp.id) ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                    <a href={opp.link} target="_blank" rel="noopener noreferrer" className="apply-btn">
                      <ExternalLink className="w-4 h-4" />
                      Apply Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="opportunities-controls">
        <div className="search-filter">
          <div className="search-bar">
            <Search className="w-5 h-5" />
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="category-filter">
            <Filter className="w-4 h-4" />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div className="sort-filter">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="deadline">Sort by Deadline</option>
              <option value="posted">Sort by Posted Date</option>
              <option value="name">Sort by Name</option>
              <option value="organization">Sort by Organization</option>
            </select>
          </div>
        </div>
        
        {isAdmin && (
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Add Opportunity
          </button>
        )}
      </div>

      {/* Opportunities List */}
      <div className="opportunities-list">
        {sortedOpportunities.map(opp => {
          const deadlineStatus = getDeadlineStatus(opp.deadline);
          const isExpired = isOpportunityExpired(opp.deadline);
          const isSaved = isOpportunitySaved(opp.id);
          const isExpanded = expandedOpportunity === opp.id;

          return (
            <div key={opp.id} className={`opportunity-card ${isExpired ? 'expired' : ''} ${isSaved ? 'saved' : ''}`}>
              <div className="opportunity-header">
                <div className="opportunity-info">
                  <div className="opportunity-title">
                    <h3>{opp.title}</h3>
                    <div className="opportunity-badges">
                      {opp.featured && <span className="badge featured"><Star className="w-3 h-3" /> Featured</span>}
                      {isExpired && <span className="badge expired"><AlertCircle className="w-3 h-3" /> Expired</span>}
                      {isSaved && <span className="badge saved"><BookmarkCheck className="w-3 h-3" /> Saved</span>}
                    </div>
                  </div>
                  <div className="opportunity-meta">
                    <span className="organization">{opp.organization}</span>
                    <span className="type">{opp.type}</span>
                    <span className="category">{categories.find(cat => cat.id === opp.category)?.name}</span>
                  </div>
                </div>
                
                <div className="opportunity-actions">
                  <button 
                    onClick={() => toggleSaveOpportunity(opp.id)}
                    className={`save-btn ${isSaved ? 'saved' : ''}`}
                    title={isSaved ? 'Remove from saved' : 'Save opportunity'}
                  >
                    {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                  </button>
                  
                  <a href={opp.link} target="_blank" rel="noopener noreferrer" className="apply-btn">
                    <ExternalLink className="w-4 h-4" />
                    {isExpired ? 'View Details' : 'Apply Now'}
                  </a>
                  
                  <button 
                    onClick={() => setExpandedOpportunity(isExpanded ? null : opp.id)}
                    className="expand-btn"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="opportunity-summary">
                <p>{opp.description}</p>
                <div className="opportunity-details">
                  <div className="detail-item">
                    <Calendar className="w-4 h-4" />
                    <span className={`deadline ${deadlineStatus.color}`}>
                      {deadlineStatus.text}
                    </span>
                  </div>
                  <div className="detail-item">
                    <Globe className="w-4 h-4" />
                    <span>{opp.mode}</span>
                  </div>
                  {opp.location && (
                    <div className="detail-item">
                      <MapPin className="w-4 h-4" />
                      <span>{opp.location}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <Clock className="w-4 h-4" />
                    <span>Posted {opp.postedDate.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              {isExpanded && (
                <div className="opportunity-expanded">
                  <div className="expanded-section">
                    <h4>Requirements</h4>
                    <ul>
                      {opp.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="expanded-section">
                    <h4>Benefits</h4>
                    <ul>
                      {opp.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="expanded-section">
                    <h4>Tags</h4>
                    <div className="tags">
                      {opp.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderSavedView = () => {
    const saved = opportunities.filter(opp => savedOpportunities.includes(opp.id));
    
    return (
      <div className="saved-opportunities">
        <div className="saved-header">
          <h1>Saved Opportunities</h1>
          <p>Track opportunities you're interested in</p>
        </div>
        
        {saved.length === 0 ? (
          <div className="empty-state">
            <Bookmark className="w-12 h-12" />
            <h3>No saved opportunities yet</h3>
            <p>Start browsing and save opportunities that interest you</p>
            <button onClick={() => setViewMode('browse')} className="btn btn-primary">
              Browse Opportunities
            </button>
          </div>
        ) : (
          <div className="saved-grid">
            {saved.map(opp => {
              const deadlineStatus = getDeadlineStatus(opp.deadline);
              const isExpired = isOpportunityExpired(opp.deadline);

              return (
                <div key={opp.id} className={`saved-card ${isExpired ? 'expired' : ''}`}>
                  <div className="saved-card-header">
                    <div className="saved-info">
                      <h3>{opp.title}</h3>
                      <p className="organization">{opp.organization}</p>
                    </div>
                    <button 
                      onClick={() => toggleSaveOpportunity(opp.id)}
                      className="remove-btn"
                      title="Remove from saved"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="description">{opp.description}</p>
                  
                  <div className="saved-meta">
                    <span className={`deadline ${deadlineStatus.color}`}>
                      {deadlineStatus.text}
                    </span>
                    <span className="mode">{opp.mode}</span>
                    <span className="category">{categories.find(cat => cat.id === opp.category)?.name}</span>
                  </div>
                  
                  <div className="saved-actions">
                    <a href={opp.link} target="_blank" rel="noopener noreferrer" className="apply-btn">
                      <ExternalLink className="w-4 h-4" />
                      {isExpired ? 'View Details' : 'Apply Now'}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderAdminView = () => (
    <div className="admin-view">
      <div className="admin-header">
        <h1>Manage Opportunities</h1>
        <p>Add, update, and organize opportunities for students</p>
      </div>

      <div className="admin-actions">
        <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Add New Opportunity
        </button>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <Briefcase className="w-6 h-6" />
          <span>{opportunities.length}</span>
          <label>Total Opportunities</label>
        </div>
        <div className="stat-card">
          <Star className="w-6 h-6" />
          <span>{featuredOpportunities.length}</span>
          <label>Featured</label>
        </div>
        <div className="stat-card">
          <Calendar className="w-6 h-6" />
          <span>{opportunities.filter(opp => !isOpportunityExpired(opp.deadline)).length}</span>
          <label>Active</label>
        </div>
        <div className="stat-card">
          <AlertCircle className="w-6 h-6" />
          <span>{opportunities.filter(opp => isOpportunityExpired(opp.deadline)).length}</span>
          <label>Expired</label>
        </div>
      </div>

      <div className="admin-opportunities">
        <h2>All Opportunities</h2>
        <div className="admin-list">
          {opportunities.map(opp => (
            <div key={opp.id} className="admin-card">
              <div className="admin-info">
                <div className="admin-title">
                  <h3>{opp.title}</h3>
                  <div className="admin-badges">
                    {opp.featured && <span className="badge featured"><Star className="w-3 h-3" /> Featured</span>}
                    {isOpportunityExpired(opp.deadline) && <span className="badge expired"><AlertCircle className="w-3 h-3" /> Expired</span>}
                    <span className="badge category">{categories.find(cat => cat.id === opp.category)?.name}</span>
                  </div>
                </div>
                <p className="admin-description">{opp.description}</p>
                <div className="admin-meta">
                  <span className="organization">{opp.organization}</span>
                  <span className="deadline">Deadline: {opp.deadline.toLocaleDateString()}</span>
                  <span className="mode">{opp.mode}</span>
                </div>
              </div>
              
              <div className="admin-actions">
                <button 
                  onClick={() => {
                    setEditingOpportunity(opp);
                    setShowCreateModal(true);
                  }} 
                  className="btn btn-secondary"
                >
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
          <h2>{editingOpportunity ? 'Edit Opportunity' : 'Add New Opportunity'}</h2>
          <button onClick={() => {
            setShowCreateModal(false);
            setEditingOpportunity(null);
          }} className="modal-close">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                placeholder="e.g., Google Summer of Code 2024"
                defaultValue={editingOpportunity?.title || ''}
              />
            </div>
            
            <div className="form-group">
              <label>Organization *</label>
              <input
                type="text"
                placeholder="e.g., Google"
                defaultValue={editingOpportunity?.organization || ''}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select defaultValue={editingOpportunity?.category || ''}>
                  <option value="">Select category</option>
                  {categories.filter(cat => cat.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Type</label>
                <input
                  type="text"
                  placeholder="e.g., Program, Competition"
                  defaultValue={editingOpportunity?.type || ''}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Description *</label>
              <textarea
                placeholder="Describe the opportunity..."
                rows={4}
                defaultValue={editingOpportunity?.description || ''}
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3>Details & Logistics</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Mode *</label>
                <select defaultValue={editingOpportunity?.mode || ''}>
                  <option value="">Select mode</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Location (if offline)</label>
                <input
                  type="text"
                  placeholder="e.g., Cambridge, Massachusetts, USA"
                  defaultValue={editingOpportunity?.location || ''}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Deadline *</label>
                <input
                  type="date"
                  defaultValue={editingOpportunity?.deadline ? editingOpportunity.deadline.toISOString().split('T')[0] : ''}
                />
              </div>
              
              <div className="form-group">
                <label>Posted Date</label>
                <input
                  type="date"
                  defaultValue={editingOpportunity?.postedDate ? editingOpportunity.postedDate.toISOString().split('T')[0] : ''}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Application Link *</label>
              <input
                type="url"
                placeholder="https://example.com/apply"
                defaultValue={editingOpportunity?.link || ''}
              />
            </div>
          </div>
          
          <div className="form-section">
            <h3>Additional Information</h3>
            <div className="form-group">
              <label>Requirements</label>
              <textarea
                placeholder="List requirements (one per line)"
                rows={4}
                defaultValue={editingOpportunity?.requirements?.join('\n') || ''}
              />
            </div>
            
            <div className="form-group">
              <label>Benefits</label>
              <textarea
                placeholder="List benefits (one per line)"
                rows={4}
                defaultValue={editingOpportunity?.benefits?.join('\n') || ''}
              />
            </div>
            
            <div className="form-group">
              <label>Tags</label>
              <input
                type="text"
                placeholder="e.g., Open Source, Mentorship, Paid (comma-separated)"
                defaultValue={editingOpportunity?.tags?.join(', ') || ''}
              />
            </div>
            
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  defaultChecked={editingOpportunity?.featured || false}
                />
                Feature this opportunity
              </label>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button onClick={() => {
            setShowCreateModal(false);
            setEditingOpportunity(null);
          }} className="btn btn-secondary">
            Cancel
          </button>
          <button className="btn btn-primary">
            <Save className="w-4 h-4" />
            {editingOpportunity ? 'Update Opportunity' : 'Create Opportunity'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="opportunities-hub-container">
        <div className="opportunities-nav">
          <button 
            className={`nav-btn ${viewMode === 'browse' ? 'active' : ''}`}
            onClick={() => setViewMode('browse')}
          >
            <Briefcase className="w-4 h-4" />
            Browse
          </button>
          <button 
            className={`nav-btn ${viewMode === 'saved' ? 'active' : ''}`}
            onClick={() => setViewMode('saved')}
          >
            <Bookmark className="w-4 h-4" />
            Saved
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
        
        <div className="opportunities-content">
          {viewMode === 'browse' && renderBrowseView()}
          {viewMode === 'saved' && renderSavedView()}
          {viewMode === 'admin' && renderAdminView()}
        </div>
      </div>
      
      {showCreateModal && renderCreateModal()}
    </>
  );
};

export default OpportunitiesHub;
