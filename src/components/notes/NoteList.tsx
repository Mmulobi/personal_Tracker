import React from 'react';
import { Note } from '../../types';
import { Edit, Trash2, Tag } from 'lucide-react';

interface NoteListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map(note => (
        <div
          key={note.id}
          className="p-4 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg dark:text-white">{note.title}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(note)}
                className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(note.id)}
                className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {note.content}
          </p>

          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {note.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Last updated: {new Date(note.updatedAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteList;