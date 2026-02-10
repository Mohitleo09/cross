import React from 'react';
import Navbar from './navbar';

export default function About({ onLoginClick, onSignupClick, onHomeClick, onAboutClick, onContactClick, onBenefitsClick }) {
    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            fontFamily: "'Inter', sans-serif",
            position: 'relative',
            overflow: 'auto'
        }}>
            {/* Responsive CSS */}
            <style>{`
                @media (max-width: 768px) {
                    .about-title { font-size: 36px !important; letter-spacing: -1px !important; }
                    .about-subtitle { font-size: 16px !important; }
                    .about-grid { 
                        grid-template-columns: 1fr !important; 
                        gap: 32px !important; 
                    }
                    .about-section-title { font-size: 18px !important; }
                    .about-text { font-size: 15px !important; }
                    .about-container { padding: 24px 20px !important; }
                    .about-header { margin-bottom: 32px !important; }
                    .about-narrative { margin-bottom: 32px !important; }
                    .value-cards-container { gap: 12px !important; }
                    .gradient-accent { display: none !important; }
                }
            `}</style>

            {/* Navbar */}
            <Navbar
                onLoginClick={onLoginClick}
                onSignupClick={onSignupClick}
                onHomeClick={onHomeClick}
                onAboutClick={onAboutClick}
                onContactClick={onContactClick}
                onBenefitsClick={onBenefitsClick}
            />

            <section style={{
                position: 'relative',
                flex: 1,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '20px 24px',
                overflow: 'auto'
            }}>
                {/* Subtle Pattern Background */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    zIndex: 0,
                    opacity: 0.5
                }} />

                {/* Gradient Accent - Top Right */}
                <div className="gradient-accent" style={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-5%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
                    borderRadius: '50%',
                    zIndex: 0,
                    pointerEvents: 'none'
                }} />

                {/* Gradient Accent - Bottom Left */}
                <div className="gradient-accent" style={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-5%',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)',
                    borderRadius: '50%',
                    zIndex: 0,
                    pointerEvents: 'none'
                }} />

                <div className="about-container" style={{
                    maxWidth: '1200px',
                    width: '100%',
                    margin: '0 auto',
                    position: 'relative',
                    zIndex: 10,
                    padding: '40px 24px'
                }}>
                    {/* Header Section */}
                    <div className="about-header" style={{
                        textAlign: 'center',
                        marginBottom: '48px'
                    }}>
                        <h1 className="about-title" style={{
                            fontSize: '48px',
                            fontWeight: '800',
                            color: '#111827',
                            margin: '0 0 16px 0',
                            letterSpacing: '-2px',
                            lineHeight: '1.1'
                        }}>
                            About Us
                        </h1>
                        <p className="about-subtitle" style={{
                            fontSize: '18px',
                            lineHeight: '1.6',
                            color: '#6b7280',
                            margin: '0 auto',
                            maxWidth: '600px',
                            fontWeight: '400'
                        }}>
                            We build tools for the creators of tomorrow.
                        </p>
                    </div>

                    {/* Content Grid */}
                    <div className="about-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(300px, 1.2fr) minmax(300px, 1fr)',
                        gap: '48px',
                        alignItems: 'start'
                    }}>
                        {/* Narrative Column */}
                        <div>
                            <div className="about-narrative" style={{ marginBottom: '48px' }}>
                                <h2 className="about-section-title" style={{
                                    fontSize: '20px',
                                    fontWeight: '700',
                                    color: '#111827',
                                    marginBottom: '12px',
                                    letterSpacing: '-0.5px'
                                }}>
                                    Our Mission
                                </h2>
                                <p className="about-text" style={{
                                    fontSize: '16px',
                                    lineHeight: '1.7',
                                    color: '#4b5563',
                                    marginBottom: '0'
                                }}>
                                    We founded Crossposting with a bold vision: to simplify the digital chaos. In a world where platforms are multiplying, we provide the unified layer that connects them all. We believe creators should spend 99% of their time creating, and 1% distributing.
                                </p>
                            </div>

                            <div>
                                <h2 className="about-section-title" style={{
                                    fontSize: '20px',
                                    fontWeight: '700',
                                    color: '#111827',
                                    marginBottom: '12px',
                                    letterSpacing: '-0.5px'
                                }}>
                                    Why We Exist
                                </h2>
                                <p className="about-text" style={{
                                    fontSize: '16px',
                                    lineHeight: '1.7',
                                    color: '#4b5563',
                                    marginBottom: '0'
                                }}>
                                    Managing presence across Instagram, YouTube, and X is a full-time job. We automated the tedious parts—formatting, uploading, tagging—so you can focus on building your community. This isn't just a tool; it's your productivity partner.
                                </p>
                            </div>
                        </div>

                        {/* Visuals / Values Column */}
                        <div className="value-cards-container" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }}>
                            <ValueCard
                                icon={<BoltIcon />}
                                title="Speed & Efficency"
                                description="Publish to three major platforms in the time it takes to post to one."
                            />
                            <ValueCard
                                icon={<GlobeIcon />}
                                title="Global Reach"
                                description="Maximize your audience by being omnipresent without the extra effort."
                            />
                            <ValueCard
                                icon={<ShieldIcon />}
                                title="Privacy First"
                                description="Your content belongs to you. We just help it travel further."
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function ValueCard({ icon, title, description }) {
    return (
        <div
            style={{
                padding: '20px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s ease',
                cursor: 'default',
                boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.02)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)';
                e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px -1px rgba(0, 0, 0, 0.02)';
                e.currentTarget.style.borderColor = '#e5e7eb';
            }}
        >
            <div style={{
                color: '#111827',
                marginTop: '2px',
                flexShrink: 0
            }}>
                {React.cloneElement(icon, { strokeWidth: 1.5, width: 28, height: 28 })}
            </div>

            <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '4px', lineHeight: '1.4' }}>{title}</h3>
                <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#6b7280', margin: 0 }}>{description}</p>
            </div>
        </div>
    );
}

// Icons
function BoltIcon() {
    return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>;
}
function GlobeIcon() {
    return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>;
}
function ShieldIcon() {
    return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
