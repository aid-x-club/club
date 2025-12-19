import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['general', 'event', 'project', 'important'],
        default: 'general'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetAudience: {
        type: String,
        enum: ['all', 'students', 'coordinators'],
        default: 'all'
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    publishedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

announcementSchema.index({ isPublished: 1, publishedAt: -1 });
announcementSchema.index({ targetAudience: 1 });

const Announcement = mongoose.model('Announcement', announcementSchema);
export default Announcement;
