import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        const authUser = await getUserFromRequest(req);
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById(authUser.userId).select('-password');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Fetch user error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
