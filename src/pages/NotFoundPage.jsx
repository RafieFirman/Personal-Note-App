import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="not-found-page" aria-labelledby="not-found-heading">
      <p className="not-found-page__code" aria-hidden="true">404</p>
      <h2 id="not-found-heading">Halaman tidak ditemukan</h2>
      <p className="not-found-page__description">
        Alamat yang kamu buka tidak tersedia. Periksa kembali URL atau kembali ke halaman utama.
      </p>
      <Link className="add-note-form__button add-note-form__button--primary" to="/">
        Kembali ke beranda
      </Link>
    </section>
  );
}

export default NotFoundPage;
