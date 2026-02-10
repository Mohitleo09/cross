import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sourcePlatform: {
        type: String,
        default: 'instagram',
        required: true
    },
    sourcePostId: {
        type: String,
        required: true,
        unique: true
    },
    mediaUrl: {
        type: String,
        required: true
    },
    caption: {
        type: String
    },
    mediaType: {
        type: String,
        enum: ['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM'],
        required: true
    },
    mediaProductType: {
        type: String,
        enum: ['AD', 'FEED', 'STORY', 'REELS', 'UNKNOWN'],
        default: 'FEED'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
