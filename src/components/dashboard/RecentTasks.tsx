import React from 'react';

const RecentTasks: React.FC = () => {
  const tasks = ['Update portfolio', 'Review project proposal', 'Team meeting'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Recent Tasks</h3>
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>{task}</span>
            <span className="text-sm text-gray-500">Today</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTasks;