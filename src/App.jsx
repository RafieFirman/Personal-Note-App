import React from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { NotesProvider, useNotes } from './context/NotesContext.jsx';
import { isSupabaseConfigured } from './lib/supabaseApi.js';
import AuthPage from './pages/AuthPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ArchivePage from './pages/ArchivePage.jsx';
import NoteDetailPage from './pages/NoteDetailPage.jsx';
import NewNotePage from './pages/NewNotePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function NoteURShell({ user }) {
  const { signOut } = useAuth();
  const { isLoading, error, reloadNotes } = useNotes();

  async function handleSignOut() {
    try {
      await signOut();
    } catch (signOutError) {
      // The session is cleared locally even if the remote request fails.
      console.error('Gagal mengakhiri sesi Supabase:', signOutError);
    }
  }

  return (
    <div className="app-container">
      <header>
        <h1>NoteUR</h1>
        <nav className="navigation" aria-label="Navigasi utama">
          <ul>
            <li>
              <NavLink to="/" end>Beranda</NavLink>
            </li>
            <li>
              <NavLink to="/archive">Arsip</NavLink>
            </li>
            <li>
              <NavLink to="/notes/new">Tambah catatan</NavLink>
            </li>
          </ul>
        </nav>
        <div className="header-account">
          {isSupabaseConfigured ? (
            <>
              <span className="header-account__email" title={user?.email ?? ''}>
                {user?.email}
              </span>
              <button className="header-account__logout" type="button" onClick={handleSignOut}>
                Keluar
              </button>
            </>
          ) : (
            <span className="demo-mode-label">Mode demo</span>
          )}
        </div>
      </header>

      {!isSupabaseConfigured && (
        <div className="storage-notice" role="status">
          <strong>Mode demo:</strong> catatan hanya tersimpan selama aplikasi berjalan.
          Konfigurasikan Supabase untuk mengaktifkan login dan penyimpanan permanen.
        </div>
      )}

      <main>
        {error ? (
          <section className="app-state app-state--error" role="alert">
            <h2>Catatan gagal dimuat</h2>
            <p>{error}</p>
            <button
              className="add-note-form__button add-note-form__button--primary"
              type="button"
              onClick={reloadNotes}
            >
              Coba lagi
            </button>
          </section>
        ) : isLoading ? (
          <div className="app-state" role="status">Memuat catatan...</div>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/notes/new" element={<NewNotePage />} />
            <Route path="/notes/:id" element={<NoteDetailPage />} />
            <Route path="/auth" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

function App() {
  const { user, isLoading: isAuthLoading } = useAuth();

  if (isSupabaseConfigured && isAuthLoading) {
    return (
      <div className="app-container">
        <div className="app-state" role="status">Memeriksa sesi NoteUR...</div>
      </div>
    );
  }

  if (isSupabaseConfigured && !user) {
    return (
      <div className="app-container">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <NotesProvider user={user}>
      <NoteURShell user={user} />
    </NotesProvider>
  );
}

function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWithAuth;
