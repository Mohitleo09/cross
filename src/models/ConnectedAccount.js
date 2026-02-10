import mongoose from 'mongoose';

const ConnectedAccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    platform: {
        type: String,
        enum: ['instagram', 'twitter', 'youtube'],
        required: true
    },
    platformUserId: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    },
    expiresAt: {
        type: Date
    },
    scopes: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Prevent duplicate connections for same user/platform
ConnectedAccountSchema.index({ userId: 1, platform: 1 }, { unique: true });

export default mongoose.models.ConnectedAccount || mongoose.model('ConnectedAccount', ConnectedAccountSchema);
