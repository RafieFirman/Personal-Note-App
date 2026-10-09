import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useNotes } from '../context/NotesContext.jsx';
import NoteSearch from '../components/NoteSearch.jsx';
import { showFormattedDate } from '../utils/index.js';
import { filterNotesByTitle } from '../utils/note-search.js';

function ArchivePage() {
  const { notes } = useNotes();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') ?? '';

  // Batasi kategori arsip terlebih dahulu agar pencarian tidak menyertakan catatan aktif.
  const archivedNotes = notes.filter((note) => note.archived === true);
  const filteredArchivedNotes = filterNotesByTitle(archivedNotes, searchTerm);

  return (
    <section aria-labelledby="archived-notes-heading">
      <h2 id="archived-notes-heading">Arsip Catatan</h2>
      <NoteSearch label="Cari catatan arsip" inputId="archived-note-search" />

      {archivedNotes.length === 0 ? (
        <div className="notes-list-empty" role="status">
          <p>Arsip kosong.</p>
        </div>
      ) : filteredArchivedNotes.length === 0 ? (
        <div className="notes-list-empty" role="status">
          <p>Tidak ada catatan arsip yang cocok dengan pencarian.</p>
        </div>
      ) : (
        <div className="notes-list">
          {filteredArchivedNotes.map((note) => (
            <Link
              className="note-item note-item__link"
              key={note.id}
              to={`/notes/${encodeURIComponent(note.id)}`}
              aria-label={`Buka detail catatan arsip ${note.title}`}
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

export default ArchivePage;
