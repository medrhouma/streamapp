'use client';
import React from 'react';
import { useRouter } from 'next/navigation'; // Utilisez next/navigation pour Next.js 13+

export default function Home() {
  const router = useRouter();

  // Fonction pour gérer la redirection vers /stream
  const handleStreamRedirect = () => {
    const token = localStorage.getItem('token'); // Vérifiez si l'utilisateur est connecté
    if (token) {
      router.push('/stream'); // Redirigez vers /stream si l'utilisateur est connecté
    } else {
      router.push('/login'); // Redirigez vers /login si l'utilisateur n'est pas connecté
    }
  };

  return (
    <>
      <main>
        <section className="hero">
          <div className="container">
            <h1 className="title">Welcome to Medical Frequency</h1>
            <p className="subtitle">
              The platform dedicated to healthcare professionals and medical enthusiasts
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <button onClick={handleStreamRedirect} className="streamLink">
              Access the Streaming Room
            </button>
          </div>
        </section>
      </main>

      <style jsx>{`
        :root {
          --background-color-dark: #333333;
          --background-color-light: #ecf0f1;
          --text-color-dark: rgb(23, 50, 230);
          --text-color-light: #2c3e50;
          --subtitle-color-dark: #bdc3c7;
          --subtitle-color-light: #7f8c8d;
          --link-background-color-dark: rgb(26, 75, 188);
          --link-background-color-light: #3498db;
          --link-text-color-dark: #ffffff;
          --link-text-color-light: #ffffff;
        }

        .hero {
          padding: 50px 0;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
          position: relative;
          overflow: hidden;
        }

        .title {
          font-size: 3.5rem;
          font-weight: bold;
          text-align: center;
          animation: fadeIn 2s ease-out;
          opacity: 0;
          animation-delay: 0.5s;
          animation-fill-mode: forwards;
        }

        .subtitle {
          font-size: 1.5rem;
          text-align: center;
          margin-top: 15px;
          animation: fadeIn 2.5s ease-out;
          opacity: 0;
          animation-delay: 1s;
          animation-fill-mode: forwards;
        }

        .container {
          text-align: center;
        }

        .streamLink {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 25px;
          border-radius: 5px;
          text-decoration: none;
          font-size: 1.2rem;
          transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          border: none;
        }

        .streamLink:hover {
          transform: scale(1.1);
          box-shadow: 0 0 20px rgba(19, 15, 212, 0.5);
        }

        /* Styles pour le mode sombre/clair */
        body.light .hero {
          background-color: var(--background-color-light);
          color: var(--text-color-light);
        }

        body.dark .hero {
          background-color: var(--background-color-dark);
          color: var(--text-color-dark);
        }

        body.light .title {
          color: var(--text-color-light);
        }

        body.dark .title {
          color: var(--text-color-dark);
        }

        body.light .subtitle {
          color: var(--subtitle-color-light);
        }

        body.dark .subtitle {
          color: var(--subtitle-color-dark);
        }

        body.light .streamLink {
          background-color: var(--link-background-color-light);
          color: var(--link-text-color-light);
        }

        body.dark .streamLink {
          background-color: var(--link-background-color-dark);
          color: var(--link-text-color-dark);
        }

        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLogo {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero {
            padding: 30px 0;
          }
          .title {
            font-size: 2.5rem;
          }
          .subtitle {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </>
  );
}