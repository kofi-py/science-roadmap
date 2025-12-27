'use client';

import React, { useState, useEffect } from 'react';

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie_consent');
        if (consent === null) {
            setShowBanner(true);
        }
    }, []);

    const handleChoice = (choice: 'accepted' | 'declined') => {
        localStorage.setItem('cookie_consent', choice);
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50">
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-100 science-card animate-slide-up">
                <h3 className="text-lg font-bold text-space-blue-900 mb-2 lowercase">can we use cookies?</h3>
                <p className="text-sm text-gray-600 mb-6">
                    we use cookies to enhance your learning experience and save your progress.
                    do you accept our use of cookies?
                </p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={() => handleChoice('declined')}
                        className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium lowercase transition-colors"
                    >
                        no, thanks
                    </button>
                    <button
                        onClick={() => handleChoice('accepted')}
                        className="btn-primary px-6 py-2 text-sm lowercase shadow-lg shadow-electric-cyan-200"
                    >
                        yes, i accept
                    </button>
                </div>
            </div>
        </div>
    );
}
