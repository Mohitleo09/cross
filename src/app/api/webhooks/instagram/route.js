import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import PostStatus from '@/models/PostStatus';
import ConnectedAccount from '@/models/ConnectedAccount';

const VERIFY_TOKEN = 'crossposting_verify_token'; // Should match Meta app settings

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        return new Response(challenge, { status: 200 });
    } else {
        return new Response('Verification failed', { status: 403 });
    }
}

import { processInstagramMedia } from '@/lib/instagram';

// ... (existing imports need to be checked, processInstagramMedia was internal before)
// Actually I need to update the whole file to clean up imports and usage.

export async function POST(req) {
    try {
        const payload = await req.json();
        console.log('Received Instagram Webhook:', JSON.stringify(payload));

        // 2. Process Entry
        for (const entry of payload.entry || []) {
            for (const change of entry.changes || []) {
                if (change.field === 'media_publish') {
                    const mediaId = change.value.id;
                    const igUserId = entry.id;

                    // Use shared helper
                    processInstagramMedia(mediaId, igUserId).catch(err => console.error('Media processing failed:', err));
                }
            }
        }

        return new Response('EVENT_RECEIVED', { status: 200 });

    } catch (error) {
        console.error('Webhook Error:', error);
        return new Response('Webhook Error', { status: 500 });
    }
}
// Removed local processInstagramMedia definition

