
import React from 'react';
import Navbar from './navbar';

export default function CookiePolicy({ onLoginClick, onSignupClick, onHomeClick, onAboutClick, onContactClick, onBenefitsClick }) {
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
                <h1 className="policy-title" style={{ fontSize: '42px', fontWeight: '800', color: '#111827', marginBottom: '16px', letterSpacing: '-1.5px' }}>Cookie Policy</h1>
                <p style={{ color: '#6b7280', marginBottom: '64px', fontSize: '16px' }}>Last updated: {new Date().toLocaleDateString()}</p>

                <Section title="1. Introduction">
                    This Cookie Policy explains what cookies are and how Crossposting App uses them. You should read this policy so you can understand what type of cookies we use, the information we collect using cookies, and how that information is used.
                </Section>

                <Section title="2. What are Cookies?">
                    Cookies are small text files that are sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third party to recognize you and make your next visit easier and the Service more useful to you.
                </Section>

                <Section title="3. How We Use Cookies">
                    When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the following purposes:
                    <ul style={{ paddingLeft: '20px', marginTop: '16px', listStyleType: 'disc' }}>
                        <li style={{ marginBottom: '8px' }}><strong>To enable certain functions of the Service:</strong> We use essential cookies to authenticate users and prevent fraudulent use of user accounts.</li>
                        <li style={{ marginBottom: '8px' }}><strong>To provide analytics:</strong> We may use third-party analytics cookies to track information on how the Service is used so that we can make improvements.</li>
                        <li style={{ marginBottom: '8px' }}><strong>To store your preferences:</strong> We use cookies to remember your settings and preferences.</li>
                    </ul>
                </Section>

                <Section title="4. Managing Cookies">
                    If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser. Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.
                    <p style={{ marginTop: '16px' }}>
                        For the Chrome web browser, please visit this page from Google: <a href="https://support.google.com/accounts/answer/32050" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>https://support.google.com/accounts/answer/32050</a>
                    </p>
                </Section>

                <Section title="5. Changes to This Policy">
                    We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page.
                </Section>

                <Section title="6. Contact Us">
                    If you have any questions about this Cookie Policy, please contact us.
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
