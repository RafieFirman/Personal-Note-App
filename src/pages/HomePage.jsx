import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useNotes } from '../context/NotesContext.jsx';
import NoteSearch from '../components/NoteSearch.jsx';
import { showFormattedDate } from '../utils/index.js';
import { filterNotesByTitle } from '../utils/note-search.js';

function HomePage() {
  const { notes } = useNotes();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') ?? '';

  // Batasi kategori terlebih dahulu, baru terapkan pencarian judul.
  const activeNotes = notes.filter((note) => note.archived === false);
  const filteredActiveNotes = filterNotesByTitle(activeNotes, searchTerm);

  return (
    <section aria-labelledby="active-notes-heading">
      <h2 id="active-notes-heading">Catatan Aktif</h2>
      <NoteSearch label="Cari catatan aktif" inputId="active-note-search" />

      {activeNotes.length === 0 ? (
        <div className="notes-list-empty" role="status">
          <p>Tidak ada catatan.</p>
        </div>
      ) : filteredActiveNotes.length === 0 ? (
        <div className="notes-list-empty" role="status">
          <p>Tidak ada catatan yang cocok dengan pencarian.</p>
        </div>
      ) : (
        <div className="notes-list">
          {filteredActiveNotes.map((note) => (
            <Link
              className="note-item note-item__link"
              key={note.id}
              to={`/notes/${encodeURIComponent(note.id)}`}
              aria-label={`Buka detail catatan ${note.title}`}
            >
              <h3 className="note-item__title">{note.title}</h3>
              <p className="note-item__createdAt">
                {showFormattedDate(note.createdAt)}
              </p>
              <p className="note-item__body">{note.body}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default HomePage;
