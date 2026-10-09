import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { NotesProvider } from './context/NotesContext.jsx';
import HomePage from './pages/HomePage.jsx';
import ArchivePage from './pages/ArchivePage.jsx';
import NoteDetailPage from './pages/NoteDetailPage.jsx';
import NewNotePage from './pages/NewNotePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <NotesProvider>
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
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route
              path="/notes/new"
              element={<NewNotePage />}
            />
            <Route path="/notes/:id" element={<NoteDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </NotesProvider>
  );
}

export default App;
