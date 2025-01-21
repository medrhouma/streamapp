"use client";

import React, { useState, useEffect } from 'react';

export default function AboutPage() {
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
                <h1 style={{ ...styles.title, color: darkMode ? '#61dafb' : '#0070f3' }}>About Us</h1>
                <p style={{ ...styles.description, color: darkMode ? '#b0b0b0' : '#333' }}>
                    Welcome to RM Stream! We are passionate about bringing the best streaming experience to our users.
                    Our team is dedicated to providing high-quality content and innovative features to make your streaming
                    experience enjoyable and memorable.
                </p>
                <h2 style={{ ...styles.subtitle, color: darkMode ? '#a9a9a9' : '#333' }}>Our Founder</h2>
                <p style={{ ...styles.founderDescription, color: darkMode ? '#b0b0b0' : '#333' }}>
                    RM Stream was founded by Rhouma Mohamed, a young and talented Tunisian entrepreneur, at the age of 20. His vision
                    and dedication have driven RM Stream to become a leading platform in the streaming industry.
                </p>
                
            </main>
            <footer style={styles.footer}>
                <p style={styles.footerText}>&copy; 2025 RM Stream. All rights reserved.</p>
                <div style={styles.footerLinks}>
                    <a href="/contact" style={styles.footerLink}>Contact</a>
                    <a href="/privacy" style={styles.footerLink}>Privacy Policy</a>
                </div>
            </footer>
        </div>
    );
}

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
    logo: {
        width: '150px',
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
    },
    founderDescription: {
        fontSize: '1.2rem',
        lineHeight: '1.6',
        textAlign: 'center',
        maxWidth: '800px',
        marginBottom: '30px',
    },
    toggleButton: {
        padding: '10px 20px',
        backgroundColor: '#0070f3',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px',
    },
    footer: {
        padding: '30px 0',
        background: 'linear-gradient(180deg, #2c2c2c 0%, #1c1c1c 100%)',
        textAlign: 'center',
        borderTop: '2px solid #3f3f3f',
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
        fontWeight: '500',
    },
    footerLink: {
        textDecoration: 'none',
        color: '#a9a9a9',
        transition: 'color 0.3s ease',
    },
};
