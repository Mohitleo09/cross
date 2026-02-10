import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ConnectedAccount from '@/models/ConnectedAccount';
import { getUserFromRequest } from '@/lib/auth';
import { decrypt } from '@/lib/crypto';

/**
 * Updates usernames for existing connected accounts
 * This is a one-time migration endpoint
 */
export async function POST(req) {
    try {
        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const accounts = await ConnectedAccount.find({ userId: user.userId });

        let updated = 0;
        const results = [];

        for (const account of accounts) {
            try {
                const token = decrypt(account.accessToken);
                if (!token) continue;

                let username = null;

                // Fetch username based on platform
                if (account.platform === 'instagram') {
                    const res = await fetch(`https://graph.facebook.com/v19.0/${account.platformUserId}?fields=username&access_token=${token}`);
                    const data = await res.json();
                    username = data.username;
                } else if (account.platform === 'twitter') {
                    const res = await fetch('https://api.twitter.com/2/users/me?user.fields=username', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    username = data.data?.username;
                } else if (account.platform === 'youtube') {
                    const res = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    username = data.items?.[0]?.snippet?.title;
                }

                if (username) {
                    account.username = username;
                    await account.save();
                    updated++;
                    results.push({ platform: account.platform, username, status: 'updated' });
                } else {
                    results.push({ platform: account.platform, status: 'failed', error: 'Could not fetch username' });
                }
            } catch (err) {
                results.push({ platform: account.platform, status: 'error', error: err.message });
            }
        }

        return NextResponse.json({
            success: true,
            updated,
            total: accounts.length,
            results
        });

    } catch (error) {
        console.error('Update usernames error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
