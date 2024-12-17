import { useState, useEffect } from 'react';
import { Note } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';
import { validateNote } from '../utils/validation';

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
    if (!validateNote(noteData)) {
      console.error('Invalid note data');
      return false;
    }

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
    return true;
  };

  const updateNote = (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    const noteToUpdate = notes.find(note => note.id === id);
    if (!noteToUpdate) return false;

    const updatedNote = { ...noteToUpdate, ...updates, updatedAt: new Date() };
    if (!validateNote(updatedNote)) {
      console.error('Invalid updated note data');
      return false;
    }

    const updatedNotes = notes.map(note =>
      note.id === id ? updatedNote : note
    );
    setNotes(updatedNotes);
    setFilteredNotes(updatedNotes);
    storage.set(STORAGE_KEYS.NOTES, updatedNotes);
    return true;
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    setFilteredNotes(updatedNotes);
    storage.set(STORAGE_KEYS.NOTES, updatedNotes);
  };

  const searchNotes = (query: string, filters?: {
    tags?: string[];
    dateRange?: { start: Date; end: Date };
  }) => {
    let result = notes;

    if (query) {
      const searchTerms = query.toLowerCase().split(' ');
      result = result.filter(note => 
        searchTerms.some(term => 
          note.title.toLowerCase().includes(term) || 
          note.content.toLowerCase().includes(term)
        )
      );
    }

    if (filters?.tags?.length) {
      result = result.filter(note => 
        filters.tags!.some(tag => note.tags.includes(tag))
      );
    }

    if (filters?.dateRange) {
      result = result.filter(note => 
        note.createdAt >= filters.dateRange!.start && 
        note.createdAt <= filters.dateRange!.end
      );
    }

    setFilteredNotes(result);
  };

  return { 
    notes, 
    filteredNotes, 
    addNote, 
    updateNote, 
    deleteNote, 
    searchNotes 
  };
};