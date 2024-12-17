import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TasksView from './components/tasks/TasksView';
import NotesView from './components/notes/NotesView';
import GoalsView from './components/goals/GoalsView';
import CalendarView from './components/calendar/CalendarView';
import ThemeToggle from './components/ThemeToggle';
import { Menu, X, LogOut } from 'lucide-react';
import { exportData, importData } from './utils/dataManagement';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (!success) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">LifeTrack Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file)
        .then((result) => {
          alert(`Import successful: 
            Notes imported: ${result.notesImported}
            Goals imported: ${result.goalsImported}`);
        })
        .catch((error) => {
          alert('Import failed');
          console.error(error);
        });
    }
  };

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
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
        <div className="p-4 flex justify-between items-center">
          <div className="flex space-x-4">
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImport} 
              className="hidden" 
              id="import-data"
            />
            <label 
              htmlFor="import-data" 
              className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Import Data
            </label>
            <button 
              onClick={exportData}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Export Data
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button 
              onClick={logout}
              className="text-red-500 hover:text-red-600 flex items-center"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
        <ErrorBoundary>
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'tasks' && <TasksView />}
          {activeTab === 'notes' && <NotesView />}
          {activeTab === 'goals' && <GoalsView />}
          {activeTab === 'calendar' && <CalendarView />}
        </ErrorBoundary>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;