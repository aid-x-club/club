import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['web-dev', 'ai-ml', 'mobile-dev', 'data-science', 'devops', 'other'],
        required: true
    },
    type: {
        type: String,
        enum: ['article', 'video', 'tutorial', 'documentation', 'course', 'book'],
        required: true
    },
    url: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: '📘'
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    tags: [String],
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    viewCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

resourceSchema.index({ category: 1, isPublished: 1 });
resourceSchema.index({ tags: 1 });

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
