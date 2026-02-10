import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import nodemailer from 'nodemailer';

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Check if user exists
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return NextResponse.json(
                { error: 'No account found with this email address' },
                { status: 404 }
            );
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP with expiration (10 minutes)
        otpStore.set(email.toLowerCase(), {
            otp,
            expiresAt: Date.now() + 10 * 60 * 1000
        });

        // Send OTP via email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset OTP - Crossposting',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #111827;">Password Reset Request</h2>
                    <p>You requested to reset your password. Use the OTP below to proceed:</p>
                    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #111827; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
                    </div>
                    <p style="color: #6b7280;">This OTP will expire in 10 minutes.</p>
                    <p style="color: #6b7280;">If you didn't request this, please ignore this email.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({
            success: true,
            message: 'OTP sent to your email'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'Failed to send OTP. Please try again.' },
            { status: 500 }
        );
    }
}

// Verify OTP
export async function PUT(request) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json(
                { error: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        const storedData = otpStore.get(email.toLowerCase());

        if (!storedData) {
            return NextResponse.json(
                { error: 'OTP expired or not found. Please request a new one.' },
                { status: 400 }
            );
        }

        if (Date.now() > storedData.expiresAt) {
            otpStore.delete(email.toLowerCase());
            return NextResponse.json(
                { error: 'OTP has expired. Please request a new one.' },
                { status: 400 }
            );
        }

        if (storedData.otp !== otp) {
            return NextResponse.json(
                { error: 'Invalid OTP. Please try again.' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'OTP verified successfully'
        });

    } catch (error) {
        console.error('OTP verification error:', error);
        return NextResponse.json(
            { error: 'Failed to verify OTP' },
            { status: 500 }
        );
    }
}
