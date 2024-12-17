import React, { useState } from 'react';
import { useNotes } from '../../hooks/useNotes';
import NoteList from './NoteList';
import NoteEditor from './NoteEditor';
import { Note } from '../../types';
import { Plus, Search } from 'lucide-react';

const NotesView: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote, searchNotes } = useNotes();
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchNotes(query);
  };

  const handleSave = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingNote) {
      updateNote(editingNote.id, noteData);
    } else {
      addNote(noteData);
    }
    setIsEditing(false);
    setEditingNote(undefined);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setIsEditing(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">Notes</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Note
        </button>
      </div>

      {isEditing ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <NoteEditor
            note={editingNote}
            onSave={handleSave}
            onCancel={() => {
              setIsEditing(false);
              setEditingNote(undefined);
            }}
          />
        </div>
      ) : (
        <>
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg pl-10 dark:bg-gray-800 dark:text-white"
            />
            <Search className="absolute left-3 top-3 text-gray-400" />
          </div>
          <NoteList 
            notes={searchQuery ? filteredNotes : notes} 
            onEdit={handleEdit} 
            onDelete={deleteNote} 
          />
        </>
      )}
    </div>
  );
};

export default NotesView;