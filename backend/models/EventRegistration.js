import mongoose from 'mongoose';

const eventRegistrationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    status: {
        type: String,
        enum: ['registered', 'attended', 'cancelled'],
        default: 'registered'
    },
    registeredAt: {
        type: Date,
        default: Date.now
    },
    attendedAt: Date,
    certificateIssued: {
        type: Boolean,
        default: false
    },
    certificateUrl: String,
    feedback: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        submittedAt: Date
    }
});

eventRegistrationSchema.index({ user: 1, event: 1 }, { unique: true });
eventRegistrationSchema.index({ user: 1, status: 1 });

const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema);
export default EventRegistration;
