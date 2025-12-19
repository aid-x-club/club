import mongoose from 'mongoose';

const userAchievementSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    achievement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Achievement',
        required: true
    },
    progress: {
        type: Number,
        default: 0
    },
    isUnlocked: {
        type: Boolean,
        default: false
    },
    unlockedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userAchievementSchema.index({ user: 1, achievement: 1 }, { unique: true });

const UserAchievement = mongoose.model('UserAchievement', userAchievementSchema);
export default UserAchievement;
