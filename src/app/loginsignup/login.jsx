import React, { useState } from 'react';

export default function Login({ onLoginSuccess, onSignupClick, initialEmail }) {
    const [email, setEmail] = useState(initialEmail || '');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    // Forgot password states
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotStep, setForgotStep] = useState('email'); // 'email', 'otp', 'newPassword'
    const [forgotEmail, setForgotEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            if (data.token) {
                localStorage.setItem('crossposting_token', data.token);
            }

            console.log('Login successful:', data.user);
            if (onLoginSuccess) onLoginSuccess(data.user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPasswordClick = () => {
        setShowForgotPassword(true);
        setForgotStep('email');
        setError('');
        setSuccess('');
        setForgotEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!forgotEmail) {
            setError('Please enter your email');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send OTP');
            }

            setSuccess('OTP sent to your email!');
            setForgotStep('otp');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail, otp })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Invalid OTP');
            }

            setSuccess('OTP verified successfully!');
            setForgotStep('newPassword');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!newPassword || !confirmPassword) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail, newPassword })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to reset password');
            }

            setSuccess('Password reset successfully!');
            setTimeout(() => {
                setShowForgotPassword(false);
                setForgotStep('email');
                setError('');
                setSuccess('');
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderForgotPasswordForm = () => {
        if (forgotStep === 'email') {
            return (
                <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            onFocus={() => setFocusedField('forgotEmail')}
                            onBlur={() => setFocusedField(null)}
                            style={{
                                padding: '14px 16px',
                                borderRadius: '12px',
                                background: '#f9fafb',
                                border: `2px solid ${focusedField === 'forgotEmail' ? '#111827' : '#e5e7eb'}`,
                                outline: 'none',
                                fontSize: '15px',
                                color: '#111827',
                                transition: 'all 0.2s ease'
                            }}
                        />
                    </div>

                    {error && <div style={{ padding: '12px 16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: '12px', fontSize: '14px', fontWeight: '500' }}>{error}</div>}
                    {success && <div style={{ padding: '12px 16px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: '12px', fontSize: '14px', fontWeight: '500' }}>{success}</div>}

                    <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', backgroundColor: '#111827', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>

                    <button type="button" onClick={() => setShowForgotPassword(false)} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
                        ← Back to Login
                    </button>
                </form>
            );
        }

        if (forgotStep === 'otp') {
            return (
                <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Enter OTP</label>
                        <input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            onFocus={() => setFocusedField('otp')}
                            onBlur={() => setFocusedField(null)}
                            maxLength={6}
                            style={{
                                padding: '14px 16px',
                                borderRadius: '12px',
                                background: '#f9fafb',
                                border: `2px solid ${focusedField === 'otp' ? '#111827' : '#e5e7eb'}`,
                                outline: 'none',
                                fontSize: '24px',
                                color: '#111827',
                                textAlign: 'center',
                                letterSpacing: '8px',
                                fontWeight: '600',
                                transition: 'all 0.2s ease'
                            }}
                        />
                        <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, textAlign: 'center' }}>Check your email for the OTP</p>
                    </div>

                    {error && <div style={{ padding: '12px 16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: '12px', fontSize: '14px', fontWeight: '500' }}>{error}</div>}
                    {success && <div style={{ padding: '12px 16px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: '12px', fontSize: '14px', fontWeight: '500' }}>{success}</div>}

                    <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', backgroundColor: '#111827', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>

                    <button type="button" onClick={() => setForgotStep('email')} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}>
                        ← Resend OTP
                    </button>
                </form>
            );
        }

        if (forgotStep === 'newPassword') {
            return (
                <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>New Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            onFocus={() => setFocusedField('newPassword')}
                            onBlur={() => setFocusedField(null)}
                            style={{
                                padding: '14px 16px',
                                borderRadius: '12px',
                                background: '#f9fafb',
                                border: `2px solid ${focusedField === 'newPassword' ? '#111827' : '#e5e7eb'}`,
                                outline: 'none',
                                fontSize: '15px',
                                color: '#111827',
                                transition: 'all 0.2s ease'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Confirm Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onFocus={() => setFocusedField('confirmPassword')}
                            onBlur={() => setFocusedField(null)}
                            style={{
                                padding: '14px 16px',
                                borderRadius: '12px',
                                background: '#f9fafb',
                                border: `2px solid ${focusedField === 'confirmPassword' ? '#111827' : '#e5e7eb'}`,
                                outline: 'none',
                                fontSize: '15px',
                                color: '#111827',
                                transition: 'all 0.2s ease'
                            }}
                        />
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={(e) => setShowPassword(e.target.checked)}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        Show password
                    </label>

                    {error && <div style={{ padding: '12px 16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: '12px', fontSize: '14px', fontWeight: '500' }}>{error}</div>}
                    {success && <div style={{ padding: '12px 16px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: '12px', fontSize: '14px', fontWeight: '500' }}>{success}</div>}

                    <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', backgroundColor: '#111827', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Resetting...' : 'Confirm'}
                    </button>
                </form>
            );
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
                    .login-container {
                        padding: 32px 24px !important;
                        max-width: 100% !important;
                    }
                    .login-title {
                        font-size: 28px !important;
                        margin-bottom: 8px !important;
                    }
                    .login-subtitle {
                        font-size: 14px !important;
                    }
                    .login-form {
                        gap: 16px !important;
                    }
                    .login-accent {
                        display: none !important;
                    }
                }
            `}</style>

            {/* Background Accents */}
            <div className="login-accent" style={{
                position: 'absolute',
                top: '-10%',
                right: '-5%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)',
                borderRadius: '50%',
                zIndex: 0
            }} />
            <div className="login-accent" style={{
                position: 'absolute',
                bottom: '-10%',
                left: '-5%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.05) 0%, transparent 70%)',
                borderRadius: '50%',
                zIndex: 0
            }} />

            <div className="login-container" style={{
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
                    <h2 className="login-title" style={{
                        fontSize: '32px',
                        fontWeight: '800',
                        color: '#111827',
                        margin: '0 0 12px 0',
                        letterSpacing: '-1px'
                    }}>{showForgotPassword ? 'Reset Password' : 'Welcome Back'}</h2>
                    <p className="login-subtitle" style={{ color: '#6b7280', fontSize: '15px', margin: 0 }}>
                        {showForgotPassword ? 'Enter your details to reset your password' : 'Login to manage your crossposting platform.'}
                    </p>
                </div>

                {showForgotPassword ? renderForgotPasswordForm() : (
                    <form onSubmit={handleSubmit} className="login-form" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Password</label>
                            </div>
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
                            <button
                                type="button"
                                onClick={handleForgotPasswordClick}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    color: '#6b7280',
                                    fontSize: '13px',
                                    textAlign: 'right',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit'
                                }}
                            >
                                Forgot password?
                            </button>
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
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                )}

                {!showForgotPassword && (
                    <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '15px', color: '#6b7280' }}>
                        Don't have an account?{' '}
                        <button
                            onClick={onSignupClick}
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
                            Sign up
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
