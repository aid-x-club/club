# AID-X Club Portal - Complete Architecture & Implementation Plan

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Tech Stack & Setup](#tech-stack--setup)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Frontend Structure](#frontend-structure)
6. [Implementation Roadmap](#implementation-roadmap)

---

## System Overview

### Three-Tier User System

```
┌─────────────────────────────────────────────────────────────┐
│                     AID-X CLUB PORTAL                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐ │
│  │   STUDENT VIEW   │  │   COORDINATOR    │  │  ADMIN     │ │
│  │   (Dashboard)    │  │   DASHBOARD      │  │  PORTAL    │ │
│  ├──────────────────┤  ├──────────────────┤  ├────────────┤ │
│  │ • My Projects    │  │ • All above +    │  │ • All +    │ │
│  │ • My Events      │  │ • Event Mgmt     │  │ • Students │ │
│  │ • Announcements  │  │ • Batch Projects │  │ • Projects │ │
│  │ • Profile        │  │ • Assist ops     │  │ • Templates│ │
│  │ • Achievements   │  │                  │  │ • Events   │ │
│  └──────────────────┘  └──────────────────┘  │ • Expos    │ │
│                                               │ • Reports  │ │
│                                               └────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack & Setup

### Frontend
- **Framework:** React 18 (existing setup)
- **Styling:** Tailwind CSS + Custom theme colors
- **State Management:** Context API / Redux
- **HTTP Client:** Axios
- **Authentication:** JWT + Firebase Auth
- **UI Components:** Material-UI + custom components
- **Animation:** Framer Motion (matches existing Lottie/Vanilla Tilt vibe)

### Backend
- **Runtime:** Node.js (v16+)
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose)
- **Authentication:** JWT + bcrypt
- **File Upload:** Multer + Cloudinary
- **Task Scheduling:** Node-cron
- **Email:** Nodemailer
- **Real-time:** Socket.io (optional, for live notifications)

### Infrastructure
- **API Hosting:** Vercel / Heroku / Railway
- **Database:** MongoDB Atlas (free tier available)
- **Storage:** Cloudinary (images) / GitHub API (repos)
- **Environment:** .env for configuration

---

## Database Schema

### Collections Overview

```
MongoDB Database: aid-x-club-portal
├── users
├── projects
├── events
├── templates
├── submissions
├── enrollments
├── announcements
├── achievements
└── logs
```

### User Schema

```javascript
// User Model - Collections: users
{
  _id: ObjectId,
  
  // Basic Info
  fullName: String,
  email: String (unique),
  studentId: String (unique, indexed),
  password: String (hashed),
  
  // Profile
  year: Enum ["1st", "2nd", "3rd", "4th"],
  section: String,
  phone: String,
  profileImage: String (URL),
  bio: String,
  
  // Authentication
  role: Enum ["student", "coordinator", "admin"], // default: "student"
  emailVerified: Boolean,
  
  // GitHub Integration
  githubUsername: String,
  githubAccessToken: String (encrypted),
  githubConnected: Boolean,
  
  // Statistics
  projectCount: Number,
  eventCount: Number,
  achievementCount: Number,
  
  // Dates
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}

// Indexes
- studentId (unique)
- email (unique)
- role (for filtering coordinators/admins)
```

### Project Schema

```javascript
// Project Model - Collection: projects
{
  _id: ObjectId,
  
  // Basic Info
  title: String,
  description: String,
  shortDescription: String (max 200 chars),
  
  // Owner & Team
  owner: ObjectId (ref: User),
  teamMembers: [
    {
      userId: ObjectId (ref: User),
      role: Enum ["owner", "developer", "designer", "manager"],
      joinedAt: Date
    }
  ],
  
  // Project Details
  template: ObjectId (ref: Template, nullable),
  domain: Enum [
    "AI/ML", "Data Science", "Web Dev", "Mobile Dev",
    "Cloud/DevOps", "Cybersecurity", "IoT", "UI/UX",
    "Blockchain", "Game Dev", "Robotics", "Other"
  ],
  techStack: [String], // e.g., ["React", "Node.js", "MongoDB"]
  
  // GitHub Integration
  githubRepo: String (URL),
  repoName: String,
  isPublic: Boolean,
  
  // Status & Tracking
  status: Enum ["draft", "active", "completed", "archived"],
  startDate: Date,
  completionDate: Date (nullable),
  
  // Metadata
  showcase: Boolean, // Featured on public page
  mentor: ObjectId (ref: User, nullable),
  adminNotes: String,
  
  // Dates
  createdAt: Date,
  updatedAt: Date,
  
  // Badges/Recognition
  badges: [String], // e.g., ["Best Innovation", "Most Popular"]
}

// Indexes
- owner (for filtering user projects)
- domain (for filtering by tech domain)
- status (for filtering)
- showcase (for public projects page)
```

### Event Schema

```javascript
// Event Model - Collection: events
{
  _id: ObjectId,
  
  // Basic Info
  title: String,
  description: String,
  type: Enum ["workshop", "hackathon", "talk", "competition", "bootcamp", "meetup"],
  
  // Date & Time
  startDate: Date,
  endDate: Date,
  venue: String (nullable, for hybrid events),
  
  // Organizer
  organizer: ObjectId (ref: User), // Faculty/Coordinator
  coordinators: [ObjectId] (ref: User),
  
  // Registration
  registrationOpen: Boolean,
  registrationOpenDate: Date,
  registrationCloseDate: Date,
  maxParticipants: Number (nullable),
  
  // Resources
  posterImage: String (URL),
  description: String,
  agenda: [
    {
      time: String,
      title: String,
      speaker: String (nullable)
    }
  ],
  
  // After Event
  isCompleted: Boolean,
  resources: {
    slidesLink: String (nullable),
    recordingLink: String (nullable),
    notesLink: String (nullable)
  },
  
  // Registrations (relationship via Enrollment collection)
  registrationCount: Number,
  
  // Dates
  createdAt: Date,
  updatedAt: Date
}

// Indexes
- type (for filtering by event type)
- startDate (for ordering upcoming events)
- isCompleted (for filtering)
```

### Template Schema

```javascript
// Template Model - Collection: templates
{
  _id: ObjectId,
  
  // Basic Info
  name: String,
  description: String,
  category: String, // "Frontend", "Backend", "Full-stack", "Data Science", etc.
  
  // Technical
  techStack: [String],
  difficultyLevel: Enum ["beginner", "intermediate", "advanced"],
  
  // GitHub Template Repo
  templateRepoUrl: String,
  templateRepoName: String,
  
  // Metadata
  isActive: Boolean,
  createdBy: ObjectId (ref: User), // Admin
  
  // Stats
  usageCount: Number,
  
  // Dates
  createdAt: Date,
  updatedAt: Date
}

// Indexes
- isActive (for student listing)
- category (for filtering)
```

### Enrollment Schema (Linking Students to Events)

```javascript
// Enrollment Model - Collection: enrollments
{
  _id: ObjectId,
  
  userId: ObjectId (ref: User),
  eventId: ObjectId (ref: Event),
  
  registrationDate: Date,
  attendanceStatus: Enum ["registered", "attended", "no-show"],
  
  // Certificate (if issued)
  certificateIssued: Boolean,
  certificateIssuedDate: Date,
  
  createdAt: Date,
  updatedAt: Date
}

// Compound Index
- userId + eventId (unique, prevent duplicate registrations)
```

### Submission Schema (For Project Expo)

```javascript
// Submission Model - Collection: submissions
{
  _id: ObjectId,
  
  // Team Info
  teamName: String,
  batch: String, // e.g., "2022-2026", "2023-2027"
  
  // Project Info
  projectTitle: String,
  projectDomain: String,
  
  // Submission
  submissionLink: String, // GitHub repo, drive link, etc.
  submissionType: Enum ["github", "drive", "website", "other"],
  
  // Management
  verified: Boolean,
  status: Enum ["pending", "verified", "featured"],
  adminNotes: String,
  pushedToGithub: Boolean,
  
  // Dates
  submissionDate: Date,
  createdAt: Date,
  updatedAt: Date
}

// Indexes
- batch (for filtering by year)
- status (for admin filtering)
```

### Announcement Schema

```javascript
// Announcement Model - Collection: announcements
{
  _id: ObjectId,
  
  title: String,
  content: String,
  type: Enum ["news", "update", "reminder", "alert"],
  
  createdBy: ObjectId (ref: User), // Admin
  
  // Publishing
  publishDate: Date,
  expiryDate: Date (nullable),
  isActive: Boolean,
  
  // Emoji/Icon
  emoji: String, // e.g., "🎉", "📢", "⚠️"
  
  createdAt: Date,
  updatedAt: Date
}

// Indexes
- publishDate (for ordering)
- isActive (for filtering)
```

---

## API Endpoints

### Authentication Routes
```
POST   /api/auth/signup               - Register new student
POST   /api/auth/login                - Login student
POST   /api/auth/verify-id            - Verify student ID (step 1)
POST   /api/auth/logout               - Logout
POST   /api/auth/refresh-token        - Refresh JWT
POST   /api/auth/forgot-password      - Reset password
```

### User Routes
```
GET    /api/users/me                  - Get current user profile
PUT    /api/users/me                  - Update profile
GET    /api/users/me/projects         - Get user's projects
GET    /api/users/me/events           - Get user's events
GET    /api/users/:id                 - Get user public profile
POST   /api/users/github/connect      - Connect GitHub
POST   /api/users/github/disconnect   - Disconnect GitHub
```

### Project Routes
```
POST   /api/projects                  - Create new project
GET    /api/projects                  - List projects (filtered)
GET    /api/projects/:id              - Get project details
PUT    /api/projects/:id              - Update project
DELETE /api/projects/:id              - Archive project
POST   /api/projects/:id/invite       - Invite team member
POST   /api/projects/:id/github       - Create GitHub repo
GET    /api/projects/public           - Get public showcase projects
```

### Event Routes
```
POST   /api/events                    - Create event (admin/coordinator)
GET    /api/events                    - List events
GET    /api/events/:id                - Get event details
PUT    /api/events/:id                - Update event
DELETE /api/events/:id                - Delete event
POST   /api/events/:id/register       - Register for event
DELETE /api/events/:id/register       - Unregister from event
GET    /api/events/:id/registrations  - Get registrations (admin/coordinator)
POST   /api/events/:id/complete       - Mark event complete
```

### Template Routes
```
GET    /api/templates                 - List active templates
GET    /api/templates/:id             - Get template details
POST   /api/projects/from-template    - Create project from template (admin only)
POST   /api/templates                 - Create new template (admin only)
PUT    /api/templates/:id             - Update template (admin only)
```

### Admin Routes
```
GET    /api/admin/overview            - Dashboard stats
GET    /api/admin/users               - List all users
PUT    /api/admin/users/:id/role      - Change user role
GET    /api/admin/projects            - All projects (with filters)
PUT    /api/admin/projects/:id/status - Update project status
PUT    /api/admin/projects/:id/mentor - Assign mentor
GET    /api/admin/submissions         - Expo submissions
PUT    /api/admin/submissions/:id     - Update submission status
POST   /api/admin/announcements       - Create announcement
GET    /api/admin/announcements       - List announcements
PUT    /api/admin/announcements/:id   - Update announcement
```

### Coordinator Routes
```
GET    /api/coordinator/events/:id/registrations  - Event registrations
GET    /api/coordinator/batch/projects            - Batch projects
GET    /api/coordinator/batch/students            - Batch students
```

---

## Frontend Structure

### Directory Layout

```
src/
├── pages/
│   ├── auth/
│   │   ├── SignUp.jsx          # Step 1 & 2 signup flow
│   │   ├── Login.jsx
│   │   └── ForgotPassword.jsx
│   │
│   ├── student/
│   │   ├── Dashboard.jsx       # Main student dashboard
│   │   ├── Projects/
│   │   │   ├── ProjectList.jsx
│   │   │   ├── ProjectDetails.jsx
│   │   │   └── CreateProject.jsx
│   │   ├── Events/
│   │   │   ├── EventList.jsx
│   │   │   ├── EventDetails.jsx
│   │   │   └── MyEvents.jsx
│   │   ├── Profile.jsx
│   │   └── Achievements.jsx
│   │
│   ├── coordinator/
│   │   ├── Dashboard.jsx       # Coordinator view (student + coordinator panel)
│   │   ├── EventRegistrations.jsx
│   │   └── BatchProjects.jsx
│   │
│   └── admin/
│       ├── Dashboard.jsx       # Admin overview
│       ├── Users/
│       │   ├── UserList.jsx
│       │   └── UserDetails.jsx
│       ├── Projects/
│       │   ├── ProjectList.jsx
│       │   └── ProjectDetails.jsx
│       ├── Templates/
│       │   ├── TemplateList.jsx
│       │   └── TemplateForm.jsx
│       ├── Events/
│       │   ├── EventList.jsx
│       │   └── EventForm.jsx
│       ├── Submissions/
│       │   └── SubmissionList.jsx
│       └── Announcements/
│           └── AnnouncementForm.jsx
│
├── components/
│   ├── auth/
│   │   ├── IdVerificationForm.jsx
│   │   └── SignUpForm.jsx
│   │
│   ├── dashboard/
│   │   ├── WelcomePanel.jsx
│   │   ├── SummaryCards.jsx
│   │   ├── QuickActions.jsx
│   │   ├── MyProjectsSection.jsx
│   │   ├── UpcomingEventsSection.jsx
│   │   └── AnnouncementsSection.jsx
│   │
│   ├── projects/
│   │   ├── ProjectCard.jsx
│   │   ├── ProjectForm.jsx
│   │   └── TeamMemberManager.jsx
│   │
│   ├── events/
│   │   ├── EventCard.jsx
│   │   ├── EventForm.jsx
│   │   └── RegistrationList.jsx
│   │
│   ├── shared/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── EmptyState.jsx
│   │
│   └── admin/
│       ├── StatsCard.jsx
│       ├── DataTable.jsx
│       └── FilterPanel.jsx
│
├── hooks/
│   ├── useAuth.js
│   ├── useProjects.js
│   ├── useEvents.js
│   └── useUser.js
│
├── context/
│   ├── AuthContext.js
│   ├── UserContext.js
│   └── NotificationContext.js
│
├── services/
│   ├── api.js           # Axios instance
│   ├── authService.js
│   ├── projectService.js
│   ├── eventService.js
│   ├── userService.js
│   └── adminService.js
│
├── styles/
│   ├── theme.js         # Tailwind theme (colors, animations)
│   ├── colors.js        # Brand colors from existing design
│   └── animations.css   # Keyframes matching frontend
│
├── utils/
│   ├── localStorage.js
│   ├── validators.js
│   └── formatters.js
│
└── App.jsx
```

---

## Color & Design System (From Existing Frontend)

### Brand Colors
```javascript
const colors = {
  primary: "#ff007b",      // Pink/Magenta
  secondary: "#d500ed",    // Purple
  success: "#00c896",
  warning: "#ffaa17",
  error: "#ff3c6f",
  
  gradient1: "linear-gradient(135deg, #ff007b 0%, #d500ed 100%)",
  gradient2: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  gradient3: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  
  dark: "#0a0a0a",
  light: "#ffffff",
  text: "#1a1a1a",
  textLight: "#666666",
  
  background: "#f5f5f5",
  surfaceLight: "#ffffff",
  surfaceDark: "#1f1f1f"
};

const animations = {
  fadeIn: "fadeIn 0.5s ease-in",
  slideUp: "slideUp 0.5s ease-out",
  slideInLeft: "slideInLeft 0.5s ease-out",
  pulse: "pulse 2s ease-in-out infinite",
  bounce: "bounce 1s ease-in-out infinite"
};
```

### Component Design Patterns
- Use gradient backgrounds for cards
- Smooth animations (fadeIn, slideUp, etc.)
- Rounded corners (1vw / 16px)
- Glassmorphism effects (backdrop-filter blur)
- Responsive grid layouts
- Dark mode friendly

---

## Implementation Roadmap

### Phase 1: Authentication & Setup (Week 1)
- [ ] Backend: Express server + MongoDB connection
- [ ] User model + schema
- [ ] Signup flow (ID verification + account creation)
- [ ] Login flow + JWT
- [ ] Frontend: Auth pages (SignUp, Login, ForgotPassword)
- [ ] Protected routes setup

### Phase 2: Student Dashboard (Week 2)
- [ ] Student Dashboard layout
- [ ] My Projects section
- [ ] My Events section
- [ ] Announcements section
- [ ] User profile page
- [ ] GitHub connection integration

### Phase 3: Project Management (Week 3)
- [ ] Project model + schema
- [ ] Create project (from template)
- [ ] Project listing & filtering
- [ ] Project details page
- [ ] Team member management
- [ ] GitHub repo creation integration
- [ ] Frontend: All project pages

### Phase 4: Event Management (Week 4)
- [ ] Event model + schema
- [ ] Event CRUD (admin)
- [ ] Event listing for students
- [ ] Event registration/unregistration
- [ ] Upcoming events section
- [ ] Frontend: Event pages

### Phase 5: Admin Portal (Week 5)
- [ ] Admin authentication & authorization
- [ ] Admin dashboard overview
- [ ] User management
- [ ] Project management (admin view)
- [ ] Template management
- [ ] Event management (admin)
- [ ] Frontend: All admin pages

### Phase 6: Coordinator Features (Week 6)
- [ ] Coordinator authorization
- [ ] Event registrations view
- [ ] Batch projects view
- [ ] Coordinator dashboard
- [ ] Frontend: Coordinator pages

### Phase 7: Polish & Deployment (Week 7)
- [ ] Testing (unit + integration)
- [ ] Bug fixes & optimization
- [ ] Deployment (Backend + Frontend)
- [ ] Documentation
- [ ] User onboarding refinement

---

## Next Steps

1. **Setup Backend Repository** - New repo for API (or in same project under `/api`)
2. **Database Setup** - MongoDB Atlas account
3. **Environment Config** - .env files for both frontend & backend
4. **Start Phase 1** - Begin with auth implementation

Ready to proceed? Confirm:
- ✅ Backend repo location?
- ✅ Start with Phase 1 (Auth)?
- ✅ Deployment platform preference (Vercel/Heroku/Railway)?
