import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './EventDetail.css';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [registrationError, setRegistrationError] = useState('');

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/events/${id}`
      );
      setEvent(response.data.data);
      
      if (user) {
        setIsRegistered(response.data.data.registeredUsers?.some(u => u._id === user.id));
        setIsLiked(response.data.data.likedBy?.includes(user.id));
        setIsSaved(response.data.data.savedBy?.includes(user.id));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setRegistrationError('');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/events/${id}/register`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );
      setIsRegistered(true);
      setEvent(prev => ({
        ...prev,
        registrationCount: prev.registrationCount + 1
      }));
    } catch (err) {
      setRegistrationError(err.response?.data?.message || 'Failed to register');
    }
  };

  const handleUnregister = async () => {
    if (!user) return;

    try {
      setRegistrationError('');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/events/${id}/unregister`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );
      setIsRegistered(false);
      setEvent(prev => ({
        ...prev,
        registrationCount: Math.max(0, prev.registrationCount - 1)
      }));
    } catch (err) {
      setRegistrationError(err.response?.data?.message || 'Failed to unregister');
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/events/${id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );
      setIsLiked(!isLiked);
      setEvent(prev => ({
        ...prev,
        likes: isLiked ? prev.likes - 1 : prev.likes + 1
      }));
    } catch (err) {
      console.error('Failed to like event', err);
    }
  };

  const handleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/events/${id}/save`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );
      setIsSaved(!isSaved);
    } catch (err) {
      console.error('Failed to save event', err);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="event-detail-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-detail-page">
        <div className="error-state">
          <h2>Oops! Event Not Found</h2>
          <p>{error || 'The event you are looking for does not exist.'}</p>
          <button onClick={() => navigate('/events')} className="back-button">
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="event-detail-page">
      {/* Hero Section */}
      <div className="event-hero">
        {event.coverImage && (
          <img src={event.coverImage} alt={event.title} className="hero-image" />
        )}
        <div className="hero-overlay">
          <div className="hero-content">
            <span className={`status-badge status-${event.status}`}>
              {event.status.toUpperCase()}
            </span>
            <h1>{event.title}</h1>
            <p className="hero-subtitle">{event.eventType} • {event.category}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="event-detail-container">
        {/* Left Column */}
        <div className="event-detail-main">
          {/* Quick Info */}
          <div className="quick-info">
            <div className="info-item">
              <span className="info-label">📅 Date</span>
              <span className="info-value">{formatDate(event.startDate)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">🕐 Time</span>
              <span className="info-value">
                {formatTime(event.startDate)} - {formatTime(event.endDate)}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">
                {event.location?.isOnline ? '🌐' : '📍'} Location
              </span>
              <span className="info-value">
                {event.location?.isOnline 
                  ? 'Online Event'
                  : `${event.location?.venue || 'To be announced'}`}
              </span>
            </div>
            {event.location?.address && (
              <div className="info-item">
                <span className="info-label">📮 Address</span>
                <span className="info-value">
                  {event.location.address}, {event.location.city}
                </span>
              </div>
            )}
            {event.location?.meetingUrl && (
              <div className="info-item">
                <span className="info-label">🔗 Meeting Link</span>
                <a href={event.location.meetingUrl} target="_blank" rel="noopener noreferrer" className="meeting-link">
                  Join Meeting
                </a>
              </div>
            )}
          </div>

          {/* Description */}
          <section className="event-section">
            <h2>About This Event</h2>
            <p className="event-description">{event.description}</p>
          </section>

          {/* Speakers */}
          {event.speakers && event.speakers.length > 0 && (
            <section className="event-section">
              <h2>Speakers & Mentors</h2>
              <div className="speakers-grid">
                {event.speakers.map((speaker, idx) => (
                  <div key={idx} className="speaker-card">
                    {speaker.image && (
                      <img src={speaker.image} alt={speaker.name} className="speaker-image" />
                    )}
                    <h3>{speaker.name}</h3>
                    <p className="speaker-title">{speaker.title}</p>
                    <p className="speaker-bio">{speaker.bio}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Registration Info */}
          <section className="event-section">
            <h2>Registration Details</h2>
            <div className="registration-info">
              <div className="reg-stat">
                <span className="stat-number">{event.registrationCount}</span>
                <span className="stat-label">Registered</span>
              </div>
              <div className="reg-stat">
                <span className="stat-number">{event.maxParticipants || '∞'}</span>
                <span className="stat-label">Max Capacity</span>
              </div>
              <div className="reg-stat">
                <span className="stat-number">
                  {event.registrationDeadline 
                    ? new Date(event.registrationDeadline).toLocaleDateString()
                    : 'No Deadline'
                  }
                </span>
                <span className="stat-label">Registration Deadline</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="event-detail-sidebar">
          {/* Registration Section */}
          <div className="sidebar-card registration-card">
            {registrationError && (
              <div className="error-message">{registrationError}</div>
            )}
            {isRegistered ? (
              <>
                <div className="registered-badge">✓ You're Registered!</div>
                <button 
                  onClick={handleUnregister}
                  className="btn btn-secondary"
                >
                  Unregister
                </button>
              </>
            ) : (
              <>
                <p className="registration-seats">
                  {event.maxParticipants && event.registrationCount < event.maxParticipants
                    ? `${event.maxParticipants - event.registrationCount} seats available`
                    : event.maxParticipants
                    ? 'Event is full'
                    : 'Unlimited seats'
                  }
                </p>
                <button 
                  onClick={handleRegister}
                  className="btn btn-primary"
                  disabled={event.maxParticipants && event.registrationCount >= event.maxParticipants}
                >
                  Register Now
                </button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="sidebar-card stats-card">
            <h3>Event Stats</h3>
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-icon">👁️</span>
                <span className="stat-text">{event.views} views</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">❤️</span>
                <span className="stat-text">{event.likes} likes</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">👥</span>
                <span className="stat-text">{event.registrationCount} registered</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="sidebar-card actions-card">
            <button 
              onClick={handleLike}
              className={`action-button ${isLiked ? 'active' : ''}`}
            >
              {isLiked ? '❤️' : '🤍'} {isLiked ? 'Unlike' : 'Like'}
            </button>
            <button 
              onClick={handleSave}
              className={`action-button ${isSaved ? 'active' : ''}`}
            >
              {isSaved ? '🔖' : '📌'} {isSaved ? 'Unsave' : 'Save'}
            </button>
          </div>

          {/* Organizer Info */}
          {event.organizer && (
            <div className="sidebar-card organizer-card">
              <h3>Organized By</h3>
              <div className="organizer-info">
                {event.organizer.profileImage && (
                  <img 
                    src={event.organizer.profileImage} 
                    alt={event.organizer.fullName}
                    className="organizer-avatar"
                  />
                )}
                <div className="organizer-details">
                  <h4>{event.organizer.fullName}</h4>
                  <p className="organizer-role">{event.organizer.role || 'Organizer'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Share */}
          <div className="sidebar-card share-card">
            <h3>Share Event</h3>
            <button className="share-button">
              📋 Copy Link
            </button>
          </div>

          {/* Back Button */}
          <button onClick={() => navigate('/events')} className="back-button-full">
            ← Back to Events
          </button>
        </aside>
      </div>
    </div>
  );
}
