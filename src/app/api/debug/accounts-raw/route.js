import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ConnectedAccount from '@/models/ConnectedAccount';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const accounts = await ConnectedAccount.find({ userId: user.userId }).lean();

        // Return raw DB data for debugging
        return NextResponse.json({
            count: accounts.length,
            accounts: accounts.map(acc => ({
                _id: acc._id,
                platform: acc.platform,
                platformUserId: acc.platformUserId,
                username: acc.username,
                hasUsername: !!acc.username,
                usernameType: typeof acc.username,
                isActive: acc.isActive,
                createdAt: acc.createdAt,
                updatedAt: acc.updatedAt
            }))
        });
    } catch (error) {
        console.error('Debug accounts error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
