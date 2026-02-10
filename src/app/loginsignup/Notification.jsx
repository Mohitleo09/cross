import React, { useEffect } from 'react';

export default function Notification({ message, type, onClose }) {
    const isSuccess = type === 'success';

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            padding: '16px 20px',
            background: 'white',
            borderRadius: '16px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)',
            minWidth: '320px',
            maxWidth: '420px',
            animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            fontFamily: "'Inter', sans-serif"
        }}>
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%) translateY(-20px); opacity: 0; }
                    to { transform: translateX(0) translateY(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0) translateY(0); opacity: 1; }
                    to { transform: translateX(100%) translateY(-20px); opacity: 0; }
                }
            `}</style>

            <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isSuccess ? '#ecfdf5' : '#fef2f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
            }}>
                {isSuccess ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                )}
            </div>

            <div style={{ flex: 1 }}>
                <p style={{
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#111827'
                }}>
                    {isSuccess ? 'Success' : 'Error'}
                </p>
                <p style={{
                    margin: '2px 0 0 0',
                    fontSize: '13px',
                    color: '#6b7280',
                    lineHeight: '1.4'
                }}>
                    {message}
                </p>
            </div>

            <button
                onClick={onClose}
                style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: '4px',
                    color: '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                    e.currentTarget.style.color = '#111827';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#9ca3af';
                }}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    );
}
