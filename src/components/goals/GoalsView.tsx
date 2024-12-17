import React, { useState } from 'react';
import { Plus, Search, Filter, X } from 'lucide-react';
import { useGoals } from '../../hooks/useGoals';
import ErrorBoundary from '../ErrorBoundary';
import { Goal } from '../../types';

const GoalsView: React.FC = () => {
  const { goals, filteredGoals, addGoal, updateGoal, deleteGoal, searchGoals } = useGoals();
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{
    status?: string[];
    progressRange?: { min: number; max: number };
    dateRange?: { start: Date; end: Date };
  }>({});

  const [newGoal, setNewGoal] = useState<Omit<Goal, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    status: 'In Progress',
    progress: 0,
    deadline: undefined
  });

  const handleAddGoal = () => {
    const success = addGoal(newGoal);
    if (success) {
      setNewGoal({
        title: '',
        description: '',
        status: 'In Progress',
        progress: 0,
        deadline: undefined
      });
      setIsAddingGoal(false);
    }
  };

  const handleSearch = () => {
    searchGoals(searchQuery, filters);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    searchGoals('');
  };

  const goalStatusColors = {
    'Not Started': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Completed': 'bg-green-100 text-green-800',
    'On Hold': 'bg-yellow-100 text-yellow-800'
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold dark:text-white">Goals</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsAddingGoal(!isAddingGoal)}
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
            >
              <Plus className="mr-2" /> Add Goal
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-4 flex space-x-2">
          <div className="relative flex-grow">
            <input 
              type="text" 
              placeholder="Search goals..." 
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
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-2 dark:text-white">Status</label>
                <div className="flex space-x-2">
                  {['Not Started', 'In Progress', 'Completed', 'On Hold'].map(status => (
                    <label key={status} className="inline-flex items-center">
                      <input 
                        type="checkbox" 
                        checked={filters.status?.includes(status)}
                        onChange={(e) => {
                          const currentStatus = filters.status || [];
                          const newStatus = e.target.checked 
                            ? [...currentStatus, status]
                            : currentStatus.filter(s => s !== status);
                          setFilters({...filters, status: newStatus});
                        }}
                        className="form-checkbox"
                      />
                      <span className="ml-2">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-2 dark:text-white">Progress Range</label>
                <div className="flex space-x-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={filters.progressRange?.min ?? ''}
                    onChange={(e) => setFilters({
                      ...filters, 
                      progressRange: {
                        min: Number(e.target.value),
                        max: filters.progressRange?.max ?? 100
                      }
                    })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    min="0"
                    max="100"
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={filters.progressRange?.max ?? ''}
                    onChange={(e) => setFilters({
                      ...filters, 
                      progressRange: {
                        min: filters.progressRange?.min ?? 0,
                        max: Number(e.target.value)
                      }
                    })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 dark:text-white">Deadline Range</label>
                <div className="flex space-x-2">
                  <input 
                    type="date" 
                    onChange={(e) => setFilters({
                      ...filters, 
                      dateRange: {
                        start: new Date(e.target.value),
                        end: filters.dateRange?.end || new Date('2099-12-31')
                      }
                    })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                  <input 
                    type="date" 
                    onChange={(e) => setFilters({
                      ...filters, 
                      dateRange: {
                        start: filters.dateRange?.start || new Date('1900-01-01'),
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

        {/* Add Goal Form */}
        {isAddingGoal && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
            <input 
              type="text" 
              placeholder="Goal Title" 
              value={newGoal.title}
              onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg mb-2 dark:bg-gray-700 dark:text-white"
            />
            <textarea 
              placeholder="Goal Description" 
              value={newGoal.description}
              onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg mb-2 h-32 dark:bg-gray-700 dark:text-white"
            />
            <div className="grid md:grid-cols-3 gap-4 mb-2">
              <div>
                <label className="block mb-2 dark:text-white">Status</label>
                <select
                  value={newGoal.status}
                  onChange={(e) => setNewGoal({...newGoal, status: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 dark:text-white">Progress (%)</label>
                <input 
                  type="number" 
                  value={newGoal.progress}
                  onChange={(e) => setNewGoal({...newGoal, progress: Number(e.target.value)})}
                  min="0" 
                  max="100"
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block mb-2 dark:text-white">Deadline</label>
                <input 
                  type="date" 
                  value={newGoal.deadline ? new Date(newGoal.deadline).toISOString().split('T')[0] : ''}
                  onChange={(e) => setNewGoal({
                    ...newGoal, 
                    deadline: e.target.value ? new Date(e.target.value) : undefined
                  })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setIsAddingGoal(false)}
                className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddGoal}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save Goal
              </button>
            </div>
          </div>
        )}

        {/* Goals List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGoals.map((goal) => (
            <div 
              key={goal.id} 
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
            >
              <h3 className="text-lg font-semibold mb-2 dark:text-white">
                {goal.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {goal.description}
              </p>
              <div className="flex justify-between items-center mb-2">
                <span 
                  className={`px-2 py-1 rounded-full text-xs ${goalStatusColors[goal.status as keyof typeof goalStatusColors]}`}
                >
                  {goal.status}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {goal.progress}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{width: `${goal.progress}%`}}
                />
              </div>
              {goal.deadline && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Deadline: {goal.deadline.toLocaleDateString()}
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Created: {goal.createdAt.toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => deleteGoal(goal.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGoals.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            No goals found. Try creating a new goal or adjusting your search.
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default GoalsView;