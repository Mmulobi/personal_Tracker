import React from 'react';

interface Goal {
  name: string;
  progress: number;
}

const GoalProgress: React.FC = () => {
  const goals: Goal[] = [
    { name: 'Learn React Native', progress: 65 },
    { name: 'Read 12 Books', progress: 40 },
    { name: 'Launch Side Project', progress: 25 },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Goal Progress</h3>
      <div className="space-y-4">
        {goals.map((goal, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between">
              <span>{goal.name}</span>
              <span>{goal.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${goal.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalProgress;