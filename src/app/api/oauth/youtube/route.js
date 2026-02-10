import { NextResponse } from 'next/server';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    const client_id = process.env.YOUTUBE_CLIENT_ID;
    const redirect_uri = process.env.YOUTUBE_REDIRECT_URI;

    // Scopes for YouTube upload and channel info
    const scope = [
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/userinfo.profile',
        'openid'
    ].join(' ');

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${encodeURIComponent(scope)}&response_type=code&access_type=offline&prompt=consent&state=${token}`;

    return NextResponse.redirect(authUrl);
}
