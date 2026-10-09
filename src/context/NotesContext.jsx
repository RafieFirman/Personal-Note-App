import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  addNote as addNoteToLocalData,
  archiveNote as archiveLocalNote,
  deleteNote as deleteLocalNote,
  unarchiveNote as unarchiveLocalNote,
} from '../utils/local-data.js';
import { createNotesSnapshot } from '../utils/notes-state.js';
import { isSupabaseConfigured } from '../lib/supabaseApi.js';
import {
  deleteNoteFromDatabase,
  fetchNotesFromDatabase,
  insertNoteIntoDatabase,
  setDatabaseNoteArchived,
} from '../lib/supabaseApi.js';

const NotesContext = createContext(null);

export function NotesProvider({ children, user }) {
  const userId = user?.id ?? null;
  const [notes, setNotes] = useState(() => (
    isSupabaseConfigured ? [] : createNotesSnapshot()
  ));
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState('');

  const reloadNotes = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoadingSafely(setIsLoading, false);
      return;
    }

    if (!userId) {
      setNotes([]);
      setError('');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const nextNotes = await fetchNotesFromDatabase();
      setNotes(nextNotes);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Catatan gagal dimuat dari database.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    reloadNotes();
  }, [reloadNotes]);

  const addNote = useCallback(async (noteInput) => {
    if (isSupabaseConfigured) {
      const createdNote = await insertNoteIntoDatabase(noteInput);
      setNotes((currentNotes) => [createdNote, ...currentNotes]);
      setError('');
      return createdNote;
    }

    const createdNote = addNoteToLocalData(noteInput);
    setNotes(createNotesSnapshot());
    return createdNote;
  }, []);

  const deleteNote = useCallback(async (id) => {
    if (isSupabaseConfigured) {
      await deleteNoteFromDatabase(id);
      setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id));
      setError('');
      return;
    }

    deleteLocalNote(id);
    setNotes(createNotesSnapshot());
  }, []);

  const archiveNote = useCallback(async (id) => {
    if (isSupabaseConfigured) {
      const updatedNote = await setDatabaseNoteArchived(id, true);
      setNotes((currentNotes) => currentNotes.map((note) => (
        note.id === id ? updatedNote : note
      )));
      setError('');
      return updatedNote;
    }

    archiveLocalNote(id);
    setNotes(createNotesSnapshot());
    return undefined;
  }, []);

  const unarchiveNote = useCallback(async (id) => {
    if (isSupabaseConfigured) {
      const updatedNote = await setDatabaseNoteArchived(id, false);
      setNotes((currentNotes) => currentNotes.map((note) => (
        note.id === id ? updatedNote : note
      )));
      setError('');
      return updatedNote;
    }

    unarchiveLocalNote(id);
    setNotes(createNotesSnapshot());
    return undefined;
  }, []);

  const value = useMemo(() => ({
    notes,
    isLoading,
    error,
    reloadNotes,
    addNote,
    deleteNote,
    archiveNote,
    unarchiveNote,
  }), [
    notes,
    isLoading,
    error,
    reloadNotes,
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

function setLoadingSafely(setter, value) {
  setter(value);
}

export function useNotes() {
  const context = useContext(NotesContext);

  if (context === null) {
    throw new Error('useNotes must be used inside a NotesProvider.');
  }

  return context;
}
