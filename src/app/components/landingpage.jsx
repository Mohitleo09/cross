import React, { useState } from 'react';
import Navbar from './navbar';

export default function LandingPage({ onLogin, onLoginClick, onSignupClick, onAboutClick, onContactClick, scrollToSection, onScrollComplete, onPrivacyClick, onTermsClick, onCookieClick }) {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    React.useEffect(() => {
        if (scrollToSection) {
            // Give a tiny delay for full mount and images
            const timer = setTimeout(() => {
                const element = document.getElementById(scrollToSection);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    if (onScrollComplete) onScrollComplete();
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [scrollToSection]);

    const handleGetStarted = () => {
        if (!email) {
            setEmailError('Please enter your email address.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Please enter a valid email address.');
            return;
        }

        // Send welcome email
        fetch('/api/welcome', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
            keepalive: true
        }).catch(err => console.error('Welcome email failed', err));

        // Proceed with login/signup flow
        if (onLogin) {
            onLogin(email);
        }
    };

    const scrollLocal = (e, id) => {
        if (e) e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div style={{
            fontFamily: "'Inter', sans-serif",
            minHeight: '100vh',
            width: '100%',
            position: 'relative',
            overflowX: 'hidden',
            backgroundColor: '#ffffff',
            color: '#111827',
            margin: 0,
            padding: 0
        }}>
            <style>{`
                /* Hide scrollbar for Chrome, Safari and Opera */
                ::-webkit-scrollbar {
                    display: none;
                }
                
                /* Hide scrollbar for IE, Edge and Firefox */
                * {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
                
                @keyframes float {
                    0%, 100% { 
                        transform: translateY(0px) rotate(0deg);
                    }
                    25% { 
                        transform: translateY(-20px) rotate(2deg);
                    }
                    50% { 
                        transform: translateY(-25px) rotate(0deg);
                    }
                    75% { 
                        transform: translateY(-20px) rotate(-2deg);
                    }
                }
                
                @keyframes pulse {
                    0%, 100% { 
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% { 
                        opacity: 0.85;
                        transform: scale(0.98);
                    }
                }
                
                .floating-icon {
                    position: absolute;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border-radius: 24px;
                    padding: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 
                        0 10px 30px -5px rgba(0, 0, 0, 0.08),
                        0 0 0 1px rgba(255, 255, 255, 0.5),
                        inset 0 1px 0 0 rgba(255, 255, 255, 0.9);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                    will-change: transform;
                }
                
                .floating-icon:hover {
                    transform: translateY(-12px) scale(1.15) !important;
                    box-shadow: 
                        0 25px 50px -12px rgba(0, 0, 0, 0.15),
                        0 0 0 1px rgba(255, 255, 255, 0.6),
                        inset 0 1px 0 0 rgba(255, 255, 255, 1);
                    animation-play-state: paused;
                }
                
                .floating-icon::before {
                    content: '';
                    position: absolute;
                    inset: -2px;
                    border-radius: 24px;
                    padding: 2px;
                    background: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.2));
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    opacity: 0;
                    transition: opacity 0.4s;
                }
                
                .floating-icon:hover::before {
                    opacity: 1;
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (max-width: 768px) {
                    .hero-title { font-size: 36px !important; letter-spacing: -1px !important; }
                    .hero-subtitle { font-size: 16px !important; margin-bottom: 32px !important; }
                    .hero-container { padding-top: 40px !important; padding-bottom: 80px !important; }
                    .section-padding { padding: 60px 20px !important; }
                    .responsive-flex { flex-direction: column !important; gap: 40px !important; }
                    .responsive-width { width: 100% !important; flex: none !important; }
                    .sticky-mobile { position: static !important; }
                    .floating-icon { transform: scale(0.5) !important; opacity: 0.3 !important; }
                    
                    .hero-input-container {
                        flex-direction: column !important;
                        padding: 12px !important;
                        border-radius: 24px !important;
                        gap: 16px !important;
                        width: 90% !important;
                        max-width: 100% !important;
                    }
                    .hero-input {
                        width: 100% !important;
                        padding: 12px 0 !important;
                        text-align: center;
                        font-size: 16px !important;
                    }
                    .hero-btn {
                        width: 100% !important;
                        padding: 16px 20px !important;
                        font-size: 16px !important;
                    }

                    .footer-padding { padding: 40px 24px !important; }
                    .footer-main-flex { flex-direction: column !important; gap: 48px !important; }
                    .footer-links-flex { gap: 40px !important; width: 100% !important; justify-content: flex-start !important; }
                    .footer-bottom-flex { flex-direction: column-reverse !important; gap: 24px !important; }

                    /* Benefits Section Tweaks */
                    .benefits-grid { gap: 32px !important; }
                    .benefits-image { height: 250px !important; }

                    /* How It Works Section Tweaks */
                    .step-card { flex-direction: column !important; gap: 16px !important; }
                    .step-number { font-size: 64px !important; width: auto !important; margin-bottom: 0 !important; line-height: 1 !important; }
                    .step-content { padding-top: 0 !important; }
                    .steps-container { gap: 40px !important; }
                }
            `}</style>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
            </style>

            {/* Navigation */}
            <Navbar
                onLoginClick={onLoginClick}
                onSignupClick={onSignupClick}
                onHomeClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                onAboutClick={onAboutClick}
                onContactClick={onContactClick}
                onBenefitsClick={(e) => scrollLocal(e, 'benefits')}
            />

            {/* Hero Section Container with Pattern Background */}
            <div style={{
                position: 'relative',
                backgroundColor: '#ffffff',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd' stroke-width='1.5'%3E%3C!-- Cyan Diamond --%3E%3Crect x='20' y='20' width='12' height='12' rx='3' stroke='%2322d3ee' transform='rotate(45 26 26)'/%3E%3C!-- Magenta Small --%3E%3Crect x='60' y='10' width='8' height='8' rx='2' stroke='%23e879f9' transform='rotate(15 64 14)'/%3E%3C!-- Yellow Diamond --%3E%3Crect x='100' y='30' width='14' height='14' rx='4' stroke='%23facc15' transform='rotate(45 107 37)'/%3E%3C!-- Green Tilt --%3E%3Crect x='150' y='15' width='10' height='10' rx='3' stroke='%234ade80' transform='rotate(-20 155 20)'/%3E%3C!-- Purple Diamond --%3E%3Crect x='40' y='60' width='10' height='10' rx='2.5' stroke='%23a78bfa' transform='rotate(45 45 65)'/%3E%3C!-- Orange Small --%3E%3Crect x='80' y='80' width='6' height='6' rx='1.5' stroke='%23fb923c' transform='rotate(30 83 83)'/%3E%3C!-- Slate Big --%3E%3Crect x='130' y='60' width='16' height='16' rx='4' stroke='%2394a3b8' transform='rotate(45 138 68)'/%3E%3C!-- Red Tilt --%3E%3Crect x='10' y='100' width='9' height='9' rx='2' stroke='%23f87171' transform='rotate(-10 14.5 104.5)'/%3E%3C!-- Blue Diamond --%3E%3Crect x='160' y='120' width='11' height='11' rx='3' stroke='%2360a5fa' transform='rotate(45 165.5 125.5)'/%3E%3C!-- Teal Small --%3E%3Crect x='50' y='140' width='7' height='7' rx='2' stroke='%232dd4bf' transform='rotate(60 53.5 143.5)'/%3E%3C!-- Pink Large --%3E%3Crect x='100' y='150' width='13' height='13' rx='3.5' stroke='%23f472b6' transform='rotate(45 106.5 156.5)'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '180px 180px',
                overflow: 'hidden',
                paddingTop: '72px'
            }}>
                {/* Hero Section */}
                <div className="hero-container" style={{
                    textAlign: 'center',
                    paddingTop: '100px',
                    paddingBottom: '200px',
                    position: 'relative',
                    zIndex: 10,
                    maxWidth: '900px',
                    margin: '0 auto'
                }}>
                    <h1 className="hero-title" style={{
                        fontSize: '72px',
                        fontWeight: '800',
                        lineHeight: '1.05',
                        marginBottom: '32px',
                        letterSpacing: '-2px',
                        color: '#111827'
                    }}>
                        One Post.<br />All Platforms.
                    </h1>
                    <p className="hero-subtitle" style={{
                        fontSize: '22px',
                        color: '#4b5563',
                        marginBottom: '48px',
                        fontWeight: '400'
                    }}>
                        Connect once, upload everywhere.
                    </p>

                    <div className="hero-input-container" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        maxWidth: '520px',
                        margin: '0 auto',
                        background: 'white',
                        padding: '6px',
                        borderRadius: '100px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)'
                    }}>
                        <input
                            className="hero-input"
                            type="text"
                            placeholder="Enter your email..."
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailError('');
                            }}
                            style={{
                                flex: 1,
                                border: 'none',
                                padding: '16px 24px',
                                fontSize: '16px',
                                outline: 'none',
                                borderRadius: '100px',
                                color: '#374151',
                                background: 'transparent'
                            }}
                        />
                        <button
                            className="hero-btn"
                            onClick={handleGetStarted}
                            style={{
                                background: '#ffedd5',
                                color: '#9a3412',
                                border: 'none',
                                padding: '16px 32px',
                                borderRadius: '100px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'transform 0.1s',
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                            }}>
                            Get started for free &rarr;
                        </button>
                    </div>
                    {emailError && (
                        <p style={{
                            color: '#ef4444',
                            fontSize: '14px',
                            marginTop: '12px',
                            fontWeight: '500'
                        }}>
                            {emailError}
                        </p>
                    )}
                    <p style={{
                        marginTop: '16px',
                        fontSize: '13px',
                        color: '#000000',
                        fontWeight: '400'
                    }}>
                        By entering your email, you agree to receive emails from Crossposting.
                    </p>
                </div>

                {/* Center Blur/Fade Overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at center, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.0) 50%, rgba(255,255,255,0) 100%)',
                    backdropFilter: 'blur(1.5px)',
                    WebkitBackdropFilter: 'blur(1.5px)',
                    maskImage: 'radial-gradient(circle at center, black 0%, black 30%, transparent 80%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 0%, black 30%, transparent 80%)',
                    zIndex: 0,
                    pointerEvents: 'none'
                }} />

                {/* Floating Icons - Elegantly distributed */}

                {/* Middle Accents */}
                <FloatingIcon
                    icon={<TwitterIcon size={24} />}
                    bgColor="rgba(239, 246, 255, 1)"
                    top="45%"
                    left="8%"
                    delay="3s"
                    duration="9s"
                    opacity={0.9}
                    zIndex={3}
                />
                <FloatingIcon
                    icon={<InstagramIcon size={28} />}
                    bgColor="rgba(255, 241, 242, 1)"
                    top="40%"
                    left="92%"
                    delay="2.5s"
                    duration="8.5s"
                    opacity={0.9}
                    zIndex={3}
                />

                {/* Bottom Left Cluster */}
                <FloatingIcon
                    icon={<FacebookIcon size={34} />}
                    bgColor="rgba(239, 246, 255, 1)"
                    top="70%"
                    left="15%"
                    delay="1s"
                    duration="7s"
                    zIndex={5}
                />
                <FloatingIcon
                    icon={<YoutubeIcon size={30} />}
                    bgColor="rgba(254, 242, 242, 1)"
                    top="78%"
                    left="25%"
                    delay="3.5s"
                    duration="6s"
                    zIndex={4}
                />

                {/* Bottom Right Cluster */}
                <FloatingIcon
                    icon={<InstagramIcon size={32} />}
                    bgColor="rgba(255, 241, 242, 1)"
                    top="68%"
                    left="75%"
                    delay="1.8s"
                    duration="8s"
                    zIndex={5}
                />
                <FloatingIcon
                    icon={<TwitterIcon size={26} />}
                    bgColor="rgba(239, 246, 255, 1)"
                    top="76%"
                    left="85%"
                    delay="2.2s"
                    duration="7.2s"
                    zIndex={4}
                />
            </div>

            {/* Benefits Section */}
            {/* Benefits Section - "OUR EXPERTISE" Clean Minimalist Style */}
            <section id="benefits" className="section-padding" style={{
                backgroundColor: '#F5F5F5', // Light gray background like image
                padding: '80px 48px', // Reduced padding for shorter section
                position: 'relative',
                zIndex: 10
            }}>
                <div className="responsive-flex" style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    gap: '100px', // Slightly reduced gap
                    flexWrap: 'wrap'
                }}>
                    {/* Left Column - Large Title & Image */}
                    <div className="responsive-width" style={{ flex: '0 0 400px', display: 'flex', flexDirection: 'column' }}>
                        <div className="sticky-mobile" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h2 className="hero-title" style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: '48px',
                                fontWeight: '800',
                                lineHeight: '1.1',
                                margin: '0 0 32px 0',
                                letterSpacing: '-1px',
                                color: '#111827',
                                textTransform: 'uppercase'
                            }}>
                                Why Choose<br />Crossposting
                            </h2>
                            <div className="benefits-image" style={{
                                width: '100%',
                                flex: 1,
                                minHeight: '400px',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                // Softer shadow for cleaner look
                                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)'
                            }}>
                                <img
                                    src="/benefits-social.png" // Social Media style image
                                    alt="Social Media Growth"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Grid of Items */}
                    <div className="benefits-grid" style={{
                        flex: 1,
                        paddingTop: '48px', // Added significant top gap
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '50px 40px'
                    }}>
                        <BenefitCard
                            icon={<IconTime />}
                            title="Save Time"
                            description="Post once and automatically share to all your connected platforms. No more manual copying."
                        />
                        <BenefitCard
                            icon={<IconGrow />}
                            title="Grow Faster"
                            description="Reach audiences across multiple platforms simultaneously. Maximize your visibility."
                        />
                        <BenefitCard
                            icon={<IconTarget />}
                            title="Stay Consistent"
                            description="Never miss posting on any platform. Maintain an active presence everywhere."
                        />
                        <BenefitCard
                            icon={<IconSecure />}
                            title="Secure & Private"
                            description="Your content and credentials are encrypted. We never store your passwords."
                        />
                        <BenefitCard
                            icon={<IconControl />}
                            title="Full Control"
                            description="Enable or disable auto-posting for each platform anytime. You're in control."
                        />
                        <BenefitCard
                            icon={<IconFree />}
                            title="Free to Start"
                            description="Get started with our free plan. No credit card required. Upgrade when ready."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="section-padding" style={{
                padding: '120px 48px',
                maxWidth: '1200px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 10
            }}>
                <div className="responsive-flex" style={{
                    display: 'flex',
                    gap: '50px',
                    alignItems: 'flex-start'
                }}>
                    {/* Left Side - Title */}
                    <div className="responsive-width sticky-mobile" style={{
                        flex: '0 0 400px',
                        position: 'sticky',
                        top: '150px'
                    }}>
                        <h2 className="hero-title" style={{
                            fontSize: '64px',
                            fontWeight: '800',
                            lineHeight: '1.1',
                            letterSpacing: '-2px',
                            color: '#111827',
                            textTransform: 'uppercase'
                        }}>
                            HOW IT<br />WORKS
                        </h2>
                        <div style={{
                            width: '80px',
                            height: '6px',
                            background: '#111827',
                            marginTop: '40px'
                        }}></div>
                    </div>

                    {/* Right Side - Steps */}
                    <div className="steps-container" style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '60px'
                    }}>
                        <StepCardNew
                            number="1"
                            title="Connect Your Accounts"
                            description="Link your Instagram, YouTube, and Twitter accounts securely using official OAuth authentication. We ensure your data is protected."
                        />
                        <StepCardNew
                            number="2"
                            title="Enable Auto-Posting"
                            description="Choose which platforms you want to automatically post to. Toggle on/off anytime from your dashboard with full control."
                        />
                        <StepCardNew
                            number="3"
                            title="Post & Relax"
                            description="Upload your content to Instagram as usual. We'll automatically share it to your connected platforms within minutes."
                        />
                    </div>
                </div>
            </section>



            {/* FAQs Section */}
            <section className="section-padding" style={{
                background: '#0f0f0f',
                padding: '120px 48px',
                position: 'relative',
                zIndex: 0,
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {/* Title */}
                    <h2 className="hero-title" style={{
                        fontSize: '48px',
                        fontWeight: '600',
                        lineHeight: '1',
                        marginBottom: '80px',
                        letterSpacing: '-1px',
                        color: '#ffffff',
                        textAlign: 'center'
                    }}>
                        Common questions, clear answers
                    </h2>

                    {/* Two Column Layout */}
                    <div className="responsive-flex" style={{
                        display: 'flex',
                        gap: '80px',
                        alignItems: 'stretch'
                    }}>
                        {/* Left Side - Image */}
                        <div className="responsive-width" style={{
                            flex: '0 0 450px',
                            borderRadius: '16px',
                            overflow: 'hidden'
                        }}>
                            <img
                                src="/faq-planning.png"
                                alt="Social media planning"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                    filter: 'grayscale(100%)'
                                }}
                            />
                        </div>

                        {/* Right Side - FAQs */}
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '40px'
                        }}>
                            <FAQItemNew
                                question="Is my data secure?"
                                answer="Yes! We use industry-standard encryption and OAuth authentication. We never store your passwords."
                            />
                            <FAQItemNew
                                question="Which platforms do you support?"
                                answer="Currently, we support Instagram (source), YouTube, and Twitter (destinations). More platforms coming soon!"
                            />
                            <FAQItemNew
                                question="Can I disable auto-posting?"
                                answer="Absolutely! You can enable or disable auto-posting for each platform individually at any time from your dashboard."
                            />
                            <FAQItemNew
                                question="How long does it take to post?"
                                answer="Your content is typically shared to connected platforms within 2-5 minutes of posting to Instagram."
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer-padding" style={{
                background: '#ffffff',
                color: '#111827',
                padding: '80px 48px 40px',
                position: 'relative',
                zIndex: 10,
                borderTop: '1px solid #f3f4f6'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="footer-main-flex" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '80px',
                        marginBottom: '80px'
                    }}>
                        {/* Brand Column - Left */}
                        <div style={{ maxWidth: '320px' }}>
                            <h3 style={{
                                fontSize: '24px',
                                fontWeight: '800',
                                marginBottom: '24px',
                                letterSpacing: '-0.5px',
                                color: '#111827'
                            }}>
                                CROSSPOSTING
                            </h3>
                            <p style={{
                                color: '#4b5563',
                                fontSize: '15px',
                                lineHeight: '1.8',
                                marginTop: '0'
                            }}>
                                Automate your social media presence across multiple platforms effortlessly. Connect once, grow everywhere.
                            </p>
                        </div>

                        {/* Links Columns - Right */}
                        <div className="footer-links-flex" style={{
                            display: 'flex',
                            gap: '80px'
                        }}>
                            <div>
                                <h4 style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    marginBottom: '24px',
                                    color: '#111827' // Darker header for elegance
                                }}>
                                    Company
                                </h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    <FooterLink text="About" onClick={onAboutClick} />
                                    <FooterLink text="Contact" onClick={onContactClick} />
                                </ul>
                            </div>
                            <div>
                                <h4 style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    marginBottom: '24px',
                                    color: '#111827'
                                }}>
                                    Legal
                                </h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    <FooterLink text="Privacy Policy" onClick={onPrivacyClick} />
                                    <FooterLink text="Terms of Service" onClick={onTermsClick} />
                                    <FooterLink text="Cookie Policy" onClick={onCookieClick} />
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom-flex" style={{
                        borderTop: '1px solid #e5e7eb',
                        paddingTop: '32px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '20px'
                    }}>
                        <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                            © {new Date().getFullYear()} Crossposting. All rights reserved.
                        </p>
                        <div style={{ display: 'flex', gap: '24px' }}>
                            <SocialIcon icon={<TwitterIconFooter />} hoverColor="#1DA1F2" />
                            <SocialIcon icon={<InstagramIconFooter />} hoverColor="#E1306C" />
                            <SocialIcon icon={<YouTubeIconFooter />} hoverColor="#FF0000" />
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
}

