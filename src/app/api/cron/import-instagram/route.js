import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ConnectedAccount from '@/models/ConnectedAccount';
import { pollInstagramAccount } from '@/lib/instagram';

export const dynamic = 'force-dynamic'; // Ensure this route is never cached

export async function GET(req) {
    try {
        await dbConnect();

        // 1. Find all active Instagram accounts
        const accounts = await ConnectedAccount.find({ platform: 'instagram', isActive: true });

        const results = [];

        // 2. Poll each account (in parallel or sequence)
        // Using sequence to be gentle on resources for localhost
        for (const account of accounts) {
            const count = await pollInstagramAccount(account);
            results.push({
                user: account.userId,
                platformId: account.platformUserId,
                newPosts: count
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Polling complete',
            details: results
        });

    } catch (error) {
        console.error('Cron Import Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
