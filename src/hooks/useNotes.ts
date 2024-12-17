import { useState, useEffect } from 'react';
import { Note } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  useEffect(() => {
    const storedNotes = storage.get<Note[]>(STORAGE_KEYS.NOTES) ?? [];
    const parsedNotes = storedNotes.map(note => ({
      ...note,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt)
    }));
    setNotes(parsedNotes);
    setFilteredNotes(parsedNotes);
  }, []);

  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    setFilteredNotes(updatedNotes);
    storage.set(STORAGE_KEYS.NOTES, updatedNotes);
  };

  const updateNote = (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    const updatedNotes = notes.map(note =>
      note.id === id
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    );
    setNotes(updatedNotes);
    setFilteredNotes(updatedNotes);
    storage.set(STORAGE_KEYS.NOTES, updatedNotes);
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    setFilteredNotes(updatedNotes);
    storage.set(STORAGE_KEYS.NOTES, updatedNotes);
  };

  const searchNotes = (query: string) => {
    if (!query.trim()) {
      setFilteredNotes(notes);
      return;
    }

    const searchTerms = query.toLowerCase().split(' ');
    const filtered = notes.filter(note =>
      searchTerms.every(term =>
        note.title.toLowerCase().includes(term) ||
        note.content.toLowerCase().includes(term) ||
        note.tags.some(tag => tag.toLowerCase().includes(term))
      )
    );
    setFilteredNotes(filtered);
  };

  return {
    notes: filteredNotes,
    addNote,
    updateNote,
    deleteNote,
    searchNotes,
  };
};