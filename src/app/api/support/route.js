
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        const { name, email, reason, message } = await request.json();
        const userMessage = message || reason;
        const userName = name || 'User';

        if (!email || !userMessage) {
            return NextResponse.json(
                { success: false, error: 'Email and message are required' },
                { status: 400 }
            );
        }

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('Missing EMAIL_USER or EMAIL_PASS in env');
            return NextResponse.json(
                { success: false, error: 'Server email credentials match configuration error.' },
                { status: 500 }
            );
        }

        // Configure Nodemailer for Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Neat HTML Content
        const htmlContent = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #111827; margin: 0; font-size: 24px; letter-spacing: -0.5px;">New Contact Message</h2>
                    <p style="color: #6b7280; font-size: 14px; margin-top: 8px;">Received via Crossposting Website</p>
                </div>
                
                <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                    <div style="margin-bottom: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 16px;">
                        <span style="display: block; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">From</span>
                        <span style="display: block; font-size: 16px; color: #111827; font-weight: 600;">${userName}</span>
                        <span style="display: block; font-size: 14px; color: #4b5563;">${email}</span>
                    </div>
                    
                    <div>
                        <span style="display: block; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Message</span>
                        <div style="font-size: 15px; line-height: 1.6; color: #374151; white-space: pre-wrap; background: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">${userMessage}</div>
                    </div>
                </div>
                
                <div style="text-align: center; border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 24px;">
                    <a href="mailto:${email}" style="display: inline-block; background: #111827; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">Reply to ${userName}</a>
                </div>
            </div>
        `;

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: '742leoleo@gmail.com',
            subject: `Contact Request from ${userName}`,
            html: htmlContent,
            replyTo: email
        });

        return NextResponse.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Email send error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to send email.' },
            { status: 500 }
        );
    }
}