// Component: Benefit Card
// Component: Benefit Card (Minimal Style)
function BenefitCard({ icon, title, description }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            textAlign: 'left'
        }}>
            {/* Small Minimal Icon */}
            <div style={{
                flexShrink: 0,
                color: '#111827', // Dark, distinct
                marginTop: '2px' // Optical alignment with title cap height
            }}>
                {icon}
            </div>

            <div>
                <h3 style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '16px',
                    fontWeight: '700', // Bold
                    textTransform: 'uppercase', // Uppercase like "RESIDENTIAL"
                    marginBottom: '6px',
                    color: '#111827',
                    letterSpacing: '0.5px',
                    lineHeight: '1.3'
                }}>
                    {title}
                </h3>

                <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '15px',
                    fontWeight: '400',
                    lineHeight: '1.6',
                    color: '#4b5563', // Dark gray
                    margin: 0
                }}>
                    {description}
                </p>
            </div>
        </div>
    );
}

// Component: Step Card
function StepCard({ number, title, description }) {
    return (
        <div style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'flex-start',
            background: 'white',
            padding: '40px',
            borderRadius: '24px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: '#111827',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: '800',
                flexShrink: 0
            }}>
                {number}
            </div>
            <div>
                <h3 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    marginBottom: '12px',
                    color: '#111827',
                    letterSpacing: '-0.5px'
                }}>
                    {title}
                </h3>
                <p style={{
                    color: '#6b7280',
                    fontSize: '16px',
                    lineHeight: '1.7',
                    margin: 0
                }}>
                    {description}
                </p>
            </div>
        </div>
    );
}

