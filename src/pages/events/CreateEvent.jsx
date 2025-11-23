import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './CreateEvent.css';

const EVENT_TYPES = ['workshop', 'hackathon', 'seminar', 'webinar', 'meetup', 'competition', 'conference', 'other'];
const CATEGORIES = ['web', 'mobile', 'ai-ml', 'blockchain', 'iot', 'game', 'general', 'other'];

export default function CreateEvent() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'workshop',
    category: 'general',
    startDate: '',
    endDate: '',
    location: {
      isOnline: false,
      venue: '',
      address: '',
      city: '',
      meetingUrl: ''
    },
    maxParticipants: '',
    registrationDeadline: '',
    speakers: [],
    coverImage: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [speakerForm, setSpeakerForm] = useState({
    name: '',
    title: '',
    bio: '',
    image: ''
  });

  if (!user) {
    return (
      <div className="create-event-page">
        <div className="error-state">
          <h2>Authentication Required</h2>
          <p>You must be logged in to create an event.</p>
          <button onClick={() => navigate('/login')} className="btn btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('location.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: { ...prev.location, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLocationTypeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, isOnline: e.target.checked }
    }));
  };

  const handleAddSpeaker = () => {
    if (!speakerForm.name || !speakerForm.title) {
      alert('Please fill in speaker name and title');
      return;
    }
    setFormData(prev => ({
      ...prev,
      speakers: [...prev.speakers, { ...speakerForm }]
    }));
    setSpeakerForm({ name: '', title: '', bio: '', image: '' });
  };

  const handleRemoveSpeaker = (index) => {
    setFormData(prev => ({
      ...prev,
      speakers: prev.speakers.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (!formData.location.isOnline) {
      if (!formData.location.venue) newErrors['location.venue'] = 'Venue is required';
      if (!formData.location.city) newErrors['location.city'] = 'City is required';
    } else {
      if (!formData.location.meetingUrl) newErrors['location.meetingUrl'] = 'Meeting URL is required';
    }

    if (formData.maxParticipants && isNaN(formData.maxParticipants)) {
      newErrors.maxParticipants = 'Max participants must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fix the errors below');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
        registrationDeadline: formData.registrationDeadline || null
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/events`,
        payload,
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );

      navigate(`/event/${response.data.data._id}`);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed to create event' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-page">
      <div className="create-event-header">
        <h1>Create New Event</h1>
        <p>Share your amazing event with the AID-X community</p>
      </div>

      <form className="create-event-form" onSubmit={handleSubmit}>
        <div className="form-container">
          {/* Basic Info */}
          <section className="form-section">
            <h2>Basic Information</h2>

            <div className="form-group">
              <label>Event Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Web Development Workshop 2024"
                className={errors.title ? 'input-error' : ''}
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your event in detail..."
                rows="6"
                className={errors.description ? 'input-error' : ''}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Event Type *</label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                >
                  {EVENT_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'ai-ml' ? 'AI & Machine Learning' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Cover Image URL</label>
              <input
                type="url"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </section>

          {/* Date & Time */}
          <section className="form-section">
            <h2>Date & Time</h2>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date & Time *</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={errors.startDate ? 'input-error' : ''}
                />
                {errors.startDate && <span className="error-text">{errors.startDate}</span>}
              </div>

              <div className="form-group">
                <label>End Date & Time *</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={errors.endDate ? 'input-error' : ''}
                />
                {errors.endDate && <span className="error-text">{errors.endDate}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Registration Deadline</label>
              <input
                type="datetime-local"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* Location */}
          <section className="form-section">
            <h2>Location</h2>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.location.isOnline}
                  onChange={handleLocationTypeChange}
                />
                This is an online event
              </label>
            </div>

            {formData.location.isOnline ? (
              <div className="form-group">
                <label>Meeting URL *</label>
                <input
                  type="url"
                  name="location.meetingUrl"
                  value={formData.location.meetingUrl}
                  onChange={handleChange}
                  placeholder="https://zoom.us/meeting/..."
                  className={errors['location.meetingUrl'] ? 'input-error' : ''}
                />
                {errors['location.meetingUrl'] && (
                  <span className="error-text">{errors['location.meetingUrl']}</span>
                )}
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label>Venue Name *</label>
                  <input
                    type="text"
                    name="location.venue"
                    value={formData.location.venue}
                    onChange={handleChange}
                    placeholder="e.g., Tech Hub Convention Center"
                    className={errors['location.venue'] ? 'input-error' : ''}
                  />
                  {errors['location.venue'] && (
                    <span className="error-text">{errors['location.venue']}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      name="location.address"
                      value={formData.location.address}
                      onChange={handleChange}
                      placeholder="Street address"
                    />
                  </div>

                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleChange}
                      placeholder="City"
                      className={errors['location.city'] ? 'input-error' : ''}
                    />
                    {errors['location.city'] && (
                      <span className="error-text">{errors['location.city']}</span>
                    )}
                  </div>
                </div>
              </>
            )}
          </section>

          {/* Capacity */}
          <section className="form-section">
            <h2>Capacity & Registration</h2>

            <div className="form-group">
              <label>Max Participants (Leave empty for unlimited)</label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                placeholder="e.g., 100"
                min="1"
                className={errors.maxParticipants ? 'input-error' : ''}
              />
              {errors.maxParticipants && (
                <span className="error-text">{errors.maxParticipants}</span>
              )}
            </div>
          </section>

          {/* Speakers */}
          <section className="form-section">
            <h2>Speakers & Mentors</h2>

            <div className="speaker-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={speakerForm.name}
                    onChange={(e) => setSpeakerForm({ ...speakerForm, name: e.target.value })}
                    placeholder="Speaker name"
                  />
                </div>

                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={speakerForm.title}
                    onChange={(e) => setSpeakerForm({ ...speakerForm, title: e.target.value })}
                    placeholder="e.g., Senior Developer"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={speakerForm.bio}
                  onChange={(e) => setSpeakerForm({ ...speakerForm, bio: e.target.value })}
                  placeholder="Speaker biography"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={speakerForm.image}
                  onChange={(e) => setSpeakerForm({ ...speakerForm, image: e.target.value })}
                  placeholder="https://example.com/speaker.jpg"
                />
              </div>

              <button
                type="button"
                onClick={handleAddSpeaker}
                className="btn btn-secondary"
              >
                + Add Speaker
              </button>
            </div>

            {formData.speakers.length > 0 && (
              <div className="speakers-list">
                <h3>Added Speakers</h3>
                {formData.speakers.map((speaker, idx) => (
                  <div key={idx} className="speaker-item">
                    <div className="speaker-info">
                      <h4>{speaker.name}</h4>
                      <p>{speaker.title}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpeaker(idx)}
                      className="btn-remove"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Submit */}
          {errors.submit && (
            <div className="error-message">{errors.submit}</div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
