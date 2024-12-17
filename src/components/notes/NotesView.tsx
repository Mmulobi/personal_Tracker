import React, { useState } from 'react';
import { Plus, Search, Filter, X } from 'lucide-react';
import { useNotes } from '../../hooks/useNotes';
import ErrorBoundary from '../ErrorBoundary';

const NotesView: React.FC = () => {
  const { notes, filteredNotes, addNote, updateNote, deleteNote, searchNotes } = useNotes();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{
    tags?: string[];
    dateRange?: { start: Date; end: Date };
  }>({});

  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: [] as string[]
  });

  const handleAddNote = () => {
    const success = addNote(newNote);
    if (success) {
      setNewNote({ title: '', content: '', tags: [] });
      setIsAddingNote(false);
    }
  };

  const handleSearch = () => {
    searchNotes(searchQuery, filters);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    searchNotes('');
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold dark:text-white">Notes</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsAddingNote(!isAddingNote)}
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
            >
              <Plus className="mr-2" /> Add Note
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-4 flex space-x-2">
          <div className="relative flex-grow">
            <input 
              type="text" 
              placeholder="Search notes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white pr-10"
            />
            <Search className="absolute right-3 top-3 text-gray-400" />
          </div>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Dropdown */}
        {isFilterOpen && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 dark:text-white">Tags</label>
                <input 
                  type="text" 
                  placeholder="Comma-separated tags"
                  value={filters.tags?.join(', ') || ''}
                  onChange={(e) => setFilters({
                    ...filters, 
                    tags: e.target.value.split(',').map(tag => tag.trim())
                  })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-2 dark:text-white">Date Range</label>
                <div className="flex space-x-2">
                  <input 
                    type="date" 
                    onChange={(e) => setFilters({
                      ...filters, 
                      dateRange: {
                        start: new Date(e.target.value),
                        end: filters.dateRange?.end || new Date()
                      }
                    })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                  <input 
                    type="date" 
                    onChange={(e) => setFilters({
                      ...filters, 
                      dateRange: {
                        start: filters.dateRange?.start || new Date(0),
                        end: new Date(e.target.value)
                      }
                    })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button 
                onClick={clearFilters}
                className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded"
              >
                Clear Filters
              </button>
              <button 
                onClick={handleSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Add Note Form */}
        {isAddingNote && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
            <input 
              type="text" 
              placeholder="Note Title" 
              value={newNote.title}
              onChange={(e) => setNewNote({...newNote, title: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg mb-2 dark:bg-gray-700 dark:text-white"
            />
            <textarea 
              placeholder="Note Content" 
              value={newNote.content}
              onChange={(e) => setNewNote({...newNote, content: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg mb-2 h-32 dark:bg-gray-700 dark:text-white"
            />
            <input 
              type="text" 
              placeholder="Tags (comma-separated)" 
              value={newNote.tags.join(', ')}
              onChange={(e) => setNewNote({
                ...newNote, 
                tags: e.target.value.split(',').map(tag => tag.trim())
              })}
              className="w-full px-3 py-2 border rounded-lg mb-2 dark:bg-gray-700 dark:text-white"
            />
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setIsAddingNote(false)}
                className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddNote}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save Note
              </button>
            </div>
          </div>
        )}

        {/* Notes List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div 
              key={note.id} 
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
            >
              <h3 className="text-lg font-semibold mb-2 dark:text-white">
                {note.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {note.content}
              </p>
              {note.tags && note.tags.length > 0 && (
                <div className="flex space-x-2 mb-2">
                  {note.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {note.createdAt.toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => deleteNote(note.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            No notes found. Try creating a new note or adjusting your search.
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default NotesView;