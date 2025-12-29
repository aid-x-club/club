-- =====================================================
-- AID-X Club Portal - Supabase Database Schema
-- =====================================================
-- Run this entire script in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'coordinator', 'admin')),
  enrollment_number TEXT UNIQUE,
  department TEXT,
  year INTEGER,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  github_username TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  skills TEXT[],
  interests TEXT[],
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  email_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_enrollment ON users(enrollment_number);
CREATE INDEX idx_users_created_at ON users(created_at);

-- =====================================================
-- 2. PROJECTS TABLE
-- =====================================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  detailed_description TEXT,
  tech_stack TEXT[],
  category TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  github_url TEXT,
  live_url TEXT,
  demo_video_url TEXT,
  thumbnail_url TEXT,
  images TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  team_members UUID[],
  tags TEXT[],
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for projects table
CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_featured ON projects(is_featured);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- =====================================================
-- 3. EVENTS TABLE
-- =====================================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  detailed_description TEXT,
  event_type TEXT CHECK (event_type IN ('workshop', 'hackathon', 'seminar', 'competition', 'meetup', 'webinar', 'bootcamp')),
  category TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  venue TEXT,
  mode TEXT CHECK (mode IN ('online', 'offline', 'hybrid')),
  meeting_link TEXT,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  registration_fee DECIMAL(10,2) DEFAULT 0,
  poster_url TEXT,
  images TEXT[],
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  is_featured BOOLEAN DEFAULT false,
  tags TEXT[],
  prerequisites TEXT[],
  learning_outcomes TEXT[],
  speakers JSONB[],
  agenda JSONB[],
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for events table
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_featured ON events(is_featured);
CREATE INDEX idx_events_created_by ON events(created_by);

-- =====================================================
-- 4. EVENT REGISTRATIONS TABLE
-- =====================================================
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled', 'waitlist')),
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attendance_marked BOOLEAN DEFAULT false,
  attendance_date TIMESTAMP WITH TIME ZONE,
  feedback TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  certificate_issued BOOLEAN DEFAULT false,
  certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Indexes for event_registrations table
CREATE INDEX idx_registrations_event ON event_registrations(event_id);
CREATE INDEX idx_registrations_user ON event_registrations(user_id);
CREATE INDEX idx_registrations_status ON event_registrations(status);

-- =====================================================
-- 5. PROJECT LIKES TABLE
-- =====================================================
CREATE TABLE project_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Indexes for project_likes table
CREATE INDEX idx_likes_project ON project_likes(project_id);
CREATE INDEX idx_likes_user ON project_likes(user_id);

-- =====================================================
-- 6. ANNOUNCEMENTS TABLE
-- =====================================================
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('general', 'urgent', 'event', 'achievement', 'opportunity')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  is_pinned BOOLEAN DEFAULT false,
  target_audience TEXT DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'coordinators', 'admins')),
  image_url TEXT,
  link_url TEXT,
  link_text TEXT,
  created_by UUID REFERENCES users(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for announcements table
CREATE INDEX idx_announcements_type ON announcements(type);
CREATE INDEX idx_announcements_priority ON announcements(priority);
CREATE INDEX idx_announcements_pinned ON announcements(is_pinned);
CREATE INDEX idx_announcements_created_at ON announcements(created_at DESC);

-- =====================================================
-- 7. CERTIFICATES TABLE
-- =====================================================
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  certificate_type TEXT CHECK (certificate_type IN ('event', 'workshop', 'course', 'achievement', 'participation')),
  title TEXT NOT NULL,
  description TEXT,
  issue_date DATE DEFAULT CURRENT_DATE,
  certificate_url TEXT,
  certificate_id TEXT UNIQUE,
  verification_code TEXT UNIQUE,
  is_verified BOOLEAN DEFAULT true,
  issued_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for certificates table
CREATE INDEX idx_certificates_user ON certificates(user_id);
CREATE INDEX idx_certificates_event ON certificates(event_id);
CREATE INDEX idx_certificates_type ON certificates(certificate_type);
CREATE INDEX idx_certificates_verification ON certificates(verification_code);

-- =====================================================
-- 8. ACHIEVEMENTS TABLE
-- =====================================================
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  achievement_type TEXT CHECK (achievement_type IN ('hackathon', 'competition', 'project', 'contribution', 'certification', 'other')),
  achievement_date DATE,
  organization TEXT,
  position TEXT,
  certificate_url TEXT,
  proof_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for achievements table
CREATE INDEX idx_achievements_user ON achievements(user_id);
CREATE INDEX idx_achievements_type ON achievements(achievement_type);
CREATE INDEX idx_achievements_verified ON achievements(is_verified);

-- =====================================================
-- 9. RESOURCES TABLE
-- =====================================================
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT CHECK (resource_type IN ('article', 'video', 'course', 'book', 'tool', 'documentation', 'tutorial')),
  category TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  tags TEXT[],
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  is_free BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  uploaded_by UUID REFERENCES users(id),
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for resources table
CREATE INDEX idx_resources_type ON resources(resource_type);
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_featured ON resources(is_featured);
CREATE INDEX idx_resources_created_at ON resources(created_at DESC);

-- =====================================================
-- 10. NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('event', 'project', 'announcement', 'achievement', 'system', 'reminder')),
  link_url TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for notifications table
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- =====================================================
-- 11. TEAMS TABLE
-- =====================================================
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  team_lead UUID REFERENCES users(id),
  members UUID[],
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for teams table
CREATE INDEX idx_teams_lead ON teams(team_lead);
CREATE INDEX idx_teams_project ON teams(project_id);
CREATE INDEX idx_teams_status ON teams(status);

