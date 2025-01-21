'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Utilisez next/navigation pour Next.js 13+

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // État de connexion
  const router = useRouter(); // Pour la redirection

  // Vérifier l'état de connexion au montage du composant
  useEffect(() => {
    const token = localStorage.getItem('token'); // Vérifiez si un token existe
    setIsLoggedIn(!!token); // Mettez à jour l'état de connexion
  }, []);

  // Gérer le mode sombre/clair
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token'); // Supprimez le token
    setIsLoggedIn(false); // Mettez à jour l'état de connexion
    router.push('/login'); // Redirigez vers la page de connexion
  };

  return (
    <html lang="en">
      <head>
        <style>{`
          :root {
            --background-color-light: #ffffff;
            --text-color-light: #000000;
            --background-color-dark: #333333;
            --text-color-dark: #ffffff;
            --navbar-background-light: #f8f9fa;
            --navbar-background-dark: #444444;
            --navbar-item-hover-light: #e2e6ea;
            --navbar-item-hover-dark: #555555;
            --button-text-color-light: #000000;
            --button-text-color-dark: #ffffff;
          }

          body.light {
            background-color: var(--background-color-light);
            color: var(--text-color-light);
          }

          body.dark {
            background-color: var(--background-color-dark);
            color: var(--text-color-dark);
          }

          .navbar {
            padding: 1rem;
            background-color: var(--navbar-background-light);
            border-bottom: 2px solid var(--background-color-dark);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          body.dark .navbar {
            background-color: var(--navbar-background-dark);
            border-bottom: 2px solid var(--background-color-light);
          }

          .navbar-list {
            display: flex;
            list-style: none;
            margin: 0;
            padding: 0;
            align-items: center;
          }

          .navbar-item {
            margin-right: 1rem;
          }

          .navbar-item a,
          .navbar-item button {
            color: inherit;
            text-decoration: none;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            transition: background-color 0.3s;
          }

          .navbar-item a:hover,
          .navbar-item button:hover {
            background-color: var(--navbar-item-hover-light);
          }

          body.dark .navbar-item a:hover,
          body.dark .navbar-item button:hover {
            background-color: var(--navbar-item-hover-dark);
          }

          .navbar-item button {
            color: var(--button-text-color-light);
          }

          body.dark .navbar-item button {
            color: var(--button-text-color-dark);
          }

          .hidden {
            display: none;
          }

          .logo {
            height: 40px;
            margin-right: 1rem;
            cursor: pointer;
          }
        `}</style>
      </head>
      <body className="antialiased">
        <nav className="navbar">
          <ul className="navbar-list">
            {/* Logo avec un lien vers la page d'accueil */}
            <li className="navbar-item">
              <a href="/">
                <img src="/logo.png" alt="Logo" className="logo" />
              </a>
            </li>
            <li className="navbar-item"><a href="/">Home</a></li>
            {/* Afficher Streaming Room et News uniquement si l'utilisateur est connecté */}
            {isLoggedIn && (
              <>
                <li className="navbar-item"><a href="/stream">Streaming Room</a></li>
                <li className="navbar-item"><a href="/news">News</a></li>
              </>
            )}
          </ul>
          <div className="navbar-right">
            <ul className="navbar-list">
              <li className="navbar-item">
                <button onClick={toggleDarkMode}>
                  {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </button>
              </li>
              {/* Afficher Login/Signup ou Logout en fonction de l'état de connexion */}
              {isLoggedIn ? (
                <li className="navbar-item">
                  <button onClick={handleLogout}>Logout</button>
                </li>
              ) : (
                <>
                  <li className="navbar-item"><a href="/login">Login</a></li>
                  <li className="navbar-item"><a href="/signup">Sign Up</a></li>
                </>
              )}
            </ul>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}