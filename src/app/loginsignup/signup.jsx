import React, { useState } from 'react';
import Notification from './Notification';

export default function Signup({ onSignupSuccess, onLoginClick, onHomeClick, initialEmail }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState(initialEmail || '');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [notification, setNotification] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!name || !email || !password) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        // Check for at least one number
        if (!/\d/.test(password)) {
            setError("Password must contain at least one number");
            setLoading(false);
            return;
        }

        // Check for at least one special character
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            setError("Password must contain at least one special character (!@#$%^&*...)");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            setNotification({
                message: 'Account created successfully!',
                type: 'success'
            });

            setTimeout(() => {
                if (onLoginClick) onLoginClick();
            }, 1500);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            backgroundColor: '#ffffff',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Inter', sans-serif",
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Responsive CSS */}
            <style>{`
                @media (max-width: 768px) {
                    .signup-container {
                        padding: 32px 24px !important;
                        max-width: 100% !important;
                    }
                    .signup-title {
                        font-size: 28px !important;
                        margin-bottom: 8px !important;
                    }
                    .signup-subtitle {
                        font-size: 14px !important;
                    }
                    .signup-form {
                        gap: 16px !important;
                    }
                    .signup-accent {
                        display: none !important;
                    }
                }
            `}</style>

            {/* Background Accents */}
            <div className="signup-accent" style={{
                position: 'absolute',
                top: '-10%',
                left: '-5%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)',
                borderRadius: '50%',
                zIndex: 0
            }} />
            <div className="signup-accent" style={{
                position: 'absolute',
                bottom: '-10%',
                right: '-5%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)',
                borderRadius: '50%',
                zIndex: 0
            }} />

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="signup-container" style={{
                backgroundColor: 'white',
                padding: '48px',
                borderRadius: '32px',
                width: '100%',
                maxWidth: '460px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.02)',
                position: 'relative',
                zIndex: 10
            }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 className="signup-title" style={{
                        fontSize: '32px',
                        fontWeight: '800',
                        color: '#111827',
                        margin: '0 0 12px 0',
                        letterSpacing: '-1px'
                    }}>Create Account</h2>
                    <p className="signup-subtitle" style={{ color: '#6b7280', fontSize: '15px', margin: 0 }}>
                        Join thousands of creators using Crossposting.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="signup-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                            style={{
                                padding: '14px 16px',
                                borderRadius: '12px',
                                background: '#f9fafb',
                                border: `2px solid ${focusedField === 'name' ? '#111827' : '#e5e7eb'}`,
                                outline: 'none',
                                fontSize: '15px',
                                color: '#111827',
                                transition: 'all 0.2s ease'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            style={{
                                padding: '14px 16px',
                                borderRadius: '12px',
                                background: '#f9fafb',
                                border: `2px solid ${focusedField === 'email' ? '#111827' : '#e5e7eb'}`,
                                outline: 'none',
                                fontSize: '15px',
                                color: '#111827',
                                transition: 'all 0.2s ease'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            style={{
                                padding: '14px 16px',
                                borderRadius: '12px',
                                background: '#f9fafb',
                                border: `2px solid ${focusedField === 'password' ? '#111827' : '#e5e7eb'}`,
                                outline: 'none',
                                fontSize: '15px',
                                color: '#111827',
                                transition: 'all 0.2s ease'
                            }}
                        />
                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0 0' }}>Must be at least 6 characters with a number and special character.</p>
                    </div>

                    {error && (
                        <div style={{
                            padding: '12px 16px',
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#991b1b',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '16px',
                            backgroundColor: '#111827',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            marginTop: '8px',
                            opacity: loading ? 0.7 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.currentTarget.style.background = '#1f2937';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(0, 0, 0, 0.15)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#111827';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        {loading ? 'Creating Account...' : 'Get Started for Free'}
                    </button>
                </form>

                <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '15px', color: '#6b7280' }}>
                    Already have an account?{' '}
                    <button
                        onClick={onLoginClick}
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            color: '#111827',
                            fontWeight: '700',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            fontSize: 'inherit'
                        }}>
                        Sign in here
                    </button>
                </div>
            </div>
        </div>
    );
}
