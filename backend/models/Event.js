import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
      minlength: [3, 'Title must be at least 3 characters'],
    },

    description: {
      type: String,
      required: [true, 'Event description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },

    shortDescription: {
      type: String,
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },

    // Event organizer
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Event details
    eventType: {
      type: String,
      enum: ['workshop', 'hackathon', 'seminar', 'webinar', 'meetup', 'competition', 'conference', 'other'],
      required: true,
    },

    category: {
      type: String,
      required: [true, 'Event category is required'],
      enum: [
        'web',
        'mobile',
        'ai-ml',
        'blockchain',
        'iot',
        'game',
        'general',
        'other',
      ],
    },

    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },

    // Dates and times
    startDate: {
      type: Date,
      required: [true, 'Event start date is required'],
    },

    endDate: {
      type: Date,
      required: [true, 'Event end date is required'],
      validate: {
        validator: function (value) {
          return value >= this.startDate;
        },
        message: 'End date must be after start date',
      },
    },

    // Location
    location: {
      venue: String,
      address: String,
      city: String,
      isOnline: {
        type: Boolean,
        default: false,
      },
      meetingUrl: String,
    },

    // Event metadata
    coverImage: {
      type: String,
      default: null,
    },

    tags: [String],

    maxParticipants: {
      type: Number,
      default: null,
    },

    registrationDeadline: Date,

    // Speakers/Mentors
    speakers: [
      {
        name: String,
        title: String,
        bio: String,
        image: String,
        contact: String,
      },
    ],

    // Registration
    registeredUsers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        registeredAt: {
          type: Date,
          default: Date.now,
        },
        attended: {
          type: Boolean,
          default: false,
        },
        attendedAt: Date,
      },
    ],

    registrationCount: {
      type: Number,
      default: 0,
    },

    attendanceCount: {
      type: Number,
      default: 0,
    },

    // Statistics
    views: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },

    // Social engagement
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // Metadata
    visibility: {
      type: String,
      enum: ['public', 'private', 'restricted'],
      default: 'public',
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isHotEvent: {
      type: Boolean,
      default: false,
    },

    // Resources
    agendaUrl: String,
    materialsUrl: String,
    recordingUrl: String,

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Indexes for performance
EventSchema.index({ organizer: 1 });
EventSchema.index({ eventType: 1 });
EventSchema.index({ category: 1 });
EventSchema.index({ status: 1 });
EventSchema.index({ startDate: 1 });
EventSchema.index({ createdAt: -1 });
EventSchema.index({ title: 'text', description: 'text' });

// Pre-save hook to update timestamp
EventSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Method to register user
EventSchema.methods.registerUser = function (userId) {
  if (this.registeredUsers.some(user => user.userId.toString() === userId.toString())) {
    throw new Error('User is already registered');
  }

  if (this.maxParticipants && this.registeredUsers.length >= this.maxParticipants) {
    throw new Error('Event is full');
  }

  this.registeredUsers.push({ userId });
  this.registrationCount = this.registeredUsers.length;
  return this.save();
};

// Method to unregister user
EventSchema.methods.unregisterUser = function (userId) {
  this.registeredUsers = this.registeredUsers.filter(
    user => user.userId.toString() !== userId.toString()
  );
  this.registrationCount = this.registeredUsers.length;
  return this.save();
};

// Method to mark attendance
EventSchema.methods.markAttendance = function (userId) {
  const userReg = this.registeredUsers.find(
    user => user.userId.toString() === userId.toString()
  );

  if (!userReg) {
    throw new Error('User is not registered for this event');
  }

  if (!userReg.attended) {
    userReg.attended = true;
    userReg.attendedAt = Date.now();
    this.attendanceCount = this.registeredUsers.filter(u => u.attended).length;
  }

  return this.save();
};

// Method to like event
EventSchema.methods.likeEvent = function (userId) {
  if (!this.likedBy.includes(userId)) {
    this.likedBy.push(userId);
    this.likes += 1;
  }
  return this.save();
};

// Method to unlike event
EventSchema.methods.unlikeEvent = function (userId) {
  const index = this.likedBy.indexOf(userId);
  if (index > -1) {
    this.likedBy.splice(index, 1);
    this.likes -= 1;
  }
  return this.save();
};

// Method to save event
EventSchema.methods.saveEvent = function (userId) {
  if (!this.savedBy.includes(userId)) {
    this.savedBy.push(userId);
  }
  return this.save();
};

// Method to unsave event
EventSchema.methods.unsaveEvent = function (userId) {
  const index = this.savedBy.indexOf(userId);
  if (index > -1) {
    this.savedBy.splice(index, 1);
  }
  return this.save();
};

// Method to get public data
EventSchema.methods.getPublicData = function () {
  const eventObj = this.toObject();
  delete eventObj.__v;
  return eventObj;
};

export default mongoose.model('Event', EventSchema);