-- =====================================================
-- 12. ATTENDANCE TABLE
-- =====================================================
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  check_in_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  check_out_time TIMESTAMP WITH TIME ZONE,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Indexes for attendance table
CREATE INDEX idx_attendance_event ON attendance(event_id);
CREATE INDEX idx_attendance_user ON attendance(user_id);

-- =====================================================
-- 13. STUDENT DATA (for validation)
-- =====================================================
CREATE TABLE student_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_number TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  department TEXT,
  year INTEGER,
  section TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for student_data table
CREATE INDEX idx_student_data_enrollment ON student_data(enrollment_number);
CREATE INDEX idx_student_data_email ON student_data(email);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_registrations_updated_at BEFORE UPDATE ON event_registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON certificates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_data_updated_at BEFORE UPDATE ON student_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment project likes count
CREATE OR REPLACE FUNCTION increment_project_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects SET likes_count = likes_count + 1 WHERE id = NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement project likes count
CREATE OR REPLACE FUNCTION decrement_project_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects SET likes_count = likes_count - 1 WHERE id = OLD.project_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Triggers for project likes
CREATE TRIGGER increment_likes AFTER INSERT ON project_likes FOR EACH ROW EXECUTE FUNCTION increment_project_likes();
CREATE TRIGGER decrement_likes AFTER DELETE ON project_likes FOR EACH ROW EXECUTE FUNCTION decrement_project_likes();

-- Function to update event participants count
CREATE OR REPLACE FUNCTION update_event_participants()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE events SET current_participants = current_participants + 1 WHERE id = NEW.event_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE events SET current_participants = current_participants - 1 WHERE id = OLD.event_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for event registrations
CREATE TRIGGER update_participants_count AFTER INSERT OR DELETE ON event_registrations FOR EACH ROW EXECUTE FUNCTION update_event_participants();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_data ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Projects table policies
CREATE POLICY "Anyone can view published projects" ON projects FOR SELECT USING (status = 'published' OR user_id::text = auth.uid()::text);
CREATE POLICY "Users can create own projects" ON projects FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid()::text = user_id::text);

-- Events table policies
CREATE POLICY "Anyone can view active events" ON events FOR SELECT USING (status != 'cancelled');
CREATE POLICY "Coordinators can create events" ON events FOR INSERT WITH CHECK ((SELECT role FROM users WHERE id::text = auth.uid()::text) IN ('coordinator', 'admin'));
CREATE POLICY "Coordinators can update events" ON events FOR UPDATE USING ((SELECT role FROM users WHERE id::text = auth.uid()::text) IN ('coordinator', 'admin'));

-- Event registrations policies
CREATE POLICY "Users can view own registrations" ON event_registrations FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can register for events" ON event_registrations FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can cancel own registrations" ON event_registrations FOR DELETE USING (auth.uid()::text = user_id::text);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Other tables - allow read for all authenticated users
CREATE POLICY "Anyone can view announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Anyone can view certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Anyone can view resources" ON resources FOR SELECT USING (true);

-- =====================================================
-- INSERT SAMPLE DATA (Optional)
-- =====================================================

-- Insert sample admin user (password: Admin@123 - you should change this!)
INSERT INTO users (email, username, full_name, role, password_hash, is_active, is_verified)
VALUES (
  'admin@aidx-club.tech',
  'admin',
  'AID-X Admin',
  'admin',
  '$2a$10$example.hash.here', -- Replace with actual bcrypt hash
  true,
  true
);

-- Insert sample event categories
INSERT INTO events (title, description, event_type, event_date, location, mode, status, created_by)
SELECT 
  'Orientation 2024',
  'Welcome to AID-X Club!',
  'meetup',
  NOW() + INTERVAL '7 days',
  'Main Auditorium',
  'offline',
  'upcoming',
  id
FROM users WHERE role = 'admin' LIMIT 1;

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for upcoming events
CREATE OR REPLACE VIEW upcoming_events AS
SELECT * FROM events 
WHERE status = 'upcoming' 
AND event_date > NOW()
ORDER BY event_date ASC;

-- View for featured projects
CREATE OR REPLACE VIEW featured_projects AS
SELECT p.*, u.username, u.full_name as author_name
FROM projects p
JOIN users u ON p.user_id = u.id
WHERE p.is_featured = true AND p.status = 'published'
ORDER BY p.created_at DESC;

-- View for user stats
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  u.id,
  u.username,
  u.full_name,
  COUNT(DISTINCT p.id) as project_count,
  COUNT(DISTINCT er.id) as events_attended,
  COUNT(DISTINCT c.id) as certificates_count
FROM users u
LEFT JOIN projects p ON u.id = p.user_id
LEFT JOIN event_registrations er ON u.id = er.user_id AND er.status = 'attended'
LEFT JOIN certificates c ON u.id = c.user_id
GROUP BY u.id, u.username, u.full_name;

-- =====================================================
-- DONE! Database schema created successfully
-- =====================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
