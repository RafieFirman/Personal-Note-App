import React from 'react';
import { useSearchParams } from 'react-router-dom';

function NoteSearch({ label, inputId }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') ?? '';

  function handleSearchChange(event) {
    const nextValue = event.target.value;

    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);

      if (nextValue === '') {
        nextParams.delete('search');
      } else {
        nextParams.set('search', nextValue);
      }

      return nextParams;
    }, { replace: true });
  }

  return (
    <div className="search-bar">
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        type="search"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Cari berdasarkan judul catatan..."
        autoComplete="off"
      />
    </div>
  );
}

export default NoteSearch;
