import React from 'react';
import { Home, CheckSquare, FileText, Target, Calendar } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'notes', icon: FileText, label: 'Notes' },
    { id: 'goals', icon: Target, label: 'Goals' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-full overflow-y-auto">
      <div className="p-4 border-b dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">LifeTrack</h1>
      </div>
      <nav className="py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                activeTab === item.id 
                  ? 'bg-gray-100 dark:bg-gray-700 border-r-4 border-blue-500 text-blue-600 dark:text-blue-400' 
                  : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;