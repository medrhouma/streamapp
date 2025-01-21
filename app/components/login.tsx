'use client';
import React, { useState } from 'react';

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation des champs
    if (!emailOrUsername || !password) {
      setError('All fields are required.');
      return;
    }

    // Envoyer les données à l'API
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrUsername,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to login.');
      }

      // Réinitialiser le formulaire et afficher un message de succès
      setEmailOrUsername('');
      setPassword('');
      setError(null);
      setSuccess(true);

      // Stocker le token JWT dans le localStorage ou les cookies
      localStorage.setItem('token', data.token);

      // Rediriger l'utilisateur vers la page d'accueil ou le tableau de bord
      window.location.href = '/stream';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
      setSuccess(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Login</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="formGroup">
          <label className="label">
            Email or Username:
            <input
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="Email or Username"
              className="input"
            />
          </label>
        </div>
        <div className="formGroup">
          <label className="label">
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="input"
            />
          </label>
        </div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">Login successful! Redirecting...</p>}
        <button type="submit" className="button">
          Login
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
          max-width: 450px;
          background-color: #2e2e2e;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
        }
        .formGroup {
          margin-bottom: 15px;
        }
        .label {
          display: block;
          margin-bottom: 6px;
          color: #b0b0b0;
          font-size: 1rem;
          font-weight: 500;
        }
        .input {
          width: 100%;
          padding: 10px 10px;
          margin: 4px 0;
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
        .button {
          width: 100%;
          padding: 12px 20px;
          background-color: var(--button-bg);
          color: var(--text-dark);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          transition: all 0.3s ease;
          margin-top: 15px;
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

export default Login;