import React from 'react';
import { Clock, CheckCircle2, AlertCircle, Target } from 'lucide-react';
import StatCard from './dashboard/StatCard';
import RecentTasks from './dashboard/RecentTasks';
import GoalProgress from './dashboard/GoalProgress';

const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Tasks Due Today', value: 5, Icon: Clock, iconColor: 'text-blue-500' },
    { title: 'Completed Tasks', value: 12, Icon: CheckCircle2, iconColor: 'text-green-500' },
    { title: 'Pending Tasks', value: 8, Icon: AlertCircle, iconColor: 'text-yellow-500' },
    { title: 'Active Goals', value: 3, Icon: Target, iconColor: 'text-purple-500' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTasks />
        <GoalProgress />
      </div>
    </div>
  );
};

export default Dashboard;