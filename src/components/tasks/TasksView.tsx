import React, { useState } from 'react';
import { Plus, Search, Filter, X } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import ErrorBoundary from '../ErrorBoundary';
import { Task } from '../../types';

const TasksView: React.FC = () => {
  const { tasks, filteredTasks, addTask, updateTask, deleteTask, searchTasks } = useTasks();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{
    priority?: string[];
    status?: string[];
    dateRange?: { start: Date; end: Date };
  }>({});

  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    status: 'Not Started',
    priority: 'Medium',
    dueDate: undefined
  });

  const handleAddTask = () => {
    const success = addTask(newTask);
    if (success) {
      setNewTask({
        title: '',
        description: '',
        status: 'Not Started',
        priority: 'Medium',
        dueDate: undefined
      });
      setIsAddingTask(false);
    }
  };

  const handleSearch = () => {
    searchTasks(searchQuery, filters);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    searchTasks('');
  };

  const priorityColors = {
    'Low': 'bg-green-100 text-green-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'High': 'bg-red-100 text-red-800'
  };

  const statusColors = {
    'Not Started': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Completed': 'bg-green-100 text-green-800',
    'Blocked': 'bg-red-100 text-red-800'
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold dark:text-white">Tasks</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsAddingTask(!isAddingTask)}
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
            >
              <Plus className="mr-2" /> Add Task
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-4 flex space-x-2">
          <div className="relative flex-grow">
            <input 
              type="text" 
              placeholder="Search tasks..." 
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
                <label className="block mb-2 dark:text-white">Priority</label>
                <div className="flex space-x-2">
                  {['Low', 'Medium', 'High'].map(priority => (
                    <label key={priority} className="inline-flex items-center">
                      <input 
                        type="checkbox" 
                        checked={filters.priority?.includes(priority)}
                        onChange={(e) => {
                          const currentPriority = filters.priority || [];
                          const newPriority = e.target.checked 
                            ? [...currentPriority, priority]
                            : currentPriority.filter(p => p !== priority);
                          setFilters({...filters, priority: newPriority});
                        }}
                        className="form-checkbox"
                      />
                      <span className="ml-2">{priority}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-2 dark:text-white">Status</label>
                <div className="flex space-x-2">
                  {['Not Started', 'In Progress', 'Completed', 'Blocked'].map(status => (
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
                <label className="block mb-2 dark:text-white">Due Date Range</label>
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

        {/* Add Task Form */}
        {isAddingTask && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
            <input 
              type="text" 
              placeholder="Task Title" 
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg mb-2 dark:bg-gray-700 dark:text-white"
            />
            <textarea 
              placeholder="Task Description" 
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg mb-2 h-32 dark:bg-gray-700 dark:text-white"
            />
            <div className="grid md:grid-cols-3 gap-4 mb-2">
              <div>
                <label className="block mb-2 dark:text-white">Status</label>
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 dark:text-white">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 dark:text-white">Due Date</label>
                <input 
                  type="date" 
                  value={newTask.dueDate ? new Date(newTask.dueDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setNewTask({
                    ...newTask, 
                    dueDate: e.target.value ? new Date(e.target.value) : undefined
                  })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setIsAddingTask(false)}
                className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddTask}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save Task
              </button>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <div 
              key={task.id} 
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
            >
              <h3 className="text-lg font-semibold mb-2 dark:text-white">
                {task.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {task.description}
              </p>
              <div className="flex justify-between items-center mb-2">
                <span 
                  className={`px-2 py-1 rounded-full text-xs ${statusColors[task.status as keyof typeof statusColors]}`}
                >
                  {task.status}
                </span>
                <span 
                  className={`px-2 py-1 rounded-full text-xs ${priorityColors[task.priority as keyof typeof priorityColors]}`}
                >
                  {task.priority} Priority
                </span>
              </div>
              {task.dueDate && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Due: {task.dueDate.toLocaleDateString()}
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Created: {task.createdAt.toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            No tasks found. Try creating a new task or adjusting your search.
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default TasksView;