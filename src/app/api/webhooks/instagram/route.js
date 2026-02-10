import { NextResponse } from 'next/server';
import { processInstagramMedia } from '@/lib/instagram';

const VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || 'crossposting_verify_token';

export async function GET(req) {
    const { searchParams } = new URL(req.url);

    // Parse query params directly for clean access
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        return new Response(challenge, { status: 200 });
    } else {
        return new Response('Verification failed', { status: 403 });
    }
}

export async function POST(req) {
    try {
        const payload = await req.json();
        console.log('Received Instagram Webhook:', JSON.stringify(payload, null, 2));

        if (payload.object === 'instagram') {
            for (const entry of payload.entry || []) {
                const igUserId = entry.id; // Instagram Business Account ID

                // Changes array might contain multiple updates
                for (const change of entry.changes || []) {
                    // We only care about new media being published or status updates
                    // However, 'media' field is unreliable for realtime.
                    // Usually we subscribe to 'story_insights' or others but 'media' is standard.
                    // Wait, standard webhook field is just 'media' or 'mentions'.
                    // Actually, for Instagram Graph API, efficient way is subscription to 'media' field on the User node.

                    // The payload structure for 'media' field update:
                    // val: { id: 'media_id' }

                    // But wait, standard IG webhook for new post is confusing.
                    // Let's assume user subscribes to 'media'.

                    if (change.field === 'media' || change.field === 'media_product_type') {
                        // Note: 'media' field update usually just gives ID.
                        // We fetch details anyway.
                        const mediaId = change.value.id;

                        // Async processing (fire and forget for quick response to FB)
                        processInstagramMedia(mediaId, igUserId).catch(err =>
                            console.error(`Webhook processing failed for ${mediaId}:`, err)
                        );
                    }
                }
            }
            return new Response('EVENT_RECEIVED', { status: 200 });
        } else {
            return new Response('Not an instagram event', { status: 404 });
        }

    } catch (error) {
        console.error('Webhook Error:', error);
        return new Response('Webhook Error', { status: 500 });
    }
}
