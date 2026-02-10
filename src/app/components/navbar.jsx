import React, { useState } from 'react';

export default function Navbar({ onLoginClick, onSignupClick, onHomeClick, onAboutClick, onContactClick, onBenefitsClick }) {
    const [hoveredLink, setHoveredLink] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Prevent scrolling when mobile menu is open
    React.useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMenuOpen]);

    return (
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            width: '100%',
            background: 'rgba(255, 255, 255, 0.95)', // Slightly higher opacity for mobile header
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        }}>
            <style>{`
                @media (max-width: 768px) {
                    .desktop-nav { display: none !important; }
                    .mobile-toggle { display: flex !important; }
                    .nav-container { padding: 16px 20px !important; }
                }
                @media (min-width: 769px) {
                    .mobile-toggle { display: none !important; }
                }
            `}</style>

            <nav className="nav-container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 48px',
                maxWidth: '1440px',
                margin: '0 auto',
            }}>
                {/* Logo */}
                <div
                    onClick={onHomeClick}
                    style={{
                        fontSize: '22px',
                        fontWeight: '900',
                        color: '#111827',
                        letterSpacing: '-1.5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        zIndex: 1001 // Ensure logo is clickable/visible above menu if needed
                    }}>
                    <span style={{ display: 'inline-block' }}>CROSSPOSTING</span>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="mobile-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        padding: '8px',
                        color: '#111827',
                        cursor: 'pointer',
                        display: 'none', // Hidden by default, shown via CSS
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {isMenuOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    )}
                </button>

                {/* Desktop Links */}
                <ul className="desktop-nav" style={{
                    display: 'flex',
                    gap: '4px',
                    alignItems: 'center',
                    listStyle: 'none',
                    margin: 0,
                    padding: '6px',
                    background: '#f3f4f6',
                    borderRadius: '14px'
                }}>
                    <NavLink label="Home" onClick={onHomeClick} isHovered={hoveredLink === 'home'} onMouseEnter={() => setHoveredLink('home')} onMouseLeave={() => setHoveredLink(null)} />
                    <NavLink label="Features" onClick={onBenefitsClick} isHovered={hoveredLink === 'benefits'} onMouseEnter={() => setHoveredLink('benefits')} onMouseLeave={() => setHoveredLink(null)} />
                    <NavLink label="About" onClick={onAboutClick} isHovered={hoveredLink === 'about'} onMouseEnter={() => setHoveredLink('about')} onMouseLeave={() => setHoveredLink(null)} />
                    <NavLink label="Contact" onClick={onContactClick} isHovered={hoveredLink === 'contact'} onMouseEnter={() => setHoveredLink('contact')} onMouseLeave={() => setHoveredLink(null)} />
                </ul>

                {/* Desktop Auth Buttons */}
                <div className="desktop-nav" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button onClick={onLoginClick} style={{ padding: '10px 20px', background: 'transparent', border: 'none', fontSize: '14px', fontWeight: '700', color: '#4b5563', cursor: 'pointer', borderRadius: '10px', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#111827'; e.currentTarget.style.backgroundColor = '#f9fafb'; }} onMouseLeave={(e) => { e.currentTarget.style.color = '#4b5563'; e.currentTarget.style.backgroundColor = 'transparent'; }}>Log in</button>
                    <button onClick={onSignupClick} style={{ padding: '10px 24px', background: '#111827', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'; }}>Get Started</button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '100%',
                    height: 'calc(100vh - 60px)',
                    background: 'white',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '32px',
                    borderTop: '1px solid #f3f4f6',
                    animation: 'slideDown 0.3s ease-out forwards',
                    zIndex: 999
                }}>
                    <style>{`
                        @keyframes slideDown {
                            from { opacity: 0; transform: translateY(-10px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}</style>

                    {/* Mobile Links */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <MobileLink label="Home" onClick={() => { onHomeClick(); setIsMenuOpen(false); }} />
                        <MobileLink label="Features" onClick={() => { onBenefitsClick(); setIsMenuOpen(false); }} />
                        <MobileLink label="About" onClick={() => { onAboutClick(); setIsMenuOpen(false); }} />
                        <MobileLink label="Contact" onClick={() => { onContactClick(); setIsMenuOpen(false); }} />
                    </div>

                    <div style={{ height: '1px', background: '#f3f4f6', width: '100%' }}></div>

                    {/* Mobile Auth */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <button onClick={onLoginClick} style={{ width: '100%', padding: '16px', background: '#f3f4f6', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', color: '#111827', cursor: 'pointer' }}>Log in</button>
                        <button onClick={onSignupClick} style={{ width: '100%', padding: '16px', background: '#111827', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>Get Started</button>
                    </div>
                </div>
            )}
        </header>
    );
}

function MobileLink({ label, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                textAlign: 'left',
                background: 'transparent',
                border: 'none',
                padding: '16px 8px',
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                cursor: 'pointer',
                borderBottom: '1px solid #f9fafb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
        >
            {label}
            <span style={{ color: '#d1d5db' }}>&rarr;</span>
        </button>
    );
}

function NavLink({ label, onClick, isHovered, onMouseEnter, onMouseLeave }) {
    return (
        <li>
            <button
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                style={{
                    background: isHovered ? 'white' : 'transparent',
                    border: 'none',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: isHovered ? '#111827' : '#6b7280',
                    cursor: 'pointer',
                    borderRadius: '10px',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit',
                    boxShadow: isHovered ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' : 'none'
                }}
            >
                {label}
            </button>
        </li>
    );
}
