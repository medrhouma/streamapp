'use client';
import React, { useState, useEffect } from 'react';

const PrivacyPolicyPage = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode === 'true') {
            setDarkMode(true);
        }
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark');
            document.body.classList.remove('light');
        } else {
            document.body.classList.add('light');
            document.body.classList.remove('dark');
        }
        localStorage.setItem('darkMode', darkMode.toString());
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div style={styles.container}>
            
            
            <main style={styles.main}>
                <h1 style={styles.title}>Privacy Policy</h1>
                <p style={styles.description}>
                    At RM Stream, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                </p>
                
                <h2 style={styles.subtitle}>Information We Collect</h2>
                <p style={styles.text}>
                    We may collect personal information that you provide to us directly, such as your name, email, address, phone number, gender, and preferred language. We may also collect information automatically, such as your IP address, browser type, and usage data.
                </p>
                
                <h2 style={styles.subtitle}>How We Use Your Information</h2>
                <p style={styles.text}>
                    We use your information to provide and improve our services, communicate with you, process transactions, and personalize your experience on our platform. We may also use your information for marketing and promotional purposes.
                </p>
                
                <h2 style={styles.subtitle}>Sharing Your Information</h2>
                <p style={styles.text}>
                    We do not sell, trade, or otherwise transfer your personal information to outside parties without your consent, except as described in this Privacy Policy. We may share your information with trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
                </p>
                
                <h2 style={styles.subtitle}>Your Rights and Choices</h2>
                <p style={styles.text}>
                    You have the right to access, update, and delete your personal information. You may also have the right to object to or restrict certain processing of your data. To exercise these rights, please contact us using the information provided below.
                </p>
                
                <h2 style={styles.subtitle}>Contact Us</h2>
                <p style={styles.text}>
                    If you have any questions or concerns about our Privacy Policy or our data practices, please contact us at:
                    <br />
                    Email: privacy@rmstream.com
                    <br />
                    Address: RM Stream, 123 Streaming Lane, Degache Tozeur, Tunisia
                </p>
                
                <p style={styles.text}>
                    This Privacy Policy was last updated on 09/01/2025. We may update this Privacy Policy from time to time, so please review it periodically.
                </p>
            </main>

            <footer style={styles.footer}>
                <p style={styles.footerText}>&copy; 2025 RM Stream. All rights reserved.</p>
                <div style={styles.footerLinks}>
                    <a href="/about" style={styles.footerLink}>About Us</a>
                    <a href="/contact" style={styles.footerLink}>Contact</a>
                </div>
            </footer>
        </div>
    );
};

import { CSSProperties } from 'react';

const styles: { [key: string]: CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px 0',
        backgroundColor: '#1c1c1c',
        borderBottom: '2px solid #3f3f3f',
    },
    modeToggleButton: {
        padding: '10px 20px',
        backgroundColor: '#61dafb',
        color: '#282c34',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    main: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
    },
    title: {
        fontSize: '3rem',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#61dafb',
    },
    description: {
        fontSize: '1.2rem',
        lineHeight: '1.6',
        textAlign: 'center',
        maxWidth: '800px',
        marginBottom: '30px',
    },
    subtitle: {
        fontSize: '2rem',
        marginBottom: '20px',
        color: '#a9a9a9',
    },
    text: {
        fontSize: '1rem',
        lineHeight: '1.6',
        textAlign: 'left',
        maxWidth: '800px',
        marginBottom: '20px',
        color: '#b0b0b0',
    },
    footer: {
        padding: '30px 0',
        textAlign: 'center',
        borderTop: '2px solid #3f3f3f',
        transition: 'background 0.3s ease, color 0.3s ease',
    },
    footerText: {
        fontSize: '1.2rem',
        color: '#b0b0b0',
        margin: '10px 0',
        letterSpacing: '0.5px',
    },
    footerLinks: {
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        marginTop: '15px',
        fontSize: '1rem',
        color: '#a9a9a9',
        fontWeight: '500',
    },
    footerLink: {
        textDecoration: 'none',
        color: '#a9a9a9',
        transition: 'color 0.3s ease',
    },
    darkMode: {
        backgroundColor: '#1c1c1c',
        color: '#fff',
    },
    lightMode: {
        backgroundColor: '#f8f8f8',
        color: '#333',
    },
};

export default PrivacyPolicyPage;
