# Admin Dashboard Documentation

## Overview
The Admin Dashboard is a comprehensive management interface for the entire AID-X Club website. It provides administrators and coordinators with powerful tools to manage users, events, projects, and view analytics.

## Access
- **URL**: `/admin/dashboard`
- **Required Role**: Admin or Coordinator
- **Authentication**: Protected route - requires login

## Features

### 1. Overview Tab 📊
The dashboard home page displaying key metrics and quick actions.

**Statistics Cards:**
- Total Users
- Total Events
- Total Projects
- Active Events
- Pending Approvals
- Event Registrations

**Quick Actions:**
- Create Event
- Create Project
- Manage Users
- View Analytics

### 2. Users Tab 👥
Complete user management system.

**Features:**
- View all registered users
- Update user roles (Student, Coordinator, Admin)
- Delete users
- View user details (Name, Email, Student ID, Join Date)
- Search and filter users

**User Roles:**
- **Student**: Basic access to events and projects
- **Coordinator**: Can create and manage events/projects
- **Admin**: Full system access

### 3. Events Tab 📅
Comprehensive event management.

**Features:**
- View all events in card layout
- Event status indicators (Upcoming, Ongoing, Completed)
- View event details
- Delete events
- Create new events
- See registration counts
- View event location and date

**Event Information Displayed:**
- Event title
- Status badge
- Date and time
- Location (venue or online)
- Registration count
- Quick actions (View, Delete)

### 4. Projects Tab 🚀
Full project management capabilities.

**Features:**
- View all projects in card grid
- Project status indicators
- View project details
- Delete projects
- Create new projects
- See project engagement (likes)
- View project tags

**Project Information Displayed:**
- Project title
- Status badge
- Description preview
- Technology tags
- Likes count
- Quick actions (View, Delete)

### 5. Analytics Tab 📈
Insights and data visualization.

**Analytics Sections:**
- **User Growth**: Track user registration trends
- **Event Participation**: Monitor event engagement
- **Project Submissions**: Track project activity
- **Popular Categories**: See trending topics

**Metrics:**
- Growth percentages
- Total counts
- Category distribution
- Engagement rates

### 6. Settings Tab ⚙️
System configuration and preferences.

**General Settings:**
- Club name
- Contact email
- Website description

**Event Settings:**
- Require approval for new events
- Email notifications for registrations
- Maximum participants per event

**Project Settings:**
- Require approval for new projects
- Allow anonymous submissions

## Design Features

### Visual Design
- **Glassmorphism Effect**: Modern dark glass aesthetic matching the events page
- **Background**: Same beautiful background image as student dashboard
- **Color Scheme**: Dark theme with white/light text
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Fully responsive design for all screen sizes

### UI Components
- **Navigation Bar**: Sticky top navbar with user info and logout
- **Sidebar**: Tab-based navigation with icons
- **Cards**: Glassmorphic cards for stats and content
- **Tables**: Responsive tables with inline editing
- **Buttons**: Consistent button styles with hover effects
- **Forms**: Clean form inputs with focus states

### User Experience
- **Loading States**: Spinner animation while fetching data
- **Hover Effects**: Interactive feedback on all clickable elements
- **Smooth Animations**: Fade-in effects for tab transitions
- **Confirmation Dialogs**: Confirm before destructive actions
- **Error Handling**: User-friendly error messages

## Technical Implementation

### State Management
- React hooks (useState, useEffect)
- Auth context integration
- Real-time data fetching

### API Integration
- Axios for HTTP requests
- Token-based authentication
- Error handling with fallbacks

### Responsive Breakpoints
- **Desktop**: Full sidebar and multi-column grids
- **Tablet** (1024px): Horizontal sidebar, adjusted grids
- **Mobile** (768px): Stacked layout, single column
- **Small Mobile** (480px): Compact buttons and spacing

## Usage Guide

### For Administrators

1. **Access Dashboard**
   - Navigate to `/admin/dashboard`
   - Must be logged in with admin/coordinator role

2. **Manage Users**
   - Click "Users" tab
   - Change roles using dropdown
   - Delete users with trash icon

3. **Manage Events**
   - Click "Events" tab
   - View all events in cards
   - Click "View" to see details
   - Click "Delete" to remove event
   - Use "Create Event" button for new events

4. **Manage Projects**
   - Click "Projects" tab
   - Similar workflow to events
   - View, delete, or create projects

5. **View Analytics**
   - Click "Analytics" tab
   - Review growth metrics
   - Check popular categories

6. **Configure Settings**
   - Click "Settings" tab
   - Update general settings
   - Configure event/project preferences
   - Save changes

### Navigation
- **Home Button**: Return to main website
- **Logout Button**: Sign out of admin dashboard
- **Sidebar Tabs**: Switch between different sections
- **Quick Actions**: Fast access to common tasks

## Security Features

- **Role-Based Access**: Only admin/coordinator can access
- **Protected Routes**: Authentication required
- **Confirmation Dialogs**: Prevent accidental deletions
- **Token Authentication**: Secure API requests

## Future Enhancements

Potential features for future versions:
- Real-time notifications
- Advanced analytics charts (Chart.js/Recharts)
- Bulk operations (multi-select)
- Export data to CSV/Excel
- Email template management
- Activity logs and audit trail
- Advanced search and filtering
- User profile editing
- Event attendance tracking
- Project approval workflow

## Troubleshooting

**Dashboard not loading:**
- Check if user has admin/coordinator role
- Verify authentication token is valid
- Check browser console for errors

**Data not displaying:**
- API endpoints may need configuration
- Check network tab for failed requests
- Verify backend is running

**Permission errors:**
- Ensure user role is admin or coordinator
- Check token expiration
- Re-login if necessary

## API Endpoints Used

```javascript
// Stats
GET /api/admin/stats

// Users
GET /api/admin/users
DELETE /api/admin/users/:id
PATCH /api/admin/users/:id/role

// Events
GET /api/events
DELETE /api/events/:id

// Projects
GET /api/projects
DELETE /api/projects/:id
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Performance

- Lazy loading for large datasets
- Optimized re-renders with React hooks
- Cached data where appropriate
- Efficient backdrop-filter usage

---

**Version**: 1.0.0  
**Last Updated**: December 2025  
**Maintained By**: AID-X Club Development Team
