import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.json({ error: 'Authentication token is required' }, { status: 401 });
    }

    const client_id = process.env.TWITTER_CLIENT_ID;
    const redirect_uri = process.env.TWITTER_REDIRECT_URI;

    // 1. Generate PKCE Code Verifier
    const code_verifier = crypto.randomBytes(32).toString('base64url');

    // 2. Generate PKCE Code Challenge
    const code_challenge = crypto.createHash('sha256')
        .update(code_verifier)
        .digest('base64url');

    const scope = ['tweet.read', 'tweet.write', 'users.read', 'offline.access'].join(' ');
    const state = token; // Use our JWT as the state for security and simplicity

    const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', client_id);
    authUrl.searchParams.set('redirect_uri', redirect_uri);
    authUrl.searchParams.set('scope', scope);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('code_challenge', code_challenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');

    const response = NextResponse.redirect(authUrl.toString());

    // 3. Store Code Verifier in a secure, httpOnly cookie
    // This is mandatory for the callback to verify the handshake
    response.cookies.set('twitter_code_verifier', code_verifier, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 300 // 5 minutes
    });

    return response;
}
