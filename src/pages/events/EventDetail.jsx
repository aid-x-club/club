import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './EventDetail.css';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Modal state
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [guestFormData, setGuestFormData] = useState({
    name: '',
    rollNo: '',
    college: '',
    email: '',
    contactNo: ''
  });

  // Show static demo event detail if id is 'demo123'
  if (id === 'demo123') {
    return (
      <div className="gdg-demo-detail-page" style={{ background: '#fff', minHeight: '100vh', fontFamily: 'Google Sans, Roboto, Arial, sans-serif' }}>
        {/* Banner */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 0 0 0' }}>
          <div style={{ background: '#f5f5f5', borderRadius: 24, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 220, marginBottom: 32 }}>
            <img src="/images/s/club_logo.png" alt="AID-X Demo Event Banner" style={{ width: 320, height: 180, objectFit: 'contain', margin: 32 }} />
            <div style={{ flex: 1 }} />
          </div>
        </div>
        {/* Main Info */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 0 32px 0' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#222', marginBottom: 8 }}>AID-X Demo Event 2025</h1>
          <div style={{ fontSize: '1.1rem', color: '#1a73e8', fontWeight: 500, marginBottom: 8 }}>AID-X Club Auditorium</div>
          <div style={{ fontSize: '1rem', color: '#444', marginBottom: 16 }}>AID-X Club, Residency Road, Hyderabad, 440001</div>
          <div style={{ fontSize: '1rem', color: '#1a73e8', marginBottom: 16 }}>AID-X Club</div>
          <div style={{ fontSize: '1.1rem', color: '#444', marginBottom: 16 }}>
            AID-X Demo Event 2025 is a flagship tech event organized by AID-X Club, bringing together developers, students, and tech enthusiasts to learn, connect, and explore the latest in AI and club technologies.
          </div>
          {/* Social icons */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            <a href="mailto:shubhamvasantgundu@gmail.com" style={{ color: '#222', fontSize: 24, textDecoration: 'none' }}>✉️</a>
            <a href="https://www.linkedin.com/in/shubhamvasantgundu/" target="_blank" rel="noopener noreferrer" style={{ color: '#222', fontSize: 24, textDecoration: 'none' }}>in</a>
          </div>
        </div>
        {/* Date, RSVP, and Key Themes */}
        <div style={{ background: '#f5f5f5', borderRadius: 0, padding: '24px 0', marginBottom: 32 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '1.1rem', color: '#222', fontWeight: 600 }}>
              Dec 21, 9:00 AM – 7:00 PM (GMT+5:30) &nbsp; <span style={{ color: '#888', fontWeight: 400 }}>0 RSVP'd</span>
            </div>
            <button className="gdg-view-details-btn" style={{ background: '#1a73e8', color: '#fff', fontWeight: 600, fontSize: '1.1rem', borderRadius: 6, padding: '10px 32px', border: 'none', cursor: 'pointer' }} onClick={() => {
              if (user) {
                alert(`RSVP confirmed for ${user.fullName}! Your registered details have been saved.`);
              } else {
                setShowRSVPModal(true);
              }
            }}>Get tickets</button>
          </div>
        </div>
        {/* About and Key Themes */}
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Key Themes */}
          <div style={{ minWidth: 220, flex: '0 0 220px' }}>
            <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 16 }}>Key Themes</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span className="gdg-tag-chip" style={{ border: '1.5px solid #bbb', background: '#fff', color: '#222', fontWeight: 500, fontSize: '1rem', borderRadius: 20, padding: '6px 18px', marginBottom: 2 }}>AI</span>
              <span className="gdg-tag-chip" style={{ border: '1.5px solid #bbb', background: '#fff', color: '#222', fontWeight: 500, fontSize: '1rem', borderRadius: 20, padding: '6px 18px', marginBottom: 2 }}>Hackathon</span>
              <span className="gdg-tag-chip" style={{ border: '1.5px solid #bbb', background: '#fff', color: '#222', fontWeight: 500, fontSize: '1rem', borderRadius: 20, padding: '6px 18px', marginBottom: 2 }}>Student</span>
              <span className="gdg-tag-chip" style={{ border: '1.5px solid #bbb', background: '#fff', color: '#222', fontWeight: 500, fontSize: '1rem', borderRadius: 20, padding: '6px 18px', marginBottom: 2 }}>AI & Machine Learning</span>
            </div>
          </div>
          {/* About Section */}
          <div style={{ flex: 1, minWidth: 320 }}>
            <div style={{ fontWeight: 700, fontSize: '2rem', marginBottom: 16 }}>About this event</div>
            <div style={{ fontSize: '1.1rem', color: '#222', marginBottom: 18 }}>
              <b>AID-X Demo Event 2025</b> is a flagship tech event organized by <b>AID-X Club</b>, bringing together developers, students, and tech enthusiasts to learn, connect, and explore the latest in AI and club technologies. The event features expert-led sessions, hands-on workshops, and networking opportunities around topics like AI, Cloud, Web, and more — fostering collaboration, innovation, and community growth in the Hyderabad tech ecosystem.
            </div>
            <div style={{ fontWeight: 600, fontSize: '1.2rem', margin: '24px 0 8px 0' }}>1. Regular Registration — Free</div>
            <ul style={{ fontSize: '1.05rem', color: '#222', marginBottom: 18 }}>
              <li>Entry to all key sessions and tracks</li>
              <li>Access to workshops and experience zones</li>
              <li>Networking lunch</li>
              <li>Certificate of participation</li>
            </ul>
            <div style={{ fontWeight: 600, fontSize: '1.2rem', margin: '24px 0 8px 0' }}>2. VIP Registration — ₹499</div>
            <ul style={{ fontSize: '1.05rem', color: '#222', marginBottom: 18 }}>
              <li>Front-row seating for all sessions</li>
              <li>Exclusive dinner with speakers and community leaders</li>
              <li>Premium AID-X merchandise and early access to updates</li>
              <li>VIP photo ops and networking access</li>
            </ul>
          </div>
        </div>
        {/* Organizer Section */}
        <div style={{ maxWidth: 1100, margin: '64px auto 0 auto', textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: '2.2rem', marginBottom: 32 }}>Organizers</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 64, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 220 }}>
              <img src="/images/s/club_logo.png" alt="Shubham" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', marginBottom: 16, background: '#f5f5f5' }} />
              <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 4 }}>Shubham Gundu</div>
              <div style={{ color: '#444', fontSize: '1.05rem', marginBottom: 2 }}>AID-X Club</div>
              <div style={{ color: '#888', fontSize: '1rem', marginBottom: 8 }}>Lead Organizer</div>
            </div>
          </div>
        </div>
        {/* Back Button */}
        <div style={{ maxWidth: 1100, margin: '40px auto 0 auto', textAlign: 'left' }}>
          <button onClick={() => navigate('/events')} className="back-button-full" style={{ marginTop: 32, background: 'none', border: 'none', color: '#1a73e8', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer' }}>
            ← Back to Events
          </button>
        </div>

        {/* RSVP Modal */}
        {showRSVPModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            fontFamily: 'Google Sans, Roboto, Arial, sans-serif'
          }}>
            <div style={{
              background: '#fff',
              borderRadius: 12,
              padding: 32,
              maxWidth: 500,
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 8, color: '#222' }}>RSVP for Event</h2>
              <p style={{ fontSize: '1rem', color: '#666', marginBottom: 24 }}>Choose your registration option:</p>

              {/* Club Member Option */}
              <div style={{ marginBottom: 24 }}>
                <button
                  onClick={() => {
                    localStorage.setItem('redirectPath', `/event/${id}`);
                    navigate('/login');
                  }}
                  style={{
                    width: '100%',
                    padding: 16,
                    background: '#f1f3f4',
                    border: '2px solid #e0e0e0',
                    borderRadius: 8,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#222',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => { e.target.style.background = '#e8eaed'; e.target.style.borderColor = '#1a73e8'; }}
                  onMouseLeave={(e) => { e.target.style.background = '#f1f3f4'; e.target.style.borderColor = '#e0e0e0'; }}
                >
                  👤 I'm an Active Club Member
                </button>
              </div>

              <div style={{ fontSize: '0.95rem', color: '#888', textAlign: 'center', marginBottom: 20 }}>OR</div>

              {/* Non-Member Form */}
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!guestFormData.name || !guestFormData.email || !guestFormData.rollNo || !guestFormData.college || !guestFormData.contactNo) {
                  alert('Please fill in all fields');
                  return;
                }
                alert(`Thank you ${guestFormData.name}! Your RSVP has been recorded. Check your email for confirmation.`);
                setShowRSVPModal(false);
                setGuestFormData({
                  name: '',
                  rollNo: '',
                  college: '',
                  email: '',
                  contactNo: ''
                });
              }} style={{ marginBottom: 16 }}>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#222', marginBottom: 16 }}>Not a member? Register as guest:</p>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#222' }}>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={guestFormData.name}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      setGuestFormData(prev => ({
                        ...prev,
                        [name]: value
                      }));
                    }}
                    placeholder="Enter your full name"
                    style={{ width: '100%', padding: 10, border: '1.5px solid #ddd', borderRadius: 6, fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#222' }}>Roll Number *</label>
                  <input
                    type="text"
                    name="rollNo"
                    value={guestFormData.rollNo}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      setGuestFormData(prev => ({
                        ...prev,
                        [name]: value
                      }));
                    }}
                    placeholder="Enter your roll number"
                    style={{ width: '100%', padding: 10, border: '1.5px solid #ddd', borderRadius: 6, fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#222' }}>College *</label>
                  <input
                    type="text"
                    name="college"
                    value={guestFormData.college}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      setGuestFormData(prev => ({
                        ...prev,
                        [name]: value
                      }));
                    }}
                    placeholder="Enter your college name"
                    style={{ width: '100%', padding: 10, border: '1.5px solid #ddd', borderRadius: 6, fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#222' }}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={guestFormData.email}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      setGuestFormData(prev => ({
                        ...prev,
                        [name]: value
                      }));
                    }}
                    placeholder="Enter your email"
                    style={{ width: '100%', padding: 10, border: '1.5px solid #ddd', borderRadius: 6, fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#222' }}>Contact Number *</label>
                  <input
                    type="tel"
                    name="contactNo"
                    value={guestFormData.contactNo}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      setGuestFormData(prev => ({
                        ...prev,
                        [name]: value
                      }));
                    }}
                    placeholder="Enter your phone number"
                    style={{ width: '100%', padding: 10, border: '1.5px solid #ddd', borderRadius: 6, fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: 12,
                    background: '#1a73e8',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginBottom: 12
                  }}
                >
                  Register as Guest
                </button>
              </form>

              <button
                onClick={() => {
                  setShowRSVPModal(false);
                  setGuestFormData({ name: '', rollNo: '', college: '', email: '', contactNo: '' });
                }}
                style={{
                  width: '100%',
                  padding: 12,
                  background: '#f1f3f4',
                  color: '#666',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // For other events - fetch from backend
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

  // Multi-stage event logic (example: hackathon/ideathon)
  const isMultiStage = ['hackathon', 'ideathon'].includes(event.eventType);
  const isWorkshop = event.eventType === 'workshop';
  const isAdmin = user && (user.role === 'admin' || user.role === 'coordinator');

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
          {/* Multi-Stage Progress (for hackathons/ideathons) */}
          {isMultiStage && (
            <section className="event-section">
              <h2>Event Stages</h2>
              <ol className="event-stages-list">
                <li className="stage-item">1. Idea Submission {event.stage === 'idea' && <span className="stage-active">(Current)</span>}</li>
                <li className="stage-item">2. Shortlisting {event.stage === 'shortlist' && <span className="stage-active">(Current)</span>}</li>
                <li className="stage-item">3. Final Presentation {event.stage === 'final' && <span className="stage-active">(Current)</span>}</li>
                {event.stage === 'results' && <li className="stage-item stage-active">Results Announced</li>}
              </ol>
            </section>
          )}

          {/* Team Registration (for hackathons/ideathons) */}
          {isMultiStage && (
            <section className="event-section">
              <h2>Team Registration</h2>
              {isRegistered ? (
                <div className="team-info">
                  <p><b>Your Team:</b> [Team Name Here]</p>
                  <ul>
                    <li>Member 1 (You)</li>
                    <li>Member 2</li>
                    <li>Member 3</li>
                  </ul>
                  <button className="btn btn-secondary">Edit Team</button>
                </div>
              ) : (
                <div className="team-register">
                  <p>Register as a team to participate in this event.</p>
                  <button className="btn btn-primary">Create/Join Team</button>
                </div>
              )}
            </section>
          )}

          {/* Submission Section (for hackathons/ideathons) */}
          {isMultiStage && isRegistered && (
            <section className="event-section">
              <h2>Project Submission</h2>
              <form className="submission-form">
                <label>GitHub Repo Link
                  <input type="url" placeholder="https://github.com/yourproject" />
                </label>
                <label>PPT/Document Upload
                  <input type="file" accept=".pdf,.ppt,.pptx,.doc,.docx" />
                </label>
                <label>Demo Link (optional)
                  <input type="url" placeholder="https://demo.com" />
                </label>
                <button className="btn btn-primary">Submit</button>
              </form>
            </section>
          )}

          {/* Workshop Session Schedule (for workshops) */}
          {isWorkshop && event.sessions && event.sessions.length > 0 && (
            <section className="event-section">
              <h2>Session Schedule</h2>
              <ul className="session-list">
                {event.sessions.map((session, idx) => (
                  <li key={idx}>
                    <b>{session.title}</b> - {session.speaker} ({formatDate(session.date)} {formatTime(session.date)})
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Certificates/Results (for completed events) */}
          {event.status === 'completed' && (
            <section className="event-section">
              <h2>Results & Certificates</h2>
              <div className="results-list">
                <p>🏆 Winning Teams: [Team Alpha, Team Beta]</p>
                <a href="#" className="btn btn-secondary">Download Certificate</a>
                <a href="#" className="btn btn-secondary">View Project Links</a>
              </div>
            </section>
          )}

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
