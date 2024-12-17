import React from 'react';
import { useTasks } from '../../hooks/useTasks';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

const TasksView: React.FC = () => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    setSearchQuery,
    setFilter,
  } = useTasks();

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Tasks</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TaskList
            tasks={tasks}
            onUpdate={updateTask}
            onDelete={deleteTask}
            onSearchChange={setSearchQuery}
            onFilterChange={setFilter}
          />
        </div>
        <div>
          <TaskForm onSubmit={addTask} />
        </div>
      </div>
    </div>
  );
};

export default TasksView;