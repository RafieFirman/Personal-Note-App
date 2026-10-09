import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useNotes } from '../context/NotesContext.jsx';
import { showFormattedDate } from '../utils/index.js';

function NoteDetailPage() {
  const { id } = useParams();
  const { notes, deleteNote, archiveNote, unarchiveNote } = useNotes();
  const navigate = useNavigate();
  const note = notes.find((item) => item.id === id);

  function handleDelete() {
    if (!note) return;

    deleteNote(note.id);
    navigate('/', { replace: true });
  }

  function handleArchiveToggle() {
    if (!note) return;

    if (note.archived === true) {
      unarchiveNote(note.id);
      navigate('/', { replace: true });
      return;
    }

    archiveNote(note.id);
    navigate('/archive', { replace: true });
  }

  if (!note) {
    return (
      <section className="detail-page" aria-labelledby="note-not-found-heading">
        <h2 id="note-not-found-heading">Catatan tidak ditemukan</h2>
        <p>Catatan yang kamu cari tidak tersedia atau mungkin sudah dihapus.</p>
        <p>
          <Link to="/">Kembali ke halaman utama</Link>
        </p>
      </section>
    );
  }

  return (
    <article className="detail-page" aria-labelledby="note-detail-title">
      <h2 className="detail-page__title" id="note-detail-title">
        {note.title}
      </h2>
      <p className="detail-page__createdAt">
        Dibuat pada {showFormattedDate(note.createdAt)}
      </p>
      <p className="detail-page__body">{note.body}</p>
      <div className="detail-page__actions">
        <button
          className="add-note-form__button add-note-form__button--primary"
          type="button"
          onClick={handleArchiveToggle}
        >
          {note.archived === true ? 'Batal arsip' : 'Arsipkan catatan'}
        </button>
        <button
          className="add-note-form__button add-note-form__button--danger"
          type="button"
          onClick={handleDelete}
        >
          Hapus catatan
        </button>
        <Link className="add-note-form__button add-note-form__button--secondary" to="/">
          Kembali ke halaman utama
        </Link>
      </div>
    </article>
  );
}

export default NoteDetailPage;
