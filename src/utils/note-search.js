/**
 * Filter catatan berdasarkan kata kunci judul saja.
 * Kumpulan input harus sudah dibatasi menurut kategori (aktif/arsip) oleh pemanggil.
 */
export function filterNotesByTitle(notes, searchTerm) {
  const normalizedTerm = searchTerm.trim().toLowerCase();

  if (normalizedTerm === '') {
    return notes;
  }

  return notes.filter((note) => (
    note.title.toLowerCase().includes(normalizedTerm)
  ));
}
