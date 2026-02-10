import { useEffect, useState } from 'react';
import { getConnectedAccounts, toggleAutoPost, getOAuthUrl, disconnectAccount } from '../api';

export default function Connect() {
    const [accounts, setAccounts] = useState([]);
    const [isHovering, setIsHovering] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        loadAccounts();

        // Check for OAuth callback parameters
        const urlParams = new URLSearchParams(window.location.search);
        const connectPlatform = urlParams.get('connect');
        const status = urlParams.get('status');
        const message = urlParams.get('message');

        if (connectPlatform && status) {
            if (status === 'success') {
                setNotification({
                    type: 'success',
                    message: `✅ ${connectPlatform.charAt(0).toUpperCase() + connectPlatform.slice(1)} connected successfully!`
                });
                // Reload accounts to show the newly connected one
                setTimeout(() => {
                    loadAccounts();
                }, 500);
            } else if (status === 'error') {
                setNotification({
                    type: 'error',
                    message: `❌ ${message || 'Failed to connect account'}`
                });
            }

            // Clean up URL parameters
            window.history.replaceState({}, '', window.location.pathname);

            // Auto-hide notification after 5 seconds
            setTimeout(() => {
                setNotification(null);
            }, 5000);
        }
    }, []);

    const loadAccounts = async () => {
        try {
            const data = await getConnectedAccounts();
            console.log('Loaded accounts:', data);
            if (Array.isArray(data)) {
                setAccounts(data);
            }
        } catch (err) {
            console.error("Failed to load accounts", err);
        }
    };

    const handleToggle = async (id, currentStatus) => {
        await toggleAutoPost(id, !currentStatus);
        loadAccounts();
    };

    const handleDisconnect = async (id) => {
        if (window.confirm('Are you sure you want to disconnect this account?')) {
            await disconnectAccount(id);
            loadAccounts();
        }
    };

    const handleRefreshUsernames = async () => {
        try {
            const response = await fetch('/api/accounts/update-usernames', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('crossposting_token')}`
                }
            });
            const result = await response.json();
            if (result.success) {
                alert(`✅ Updated ${result.updated} usernames!`);
                loadAccounts();
            } else {
                alert('Failed to update usernames');
            }
        } catch (err) {
            console.error('Refresh usernames error:', err);
            alert('Error updating usernames');
        }
    };

    return (
        <div className="connect-container" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
            <style>{`
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @media (max-width: 768px) {
                    .connect-container {
                        padding: 20px !important;
                    }
                    .connect-title {
                        font-size: 24px !important;
                        margin-bottom: 8px !important;
                    }
                    .connect-description {
                        font-size: 14px !important;
                    }
                    .connect-grid {
                        grid-template-columns: 1fr !important;
                        gap: 16px !important;
                    }
                    .accounts-list {
                        gap: 12px !important;
                    }
                }
            `}</style>

            {/* Notification Banner */}
            {notification && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 9999,
                    background: notification.type === 'success' ? '#10b981' : '#ef4444',
                    color: 'white',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                    fontSize: '14px',
                    fontWeight: '600',
                    maxWidth: '400px',
                    animation: 'slideInRight 0.3s ease-out'
                }}>
                    {notification.message}
                </div>
            )}

            <div style={{ marginBottom: '48px' }}>
                <h2 className="connect-title" style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    color: '#000000',
                    marginBottom: '12px',
                    letterSpacing: '-1px'
                }}>
                    Connect Your World
                </h2>
                <p className="connect-description" style={{
                    color: '#6b7280',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    maxWidth: '600px'
                }}>
                    Bridge your social media presence. Once connected, your Instagram posts will ripple across your selected networks instantly.
                </p>
            </div>

            <div className="connect-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                marginBottom: '64px'
            }}>
                <PlatformActionCard
                    platform="instagram"
                    icon={<InstagramIcon size={24} />}
                    label="Instagram"
                    description="Set as your primary content source"
                    isConnected={accounts.some(a => a.platform === 'instagram')}
                />
                <PlatformActionCard
                    platform="youtube"
                    icon={<YouTubeIcon size={24} />}
                    label="YouTube"
                    description="Automatically share as Shorts"
                    isConnected={accounts.some(a => a.platform === 'youtube')}
                />
                <PlatformActionCard
                    platform="twitter"
                    icon={<TwitterIcon size={24} />}
                    label="Twitter / X"
                    description="Share updates and media to your feed"
                    isConnected={accounts.some(a => a.platform === 'twitter')}
                />
            </div>

            <div style={{ marginTop: '48px', marginBottom: '20px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '4px'
                }}>
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#000000',
                        letterSpacing: '-0.3px',
                        margin: 0
                    }}>
                        Active Channels
                    </h3>
                    {accounts.length > 0 && (
                        <span style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#000000',
                            backgroundColor: '#f3f4f6',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb'
                        }}>
                            {accounts.length} {accounts.length === 1 ? 'channel' : 'channels'}
                        </span>
                    )}
                </div>
                <p style={{
                    margin: '6px 0 0',
                    fontSize: '13px',
                    color: '#6b7280',
                    lineHeight: '1.5'
                }}>
                    Manage your connected social media accounts
                </p>
            </div>

            {accounts.length === 0 ? (
                <div style={{
                    padding: '60px 24px',
                    textAlign: 'center',
                    background: '#ffffff',
                    borderRadius: '20px',
                    border: '1px dashed #e5e7eb',
                }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        backgroundColor: '#f9fafb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        border: '1px solid #e5e7eb'
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                    </div>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#000000' }}>
                        No channels connected yet
                    </p>
                    <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#6b7280' }}>
                        Connect a platform above to start crossposting
                    </p>
                </div>
            ) : (
                <div className="accounts-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {accounts.map(acc => (
                        <AccountListItem
                            key={acc.id}
                            account={acc}
                            onToggle={handleToggle}
                            onDisconnect={handleDisconnect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function PlatformActionCard({ platform, icon, label, description, isConnected }) {
    const brandColors = {
        instagram: '#E1306C',
        youtube: '#FF0000',
        twitter: '#000000'
    };

    const color = brandColors[platform] || '#000000';

    const handleClick = async () => {
        if (isConnected) return;
        try {
            const data = await getOAuthUrl(platform);
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.error("Failed to get auth URL", err);
        }
    };

    return (
        <div
            onClick={handleClick}
            style={{
                background: 'white',
                padding: '32px',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                cursor: isConnected ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}
        >
            <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: '#f9fafb',
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #e5e7eb'
            }}>
                {icon}
            </div>
            <div>
                <h4 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    margin: '0 0 4px 0',
                    color: '#000000'
                }}>
                    Connect {label}
                </h4>
                <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: 0,
                    lineHeight: '1.5'
                }}>
                    {description}
                </p>
            </div>
            <div style={{
                marginTop: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: isConnected ? '#065f46' : '#000000',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
            }}>
                {isConnected ? (
                    <>
                        <span style={{
                            width: '18px',
                            height: '18px',
                            background: '#065f46',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </span>
                        Connected
                    </>
                ) : (
                    <>
                        Link Account
                        <span style={{ transition: 'transform 0.2s' }}>→</span>
                    </>
                )}
            </div>
        </div>
    );
}

function AccountListItem({ account, onToggle, onDisconnect }) {
    const [hover, setHover] = useState(false);

    const platformMeta = {
        instagram: { icon: <InstagramIcon size={20} />, name: 'Instagram', color: '#E1306C' },
        youtube: { icon: <YouTubeIcon size={20} />, name: 'YouTube', color: '#FF0000' },
        twitter: { icon: <TwitterIcon size={20} />, name: 'Twitter', color: '#000000' }
    };

    const meta = platformMeta[account.platform] || { icon: null, name: account.platform };

    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                padding: '20px',
                background: 'white',
                borderRadius: '20px',
                border: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                boxShadow: hover ? '0 10px 15px -3px rgba(0, 0, 0, 0.05)' : 'none'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: '#f9fafb',
                    color: meta.color || '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #e5e7eb'
                }}>
                    {meta.icon}
                </div>
                <div>
                    <div style={{ fontWeight: '700', color: '#000000', fontSize: '15px' }}>
                        {meta.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Connected @{account.username || account.platform_user_id || 'User'}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                    onClick={() => onDisconnect(account.id)}
                    style={{
                        padding: '8px 16px',
                        background: '#fee2e2',
                        color: '#b91c1c',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fecaca';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fee2e2';
                    }}
                >
                    Disconnect
                </button>
                <button
                    onClick={() => onToggle(account.id, account.auto_post)}
                    style={{
                        position: 'relative',
                        width: '44px',
                        height: '24px',
                        padding: '0',
                        backgroundColor: account.auto_post ? '#000000' : '#e5e7eb',
                        border: 'none',
                        borderRadius: '100px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                        outline: 'none'
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        top: '2px',
                        left: account.auto_post ? '22px' : '2px',
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        transition: 'left 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }} />
                </button>
            </div>
        </div>
    );
}

// Icons
function InstagramIcon({ size = 20 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
    );
}

function YouTubeIcon({ size = 20 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    );
}

function TwitterIcon({ size = 20 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}
