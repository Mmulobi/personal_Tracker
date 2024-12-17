import { useState, useEffect } from 'react';
import { Task } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    const storedTasks = storage.get<Task[]>(STORAGE_KEYS.TASKS) || [];
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    let filtered = tasks;

    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filter === 'completed') {
      filtered = filtered.filter(task => task.completed);
    } else if (filter === 'pending') {
      filtered = filtered.filter(task => !task.completed);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, filter]);

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = { ...task, id: uuidv4() };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    storage.set(STORAGE_KEYS.TASKS, updatedTasks);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    );
    setTasks(updatedTasks);
    storage.set(STORAGE_KEYS.TASKS, updatedTasks);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    storage.set(STORAGE_KEYS.TASKS, updatedTasks);
  };

  return {
    tasks: filteredTasks,
    addTask,
    updateTask,
    deleteTask,
    setSearchQuery,
    setFilter,
  };
};