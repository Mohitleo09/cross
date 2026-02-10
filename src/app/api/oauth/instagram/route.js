import { NextResponse } from 'next/server';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    const client_id = process.env.INSTAGRAM_CLIENT_ID;
    const redirect_uri = process.env.INSTAGRAM_REDIRECT_URI;

    // Minimal scopes needed for Business/Creator accounts and publishing
    const scope = [
        'instagram_basic',
        'instagram_content_publish',
        'pages_show_list',
        'pages_read_engagement',
        'business_management'
    ].join(',');

    const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${scope}&response_type=code&state=${token}&auth_type=rerequest`;

    return NextResponse.redirect(authUrl);
}
