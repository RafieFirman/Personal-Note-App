import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotes } from '../context/NotesContext.jsx';

function NewNotePage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNote } = useNotes();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (!trimmedTitle || !trimmedBody) {
      setErrorMessage('Judul dan isi catatan wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const createdNote = await addNote({
        title: trimmedTitle,
        body: trimmedBody,
      });

      if (!createdNote?.id) {
        setErrorMessage('Catatan belum berhasil disimpan. Silakan coba lagi.');
        return;
      }

      // Only return to the list after the database/local save has succeeded.
      navigate('/', { replace: true });
    } catch (saveError) {
      setErrorMessage(
        saveError instanceof Error
          ? `Catatan gagal disimpan: ${saveError.message}`
          : 'Catatan gagal disimpan. Periksa koneksi dan konfigurasi database.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="add-note-page" aria-labelledby="add-note-heading">
      <h2 id="add-note-heading">Tambah Catatan</h2>
      <p className="add-note-page__description">
        Tulis judul dan isi catatan yang ingin kamu simpan.
      </p>

      <form className="add-note-form" onSubmit={handleSubmit}>
        <div className="add-new-page__input">
          <label htmlFor="note-title">Judul catatan</label>
          <input
            id="note-title"
            name="title"
            type="text"
            className="add-new-page__input__title"
            placeholder="Masukkan judul catatan"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            required
            autoComplete="off"
            maxLength={200}
            disabled={isSubmitting}
          />

          <label htmlFor="note-body">Isi catatan</label>
          <textarea
            id="note-body"
            name="body"
            className="add-new-page__input__body"
            placeholder="Tuliskan isi catatan di sini..."
            value={body}
            onChange={(event) => {
              setBody(event.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            rows={10}
            required
            maxLength={50000}
            disabled={isSubmitting}
          />
        </div>

        {errorMessage && (
          <p className="add-note-form__error" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="add-note-form__actions">
          <button
            className="add-note-form__button add-note-form__button--primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan catatan'}
          </button>
          <Link
            className="add-note-form__button add-note-form__button--secondary"
            to="/"
            aria-disabled={isSubmitting}
          >
            Batal
          </Link>
        </div>
      </form>
    </section>
  );
}

export default NewNotePage;
