
import React from 'react';
import Navbar from './navbar';

export default function Terms({ onLoginClick, onSignupClick, onHomeClick, onAboutClick, onContactClick, onBenefitsClick }) {
    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Responsive CSS */}
            <style>{`
                /* Hide scrollbar for Chrome, Safari and Opera */
                html::-webkit-scrollbar,
                body::-webkit-scrollbar,
                *::-webkit-scrollbar {
                    display: none;
                    width: 0;
                    height: 0;
                }
                
                /* Hide scrollbar for IE, Edge and Firefox */
                html,
                body,
                * {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
                
                @media (max-width: 768px) {
                    .policy-title { font-size: 32px !important; letter-spacing: -1px !important; }
                    .policy-container { padding: 25px 20px 40px !important; }
                    .policy-section-title { font-size: 18px !important; }
                    .policy-text { font-size: 15px !important; text-align: justify !important; }
                    .policy-section { margin-bottom: 32px !important; }
                }
            `}</style>

            <Navbar
                onLoginClick={onLoginClick}
                onSignupClick={onSignupClick}
                onHomeClick={onHomeClick}
                onAboutClick={onAboutClick}
                onContactClick={onContactClick}
                onBenefitsClick={onBenefitsClick}
            />

            <div className="policy-container" style={{ flex: 1, maxWidth: '800px', width: '100%', margin: '0 auto', padding: '30px 24px 60px' }}>
                <h1 className="policy-title" style={{ fontSize: '42px', fontWeight: '800', color: '#111827', marginBottom: '16px', letterSpacing: '-1.5px' }}>Terms and Conditions</h1>
                <p style={{ color: '#6b7280', marginBottom: '64px', fontSize: '16px' }}>Last updated: {new Date().toLocaleDateString()}</p>

                <Section title="1. Agreement to Terms">
                    By accessing or using our Crossposting Service ("Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you disagree with any part of these Terms, you may not access the Service.
                </Section>

                <Section title="2. Description of Service">
                    Our Service allows users to manage and post content across multiple social media platforms simultaneously. We act as an intermediary tool to facilitate your interactions with connected third-party platforms.
                </Section>

                <Section title="3. User Content & Conduct">
                    <ul style={{ paddingLeft: '20px', marginTop: '16px', listStyleType: 'disc' }}>
                        <li style={{ marginBottom: '8px' }}>You retain all ownership rights to the content you post via our Service.</li>
                        <li style={{ marginBottom: '8px' }}>You are solely responsible for the content you upload, post, or display using our Service.</li>
                        <li style={{ marginBottom: '8px' }}>You agree not to use the Service for any unlawful purpose or to post any content that violates intellectual property rights or community guidelines of the respective platforms.</li>
                    </ul>
                </Section>

                <Section title="4. Third-Party Platforms">
                    Our Service integrates with Instagram, YouTube, and Twitter/X. Your use of these platforms through our Service is subject to their respective terms:
                    <ul style={{ paddingLeft: '20px', marginTop: '16px', listStyleType: 'disc' }}>
                        <li style={{ marginBottom: '8px' }}><strong>YouTube Terms of Service:</strong> By using our Service to interact with YouTube, you agree to be bound by the YouTube Terms of Service available at <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>https://www.youtube.com/t/terms</a>.</li>
                        <li style={{ marginBottom: '8px' }}><strong>Instagram / Meta:</strong> You agree to comply with Instagram's Terms of Use and Meta's Terms of Service.</li>
                        <li style={{ marginBottom: '8px' }}><strong>Twitter / X:</strong> You agree to comply with X's Terms of Service.</li>
                    </ul>
                    We are not responsible for the availability or functionality of any Third-Party Platform.
                </Section>

                <Section title="5. API Usage">
                    Our application uses YouTube API Services. By using our application, you acknowledge that we access, use, and store certain data as described in our Privacy Policy. You can revoke our access to your data via the Google Security Settings page at <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>https://myaccount.google.com/permissions</a>.
                </Section>

                <Section title="6. Termination">
                    We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
                </Section>

                <Section title="7. Limitation of Liability">
                    In no event shall Crossposting App, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                </Section>

                <Section title="8. Changes to Terms">
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                </Section>

                <Section title="9. Contact Us">
                    If you have any questions about these Terms, please contact us.
                </Section>
            </div>

            <div style={{ borderTop: '1px solid #e5e7eb', padding: '40px 0', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                &copy; {new Date().getFullYear()} Crossposting App. All rights reserved.
            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="policy-section" style={{ marginBottom: '48px' }}>
            <h2 className="policy-section-title" style={{ fontSize: '22px', fontWeight: '700', color: '#111827', marginBottom: '16px', letterSpacing: '-0.5px' }}>{title}</h2>
            <div className="policy-text" style={{ fontSize: '16px', lineHeight: '1.7', color: '#4b5563' }}>
                {children}
            </div>
        </div>
    );
}