// Component: Step Card New (for How It Works section)
function StepCardNew({ number, title, description }) {
    return (
        <div className="step-card" style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'flex-start'
        }}>
            {/* Large Number */}
            <div className="step-number" style={{
                fontSize: '96px',
                fontWeight: '800',
                color: '#111827',
                lineHeight: '1',
                flexShrink: 0,
                width: '120px'
            }}>
                {number}
            </div>

            {/* Content */}
            <div className="step-content" style={{ flex: 1, paddingTop: '8px' }}>
                <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    marginBottom: '12px',
                    color: '#111827',
                    letterSpacing: '-0.3px',
                    textTransform: 'uppercase'
                }}>
                    {title}
                </h3>
                <p style={{
                    color: '#6b7280',
                    fontSize: '15px',
                    lineHeight: '1.8',
                    margin: 0
                }}>
                    {description}
                </p>
            </div>
        </div>
    );
}

// Component: FAQ Item
function FAQItem({ question, answer }) {
    return (
        <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '16px',
            border: '1px solid #e5e7eb'
        }}>
            <h4 style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '12px',
                color: '#111827',
                letterSpacing: '-0.3px'
            }}>
                {question}
            </h4>
            <p style={{
                color: '#6b7280',
                fontSize: '15px',
                lineHeight: '1.7',
                margin: 0
            }}>
                {answer}
            </p>
        </div>
    );
}

