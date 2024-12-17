import React, { useState, useEffect } from 'react';
import { Save, Trash2 } from 'lucide-react';
import type { EventInput } from '@fullcalendar/core';

interface EventEditorProps {
  event?: EventInput;
  initialDate?: Date;
  onSave: (eventData: any) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const EventEditor: React.FC<EventEditorProps> = ({
  event,
  initialDate,
  onSave,
  onCancel,
  onDelete,
}) => {
  const [title, setTitle] = useState(event?.title as string || '');
  const [start, setStart] = useState(
    event?.start
      ? new Date(event.start).toISOString().split('T')[0]
      : initialDate
      ? initialDate.toISOString().split('T')[0]
      : ''
  );
  const [end, setEnd] = useState(
    event?.end
      ? new Date(event.end).toISOString().split('T')[0]
      : ''
  );
  const [description, setDescription] = useState(event?.extendedProps?.description || '');
  const [color, setColor] = useState(event?.backgroundColor || '#3B82F6');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      start,
      end: end || undefined,
      backgroundColor: color,
      borderColor: color,
      extendedProps: {
        description,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Event Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Color
        </label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full h-10 rounded-lg cursor-pointer"
        />
      </div>

      <div className="flex justify-between">
        <div>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Event
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Event
          </button>
        </div>
      </div>
    </form>
  );
};

export default EventEditor;