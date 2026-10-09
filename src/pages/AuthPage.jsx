import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { isSupabaseConfigured } from '../lib/supabaseApi.js';

function AuthPage() {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isSupabaseConfigured || user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      if (isRegistering) {
        const result = await signUp(email.trim(), password);

        if (result.session) {
          navigate('/', { replace: true });
          return;
        }

        setSuccessMessage(
          'Pendaftaran berhasil. Buka email untuk konfirmasi akun, lalu masuk ke NoteUR.'
        );
        setIsRegistering(false);
        setPassword('');
        return;
      }

      await signIn(email.trim(), password);
      navigate('/', { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Autentikasi gagal. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-heading">
        <p className="auth-card__eyebrow">PERSONAL NOTE APP</p>
        <h1 id="auth-heading">NoteUR</h1>
        <p className="auth-card__description">
          {isRegistering
            ? 'Buat akun untuk mulai menyimpan catatan secara online.'
            : 'Masuk untuk mengakses catatan yang tersimpan di akunmu.'}
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nama@email.com"
            required
          />

          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            autoComplete={isRegistering ? 'new-password' : 'current-password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={isRegistering ? 'Minimal 8 karakter' : 'Masukkan password'}
            minLength={isRegistering ? 8 : undefined}
            required
          />

          {errorMessage && <p className="auth-message auth-message--error" role="alert">{errorMessage}</p>}
          {successMessage && <p className="auth-message auth-message--success" role="status">{successMessage}</p>}

          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Memproses...'
              : isRegistering ? 'Buat akun' : 'Masuk'}
          </button>
        </form>

        <p className="auth-switch">
          {isRegistering ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegistering((current) => !current);
              setErrorMessage('');
              setSuccessMessage('');
            }}
          >
            {isRegistering ? 'Masuk' : 'Daftar sekarang'}
          </button>
        </p>
      </section>
    </main>
  );
}

export default AuthPage;