// Component: FAQ Item New (for dark theme)
function FAQItemNew({ question, answer }) {
    return (
        <div style={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '32px'
        }}>
            <h4 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#ffffff',
                letterSpacing: '-0.3px'
            }}>
                {question}
            </h4>
            <p style={{
                color: '#a0a0a0',
                fontSize: '15px',
                lineHeight: '1.8',
                margin: 0
            }}>
                {answer}
            </p>
        </div>
    );
}

// Component: Footer Link
function FooterLink({ text, onClick }) {
    return (
        <li style={{ marginBottom: '12px' }}>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    if (onClick) onClick();
                }}
                style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: '#4b5563', // Dark gray
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.2s',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => e.target.style.color = '#111827'} // Black on hover
                onMouseLeave={(e) => e.target.style.color = '#4b5563'}
            >
                {text}
            </button>
        </li>
    );
}

// Component: Social Icon
function SocialIcon({ icon, hoverColor = '#111827' }) {
    return (
        <a href="#" style={{
            color: '#6b7280', // Gray
            transition: 'color 0.2s',
            display: 'flex'
        }}
            onMouseEnter={(e) => e.currentTarget.style.color = hoverColor}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
        >
            {icon}
        </a>
    );
}

// Footer Social Icons
function TwitterIconFooter() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function InstagramIconFooter() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
    );
}

