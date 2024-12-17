import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TasksView from './components/tasks/TasksView';
import NotesView from './components/notes/NotesView';
import GoalsView from './components/goals/GoalsView';
import CalendarView from './components/calendar/CalendarView';
import ThemeToggle from './components/ThemeToggle';
import { Menu, X } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
  };

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile Sidebar Toggle */}
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <button 
            onClick={toggleMobileSidebar}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md"
          >
            {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        {/* Mobile Sidebar */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div 
              className="absolute inset-0 bg-black opacity-50" 
              onClick={toggleMobileSidebar}
            />
            <div className="absolute top-0 left-0 w-64 h-full bg-white dark:bg-gray-800 shadow-lg transform translate-x-0 transition-transform">
              <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto md:ml-64 pt-16 md:pt-0">
          <div className="p-4 flex justify-end">
            <ThemeToggle />
          </div>
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'tasks' && <TasksView />}
          {activeTab === 'notes' && <NotesView />}
          {activeTab === 'goals' && <GoalsView />}
          {activeTab === 'calendar' && <CalendarView />}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;