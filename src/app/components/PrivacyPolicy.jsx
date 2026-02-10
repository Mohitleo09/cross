
import React from 'react';
import Navbar from './navbar';

export default function PrivacyPolicy({ onLoginClick, onSignupClick, onHomeClick, onAboutClick, onContactClick, onBenefitsClick }) {
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
                <h1 className="policy-title" style={{ fontSize: '42px', fontWeight: '800', color: '#111827', marginBottom: '16px', letterSpacing: '-1.5px' }}>Privacy Policy</h1>
                <p style={{ color: '#6b7280', marginBottom: '64px', fontSize: '16px' }}>Last updated: {new Date().toLocaleDateString()}</p>

                <Section title="1. Introduction">
                    Welcome to Crossposting App ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our web application and services. By accessing or using our Service, you consent to the practices described in this policy.
                </Section>

                <Section title="2. Information We Collect">
                    We collect information that identifies, relates to, describes, or could reasonably be linked, directly or indirectly, with you ("Personal Data").
                    <ul style={{ paddingLeft: '20px', marginTop: '16px', listStyleType: 'disc' }}>
                        <li style={{ marginBottom: '8px' }}><strong>Account Information:</strong> When you register, we collect your email address, username, and authentication credentials.</li>
                        <li style={{ marginBottom: '8px' }}><strong>Social Media Data:</strong> When you connect your social media accounts (e.g., Instagram, YouTube, Twitter/X), we collect authorization tokens, profile names, and content metadata necessary to perform cross-posting functions. We do NOT store your social media passwords.</li>
                        <li style={{ marginBottom: '8px' }}><strong>Usage Data:</strong> We automatically collect information about your interaction with our Service, including IP addresses, browser type, and access times.</li>
                    </ul>
                </Section>

                <Section title="3. How We Use Your Information">
                    We use the collected information for the following purposes:
                    <ul style={{ paddingLeft: '20px', marginTop: '16px', listStyleType: 'disc' }}>
                        <li style={{ marginBottom: '8px' }}>To provide, operate, and maintain our Service.</li>
                        <li style={{ marginBottom: '8px' }}>To process and publish your content across connected platforms as directed by you.</li>
                        <li style={{ marginBottom: '8px' }}>To improve usage flow and user experience.</li>
                        <li style={{ marginBottom: '8px' }}>To communicate with you regarding updates, security alerts, and support.</li>
                    </ul>
                </Section>

                <Section title="4. Third-Party Services & Data Sharing">
                    Our Service relies on third-party APIs to function. By connecting your accounts, you authorize us to share content with these platforms:
                    <ul style={{ paddingLeft: '20px', marginTop: '16px', listStyleType: 'disc' }}>
                        <li style={{ marginBottom: '8px' }}><strong>Google / YouTube API Services:</strong> We use YouTube API Services to upload video content. By using our Service to interact with YouTube, you agree to be bound by the Google Privacy Policy available at <a href="http://www.google.com/policies/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>http://www.google.com/policies/privacy</a>. You can manage your Google security settings at <a href="https://security.google.com/settings/security/permissions" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>https://security.google.com/settings/security/permissions</a>.</li>
                        <li style={{ marginBottom: '8px' }}><strong>Meta / Instagram:</strong> Information shared with Instagram is subject to the Meta Privacy Policy.</li>
                        <li style={{ marginBottom: '8px' }}><strong>X (formerly Twitter):</strong> Information shared with X is subject to the X Privacy Policy.</li>
                    </ul>
                    We do not sell your personal data to advertisers or other third parties.
                </Section>

                <Section title="5. Data Retention and Deletion">
                    We retain your personal data only for as long as necessary to provide the Service. You may request deletion of your account and associated data at any time by contacting us at support@crossposting.com or using the deletion tools provided within your account settings. Upon request, we will delete your data from our servers, subject to any legal obligations.
                </Section>

                <Section title="6. Cookies">
                    We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. Please see our Cookie Policy for more details.
                </Section>

                <Section title="7. Contact Us">
                    If you have any questions about this Privacy Policy, please contact us via our Support page.
                </Section>
            </div>

            {/* Simple Footer */}
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
