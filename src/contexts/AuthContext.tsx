// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Auto-login for development purposes
    const login = async () => {
      await handleLogin('demo', 'password');
    };
    login();
  }, []);

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    // IMPORTANT: This is a MOCK implementation. 
    // In a real app, use secure backend authentication
    if (username === 'demo' && password === 'password') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    return await handleLogin(username, password);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};