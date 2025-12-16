import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Events.css';

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || '';
  const eventType = searchParams.get('eventType') || '';
  const status = searchParams.get('status') || '';
  const sort = searchParams.get('sort') || 'upcoming';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';

  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);

  // Demo event
  const demoEvent = {
    _id: 'demo123',
    title: 'AID-X Demo Event 2025',
    coverImage: '',
    startDate: new Date().toISOString(),
    location: { venue: 'AID-X Club Auditorium' },
    tags: ['AI', 'Hackathon', 'Student'],
    category: 'AI & Machine Learning',
    eventType: 'hackathon',
    shortDescription: 'A showcase demo event for the new AID-X Club Portal. Join us for a day of innovation, learning, and fun!'
  };

  useEffect(() => {
    fetchEvents();
  }, [category, eventType, status, sort, page, search]);

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
      });

      if (category) params.append('category', category);
      if (eventType) params.append('eventType', eventType);
      if (status) params.append('status', status);
      if (sort) params.append('sort', sort);
      if (search) params.append('search', search);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/events?${params}`
      );

      setEvents(response.data.data);
      setTotal(response.data.total);
      setPages(response.data.pages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch events');
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };



  return (
    <div className="events-gdg-page">
      <header className="gdg-header">
        <h1 className="gdg-title">Upcoming events</h1>
        <p className="gdg-subtitle">
          We can't wait to see you at an upcoming event! On this page, you can advance search by location, select event types (how you want to join the event), and/or pick out topics of your interest!
        </p>
      </header>

      {/* Search and Filters Bar */}
      <div className="gdg-filters-bar">
        <input
          type="text"
          className="gdg-search-input"
          placeholder="Search for a Event"
          value={search}
          onChange={handleSearch}
        />
        <select
          className="gdg-filter-select"
          value={eventType}
          onChange={e => handleFilterChange('eventType', e.target.value)}
        >
          <option value="">Event types</option>
          <option value="workshop">Workshop</option>
          <option value="hackathon">Hackathon</option>
          <option value="seminar">Seminar</option>
          <option value="webinar">Webinar</option>
          <option value="meetup">Meetup</option>
          <option value="competition">Competition</option>
          <option value="conference">Conference</option>
          <option value="other">Other</option>
        </select>
        <select
          className="gdg-filter-select"
          value={category}
          onChange={e => handleFilterChange('category', e.target.value)}
        >
          <option value="">Event topics</option>
          <option value="ai-ml">AI & Machine Learning</option>
          <option value="web">Web Development</option>
          <option value="mobile">Mobile App</option>
          <option value="blockchain">Blockchain</option>
          <option value="iot">IoT</option>
          <option value="game">Game Development</option>
          <option value="general">General</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* List Toggle Only (no calendar) */}
      <div className="gdg-toggle-bar">
        <span className="gdg-toggle active">List</span>
      </div>

      {/* Demo Event Card */}
      <main className="gdg-events-list">
        <div className="gdg-event-card">
          <div className="gdg-event-logo">
            <div className="gdg-event-logo-placeholder">A</div>
          </div>
          <div className="gdg-event-main">
            <div className="gdg-event-meta-top">
              <span className="gdg-event-date">{formatDate(demoEvent.startDate)}</span>
              {demoEvent.location?.venue && (
                <span className="gdg-event-location">- {demoEvent.location.venue}</span>
              )}
            </div>
            <h2 className="gdg-event-title">{demoEvent.title}</h2>
            <div className="gdg-event-tags">
              {demoEvent.tags && demoEvent.tags.map((tag, idx) => (
                <span key={idx} className="gdg-tag-chip">{tag}</span>
              ))}
              {demoEvent.category && <span className="gdg-tag-chip">{demoEvent.category}</span>}
              {demoEvent.eventType && <span className="gdg-tag-chip">{demoEvent.eventType}</span>}
            </div>
            <p className="gdg-event-desc">{demoEvent.shortDescription}</p>
            <div style={{ marginTop: '8px' }}>
              <button onClick={() => navigate(`/event/${demoEvent._id}`)} className="gdg-view-details-btn">View details</button>
            </div>
          </div>
        </div>
        {error && <div className="gdg-error-message">{error}</div>}
        {loading ? (
          <div className="gdg-loading-spinner">
            <div className="spinner"></div>
            <p>Loading events...</p>
          </div>
        ) : events.length > 0 ? (
          <>
            {events.map(event => (
              <div key={event._id} className="gdg-event-card">
                <div className="gdg-event-logo">
                  {event.coverImage ? (
                    <img src={event.coverImage} alt={event.title} />
                  ) : (
                    <div className="gdg-event-logo-placeholder">{event.title[0]}</div>
                  )}
                </div>
                <div className="gdg-event-main">
                  <div className="gdg-event-meta-top">
                    <span className="gdg-event-date">{formatDate(event.startDate)}</span>
                    {event.location?.venue && (
                      <span className="gdg-event-location">- {event.location.venue}</span>
                    )}
                  </div>
                  <h2 className="gdg-event-title">{event.title}</h2>
                  <div className="gdg-event-tags">
                    {event.tags && event.tags.map((tag, idx) => (
                      <span key={idx} className="gdg-tag-chip">{tag}</span>
                    ))}
                    {event.category && <span className="gdg-tag-chip">{event.category}</span>}
                    {event.eventType && <span className="gdg-tag-chip">{event.eventType}</span>}
                  </div>
                  <p className="gdg-event-desc">{event.shortDescription || event.description?.substring(0, 120)}...</p>
                  <a href={`/event/${event._id}`} className="gdg-view-details-btn">View details</a>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="gdg-empty-state">
            <p>No events found</p>
            <p>Try adjusting your filters</p>
          </div>
        )}
      </main>
      {/* Pagination */}
      {pages > 1 && (
        <div className="gdg-pagination">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="gdg-pagination-btn"
          >
            ← Previous
          </button>
          <div className="gdg-page-numbers">
            {Array.from({ length: pages }, (_, i) => i + 1).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`gdg-page-number ${page === pageNum ? 'active' : ''}`}
                >
                  {pageNum}
                </button>
              )
            )}
          </div>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === pages}
            className="gdg-pagination-btn"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
