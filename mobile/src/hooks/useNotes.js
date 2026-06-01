import { useState, useCallback } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from '../services/api';

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getNotes();
      setNotes(data);
    } catch {
      // caller can show error via try/catch; silently ignore here
    } finally {
      setLoading(false);
    }
  }, []);

  const addNote = async (noteData) => {
    const { data } = await createNote(noteData);
    setNotes((prev) => [data, ...prev]);
    return data;
  };

  const editNote = async (id, noteData) => {
    const { data } = await updateNote(id, noteData);
    setNotes((prev) => prev.map((n) => (n._id === id ? data : n)));
    return data;
  };

  const removeNote = async (id) => {
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n._id !== id));
  };

  return { notes, loading, fetchNotes, addNote, editNote, removeNote };
}
