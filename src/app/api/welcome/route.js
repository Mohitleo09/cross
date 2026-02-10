
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const htmlContent = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
                <div style="background-color: #111827; padding: 40px 32px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Welcome to Crossposting!</h1>
                    <p style="color: #9ca3af; font-size: 14px; margin-top: 8px; letter-spacing: 0.5px;">One Post. All Platforms.</p>
                </div>
                
                <div style="padding: 40px 32px;">
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                        Hi there,
                    </p>
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                        Thanks for opting to receive updates from us. We're thrilled to have you explore the future of social media management.
                    </p>
                    
                    <div style="background-color: #f9fafb; padding: 24px; border-radius: 12px; margin-bottom: 32px; border: 1px solid #e5e7eb; text-align: center;">
                        <p style="color: #4b5563; font-size: 15px; margin: 0; font-weight: 500;">
                            Your journey to effortless content distribution starts now.
                        </p>
                    </div>

                    <div style="text-align: center;">
                        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://crossposting.com'}" style="display: inline-block; background-color: #111827; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 100px; font-weight: 600; font-size: 16px; transition: background 0.2s;">Go to Dashboard</a>
                    </div>
                </div>
                
                <div style="background-color: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px 0;">
                        You received this email because you signed up on our website.
                    </p>
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                        © ${new Date().getFullYear()} Crossposting. All rights reserved.
                    </p>
                </div>
            </div>
        `;

        await transporter.sendMail({
            from: `"Crossposting Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Welcome to Crossposting!',
            html: htmlContent
        });

        return NextResponse.json({ success: true, message: 'Welcome email sent' });
    } catch (error) {
        console.error('Welcome email error:', error);
        return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
    }
}
