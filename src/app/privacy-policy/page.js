'use client';

import React from 'react';
import PrivacyPolicy from '../components/PrivacyPolicy';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicyPage() {
    const router = useRouter();

    const handleNavigation = (path) => {
        router.push(path || '/');
    };

    return (
        <PrivacyPolicy
            onHomeClick={() => handleNavigation('/')}
            onLoginClick={() => handleNavigation('/?page=login')}
            onSignupClick={() => handleNavigation('/?page=signup')}
            onAboutClick={() => handleNavigation('/?page=about')}
            onContactClick={() => handleNavigation('/?page=contact')}
            onBenefitsClick={() => handleNavigation('/?section=benefits')}
        />
    );
}
