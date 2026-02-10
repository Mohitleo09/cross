import dbConnect from './db';
import Post from '@/models/Post';
import PostStatus from '@/models/PostStatus';
import ConnectedAccount from '@/models/ConnectedAccount';
import { executeCrosspostingJob } from './worker';
import { decrypt } from './crypto';

/**
 * Process a specific Instagram Media ID:
 * 1. Fetch details from IG Graph API
 * 2. Create Post in local DB
 * 3. Create PostStatus for other platforms
 * 4. Trigger worker
 * 
 * @param {string} mediaId - The Instagram Media ID
 * @param {string} igUserId - The Instagram User ID (optional, to find account faster)
 * @param {object} accountObj - The Mongoose account document (optional, if already fetched)
 */
export async function processInstagramMedia(mediaId, igUserId, accountObj = null) {
    await dbConnect();

    // 1. Find the connected account if not provided
    let account = accountObj;
    if (!account) {
        account = await ConnectedAccount.findOne({ platformUserId: igUserId, platform: 'instagram' });
    }

    if (!account) {
        console.error(`No connected Instagram account found for User ID: ${igUserId}`);
        return null; // Cannot proceed without token
    }

    // Decrypt token
    const accessToken = decrypt(account.accessToken);
    if (!accessToken) {
        console.error('Failed to decrypt access token');
        return null;
    }

    // 2. Fetch media details from Instagram Graph API
    // Using v19.0 as established
    const fields = 'media_url,caption,media_type,timestamp,permalink,thumbnail_url,media_product_type';
    const response = await fetch(`https://graph.facebook.com/v19.0/${mediaId}?fields=${fields}&access_token=${accessToken}`);
    const media = await response.json();

    if (media.error) {
        console.error(`IG Media Fetch Error (${mediaId}):`, media.error.message);
        return null;
    }

    // 2b. Check if Post already exists (Idempotency)
    const existingPost = await Post.findOne({ sourcePostId: mediaId });
    if (existingPost) {
        console.log(`Post ${mediaId} already imported. Skipping.`);
        return existingPost;
    }

    // 2c. Check for copyrighted content (missing media_url for videos)
    if (media.media_type === 'VIDEO' && !media.media_url) {
        console.warn(`⚠️  Video ${mediaId} contains copyrighted content (no media_url). Cannot crosspost. Permalink: ${media.permalink}`);
        // Still save the post for record-keeping, but mark it
        const post = await Post.create({
            userId: account.userId,
            sourcePlatform: 'instagram',
            sourcePostId: mediaId,
            mediaUrl: media.thumbnail_url || media.permalink, // Save thumbnail as reference
            caption: media.caption || '',
            mediaType: media.media_type,
            mediaProductType: media.media_product_type || 'FEED',
            timestamp: new Date(media.timestamp)
        });

        // Create failed status entries to inform user
        // Only Twitter since copyrighted videos can't be posted to YouTube anyway
        const destinations = ['twitter'];
        for (const platform of destinations) {
            const destAccount = await ConnectedAccount.findOne({ userId: account.userId, platform, isActive: true });
            if (destAccount) {
                await PostStatus.create({
                    postId: post._id,
                    platform,
                    status: 'failed',
                    errorMessage: 'Video contains copyrighted audio - Instagram API blocks download'
                });
            }
        }

        return { post, statuses: [], copyrighted: true };
    }

    // 3. Save Post
    const post = await Post.create({
        userId: account.userId,
        sourcePlatform: 'instagram',
        sourcePostId: mediaId,
        mediaUrl: media.media_url || media.thumbnail_url, // Fallback
        caption: media.caption || '',
        mediaType: media.media_type,
        mediaProductType: media.media_product_type || 'FEED',
        timestamp: new Date(media.timestamp)
    });

    console.log(`✅ Imported Instagram Post: ${post._id}`);

    // 4. Create statuses for other connected platforms
    // Only target ACTIVE connections for the same user
    // For images/carousels: only Twitter
    // For videos (Reels): both Twitter and YouTube
    let destinations = [];

    if (media.media_type === 'VIDEO') {
        // Videos go to both Twitter and YouTube
        destinations = ['twitter', 'youtube'];
    } else {
        // Images and Carousels only go to Twitter (skip YouTube)
        destinations = ['twitter'];
    }

    const createdStatuses = [];

    for (const platform of destinations) {
        const destAccount = await ConnectedAccount.findOne({ userId: account.userId, platform, isActive: true });

        if (destAccount) {
            const status = await PostStatus.create({
                postId: post._id,
                platform,
                status: 'pending'
            });
            createdStatuses.push(status);

            // Trigger the worker immediately for this MVP
            // In production, use a queue
            executeCrosspostingJob(status._id).catch(err =>
                console.error(`Worker failed for ${platform}:`, err)
            );
        }
    }

    return { post, statuses: createdStatuses };
}


/**
 * Polls for new media for a specific account
 */
export async function pollInstagramAccount(account) {
    try {
        const accessToken = decrypt(account.accessToken);
        if (!accessToken) return 0;

        // Fetch recent media (limit 5 to avoid overwhelming rate limits on poll)
        const url = `https://graph.facebook.com/v19.0/${account.platformUserId}/media?limit=5&access_token=${accessToken}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
            console.error(`Polling Error for ${account.platformUserId}:`, data.error.message);
            return 0;
        }

        let newCount = 0;
        for (const item of data.data || []) {
            // Check existence before processing to save API calls in processInstagramMedia
            const exists = await Post.exists({ sourcePostId: item.id });
            if (!exists) {
                await processInstagramMedia(item.id, account.platformUserId, account);
                newCount++;
            }
        }
        return newCount;

    } catch (error) {
        console.error(`Poll failed for account ${account._id}:`, error);
        return 0;
    }
}
