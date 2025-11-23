import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
      minlength: [3, 'Title must be at least 3 characters'],
    },

    description: {
      type: String,
      required: [true, 'Project description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },

    shortDescription: {
      type: String,
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },

    // Project ownership
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    teamMembers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          enum: ['lead', 'member'],
          default: 'member',
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Project details
    category: {
      type: String,
      required: [true, 'Project category is required'],
      enum: [
        'web',
        'mobile',
        'ai-ml',
        'blockchain',
        'iot',
        'game',
        'desktop',
        'other',
      ],
    },

    technologies: [
      {
        type: String,
        trim: true,
      },
    ],

    status: {
      type: String,
      enum: ['planning', 'in-progress', 'completed', 'on-hold'],
      default: 'planning',
    },

    // Links and resources
    repositoryUrl: {
      type: String,
      match: [
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        'Please provide a valid repository URL',
      ],
    },

    liveUrl: {
      type: String,
      match: [
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        'Please provide a valid live URL',
      ],
    },

    documentationUrl: {
      type: String,
    },

    // GitHub integration
    github: {
      owner: String,
      repo: String,
      stars: {
        type: Number,
        default: 0,
      },
      forks: {
        type: Number,
        default: 0,
      },
      lastSynced: Date,
    },

    // Metadata
    coverImage: {
      type: String,
      default: null,
    },

    tags: [String],

    visibility: {
      type: String,
      enum: ['public', 'private', 'restricted'],
      default: 'public',
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

    comments: {
      type: Number,
      default: 0,
    },

    // Project timeline
    startDate: Date,
    endDate: Date,

    // Ratings and reviews
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    totalRatings: {
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

    // Additional metadata
    isHotProject: {
      type: Boolean,
      default: false,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

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
ProjectSchema.index({ createdBy: 1 });
ProjectSchema.index({ category: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ createdAt: -1 });
ProjectSchema.index({ title: 'text', description: 'text' });

// Pre-save hook to update timestamp
ProjectSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Method to add team member
ProjectSchema.methods.addTeamMember = function (userId, role = 'member') {
  if (this.teamMembers.some(member => member.userId.toString() === userId.toString())) {
    throw new Error('User is already a team member');
  }
  this.teamMembers.push({ userId, role });
  return this.save();
};

// Method to remove team member
ProjectSchema.methods.removeTeamMember = function (userId) {
  this.teamMembers = this.teamMembers.filter(
    member => member.userId.toString() !== userId.toString()
  );
  return this.save();
};

// Method to like project
ProjectSchema.methods.likeProject = function (userId) {
  if (!this.likedBy.includes(userId)) {
    this.likedBy.push(userId);
    this.likes += 1;
  }
  return this.save();
};

// Method to unlike project
ProjectSchema.methods.unlikeProject = function (userId) {
  const index = this.likedBy.indexOf(userId);
  if (index > -1) {
    this.likedBy.splice(index, 1);
    this.likes -= 1;
  }
  return this.save();
};

// Method to save project
ProjectSchema.methods.saveProject = function (userId) {
  if (!this.savedBy.includes(userId)) {
    this.savedBy.push(userId);
  }
  return this.save();
};

// Method to unsave project
ProjectSchema.methods.unsaveProject = function (userId) {
  const index = this.savedBy.indexOf(userId);
  if (index > -1) {
    this.savedBy.splice(index, 1);
  }
  return this.save();
};

// Method to get public data (for API responses)
ProjectSchema.methods.getPublicData = function () {
  const projectObj = this.toObject();
  delete projectObj.__v;
  return projectObj;
};

export default mongoose.model('Project', ProjectSchema);
