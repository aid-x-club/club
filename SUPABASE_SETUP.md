# Supabase Database Setup Guide

## 🎯 Quick Setup (5 Minutes)

Your Supabase credentials are already configured:
- **URL:** `https://ityjmpbelnivrfekwevn.supabase.co`
- **Anon Key:** Already set in `.env.example`

## 📋 Step-by-Step Setup

### Step 1: Access Your Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Open your project: `ityjmpbelnivrfekwevn`

### Step 2: Run the Database Schema

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **"New Query"**
3. Open the file `supabase-schema.sql` from this project
4. Copy ALL the contents
5. Paste into the SQL Editor
6. Click **RUN** or press `Ctrl/Cmd + Enter`

⏱️ This will take about 30 seconds to complete.

### Step 3: Verify Tables Were Created

1. Click **Table Editor** in the left sidebar
2. You should see these 13 tables:
   - ✅ users
   - ✅ projects
   - ✅ events
   - ✅ event_registrations
   - ✅ project_likes
   - ✅ announcements
   - ✅ certificates
   - ✅ achievements
   - ✅ resources
   - ✅ notifications
   - ✅ teams
   - ✅ attendance
   - ✅ student_data

### Step 4: Get Service Role Key

1. Go to **Settings** → **API**
2. Scroll down to **Project API keys**
3. Copy the `service_role` key (keep this secret!)
4. Add to `backend/.env`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
   ```

### Step 5: Create First Admin User

You need to hash a password first. Run this in your backend directory:

```bash
cd backend
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('Admin@123', 10));"
```

Then in Supabase SQL Editor, run:

```sql
INSERT INTO users (email, username, full_name, role, password_hash, is_active, is_verified, email_verified)
VALUES (
  'admin@aidx-club.tech',
  'admin',
  'AID-X Admin',
  'admin',
  '$2a$10$CYWK7p/hmznWQ4XuxKXB8uX59SBMHNQVOhJGrak8d6JGAprH7Yj7O', -- Replace with hash from above
  true,
  true,
  true
);
```

## 📊 Database Structure Overview

### Core Tables

#### 1. **users** - User accounts and profiles
- Stores student, coordinator, and admin accounts
- Includes profile info, skills, social links
- Role-based access control

#### 2. **projects** - Student projects showcase
- Project details, tech stack, links
- Team collaboration support
- Likes and views tracking

#### 3. **events** - Club events and activities
- Workshops, hackathons, seminars, etc.
- Registration management
- Online/offline/hybrid modes

#### 4. **event_registrations** - Event sign-ups
- Track who registered for which event
- Attendance marking
- Certificate issuance

#### 5. **certificates** - Achievement certificates
- Event participation certificates
- Verification system
- Unique certificate IDs

#### 6. **achievements** - Student accomplishments
- Hackathon wins, certifications
- Verification by coordinators
- Portfolio building

#### 7. **announcements** - Club announcements
- Important updates
- Priority levels
- Target specific audiences

#### 8. **resources** - Learning resources
- Articles, videos, courses
- Categorized by difficulty
- Community-curated content

#### 9. **notifications** - User notifications
- Real-time updates
- Read/unread tracking

#### 10. **teams** - Project teams
- Collaborative projects
- Team member management

#### 11. **attendance** - Event attendance tracking
- Check-in/check-out times
- Location tracking (optional)

#### 12. **student_data** - Student validation
- Enrollment number verification
- Official student database

#### 13. **project_likes** - Project engagement
- Like/unlike functionality
- Automatic count updates

### Automatic Features

✅ **Auto Timestamps** - All tables have `created_at` and `updated_at`
✅ **Auto Counting** - Likes and participants updated automatically
✅ **Triggers** - Database handles counts and validations
✅ **Row Level Security (RLS)** - Users can only access their own data
✅ **Indexes** - Optimized queries for fast performance
✅ **Views** - Pre-built queries for common data needs

## 🔒 Security Features

### Row Level Security (RLS) Policies

- ✅ Users can view all public profiles
- ✅ Users can only edit their own profile
- ✅ Only published projects are publicly visible
- ✅ Only coordinators/admins can create events
- ✅ Users can only see their own notifications
- ✅ Registrations are user-specific

### Best Practices Implemented

- Password hashing (bcrypt)
- Email verification support
- Role-based access control
- UUID primary keys (more secure than auto-increment)
- Constraint validation (CHECK constraints)
- Unique constraints where needed

## 📈 Built-in Views

### `upcoming_events`
Shows all upcoming events ordered by date.

```sql
SELECT * FROM upcoming_events LIMIT 10;
```

### `featured_projects`
Shows featured projects with author information.

```sql
SELECT * FROM featured_projects;
```

### `user_stats`
Aggregated statistics for each user.

```sql
SELECT * FROM user_stats WHERE username = 'john_doe';
```

## 🧪 Testing Your Setup

### Test 1: Insert a Test User

```sql
INSERT INTO users (email, username, full_name, role)
VALUES ('test@example.com', 'testuser', 'Test User', 'student')
RETURNING *;
```

### Test 2: Create a Test Project

```sql
INSERT INTO projects (title, description, tech_stack, user_id)
VALUES (
  'My First Project',
  'A test project',
  ARRAY['React', 'Node.js'],
  (SELECT id FROM users WHERE username = 'testuser')
)
RETURNING *;
```

### Test 3: Query Projects

```sql
SELECT p.title, u.username as author
FROM projects p
JOIN users u ON p.user_id = u.id
LIMIT 5;
```

## 🔧 Common Queries

### Get user with their projects

```sql
SELECT 
  u.*,
  json_agg(p.*) as projects
