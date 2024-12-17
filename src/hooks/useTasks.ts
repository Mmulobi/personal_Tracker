import { useState, useEffect } from 'react';
import { Task } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';
import { validateTask } from '../utils/validation';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    const storedTasks = storage.get<Task[]>(STORAGE_KEYS.TASKS) ?? [];
    const parsedTasks = storedTasks.map(task => ({
      ...task,
      createdAt: new Date(task.createdAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined
    }));
    setTasks(parsedTasks);
    setFilteredTasks(parsedTasks);
  }, []);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (!validateTask(taskData)) {
      console.error('Invalid task data');
      return false;
    }

    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: new Date(),
    };
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
    storage.set(STORAGE_KEYS.TASKS, updatedTasks);
    return true;
  };

  const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    if (!taskToUpdate) return false;

    const updatedTask = { ...taskToUpdate, ...updates };
    if (!validateTask(updatedTask)) {
      console.error('Invalid updated task data');
      return false;
    }

    const updatedTasks = tasks.map(task =>
      task.id === id ? updatedTask : task
    );
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
    storage.set(STORAGE_KEYS.TASKS, updatedTasks);
    return true;
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
    storage.set(STORAGE_KEYS.TASKS, updatedTasks);
  };

  const searchTasks = (query: string, filters?: {
    priority?: string[];
    status?: string[];
    dateRange?: { start: Date; end: Date };
  }) => {
    let result = tasks;

    if (query) {
      const searchTerms = query.toLowerCase().split(' ');
      result = result.filter(task => 
        searchTerms.some(term => 
          task.title.toLowerCase().includes(term) || 
          task.description.toLowerCase().includes(term)
        )
      );
    }

    if (filters?.priority?.length) {
      result = result.filter(task => 
        filters.priority!.includes(task.priority)
      );
    }

    if (filters?.status?.length) {
      result = result.filter(task => 
        filters.status!.includes(task.status)
      );
    }

    if (filters?.dateRange) {
      result = result.filter(task => 
        (!task.dueDate || task.dueDate >= filters.dateRange!.start) && 
        (!task.dueDate || task.dueDate <= filters.dateRange!.end)
      );
    }

    setFilteredTasks(result);
  };

  return { 
    tasks, 
    filteredTasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    searchTasks 
  };
};