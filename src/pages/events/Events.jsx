import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import './Events.css';

export default function Events() {
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
    <div className="events-page">
      <div className="events-header">
        <h1>Events & Workshops</h1>
        <p>Discover amazing events and networking opportunities</p>
      </div>

      <div className="events-container">
        {/* Sidebar Filters */}
        <aside className="events-sidebar">
          <div className="filter-group">
            <h3>Search</h3>
            <input
              type="text"
              placeholder="Search events..."
              defaultValue={search}
              onChange={handleSearch}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <h3>Event Type</h3>
            <select
              value={eventType}
              onChange={(e) => handleFilterChange('eventType', e.target.value)}
              className="filter-select"
            >
              <option value="">All Types</option>
              <option value="workshop">Workshop</option>
              <option value="hackathon">Hackathon</option>
              <option value="seminar">Seminar</option>
              <option value="webinar">Webinar</option>
              <option value="meetup">Meetup</option>
              <option value="competition">Competition</option>
              <option value="conference">Conference</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="filter-group">
            <h3>Category</h3>
            <select
              value={category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              <option value="web">Web Development</option>
              <option value="mobile">Mobile App</option>
              <option value="ai-ml">AI & Machine Learning</option>
              <option value="blockchain">Blockchain</option>
              <option value="iot">IoT</option>
              <option value="game">Game Development</option>
              <option value="general">General</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="filter-group">
            <h3>Status</h3>
            <select
              value={status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="filter-group">
            <h3>Sort By</h3>
            <select
              value={sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="filter-select"
            >
              <option value="upcoming">Upcoming First</option>
              <option value="trending">Most Popular</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>
        </aside>

        {/* Main Content */}
        <main className="events-main">
          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading events...</p>
            </div>
          ) : events.length > 0 ? (
            <>
              <div className="events-list">
                {events.map((event) => (
                  <a
                    key={event._id}
                    href={`/event/${event._id}`}
                    className="event-card"
                  >
                    <div className="event-card-left">
                      {event.coverImage && (
                        <img
                          src={event.coverImage}
                          alt={event.title}
                          className="event-image"
                        />
                      )}
                    </div>

                    <div className="event-card-right">
                      <div className="event-header">
                        <h3>{event.title}</h3>
                        <span className={`status-badge status-${event.status}`}>
                          {event.status}
                        </span>
                      </div>

                      <p className="event-description">
                        {event.shortDescription || event.description.substring(0, 100)}...
                      </p>

                      <div className="event-meta">
                        <div className="meta-item">
                          📅 {formatDate(event.startDate)}
                        </div>
                        <div className="meta-item">
                          🕐 {formatTime(event.startDate)}
                        </div>
                        {event.location?.isOnline ? (
                          <div className="meta-item">🌐 Online</div>
                        ) : event.location?.venue ? (
                          <div className="meta-item">📍 {event.location.venue}</div>
                        ) : null}
                      </div>

                      <div className="event-tags">
                        <span className="event-type-badge">{event.eventType}</span>
                        <span className="event-category-badge">{event.category}</span>
                      </div>

                      <div className="event-footer">
                        <div className="event-stats">
                          <span className="stat">
                            👁️ {event.views}
                          </span>
                          <span className="stat">
                            ❤️ {event.likes}
                          </span>
                          <span className="stat">
                            👥 {event.registrationCount}/{event.maxParticipants || '∞'}
                          </span>
                        </div>

                        {event.organizer && (
                          <div className="event-organizer">
                            {event.organizer.profileImage && (
                              <img
                                src={event.organizer.profileImage}
                                alt={event.organizer.fullName}
                                className="organizer-avatar"
                              />
                            )}
                            <span>{event.organizer.fullName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    className="pagination-btn"
                  >
                    ← Previous
                  </button>

                  <div className="page-numbers">
                    {Array.from({ length: pages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`page-number ${
                            page === pageNum ? 'active' : ''
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() => goToPage(page + 1)}
                    disabled={page === pages}
                    className="pagination-btn"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <p>No events found</p>
              <p>Try adjusting your filters</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
