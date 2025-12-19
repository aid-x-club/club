import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['participation', 'projects', 'leadership', 'learning', 'special'],
        required: true
    },
    points: {
        type: Number,
        required: true,
        default: 10
    },
    requirement: {
        type: {
            type: String,
            enum: ['event_count', 'project_count', 'special'],
            required: true
        },
        value: {
            type: Number,
            required: true
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Achievement = mongoose.model('Achievement', achievementSchema);
export default Achievement;
