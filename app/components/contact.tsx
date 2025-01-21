'use client';
import React, { useState, useEffect } from 'react';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

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

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log('Form Data Submitted:', formData);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div style={styles.container}>
            
            <main style={styles.main}>
                <h1 style={styles.title}>Contact Us</h1>
                <p style={styles.description}>
                    If you have any questions, feedback, or inquiries, please fill out the form below and we will get back to you as soon as possible.
                </p>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label htmlFor="name" style={styles.label}>Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder='exemple : med '
                            required
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="email" style={styles.label}>Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder='email@exemple.com'
                            required
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="message" style={styles.label}>Message:</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            style={styles.textarea}
                            placeholder='the best streaming platform in the world...'
                            required
                        />
                    </div>
                    <button type="submit" style={styles.button}>Submit</button>
                </form>
            </main>
            <footer style={styles.footer}>
                <p style={styles.footerText}>&copy; 2025 RM Stream. All rights reserved.</p>
                <div style={styles.footerLinks}>
                    <a href="/about" style={styles.footerLink}>About Us</a>
                    <a href="/privacy" style={styles.footerLink}>Privacy Policy</a>
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
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '600px',
    },
    formGroup: {
        width: '100%',
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        fontSize: '1rem',
        marginBottom: '5px',
        color: '#a9a9a9',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #3f3f3f',
        backgroundColor: '#292929',
        color: '#fff',
    },
    textarea: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #3f3f3f',
        backgroundColor: '#292929',
        color: '#fff',
        height: '100px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#61dafb',
        color: '#282c34',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
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
    // Dark mode styles
    darkMode: {
        backgroundColor: '#1c1c1c',
        color: '#fff',
    },
    lightMode: {
        backgroundColor: '#f8f8f8',
        color: '#333',
    },
};

export default ContactPage;
