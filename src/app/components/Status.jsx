import { useEffect, useState } from "react";
import { getPostStatus } from "../api";

export default function Status() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = () => {
        setLoading(true);
        getPostStatus()
            .then(data => {
                setItems(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="status-container" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <style>{`
                @media (max-width: 768px) {
                    .status-container {
                        padding: 20px !important;
                    }
                    .status-header {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 12px !important;
                        margin-bottom: 24px !important;
                    }
                    .status-title-row {
                        width: 100% !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: space-between !important;
                        margin-bottom: 8px !important;
                    }
                    .status-title {
                        font-size: 24px !important;
                        margin-bottom: 0 !important;
                    }
                    .status-description {
                        font-size: 14px !important;
                        margin-top: 0 !important;
                    }
                    .status-table-container {
                        border-radius: 12px !important;
                        overflow-x: auto !important;
                        -webkit-overflow-scrolling: touch !important;
                    }
                    .status-table-container table {
                        font-size: 13px !important;
                    }
                    .status-table-container th,
                    .status-table-container td {
                        padding: 12px 8px !important;
                        white-space: nowrap !important;
                    }
                    .status-refresh-btn {
                        width: 36px !important;
                        height: 36px !important;
                        min-width: 36px !important;
                    }
                }
                
                /* Hide scrollbar but keep functionality */
                .status-table-container::-webkit-scrollbar {
                    height: 6px;
                }
                .status-table-container::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .status-table-container::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 10px;
                }
                .status-table-container::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
            `}</style>

            <div className="status-header" style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '0' }}>
                <div className="status-title-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <h2 className="status-title" style={{
                        fontSize: '32px',
                        fontWeight: '800',
                        color: '#000000',
                        marginBottom: '12px',
                        letterSpacing: '-1px'
                    }}>
                        Content Pipeline
                    </h2>
                    <button
                        className="status-refresh-btn"
                        onClick={loadData}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'transparent',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'opacity 0.2s',
                            opacity: 0.6
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '0.6';
                        }}
                        title="Refresh status"
                    >
                        <RefreshIcon size={20} />
                    </button>
                </div>
                <p className="status-description" style={{
                    color: '#6b7280',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    maxWidth: '600px',
                    margin: 0
                }}>
                    Track your cross-platform content as it flows across your connected channels.
                </p>
            </div>

            <div className="status-table-container" style={{
                background: 'white',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                overflow: 'hidden',
                position: 'relative'
            }}>
                <div style={{ overflowX: 'auto', overflowY: 'visible' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <Th>Platform</Th>
                                <Th>Content ID</Th>
                                <Th>Dispatch Status</Th>
                                <Th>Insights / Errors</Th>
                                <Th>Timestamp</Th>
                            </tr>
                        </thead>
                        <tbody style={{ verticalAlign: 'middle' }}>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '60px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                                            <div style={{
                                                width: '24px',
                                                height: '24px',
                                                border: '3px solid #f3f3f3',
                                                borderTop: '3px solid #000000',
                                                borderRadius: '50%',
                                                animation: 'spin 1s linear infinite'
                                            }} />
                                            <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>Retrieving your history...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '80px 24px', textAlign: 'center' }}>
                                        <div style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: '20px',
                                            background: '#f9fafb',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 20px',
                                            border: '1px solid #e5e7eb'
                                        }}>
                                            <InboxIcon size={32} />
                                        </div>
                                        <p style={{ fontSize: '16px', color: '#000000', fontWeight: '600', margin: 0 }}>All quiet on the front.</p>
                                        <p style={{ fontSize: '14px', color: '#6b7280', margin: '8px 0 0 0' }}>Post something on Instagram to see the magic happen.</p>
                                    </td>
                                </tr>
                            ) : (
                                items.map((item, idx) => (
                                    <tr key={idx} style={{
                                        borderBottom: idx === items.length - 1 ? 'none' : '1px solid #f3f4f6',
                                        transition: 'background-color 0.2s'
                                    }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <PlatformIcon platform={item.platform} />
                                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#000000', textTransform: 'capitalize' }}>
                                                    {item.platform || 'Unknown'}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{
                                                padding: '6px 10px',
                                                background: '#f3f4f6',
                                                borderRadius: '8px',
                                                display: 'inline-block',
                                                border: '1px solid #e5e7eb'
                                            }}>
                                                <span style={{
                                                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                                                    fontSize: '12px',
                                                    color: '#000000',
                                                    fontWeight: '500'
                                                }}>
                                                    {(item.instagram_media_id || item.id || 'N/A').toString().substring(0, 12)}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td style={{ padding: '20px 24px', maxWidth: '300px' }}>
                                            {item.last_error ? (
                                                <div style={{
                                                    fontSize: '13px',
                                                    color: '#000000',
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: '8px',
                                                    background: '#ffffff',
                                                    padding: '8px 12px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #000000'
                                                }}>
                                                    <AlertCircleIcon size={16} />
                                                    <span>{item.last_error}</span>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#000000' }}>
                                                    <CheckCircleIcon size={16} />
                                                    <span style={{ fontSize: '13px', fontWeight: '500' }}>Synchronized perfectly</span>
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ fontSize: '13px', color: '#000000', fontWeight: '600' }}>
                                                {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                                                {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

function Th({ children }) {
    return (
        <th style={{
            padding: '16px 24px',
            textAlign: 'left',
            fontSize: '12px',
            fontWeight: '700',
            color: '#000000',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
        }}>
            {children}
        </th>
    );
}

function StatusBadge({ status }) {
    const config = {
        success: { color: '#ffffff', bg: '#000000', label: 'Delivered', icon: '●', border: '1px solid #000000' },
        failed: { color: '#000000', bg: '#ffffff', label: 'Halted', icon: '✕', border: '1px solid #000000' },
        pending: { color: '#000000', bg: '#f3f4f6', label: 'In Queue', icon: '○', border: '1px solid #e5e7eb' },
        processing: { color: '#000000', bg: '#e5e7eb', label: 'Processing', icon: '↻', border: '1px solid #d1d5db' }
    };

    const s = status?.toLowerCase() || 'pending';
    const style = config[s] || config.pending;

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '100px',
            background: style.bg,
            color: style.color,
            fontSize: '12px',
            fontWeight: '700',
            border: style.border
        }}>
            <span style={{ fontSize: '8px' }}>{style.icon}</span>
            {style.label}
        </span>
    );
}

function PlatformIcon({ platform }) {
    const p = platform?.toLowerCase();

    // Brand Colors
    let color = '#000000';
    if (p?.includes('instagram')) color = '#E1306C';
    else if (p?.includes('youtube')) color = '#FF0000';
    else if (p?.includes('twitter')) color = '#000000';

    return (
        <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
            border: '1px solid #e5e7eb'
        }}>
            {p?.includes('youtube') && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
            )}
            {p?.includes('instagram') && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            )}
            {p?.includes('twitter') && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            )}
            {!p?.includes('youtube') && !p?.includes('instagram') && !p?.includes('twitter') && (
                <span>{p ? p[0].toUpperCase() : '?'}</span>
            )}
        </div>
    );
}

// Icons
const AlertCircleIcon = ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
const CheckCircleIcon = ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const InboxIcon = ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const RefreshIcon = ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" /></svg>;
