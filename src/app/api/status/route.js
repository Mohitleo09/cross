import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import PostStatus from '@/models/PostStatus';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Find statuses for posts belonging to this user
        // We'll join with the Post model
        const statuses = await PostStatus.find()
            .populate({
                path: 'postId',
                match: { userId: user.userId }
            })
            .sort({ createdAt: -1 })
            .limit(50);

        // Filter out statuses where the populated postId is null (meaning it belongs to another user)
        const userStatuses = statuses.filter(s => s.postId !== null);

        const formatted = userStatuses.map(s => ({
            id: s.externalPostId || s._id,
            platform: s.platform,
            status: s.status,
            created_at: s.createdAt.toISOString(),
            last_error: s.errorMessage,
            media_url: s.postId.mediaUrl
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        console.error('Fetch status error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
