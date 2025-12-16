import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  ChevronRight, 
  ArrowLeft, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Archive, 
  Lock, 
  Unlock, 
  ExternalLink, 
  Video, 
  Mic, 
  Monitor, 
  Building, 
  Globe, 
  Tag, 
  Star, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Code, 
  Palette, 
  Briefcase, 
  Target,
  Settings,
  Download,
  Upload,
  CheckSquare,
  Square
} from 'lucide-react';
import './ClubEvents.css';

const ClubEvents = ({ onClose, user, isAdmin = false }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeView, setActiveView] = useState('upcoming'); // upcoming, my-events, history, manage
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, workshop, seminar, competition, social
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAttendeesModal, setShowAttendeesModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedEventForAttendees, setSelectedEventForAttendees] = useState(null);
  const [selectedEventForRegistration, setSelectedEventForRegistration] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [isRegistering, setIsRegistering] = useState(new Set());
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    mode: 'offline',
    type: 'workshop',
    maxAttendees: '',
    tags: [],
    requirements: ''
  });

  // Sample data - in real app this would come from API
  useEffect(() => {
    setEvents([
      {
        id: 1,
        name: 'React Workshop: Advanced Hooks',
        description: 'Deep dive into React hooks including custom hooks, useReducer, and useContext patterns. Learn advanced techniques for building scalable React applications.',
        date: '2024-02-15',
        time: '14:00',
        venue: 'Computer Lab - Room 301',
        mode: 'offline',
        type: 'workshop',
        status: 'upcoming',
        maxAttendees: 30,
        currentAttendees: 24,
        registrationsOpen: true,
        organizer: { id: 1, name: 'Sarah Chen', role: 'coordinator' },
        tags: ['react', 'javascript', 'frontend', 'advanced'],
        requirements: 'Laptop with Node.js installed, basic React knowledge',
        createdAt: '2024-01-20T10:00:00Z',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=react-workshop'
      },
      {
        id: 2,
        name: 'AI/ML Seminar: Introduction to Neural Networks',
        description: 'Introduction to neural networks and deep learning. Cover basic concepts, architectures, and practical applications in modern AI systems.',
        date: '2024-02-20',
        time: '16:00',
        venue: 'Online - Zoom Meeting',
        mode: 'online',
        type: 'seminar',
        status: 'upcoming',
        maxAttendees: 100,
        currentAttendees: 67,
        registrationsOpen: true,
        organizer: { id: 2, name: 'Dr. James Wilson', role: 'faculty' },
        tags: ['ai', 'ml', 'neural-networks', 'beginner'],
        requirements: 'Basic programming knowledge, notebook for notes',
        createdAt: '2024-01-22T14:00:00Z',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai-seminar'
      },
      {
        id: 3,
        name: 'Hackathon 2024: Innovation Challenge',
        description: '24-hour hackathon focused on solving real-world problems. Teams will compete for prizes and recognition.',
        date: '2024-03-01',
        time: '10:00',
        venue: 'Innovation Hub - Main Hall',
        mode: 'offline',
        type: 'competition',
        status: 'upcoming',
        maxAttendees: 60,
        currentAttendees: 45,
        registrationsOpen: true,
        organizer: { id: 3, name: 'Tech Team', role: 'coordinator' },
        tags: ['hackathon', 'competition', 'innovation', 'team'],
        requirements: 'Team formation (2-4 members), laptop, ideas',
        createdAt: '2024-01-18T09:00:00Z',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hackathon'
      },
      {
        id: 4,
        name: 'Web Development Bootcamp',
        description: 'Intensive 3-day bootcamp covering HTML, CSS, JavaScript, and modern frameworks. Perfect for beginners.',
        date: '2024-01-25',
        time: '09:00',
        venue: 'Computer Lab - Room 201',
        mode: 'offline',
        type: 'workshop',
        status: 'completed',
        maxAttendees: 25,
        currentAttendees: 23,
        registrationsOpen: false,
        organizer: { id: 4, name: 'Mike Johnson', role: 'coordinator' },
        tags: ['web-dev', 'html', 'css', 'javascript', 'beginner'],
        requirements: 'Laptop, basic computer skills',
        createdAt: '2024-01-10T11:00:00Z',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=web-bootcamp'
      },
      {
        id: 5,
        name: 'UI/UX Design Workshop',
        description: 'Learn the fundamentals of user interface and user experience design. Hands-on workshop with Figma.',
        date: '2024-01-18',
        time: '13:00',
        venue: 'Design Studio - Room 105',
        mode: 'offline',
        type: 'workshop',
        status: 'completed',
        maxAttendees: 20,
        currentAttendees: 18,
        registrationsOpen: false,
        organizer: { id: 5, name: 'Emily Davis', role: 'coordinator' },
        tags: ['design', 'ui', 'ux', 'figma', 'creative'],
        requirements: 'Laptop with Figma installed',
        createdAt: '2024-01-05T15:00:00Z',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=design-workshop'
      }
    ]);

    // Initialize attendance data
    setAttendanceData({
      4: [
        { id: 1, name: 'John Doe', rollNumber: '2021001', attended: true, registeredAt: '2024-01-15T10:00:00Z' },
        { id: 2, name: 'Jane Smith', rollNumber: '2021002', attended: true, registeredAt: '2024-01-16T14:00:00Z' },
        { id: 3, name: 'Mike Johnson', rollNumber: '2021003', attended: false, registeredAt: '2024-01-17T09:00:00Z' }
      ],
      5: [
        { id: 1, name: 'John Doe', rollNumber: '2021001', attended: true, registeredAt: '2024-01-10T11:00:00Z' },
        { id: 4, name: 'Sarah Wilson', rollNumber: '2021004', attended: true, registeredAt: '2024-01-12T16:00:00Z' }
      ]
    });
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || event.type === filterType;
    
    // Filter based on active view
    const matchesView = 
      activeView === 'upcoming' ? event.status === 'upcoming' :
      activeView === 'my-events' ? event.registered || event.attended :
      activeView === 'history' ? event.status === 'completed' :
      true; // manage view shows all
    
    return matchesSearch && matchesType && matchesView;
  });

  const handleRegister = async (eventId) => {
    setIsRegistering(prev => new Set(prev).add(eventId));
    
    // Simulate registration API call
    setTimeout(() => {
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { 
              ...event, 
              currentAttendees: event.currentAttendees + 1,
              registered: true,
              registeredAt: new Date().toISOString()
            }
          : event
      ));
      
      setIsRegistering(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    }, 1000);
  };

  const handleCreateEvent = () => {
    const event = {
      id: Date.now(),
      ...newEvent,
      status: 'upcoming',
      currentAttendees: 0,
      registrationsOpen: true,
      organizer: { id: user?.id, name: user?.name, role: user?.role || 'coordinator' },
      createdAt: new Date().toISOString(),
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
    };
    
    setEvents(prev => [event, ...prev]);
    setNewEvent({
      name: '',
      description: '',
      date: '',
      time: '',
      venue: '',
      mode: 'offline',
      type: 'workshop',
      maxAttendees: '',
      tags: [],
      requirements: ''
    });
    setShowCreateModal(false);
  };

  const handleUpdateAttendance = (eventId, attendeeId, attended) => {
    setAttendanceData(prev => ({
      ...prev,
      [eventId]: prev[eventId]?.map(attendee =>
        attendee.id === attendeeId ? { ...attendee, attended } : attendee
      )
    }));
  };

  const handleArchiveEvent = (eventId) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, status: 'archived', registrationsOpen: false }
        : event
    ));
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'status-upcoming';
      case 'completed': return 'status-completed';
      case 'ongoing': return 'status-ongoing';
      case 'cancelled': return 'status-cancelled';
      case 'archived': return 'status-archived';
      default: return 'status-default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'upcoming': return <Calendar className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'ongoing': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'archived': return <Archive className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'workshop': return <Code className="w-4 h-4" />;
      case 'seminar': return <BookOpen className="w-4 h-4" />;
      case 'competition': return <Target className="w-4 h-4" />;
      case 'social': return <Users className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'online': return <Video className="w-4 h-4" />;
      case 'offline': return <Building className="w-4 h-4" />;
      case 'hybrid': return <Monitor className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const renderEventsList = () => (
    <div className="club-events-container">
      <div className="events-header">
        <div className="header-left">
          <h1>Club Events & Workshops</h1>
          <p>AID-X Club organized events and workshops</p>
        </div>
        
        <div className="header-actions">
          {isAdmin && (
            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
              <Plus className="w-4 h-4" />
              Create Event
            </button>
          )}
        </div>
      </div>

      <div className="events-nav">
        <button 
          className={`nav-btn ${activeView === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveView('upcoming')}
        >
          <Calendar className="w-4 h-4" />
          Upcoming Events
        </button>
        <button 
          className={`nav-btn ${activeView === 'my-events' ? 'active' : ''}`}
          onClick={() => setActiveView('my-events')}
        >
          <CheckSquare className="w-4 h-4" />
          My Club Events
        </button>
        <button 
          className={`nav-btn ${activeView === 'history' ? 'active' : ''}`}
          onClick={() => setActiveView('history')}
        >
          <Clock className="w-4 h-4" />
          Event History
        </button>
        {isAdmin && (
          <button 
            className={`nav-btn ${activeView === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveView('manage')}
          >
            <Settings className="w-4 h-4" />
            Manage Events
          </button>
        )}
      </div>

      <div className="content-controls">
        <div className="search-filter">
          <div className="search-bar">
            <Search className="w-5 h-5" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-dropdown">
            <Filter className="w-4 h-4" />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="workshop">Workshops</option>
              <option value="seminar">Seminars</option>
              <option value="competition">Competitions</option>
              <option value="social">Social Events</option>
            </select>
          </div>
        </div>
      </div>

      <div className="events-grid">
        {filteredEvents.map(event => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <div className="event-image">
                <img src={event.image} alt={event.name} />
              </div>
              <div className="event-meta">
                <span className={`status ${getStatusColor(event.status)}`}>
                  {getStatusIcon(event.status)}
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
                <span className="event-type">
                  {getTypeIcon(event.type)}
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>
              </div>
              {event.registered && (
                <div className="registered-badge">
                  <CheckCircle className="w-3 h-3" />
                  Registered
                </div>
              )}
            </div>
            
            <div className="event-content">
              <h3>{event.name}</h3>
              <p>{event.description}</p>
              
              <div className="event-details">
                <div className="detail-item">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <Clock className="w-4 h-4" />
                  <span>{event.time}</span>
                </div>
                <div className="detail-item">
                  {getModeIcon(event.mode)}
                  <span>{event.venue}</span>
                </div>
              </div>
              
              <div className="event-tags">
                {event.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
                {event.tags.length > 3 && (
                  <span className="tag more">+{event.tags.length - 3}</span>
                )}
              </div>
              
              <div className="event-stats">
                <div className="stat-item">
                  <Users className="w-4 h-4" />
                  <span>{event.currentAttendees}/{event.maxAttendees}</span>
                  <label>Attendees</label>
                </div>
                <div className="stat-item">
                  <UserCheck className="w-4 h-4" />
                  <span>{event.registrationsOpen ? 'Open' : 'Closed'}</span>
                  <label>Registration</label>
                </div>
              </div>
              
              <div className="event-organizer">
                <span>Organized by {event.organizer.name}</span>
                <span className="organizer-role">{event.organizer.role}</span>
              </div>
            </div>

            <div className="event-actions">
              <button 
                onClick={() => setSelectedEvent(event)}
                className="btn btn-secondary"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
              
              {event.status === 'upcoming' && event.registrationsOpen && !event.registered && (
                <button 
                  onClick={() => handleRegister(event.id)}
                  disabled={isRegistering.has(event.id)}
                  className="btn btn-primary"
                >
                  <UserPlus className="w-4 h-4" />
                  {isRegistering.has(event.id) ? 'Registering...' : 'Register'}
                </button>
              )}
              
              {event.registered && (
                <div className="registered-info">
                  <CheckCircle className="w-4 h-4" />
                  <span>Registered</span>
                </div>
              )}
              
              {isAdmin && (
                <div className="admin-actions">
                  <button className="edit-btn">
                    <Edit className="w-3 h-3" />
                  </button>
                  <button onClick={() => {
                    setSelectedEventForAttendees(event);
                    setShowAttendeesModal(true);
                  }} className="attendees-btn">
                    <Users className="w-3 h-3" />
                  </button>
                  {event.status === 'completed' && (
                    <button className="archive-btn" onClick={() => handleArchiveEvent(event.id)}>
                      <Archive className="w-3 h-3" />
                    </button>
                  )}
                  <button className="delete-btn" onClick={() => handleDeleteEvent(event.id)}>
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {filteredEvents.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <Calendar className="w-12 h-12" />
            </div>
            <h3>No events found</h3>
            <p>{isAdmin ? 'Create your first club event' : 'Check back later for upcoming events'}</p>
            {isAdmin && (
              <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
                <Plus className="w-4 h-4" />
                Create Event
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderEventDetails = () => {
    if (!selectedEvent) return null;

    return (
      <div className="event-details">
        <div className="details-header">
          <button onClick={() => setSelectedEvent(null)} className="back-btn">
            <ArrowLeft className="w-5 h-5" />
            Back to Events
          </button>
          
          <div className="event-title">
            <h2>{selectedEvent.name}</h2>
            <div className="event-badges">
              <span className={`status ${getStatusColor(selectedEvent.status)}`}>
                {getStatusIcon(selectedEvent.status)}
                {selectedEvent.status}
              </span>
              <span className="event-type">
                {getTypeIcon(selectedEvent.type)}
                {selectedEvent.type}
              </span>
              <span className="event-mode">
                {getModeIcon(selectedEvent.mode)}
                {selectedEvent.mode}
              </span>
            </div>
          </div>
        </div>

        <div className="details-content">
          <div className="event-overview">
            <h3>Event Overview</h3>
            <p>{selectedEvent.description}</p>
            
            <div className="overview-grid">
              <div className="overview-item">
                <Calendar className="w-5 h-5" />
                <div>
                  <strong>Date</strong>
                  <p>{new Date(selectedEvent.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="overview-item">
                <Clock className="w-5 h-5" />
                <div>
                  <strong>Time</strong>
                  <p>{selectedEvent.time}</p>
                </div>
              </div>
              <div className="overview-item">
                {getModeIcon(selectedEvent.mode)}
                <div>
                  <strong>Venue</strong>
                  <p>{selectedEvent.venue}</p>
                </div>
              </div>
              <div className="overview-item">
                <Users className="w-5 h-5" />
                <div>
                  <strong>Capacity</strong>
                  <p>{selectedEvent.currentAttendees}/{selectedEvent.maxAttendees} attendees</p>
                </div>
              </div>
            </div>
          </div>

          <div className="event-requirements">
            <h3>Requirements</h3>
            <p>{selectedEvent.requirements}</p>
          </div>

          <div className="event-tags-section">
            <h3>Tags</h3>
            <div className="tags-list">
              {selectedEvent.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </div>

          <div className="event-organizer-info">
            <h3>Organizer</h3>
            <div className="organizer-card">
              <div className="organizer-avatar">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedEvent.organizer.name}`} alt={selectedEvent.organizer.name} />
              </div>
              <div className="organizer-details">
                <h4>{selectedEvent.organizer.name}</h4>
                <p>{selectedEvent.organizer.role}</p>
              </div>
            </div>
          </div>

          {selectedEvent.registered && (
            <div className="registration-status">
              <h3>Your Registration</h3>
              <div className="status-card">
                <CheckCircle className="w-5 h-5" />
                <div>
                  <strong>Registered</strong>
                  <p>Registered on {new Date(selectedEvent.registeredAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              {attendanceData[selectedEvent.id] && (
                <div className="attendance-status">
                  {attendanceData[selectedEvent.id].find(a => a.id === user?.id)?.attended ? (
                    <div className="status-card success">
                      <CheckCircle className="w-5 h-5" />
                      <div>
                        <strong>Attended</strong>
                        <p>Your attendance has been recorded</p>
                      </div>
                    </div>
                  ) : (
                    <div className="status-card pending">
                      <Clock className="w-5 h-5" />
                      <div>
                        <strong>Attendance Pending</strong>
                        <p>Attendance will be marked after the event</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="event-actions">
            {selectedEvent.status === 'upcoming' && selectedEvent.registrationsOpen && !selectedEvent.registered && (
              <button 
                onClick={() => handleRegister(selectedEvent.id)}
                disabled={isRegistering.has(selectedEvent.id)}
                className="btn btn-primary"
              >
                <UserPlus className="w-4 h-4" />
                {isRegistering.has(selectedEvent.id) ? 'Registering...' : 'Register for Event'}
              </button>
            )}
            
            {selectedEvent.registered && (
              <div className="registered-info">
                <CheckCircle className="w-4 h-4" />
                <span>You are registered for this event</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCreateModal = () => (
    <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Club Event</h2>
          <button onClick={() => setShowCreateModal(false)} className="modal-close">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="event-form">
            <div className="form-row">
              <div className="form-group">
                <label>Event Name</label>
                <input
                  type="text"
                  placeholder="Enter event name"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="form-group">
                <label>Event Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="competition">Competition</option>
                  <option value="social">Social Event</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Describe the event..."
                rows={4}
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Mode</label>
                <select
                  value={newEvent.mode}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, mode: e.target.value }))}
                >
                  <option value="offline">Offline</option>
                  <option value="online">Online</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Venue</label>
                <input
                  type="text"
                  placeholder="Event venue or meeting link"
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, venue: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Maximum Attendees</label>
              <input
                type="number"
                placeholder="Maximum number of attendees"
                value={newEvent.maxAttendees}
                onChange={(e) => setNewEvent(prev => ({ ...prev, maxAttendees: e.target.value }))}
              />
            </div>
            
            <div className="form-group">
              <label>Requirements</label>
              <textarea
                placeholder="What participants should bring or prepare..."
                rows={2}
                value={newEvent.requirements}
                onChange={(e) => setNewEvent(prev => ({ ...prev, requirements: e.target.value }))}
              />
            </div>
            
            <div className="form-actions">
              <button onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleCreateEvent} className="btn btn-primary">
                <Plus className="w-4 h-4" />
                Create Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAttendeesModal = () => {
    if (!selectedEventForAttendees) return null;

    const attendees = attendanceData[selectedEventForAttendees.id] || [];

    return (
      <div className="modal-overlay" onClick={() => setShowAttendeesModal(false)}>
        <div className="modal-container attendees-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Event Attendees - {selectedEventForAttendees.name}</h2>
            <button onClick={() => setShowAttendeesModal(false)} className="modal-close">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="modal-content">
            <div className="attendees-stats">
              <div className="stat-card">
                <Users className="w-5 h-5" />
                <span>{attendees.length}</span>
                <label>Total Registered</label>
              </div>
              <div className="stat-card">
                <CheckCircle className="w-5 h-5" />
                <span>{attendees.filter(a => a.attended).length}</span>
                <label>Attended</label>
              </div>
              <div className="stat-card">
                <XCircle className="w-5 h-5" />
                <span>{attendees.filter(a => !a.attended).length}</span>
                <label>Absent</label>
              </div>
            </div>

            <div className="attendees-list">
              {attendees.map(attendee => (
                <div key={attendee.id} className="attendee-card">
                  <div className="attendee-info">
                    <div className="attendee-avatar">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${attendee.name}`} alt={attendee.name} />
                    </div>
                    <div className="attendee-details">
                      <h4>{attendee.name}</h4>
                      <p>{attendee.rollNumber}</p>
                      <span>Registered {new Date(attendee.registeredAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="attendance-control">
                    <label>Attendance</label>
                    <button
                      onClick={() => handleUpdateAttendance(selectedEventForAttendees.id, attendee.id, !attendee.attended)}
                      className={`attendance-btn ${attendee.attended ? 'present' : 'absent'}`}
                    >
                      {attendee.attended ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Present
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          Absent
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button onClick={() => {
                // Export attendance data
                console.log('Exporting attendance data...');
              }} className="btn btn-secondary">
                <Download className="w-4 h-4" />
                Export Attendance
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {selectedEvent ? renderEventDetails() : renderEventsList()}
      {showCreateModal && renderCreateModal()}
      {showAttendeesModal && renderAttendeesModal()}
    </>
  );
};

export default ClubEvents;
