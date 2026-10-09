import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  addNote as addNoteToData,
  archiveNote as archiveNoteInData,
  deleteNote as deleteNoteFromData,
  unarchiveNote as unarchiveNoteInData,
} from '../utils/local-data.js';
import { createNotesSnapshot } from '../utils/notes-state.js';

const NotesContext = createContext(null);

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState(() => createNotesSnapshot());

  const synchronizeNotes = useCallback(() => {
    const nextSnapshot = createNotesSnapshot();
    setNotes(nextSnapshot);
    return nextSnapshot;
  }, []);

  const runAndSynchronize = useCallback((dataOperation, argument) => {
    const result = dataOperation(argument);
    synchronizeNotes();
    return result;
  }, [synchronizeNotes]);

  const addNote = useCallback((noteInput) => (
    runAndSynchronize(addNoteToData, noteInput)
  ), [runAndSynchronize]);

  const deleteNote = useCallback((id) => (
    runAndSynchronize(deleteNoteFromData, id)
  ), [runAndSynchronize]);

  const archiveNote = useCallback((id) => (
    runAndSynchronize(archiveNoteInData, id)
  ), [runAndSynchronize]);

  const unarchiveNote = useCallback((id) => (
    runAndSynchronize(unarchiveNoteInData, id)
  ), [runAndSynchronize]);

  const value = useMemo(() => ({
    notes,
    synchronizeNotes,
    addNote,
    deleteNote,
    archiveNote,
    unarchiveNote,
  }), [
    notes,
    synchronizeNotes,
    addNote,
    deleteNote,
    archiveNote,
    unarchiveNote,
  ]);

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);

  if (context === null) {
    throw new Error('useNotes must be used inside a NotesProvider.');
  }

  return context;
}
