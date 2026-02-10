import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ConnectedAccount from '@/models/ConnectedAccount';
import { getUserFromRequest } from '@/lib/auth';

import User from '@/models/User';

export async function GET(req) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const accounts = await ConnectedAccount.find({ userId: user.userId });

        console.log('=== DEBUG: Raw accounts from DB ===');
        accounts.forEach(acc => {
            console.log(`Platform: ${acc.platform}, Username: ${acc.username}, Has Username: ${!!acc.username}`);
        });

        // Map to frontend expected format
        const formattedAccounts = accounts.map(acc => ({
            id: acc._id,
            platform: acc.platform,
            platform_user_id: acc.platformUserId,
            username: acc.username,
            auto_post: acc.isActive // Mapping isActive to auto_post
        }));

        console.log('=== DEBUG: Formatted accounts ===');
        console.log(JSON.stringify(formattedAccounts, null, 2));

        return NextResponse.json(formattedAccounts);
    } catch (error) {
        console.error('Fetch accounts error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, auto_post } = await req.json();

        await dbConnect();
        const account = await ConnectedAccount.findOneAndUpdate(
            { _id: id, userId: user.userId },
            { isActive: auto_post },
            { new: true }
        );

        if (!account) {
            return NextResponse.json({ error: 'Account not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Toggle status error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await req.json();

        await dbConnect();
        const account = await ConnectedAccount.findOneAndDelete({ _id: id, userId: user.userId });

        if (!account) {
            return NextResponse.json({ error: 'Account not found' }, { status: 404 });
        }

        // Update User model flag
        const updateData = {};
        if (account.platform === 'instagram') updateData.instagramConnected = false;
        if (account.platform === 'youtube') updateData.youtubeConnected = false;
        if (account.platform === 'twitter') updateData.twitterConnected = false;

        await User.findByIdAndUpdate(user.userId, updateData);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Disconnect account error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
