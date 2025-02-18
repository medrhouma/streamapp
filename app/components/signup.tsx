'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Utilisez next/navigation pour Next.js 13+

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter(); // Initialisez useRouter

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Validation des champs
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Vérification des critères de sécurité du mot de passe
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
      setError('Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number.');
      return;
    }

    if (!acceptedTerms) {
      setError('You must accept the terms and conditions.');
      return;
    }

    // Envoyer les données à l'API
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up.');
      }

      // Réinitialiser le formulaire et afficher un message de succès
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setAcceptedTerms(false);
      setError(null);
      setSuccess(true);

      // Rediriger vers StreamPage après 2 secondes
      setTimeout(() => {
        router.push('/login'); // Redirection vers StreamPage
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
      setSuccess(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Signup</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="formRow">
          <label className="label">
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              className="input"
            />
          </label>
          <label className="label">
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aa@example.com"
              className="input"
            />
          </label>
          <label className="label">
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="input"
            />
          </label>
          <label className="label">
            Confirm Password:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="input"
            />
          </label>
        </div>
        <label className="checkboxLabel">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="checkbox"
          />
          I accept the <a href="/privacy">terms and conditions</a>
        </label>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">Signup successful! Redirecting to LoginPage...</p>}
        <button type="submit" className="button">
          Signup
        </button>
      </form>

      <style jsx>{`
        :root {
          --background-light: #f9f9f9;
          --background-dark: #1c1c1c;
          --text-light: #000;
          --text-dark: #fff;
          --button-bg: #0070f3;
        }
        .container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: var(--background-dark);
          color: var(--text-dark);
          padding: 30px;
          font-family: Arial, sans-serif;
        }
        .title {
          color: var(--button-bg);
          margin-bottom: 20px;
          font-size: 2.5rem;
          font-weight: bold;
          text-transform: uppercase;
        }
        .form {
          width: 100%;
          max-width: 950px;
          background-color: #2e2e2e;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
        }
        .formRow {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .label {
          flex-basis: 48%;
          margin-bottom: 10px;
          color: #b0b0b0;
          font-size: 0.95rem;
          font-weight: 500;
        }
        .input {
          width: 100%;
          padding: 10px 10px;
          margin-top: 6px;
          margin-bottom: 14px;
          border-radius: 8px;
          border: 1px solid #333;
          background-color: #1f1f1f;
          color: var(--text-dark);
          font-size: 0.95rem;
          outline: none;
          transition: all 0.3s ease-in-out;
        }
        .input:focus {
          border-color: var(--button-bg);
          box-shadow: 0 0 5px rgba(0, 112, 243, 0.5);
        }
        .checkboxLabel {
          display: flex;
          align-items: center;
          color: #b0b0b0;
          font-size: 0.95rem;
          margin-bottom: 20px;
        }
        .checkbox {
          margin-right: 8px;
        }
        .button {
          width: 100%;
          padding: 12px 18px;
          background-color: var(--button-bg);
          color: var(--text-dark);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .button:hover {
          background-color: #005bb5;
          transform: scale(1.05);
        }
        .button:active {
          transform: scale(1);
        }
        .error {
          color: #ff4d4d;
          margin-bottom: 10px;
          font-size: 0.9rem;
        }
        .success {
          color: #4dff4d;
          margin-bottom: 10px;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default Signup;