function YouTubeIconFooter() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    );
}


function FloatingIcon({ icon, top, left, delay, duration = '6s', opacity = 1, bgColor = 'white', zIndex = 1 }) {
    return (
        <div
            className="floating-icon"
            style={{
                top,
                left,
                background: `linear-gradient(135deg, ${bgColor}, rgba(255, 255, 255, 0.9))`,
                animation: `float ${duration} ease-in-out infinite`,
                animationDelay: delay,
                opacity,
                zIndex
            }}
        >
            {icon}
        </div>
    );
}

function InstagramIcon({ size = 40 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="url(#insta-gradient)" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
            <defs>
                <linearGradient id="insta-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#f09433", stopOpacity: 1 }} />
                    <stop offset="25%" style={{ stopColor: "#e6683c", stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: "#dc2743", stopOpacity: 1 }} />
                    <stop offset="75%" style={{ stopColor: "#cc2366", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#bc1888", stopOpacity: 1 }} />
                </linearGradient>
            </defs>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#insta-gradient)" strokeWidth="2" fill="none"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="url(#insta-gradient)" strokeWidth="2"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="url(#insta-gradient)" strokeWidth="2"></line>
        </svg>
    );
}

function YoutubeIcon({ size = 40 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#ff0000">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    );
}

function TwitterIcon({ size = 32 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="black">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function FacebookIcon({ size = 40 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    );
}

// Custom Line Icons for Benefits
function IconTime() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}

function IconGrow() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 6L13.5 15.5L8.5 10.5L1 18" />
            <path d="M17 6H23V12" />
        </svg>
    );
}

function IconTarget() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    );
}

function IconSecure() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}

function IconControl() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
        </svg>
    );
}

function IconFree() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
    );
}
