import { getAllNotes } from './local-data.js';

export function createNotesSnapshot(sourceNotes = getAllNotes()) {
  return sourceNotes.map((note) => ({ ...note }));
}
