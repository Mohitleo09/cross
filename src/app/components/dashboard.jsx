import { useState } from 'react';
import Connect from './Connect';
import Status from './Status';
import Notification from '../loginsignup/Notification';
import { useEffect } from 'react';

function Dashboard({ onLogout }) {
    const [activeTab, setActiveTab] = useState('connect');
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    const [notification, setNotification] = useState(null);
    const [supportEmail, setSupportEmail] = useState('');
    const [supportReason, setSupportReason] = useState('');
    const [supportLoading, setSupportLoading] = useState(false);
    const [supportSuccess, setSupportSuccess] = useState(false);

    const handleSupportSubmit = async (e) => {
        e.preventDefault();
        setSupportLoading(true);

        try {
            const res = await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: supportEmail, reason: supportReason })
            });

            if (res.ok) {
                setSupportSuccess(true);
                setTimeout(() => {
                    setSupportSuccess(false);
                    setIsContactOpen(false);
                    setSupportEmail('');
                    setSupportReason('');
                }, 3000);
            } else {
                alert('Failed to send message. Please ensure server credentials (EMAIL_USER/PASS) are set in .env');
            }
        } catch (error) {
            console.error('Support error:', error);
            alert('An error occurred. Please check your connection.');
        } finally {
            setSupportLoading(false);
        }
    };

    useEffect(() => {
        // Handle OAuth redirect params
        const params = new URLSearchParams(window.location.search);
        const connect = params.get('connect');
        const status = params.get('status');

        if (connect) {
            setActiveTab('connect');
            if (status === 'success') {
                setNotification({
                    message: `Successfully connected your ${connect.charAt(0).toUpperCase() + connect.slice(1)} account!`,
                    type: 'success'
                });
            } else if (status === 'error') {
                const message = params.get('message');
                setNotification({
                    message: message ? decodeURIComponent(message) : 'Failed to connect account. Please try again.',
                    type: 'error'
                });
            }
            // Clear params from URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            width: '100vw',
            background: '#f8fafc',
            fontFamily: "'Inter', sans-serif",
            overflow: 'hidden'
        }}>
            {/* Responsive CSS */}
            <style>{`
                @media (max-width: 768px) {
                    .dashboard-sidebar {
                        position: fixed !important;
                        left: ${isSidebarCollapsed ? '-100%' : '0'} !important;
                        width: 280px !important;
                        z-index: 1000 !important;
                        transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                        box-shadow: ${isSidebarCollapsed ? 'none' : '2px 0 8px rgba(0, 0, 0, 0.15)'} !important;
                    }
                    .dashboard-main {
                        margin-left: 0 !important;
                        width: 100% !important;
                    }
                    .dashboard-header {
                        padding: 12px 16px !important;
                    }
                    .dashboard-content {
                        padding: 16px !important;
                    }
                    .mobile-menu-btn {
                        display: flex !important;
                    }
                    .mobile-overlay {
                        display: ${isSidebarCollapsed ? 'none' : 'block'} !important;
                        opacity: ${isSidebarCollapsed ? '0' : '1'} !important;
                        transition: opacity 0.3s ease !important;
                    }
                    .breadcrumb-text,
                    .breadcrumb-active {
                        font-size: 12px !important;
                    }
                }
                @media (min-width: 769px) {
                    .mobile-menu-btn {
                        display: none !important;
                    }
                    .mobile-overlay {
                        display: none !important;
                    }
                }
            `}</style>

            {/* Mobile Overlay */}
            <div
                className="mobile-overlay"
                onClick={() => setIsSidebarCollapsed(true)}
                style={{
                    display: 'none',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 999
                }}
            />

            {/* Sidebar */}
            <aside
                className="dashboard-sidebar"
                style={{
                    width: isSidebarCollapsed ? '80px' : '280px',
                    height: '100vh',
                    background: 'linear-gradient(180deg, #000000 0%, #1a1a1a 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: 100,
                    position: 'relative',
                    overflow: 'hidden',
                    borderRight: '1px solid rgba(255, 255, 255, 0.08)'
                }}>

                {/* Logo Section */}
                <div style={{
                    padding: '32px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    overflow: 'hidden',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        minWidth: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: '900',
                        fontSize: '28px',
                        transition: 'transform 0.2s ease'
                    }}>
                        C
                    </div>
                    {!isSidebarCollapsed && (
                        <div style={{
                            whiteSpace: 'nowrap'
                        }}>                            <h1 style={{
                            margin: 0,
                            fontSize: '20px',
                            fontWeight: '900',
                            color: '#ffffff',
                            letterSpacing: '-0.5px'
                        }}>
                                CROSSPOSTING
                            </h1>
                            <p style={{
                                margin: '4px 0 0',
                                fontSize: '11px',
                                color: 'rgba(255, 255, 255, 0.5)',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em'
                            }}>
                                Dashboard
                            </p>
                        </div>
                    )}
                </div>

                {/* Navigation Items */}
                <nav style={{
                    flex: 1,
                    padding: '24px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <NavItem
                        icon={<ConnectIcon />}
                        label="Connect"
                        active={activeTab === 'connect'}
                        onClick={() => {
                            setActiveTab('connect');
                            // Close sidebar on mobile after selection
                            if (window.innerWidth <= 768) {
                                setIsSidebarCollapsed(true);
                            }
                        }}
                        collapsed={isSidebarCollapsed}
                    />
                    <NavItem
                        icon={<ActivityIcon />}
                        label="Activity Logs"
                        active={activeTab === 'status'}
                        onClick={() => {
                            setActiveTab('status');
                            // Close sidebar on mobile after selection
                            if (window.innerWidth <= 768) {
                                setIsSidebarCollapsed(true);
                            }
                        }}
                        collapsed={isSidebarCollapsed}
                    />
                </nav>

                {/* Bottom Section */}
                <div style={{
                    padding: '20px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    position: 'relative',
                    zIndex: 1,
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                }}>


                    {/* Logout Button */}
                    <button
                        onClick={onLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            padding: '12px',
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease',
                            justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#ffffff';
                            e.currentTarget.style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                        }}
                    >
                        <LogOutIcon />
                        {!isSidebarCollapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="dashboard-main" style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                overflow: 'hidden',
                position: 'relative'
            }}>
                {/* Header / Breadcrumbs */}
                <header className="dashboard-header" style={{
                    padding: '14px 24px',
                    background: '#ffffff',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Mobile Menu Button */}
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            style={{
                                display: 'none',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                padding: 0
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M3 5h14M3 10h14M3 15h14" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>

                        <div>
                            <span className="breadcrumb-text" style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '500' }}>Dashboard / </span>
                            <span className="breadcrumb-active" style={{ fontSize: '14px', color: '#111827', fontWeight: '700' }}>
                                {activeTab === 'connect' ? 'Connect Channels' : 'Activity Management'}
                            </span>
                        </div>
                    </div>

                    {/* User Profile in Header */}
                    <UserProfile theme="light" />
                </header>

                {/* Content Frame */}
                <div className="hide-scrollbar" style={{
                    flex: 1,
                    overflow: 'auto',
                    background: '#ffffff'
                }}>
                    <style>{`
                        .hide-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                        .hide-scrollbar {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                    `}</style>
                    <div style={{
                        minHeight: '100%'
                    }}>
                        {activeTab === 'connect' && <Connect />}
                        {activeTab === 'status' && <Status />}
                    </div>
                </div>

                {/* Notifications */}
                {notification && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}

                {/* Floating Contact/Support */}
                <button
                    className="floating-support-btn"
                    onClick={() => setIsContactOpen(!isContactOpen)}
                    style={{
                        position: 'fixed',
                        bottom: '32px',
                        right: '32px',
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: '#111827',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        transform: isContactOpen ? 'rotate(135deg)' : 'rotate(0deg)'
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>

                {/* Support Modal */}
                {isContactOpen && (
                    <div className="support-modal" style={{
                        position: 'fixed',
                        bottom: '100px',
                        right: '32px',
                        width: '360px',
                        background: 'white',
                        borderRadius: '24px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        border: '1px solid #e2e8f0',
                        zIndex: 999,
                        overflow: 'hidden',
                        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                        {supportSuccess ? (
                            <div style={{ padding: '60px 24px', textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    background: '#10b981',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 16px',
                                    color: 'white'
                                }}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '800', color: '#111827' }}>Message Sent!</h3>
                                <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                                    We've received your request.
                                </p>
                                <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af', lineHeight: '1.5' }}>
                                    Our team will get back to you shortly at {supportEmail}.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div style={{ padding: '24px', background: '#111827', color: 'white' }}>
                                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>How can we help?</h3>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', opacity: 0.8 }}>We typically respond in less than 2 hours.</p>
                                </div>
                                <form className="support-form" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handleSupportSubmit}>
                                    <input
                                        placeholder="Email address"
                                        type="email"
                                        required
                                        value={supportEmail}
                                        onChange={(e) => setSupportEmail(e.target.value)}
                                        style={{
                                            padding: '12px 16px',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                            background: '#f8fafc',
                                            fontSize: '14px',
                                            outline: 'none'
                                        }}
                                    />
                                    <textarea
                                        placeholder="Describe your issue..."
                                        rows={4}
                                        required
                                        value={supportReason}
                                        onChange={(e) => setSupportReason(e.target.value)}
                                        style={{
                                            padding: '12px 16px',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                            background: '#f8fafc',
                                            fontSize: '14px',
                                            outline: 'none',
                                            resize: 'none',
                                            fontFamily: 'inherit'
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        disabled={supportLoading}
                                        style={{
                                            padding: '12px',
                                            background: '#111827',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontWeight: '700',
                                            cursor: supportLoading ? 'not-allowed' : 'pointer',
                                            opacity: supportLoading ? 0.7 : 1,
                                            transition: 'opacity 0.2s'
                                        }}
                                    >
                                        {supportLoading ? 'Preparing...' : 'Send Priority Message'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                )}
            </main>
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes float {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(30px, -30px) rotate(120deg); }
                    66% { transform: translate(-20px, 20px) rotate(240deg); }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideIn {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
                @keyframes shine {
                    from { left: -100%; }
                    to { left: 200%; }
                }
                
                /* Mobile Responsive Styles for Support */
                @media (max-width: 768px) {
                    .floating-support-btn {
                        bottom: 20px !important;
                        right: 20px !important;
                        width: 52px !important;
                        height: 52px !important;
                    }
                    .support-modal {
                        bottom: 80px !important;
                        right: 20px !important;
                        left: 20px !important;
                        width: auto !important;
                        max-width: calc(100vw - 40px) !important;
                        border-radius: 20px !important;
                    }
                    .support-form {
                        padding: 20px !important;
                        gap: 14px !important;
                    }
                    .support-modal textarea {
                        min-height: 80px !important;
                    }
                    .support-modal h3 {
                        font-size: 16px !important;
                    }
                    .support-modal input,
                    .support-modal textarea {
                        font-size: 14px !important;
                    }
                }
            `}</style>
        </div>
    );
}

function NavItem({ icon, label, active, onClick, collapsed }) {
    const [hover, setHover] = useState(false);

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px',
                width: '100%',
                background: 'transparent',
                color: active || hover ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: active ? '700' : '500',
                fontSize: '14px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                position: 'relative',
                opacity: active ? 1 : (hover ? 0.9 : 0.8)
            }}
        >
            <div style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                transform: active || hover ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.2s ease'
            }}>
                {icon}
            </div>
            {!collapsed && (
                <span style={{
                    whiteSpace: 'nowrap',
                    position: 'relative',
                    zIndex: 1,
                    letterSpacing: '-0.2px'
                }}>
                    {label}
                </span>
            )}
            {active && !collapsed && (
                <div style={{
                    marginLeft: 'auto',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    flexShrink: 0
                }} />
            )}

            {/* Tooltip for collapsed state */}
            {collapsed && hover && (
                <div style={{
                    position: 'absolute',
                    left: '100%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    marginLeft: '12px',
                    background: '#000000',
                    color: '#ffffff',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    zIndex: 1000,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    pointerEvents: 'none'
                }}>
                    {label}
                    {/* Arrow */}
                    <div style={{
                        position: 'absolute',
                        left: '-4px',
                        top: '50%',
                        transform: 'translateY(-50%) rotate(45deg)',
                        width: '8px',
                        height: '8px',
                        background: '#000000'
                    }} />
                </div>
            )}
        </button>
    );
}

function UserProfile({ collapsed, theme = 'dark' }) {
    const [userName, setUserName] = useState('User');
    const [hover, setHover] = useState(false);

    const isLight = theme === 'light';
    const mainColor = isLight ? '#000000' : '#ffffff';
    const subColor = isLight ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)';
    const borderColor = isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.3)';

    useEffect(() => {
        // Fetch user name from JWT token
        const token = localStorage.getItem('crossposting_token');
        if (token) {
            try {
                // Decode JWT to get user info
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserName(payload.name || 'User');
            } catch (error) {
                console.error('Failed to decode token:', error);
                setUserName('User');
            }
        }
    }, []);

    // Get initials from name
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (collapsed) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                position: 'relative'
            }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: `1px solid ${borderColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: mainColor,
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    opacity: hover ? 1 : 0.8
                }}>
                    {getInitials(userName)}
                </div>
            </div>
        );
    }

    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 12px',
                borderRadius: '12px',
                transition: 'all 0.2s ease',
                cursor: 'default',
                opacity: hover ? 1 : 0.9
            }}
        >
            <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: `1px solid ${borderColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: mainColor,
                fontWeight: '600',
                fontSize: '13px',
                flexShrink: 0
            }}>
                {getInitials(userName)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: mainColor,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {userName}
                </div>
            </div>
        </div>
    );
}

// Sidebar Icons
const ConnectIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>;
const ActivityIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
const LogOutIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;

export default Dashboard;
