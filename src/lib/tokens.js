import ConnectedAccount from '@/models/ConnectedAccount';
import { encrypt, decrypt } from './crypto';

export async function getValidToken(account) {
    // If account has an expiration date and it's not soon, return current token
    if (account.expiresAt && account.expiresAt > new Date(Date.now() + 60000)) {
        return decrypt(account.accessToken);
    }

    // If no refresh token, we can't refresh
    if (!account.refreshToken) {
        return decrypt(account.accessToken);
    }

    const refreshToken = decrypt(account.refreshToken);

    try {
        if (account.platform === 'twitter') {
            return await refreshTwitterToken(account, refreshToken);
        } else if (account.platform === 'youtube') {
            return await refreshYouTubeToken(account, refreshToken);
        }
    } catch (error) {
        console.error(`Token refresh failed for ${account.platform}:`, error);
        return decrypt(account.accessToken);
    }

    return decrypt(account.accessToken);
}

async function refreshTwitterToken(account, refreshToken) {
    const basicAuth = Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString('base64');

    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${basicAuth}`
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: process.env.TWITTER_CLIENT_ID
        })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error_description || data.error);

    account.accessToken = encrypt(data.access_token);
    if (data.refresh_token) {
        account.refreshToken = encrypt(data.refresh_token);
    }
    account.expiresAt = new Date(Date.now() + data.expires_in * 1000);
    await account.save();

    return data.access_token;
}

async function refreshYouTubeToken(account, refreshToken) {
    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: process.env.YOUTUBE_CLIENT_ID,
            client_secret: process.env.YOUTUBE_CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
        })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error_description || data.error);

    account.accessToken = encrypt(data.access_token);
    // YouTube usually sends a new refresh token only if prompted, but we should handle it if present
    if (data.refresh_token) {
        account.refreshToken = encrypt(data.refresh_token);
    }
    account.expiresAt = new Date(Date.now() + data.expires_in * 1000);
    await account.save();

    return data.access_token;
}
