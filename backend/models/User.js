import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic Info
  fullName: {
    type: String,
    required: [true, 'Full name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't return password by default
  },

  // Extended Profile
  year: {
    type: String,
    enum: ['1st', '2nd', '3rd', '4th'],
    required: [true, 'Year is required']
  },
  phone: String,
  profileImage: {
    type: String,
    default: null
  },
  bio: String,
  rollNumber: String,
  skills: [String],
  interests: [String],
  linkedinProfile: String,

  // Authentication
  role: {
    type: String,
    enum: ['student', 'coordinator', 'admin'],
    default: 'student'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },

  // GitHub Integration
  githubUsername: String,
  githubAccessToken: {
    type: String,
    select: false // Don't return token by default
  },
  githubConnected: {
    type: Boolean,
    default: false
  },

  // Statistics
  projectCount: {
    type: Number,
    default: 0
  },
  eventCount: {
    type: Number,
    default: 0
  },
  achievementCount: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 0
  },

  // Settings
  notificationSettings: {
    emailNotifications: { type: Boolean, default: true },
    eventReminders: { type: Boolean, default: true },
    announcementAlerts: { type: Boolean, default: true }
  },
  privacySettings: {
    profileVisibility: { type: String, enum: ['public', 'members', 'private'], default: 'members' },
    showEmail: { type: Boolean, default: false },
    showProjects: { type: Boolean, default: true }
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
});

// Indexes
userSchema.index({ studentId: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    this.updatedAt = Date.now();
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (passwordToCheck) {
  return await bcryptjs.compare(passwordToCheck, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function () {
  const user = this.toObject();
  delete user.password;
  delete user.githubAccessToken;
  return user;
};

const User = mongoose.model('User', userSchema);
export default User;
