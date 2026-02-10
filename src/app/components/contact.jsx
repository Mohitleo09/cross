import React, { useState } from 'react';
import Navbar from './navbar';

export default function Contact({ onLoginClick, onSignupClick, onHomeClick, onAboutClick, onContactClick, onBenefitsClick }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const [focusedField, setFocusedField] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setFormData({ name: '', email: '', message: '' });
            } else {
                setError(data.error || 'Failed to send message.');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                    .contact-title { font-size: 36px !important; letter-spacing: -1px !important; }
                    .contact-subtitle { font-size: 15px !important; max-width: 100% !important; }
                    .contact-grid { 
                        grid-template-columns: 1fr !important; 
                        gap: 32px !important; 
                    }
                    .contact-section { 
                        padding: 24px 20px !important; 
                        overflow-y: auto !important;
                        align-items: flex-start !important;
                    }
                    .contact-info-container { gap: 24px !important; }
                    .contact-form-card { 
                        padding: 24px !important; 
                        margin-bottom: 24px !important;
                    }
                    .contact-form-title { font-size: 20px !important; }
                    .success-container { 
                        padding: 40px 20px !important; 
                        min-height: 300px !important; 
                    }
                    .success-icon { 
                        width: 60px !important; 
                        height: 60px !important; 
                    }
                    .success-title { font-size: 24px !important; }
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

            <section className="contact-section" style={{
                position: 'relative',
                flex: 1,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 24px',
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

                <div className="contact-grid" style={{
                    maxWidth: '1200px',
                    width: '100%',
                    margin: '0 auto',
                    position: 'relative',
                    zIndex: 10,
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr',
                    gap: '60px',
                    alignItems: 'center'
                }}>
                    {/* Left Side - Info */}
                    <div className="contact-info-container" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '32px'
                    }}>
                        <div>
                            <h1 className="contact-title" style={{
                                fontSize: '48px',
                                fontWeight: '800',
                                color: '#111827',
                                margin: '0 0 16px 0',
                                letterSpacing: '-2px',
                                lineHeight: '1.1'
                            }}>
                                Let's Talk
                            </h1>
                            <p className="contact-subtitle" style={{
                                fontSize: '16px',
                                lineHeight: '1.6',
                                color: '#6b7280',
                                margin: 0,
                                maxWidth: '400px'
                            }}>
                                Have questions? We're here to help you streamline your presence.
                            </p>
                        </div>

                        {/* Contact Info Cards */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }}>
                            <ContactInfoCard
                                icon={<EmailIcon />}
                                title="Email Us"
                                detail="crossposting2026@gmail.com"
                                subtitle="Within 2-3 hours"
                            />
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="contact-form-card" style={{
                        background: 'white',
                        padding: '32px',
                        borderRadius: '24px',
                        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                        border: '1px solid #f1f5f9'
                    }}>
                        {success ? (
                            <div className="success-container" style={{
                                padding: '60px 20px',
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                minHeight: '400px',
                                animation: 'fadeIn 0.5s ease'
                            }}>
                                <div className="success-icon" style={{
                                    width: '80px',
                                    height: '80px',
                                    background: '#dcfce7',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '24px',
                                    color: '#166534'
                                }}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <h2 className="success-title" style={{ fontSize: '28px', fontWeight: '800', color: '#111827', margin: '0 0 16px 0', letterSpacing: '-0.5px' }}>Message Sent!</h2>
                                <p style={{ fontSize: '16px', color: '#6b7280', margin: '0 0 32px 0', lineHeight: '1.6', maxWidth: '300px' }}>
                                    Thanks for reaching out! We've received your message and will get back to you shortly at {formData.email || 'your email'}.
                                </p>
                                <button
                                    onClick={() => setSuccess(false)}
                                    style={{
                                        padding: '12px 32px',
                                        background: '#111827',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '100px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    Send Another
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 className="contact-form-title" style={{
                                    fontSize: '22px',
                                    fontWeight: '700',
                                    color: '#111827',
                                    margin: '0 0 4px 0',
                                    letterSpacing: '-0.5px'
                                }}>
                                    Send us a message
                                </h2>
                                <p style={{
                                    fontSize: '13px',
                                    color: '#6b7280',
                                    margin: '0 0 20px 0'
                                }}>
                                    Fill out the form below and we'll get back shortly.
                                </p>

                                <form onSubmit={handleSubmit} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '20px'
                                }}>
                                    <FormField
                                        label="Name"
                                        name="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        focused={focusedField === 'name'}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                    />

                                    <FormField
                                        label="Email"
                                        name="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        focused={focusedField === 'email'}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                    />

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <label style={{ fontSize: '13px', fontWeight: '700', color: '#374151' }}>Message</label>
                                        <textarea
                                            name="message"
                                            rows={4}
                                            placeholder="How can we help?"
                                            value={formData.message}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('message')}
                                            onBlur={() => setFocusedField(null)}
                                            style={{
                                                padding: '12px 14px',
                                                borderRadius: '10px',
                                                background: '#f8fafc',
                                                border: `2px solid ${focusedField === 'message' ? '#111827' : '#e2e8f0'}`,
                                                outline: 'none',
                                                resize: 'none',
                                                fontSize: '14px',
                                                color: '#111827',
                                                fontFamily: 'inherit',
                                                transition: 'all 0.2s ease'
                                            }}
                                        />
                                    </div>

                                    {error && (
                                        <div style={{ color: '#ef4444', fontSize: '13px', padding: '8px', background: '#fef2f2', borderRadius: '8px' }}>
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            marginTop: '4px',
                                            padding: '12px',
                                            background: '#111827',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '102px',
                                            fontSize: '14px',
                                            fontWeight: '700',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            opacity: loading ? 0.7 : 1,
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!loading) {
                                                e.currentTarget.style.background = '#1f2937';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!loading) {
                                                e.currentTarget.style.background = '#111827';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }
                                        }}
                                    >
                                        {loading ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

function FormField({ label, name, type, placeholder, value, onChange, focused, onFocus, onBlur }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#374151' }}>{label}</label>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    border: `2px solid ${focused ? '#111827' : '#e2e8f0'}`,
                    outline: 'none',
                    fontSize: '14px',
                    color: '#111827',
                    transition: 'all 0.2s ease'
                }}
            />
        </div>
    );
}

function ContactInfoCard({ icon, title, detail, subtitle }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                display: 'flex',
                gap: '16px',
                padding: '16px',
                background: isHovered ? '#f8fafc' : 'transparent',
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                cursor: 'default',
                border: `1px solid ${isHovered ? '#e2e8f0' : 'transparent'}`
            }}
        >
            <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
            }}>
                {icon}
            </div>
            <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', margin: '0 0 2px 0' }}>{title}</h3>
                <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 1px 0', fontWeight: '500' }}>{detail}</p>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{subtitle}</p>
            </div>
        </div>
    );
}

// Icons
const EmailIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 7 10-7" /></svg>;
const ChatIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
