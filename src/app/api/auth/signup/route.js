// Forced rebuild trigger - checking relative paths
import dbConnect from '../../../../lib/db.js';
import User from '../../../../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // In production, use env variable

export async function POST(req) {
    console.log('Signup attempt received');
    await dbConnect();

    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return new Response(JSON.stringify({ error: 'Please provide all fields' }), { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Create token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

        return new Response(JSON.stringify({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                twitterConnected: false,
                instagramConnected: false,
                youtubeConnected: false
            }
        }), { status: 201 });

    } catch (error) {
        console.error('Signup error:', error);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}
