import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ConnectedAccount from '@/models/ConnectedAccount';
import User from '@/models/User';
import { encrypt } from '@/lib/crypto';
import jwt from 'jsonwebtoken';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    // Use the configured redirect URI's origin to ensure we redirect to the correct port (3001)
    const baseUrl = new URL(process.env.INSTAGRAM_REDIRECT_URI).origin;

    if (!code) {
        return NextResponse.redirect(new URL('/?connect=instagram&status=error&message=No+code+provided', baseUrl));
    }

    try {
        await dbConnect();

        // 1. Verify User Session from state
        let userId;
        try {
            const decoded = jwt.verify(state, process.env.JWT_SECRET || 'your_jwt_secret_key');
            userId = decoded.userId;
        } catch (e) {
            console.error('JWT Verification failed:', e.message);
            return NextResponse.redirect(new URL('/?connect=instagram&status=error&message=Session+expired', baseUrl));
        }

        // 2. Exchange Code for Access Token
        const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.INSTAGRAM_REDIRECT_URI)}&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&code=${code}`;
        const tokenRes = await fetch(tokenUrl);
        const tokenData = await tokenRes.json();

        if (tokenData.error) {
            console.error('FB Token Exchange Error:', tokenData.error);
            throw new Error(tokenData.error.message);
        }

        const accessToken = tokenData.access_token;

        // 3. Find the Linked Instagram Business Account
        console.log('Fetching managed pages (limit 100)...');
        // Fetch up to 100 pages to ensure we catch all managed pages. Ask for tasks to debug role.
        const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}&limit=100&fields=name,id,access_token,instagram_business_account,tasks`);
        const pagesData = await pagesRes.json();

        if (pagesData.error) {
            console.error('FB Pages Fetch Error:', pagesData.error);
            throw new Error(pagesData.error.message);
        }

        // DEBUG: Check permissions if no pages found
        if (!pagesData.data || pagesData.data.length === 0) {
            console.log('⚠️ No pages returned. Checking granted permissions...');
            const permRes = await fetch(`https://graph.facebook.com/v19.0/me/permissions?access_token=${accessToken}`);
            const permData = await permRes.json();
            const grantedPerms = (permData.data || [])
                .filter(p => p.status === 'granted')
                .map(p => p.permission);

            console.log('Granted Permissions:', grantedPerms.join(', '));
        }

        let instagramId = null;
        let finalAccessToken = accessToken;
        let pageName = '';

        console.log(`Checking ${pagesData.data?.length || 0} pages for Instagram connection...`);
        for (const page of pagesData.data || []) {
            try {
                // If the initial fetch didn't return instagram_business_account (it should if validation passed), verify it
                console.log(`Page: ${page.name}, Tasks: ${JSON.stringify(page.tasks)}`);

                if (page.instagram_business_account) {
                    instagramId = page.instagram_business_account.id;
                    finalAccessToken = page.access_token; // Use Page Token for publishing
                    pageName = page.name;
                    console.log(`✅ Linked Instagram found on page: ${pageName}`);

                    // 4. Verify Media Objects Access
                    try {
                        const mediaRes = await fetch(`https://graph.facebook.com/v19.0/${instagramId}/media?access_token=${finalAccessToken}`);
                        const mediaData = await mediaRes.json();
                        console.log(`📸 Found ${mediaData.data?.length || 0} media objects on Instagram account`);
                    } catch (mediaErr) {
                        console.warn('Could not fetch media objects:', mediaErr.message);
                    }

                    break;
                }
            } catch (e) {
                console.warn(`Error checking page ${page.id}:`, e.message);
            }
        }

        if (!instagramId) {
            const foundPageNames = (pagesData.data || []).map(p => p.name).join(', ');
            console.error('No IG Found. Pages scanned:', foundPageNames);

            let errorMsg = 'No+Instagram+account+found.';

            // Check permissions again for the error message
            const permRes = await fetch(`https://graph.facebook.com/v19.0/me/permissions?access_token=${accessToken}`);
            const permData = await permRes.json();
            const grantedPermsArray = (permData.data || []).filter(p => p.status === 'granted').map(p => p.permission);
            const grantedPermsStr = grantedPermsArray.join(', ');

            // Fetch user info to help debug identity issues
            let userInfo = "";
            try {
                const userRes = await fetch(`https://graph.facebook.com/v19.0/me?fields=name,id&access_token=${accessToken}`);
                const uData = await userRes.json();
                userInfo = `Logged+in+as:+${uData.name}+(ID:${uData.id}).`;
            } catch (e) { }

            if (!foundPageNames) {
                errorMsg += `+We+found+ZERO+Facebook+Pages.+${userInfo}+Granted+Permissions:+[${grantedPermsStr}].`;

                if (!grantedPermsArray.includes('business_management')) {
                    errorMsg += '+Also+MISSING+business_management+(Requires+"Business+Asset+User+Profile+Access"+product).';
                }

                errorMsg += '+1)+Go+to+developers.facebook.com+and+ensure+App+is+in+"Development"+Mode+(or+you+are+Admin).+2)+Go+to+Facebook+Business+Integrations+and+REMOVE+app,+then+retry+and+SELECT+ALL+PAGES.';
            } else {
                errorMsg += `+We+scanned+these+Pages:+${encodeURIComponent(foundPageNames)}.+None+had+an+Instagram+Business+account+linked.`;
            }

            return NextResponse.redirect(new URL(`/?connect=instagram&status=error&message=${errorMsg}`, baseUrl));
        }

        // 4. Fetch Instagram Username
        let instagramUsername = null;
        try {
            const usernameRes = await fetch(`https://graph.facebook.com/v19.0/${instagramId}?fields=username&access_token=${finalAccessToken}`);
            const usernameData = await usernameRes.json();

            console.log('Instagram Username API Response:', JSON.stringify(usernameData, null, 2));

            if (usernameData.error) {
                console.error('Instagram Username API Error:', usernameData.error);
            } else if (usernameData.username) {
                instagramUsername = usernameData.username;
                console.log(`✅ Instagram Username: @${instagramUsername}`);
            } else {
                console.warn('No username in Instagram API response');
            }
        } catch (err) {
            console.error('Could not fetch Instagram username:', err.message);
        }

        console.log(`Saving Instagram account - Instagram ID: ${instagramId}, Username: ${instagramUsername || 'N/A'}`);

        // 5. Save/Update Connection
        const savedAccount = await ConnectedAccount.findOneAndUpdate(
            { userId, platform: 'instagram' },
            {
                platformUserId: instagramId,
                username: instagramUsername || 'Instagram User',
                accessToken: encrypt(finalAccessToken),
                isActive: true
            },
            { upsert: true, new: true }
        );

        console.log('=== SAVED INSTAGRAM ACCOUNT ===');
        console.log(`ID: ${savedAccount._id}`);
        console.log(`Platform: ${savedAccount.platform}`);
        console.log(`Username: ${savedAccount.username}`);
        console.log(`Username type: ${typeof savedAccount.username}`);
        console.log(`Has username: ${!!savedAccount.username}`);

        // 6. Update User Record
        await User.findByIdAndUpdate(userId, { instagramConnected: true });

        console.log('✅ Instagram OAuth completed successfully');

        return NextResponse.redirect(new URL('/?connect=instagram&status=success', baseUrl));

    } catch (error) {
        console.error('Fresh OAuth Error:', error);
        return NextResponse.redirect(new URL(`/?connect=instagram&status=error&message=${encodeURIComponent(error.message)}`, baseUrl));
    }
}
