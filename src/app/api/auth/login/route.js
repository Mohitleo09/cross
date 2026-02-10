// Forced rebuild trigger - checking relative paths
import dbConnect from '../../../../lib/db.js';
import User from '../../../../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export async function POST(req) {
    console.log('Login attempt received');
    await dbConnect();

    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return new Response(JSON.stringify({ error: 'Please provide email and password' }), { status: 400 });
        }

        // Check for user
        const user = await User.findOne({ email });
        if (!user) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 400 });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 400 });
        }

        // Create token with user info
        const token = jwt.sign(
            {
                userId: user._id,
                name: user.name,
                email: user.email
            },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        return new Response(JSON.stringify({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                twitterConnected: user.twitterConnected,
                instagramConnected: user.instagramConnected,
                youtubeConnected: user.youtubeConnected
            }
        }), { status: 200 });

    } catch (error) {
        console.error('Login error:', error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}
