import mongoose from 'mongoose';

const PostStatusSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    platform: {
        type: String,
        enum: ['twitter', 'youtube'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'success', 'failed'],
        default: 'pending'
    },
    externalPostId: {
        type: String
    },
    errorMessage: {
        type: String
    },
    retryCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Ensure one status per post per destination platform
PostStatusSchema.index({ postId: 1, platform: 1 }, { unique: true });

export default mongoose.models.PostStatus || mongoose.model('PostStatus', PostStatusSchema);