FROM users u
LEFT JOIN projects p ON u.id = p.user_id
WHERE u.username = 'your_username'
GROUP BY u.id;
```

### Get event with registrations count

```sql
SELECT 
  e.*,
  COUNT(er.id) as registration_count
FROM events e
LEFT JOIN event_registrations er ON e.id = er.event_id
GROUP BY e.id;
```

### Get user's upcoming events

```sql
SELECT e.*
FROM events e
JOIN event_registrations er ON e.id = er.event_id
WHERE er.user_id = 'USER_UUID_HERE'
AND e.event_date > NOW()
ORDER BY e.event_date;
```

## 🎨 Sample Data (Optional)

If you want to add sample data for testing, run:

```sql
-- Sample projects
INSERT INTO projects (title, description, tech_stack, status, user_id)
SELECT 
  'AI Chatbot',
  'An intelligent chatbot using GPT',
  ARRAY['Python', 'OpenAI', 'Flask'],
  'published',
  id
FROM users WHERE role = 'admin' LIMIT 1;

-- Sample events
INSERT INTO events (title, description, event_type, event_date, mode, status, created_by)
SELECT 
  'Web Development Workshop',
  'Learn modern web development',
  'workshop',
  NOW() + INTERVAL '10 days',
  'hybrid',
  'upcoming',
  id
FROM users WHERE role = 'admin' LIMIT 1;

-- Sample announcement
INSERT INTO announcements (title, content, type, priority, created_by)
SELECT 
  'Welcome to AID-X Club!',
  'We are excited to have you join our community.',
  'general',
  'high',
  id
FROM users WHERE role = 'admin' LIMIT 1;
```

## 🚀 Next Steps

After setting up the database:

1. ✅ **Update Backend Controllers** - Modify all controllers to use Supabase queries
2. ✅ **Test API Endpoints** - Ensure CRUD operations work
3. ✅ **Set Up Authentication** - Implement JWT + Supabase auth
4. ✅ **Deploy** - Follow the deployment guide

## 📚 Supabase Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase.js Client Docs](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)

## ⚠️ Important Notes

1. **Service Role Key** - Never expose this in frontend code! Only use in backend.
2. **Password Hashing** - Always use bcrypt (already installed in backend)
3. **RLS Policies** - Test thoroughly to ensure data privacy
4. **Backups** - Supabase auto-backs up daily (free tier: 7 days retention)

## 🆘 Troubleshooting

### "permission denied" errors
- Check RLS policies are correctly set
- Ensure you're using the right API key (anon vs service_role)

### "relation does not exist" errors
- Verify all tables were created
- Check table names are lowercase

### Foreign key errors
- Ensure referenced records exist first
- Check UUID formats are correct

---

**✅ Database Setup Complete!**

Your Supabase database is now ready. Proceed to update your backend controllers.
