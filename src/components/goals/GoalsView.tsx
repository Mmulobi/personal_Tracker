import React, { useState } from 'react';
import { useGoals } from '../../hooks/useGoals';
import GoalList from './GoalList';
import GoalEditor from './GoalEditor';
import { Goal } from '../../types';
import { Plus, Search } from 'lucide-react';

const GoalsView: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal, searchGoals } = useGoals();
  const [isEditing, setIsEditing] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchGoals(query);
  };

  const handleSave = (goalData: Omit<Goal, 'id'>) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, goalData);
    } else {
      addGoal(goalData);
    }
    setIsEditing(false);
    setEditingGoal(undefined);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsEditing(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">Goals</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      {isEditing ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <GoalEditor
            goal={editingGoal}
            onSave={handleSave}
            onCancel={() => {
              setIsEditing(false);
              setEditingGoal(undefined);
            }}
          />
        </div>
      ) : (
        <>
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search goals..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg pl-10 dark:bg-gray-800 dark:text-white"
            />
            <Search className="absolute left-3 top-3 text-gray-400" />
          </div>
          <GoalList 
            goals={searchQuery ? filteredGoals : goals} 
            onEdit={handleEdit} 
            onDelete={deleteGoal} 
          />
        </>
      )}
    </div>
  );
};

export default GoalsView;