import React, { useState } from 'react';
import { Goal } from '../../types';
import { Save, Plus, X } from 'lucide-react';

interface GoalEditorProps {
  goal?: Goal;
  onSave: (goal: Omit<Goal, 'id'>) => void;
  onCancel: () => void;
}

const GoalEditor: React.FC<GoalEditorProps> = ({ goal, onSave, onCancel }) => {
  const [title, setTitle] = useState(goal?.title || '');
  const [description, setDescription] = useState(goal?.description || '');
  const [deadline, setDeadline] = useState(goal?.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '');
  const [progress, setProgress] = useState(goal?.progress || 0);
  const [milestones, setMilestones] = useState<string[]>(goal?.milestones || []);
  const [newMilestone, setNewMilestone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      deadline: deadline ? new Date(deadline) : undefined,
      progress,
      milestones,
    });
  };

  const addMilestone = () => {
    if (newMilestone.trim()) {
      setMilestones([...milestones, newMilestone.trim()]);
      setNewMilestone('');
    }
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          required
        />
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
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Deadline
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Progress ({progress}%)
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Milestones
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newMilestone}
            onChange={(e) => setNewMilestone(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Add a milestone"
          />
          <button
            type="button"
            onClick={addMilestone}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <ul className="space-y-2">
          {milestones.map((milestone, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700"
            >
              <span className="dark:text-white">{milestone}</span>
              <button
                type="button"
                onClick={() => removeMilestone(index)}
                className="text-red-500 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end gap-2">
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
          Save Goal
        </button>
      </div>
    </form>
  );
};

export default GoalEditor;