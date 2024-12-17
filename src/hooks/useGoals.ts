import { useState, useEffect } from 'react';
import { Goal } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';
import { validateGoal } from '../utils/validation';

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const storedGoals = storage.get<Goal[]>(STORAGE_KEYS.GOALS) ?? [];
    const parsedGoals = storedGoals.map(goal => ({
      ...goal,
      createdAt: new Date(goal.createdAt),
      deadline: goal.deadline ? new Date(goal.deadline) : undefined
    }));
    setGoals(parsedGoals);
    setFilteredGoals(parsedGoals);
  }, []);

  const addGoal = (goalData: Omit<Goal, 'id' | 'createdAt'>) => {
    if (!validateGoal(goalData)) {
      console.error('Invalid goal data');
      return false;
    }

    const newGoal: Goal = {
      ...goalData,
      id: uuidv4(),
      createdAt: new Date(),
    };
    const updatedGoals = [newGoal, ...goals];
    setGoals(updatedGoals);
    setFilteredGoals(updatedGoals);
    storage.set(STORAGE_KEYS.GOALS, updatedGoals);
    return true;
  };

  const updateGoal = (id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>) => {
    const goalToUpdate = goals.find(goal => goal.id === id);
    if (!goalToUpdate) return false;

    const updatedGoal = { ...goalToUpdate, ...updates };
    if (!validateGoal(updatedGoal)) {
      console.error('Invalid updated goal data');
      return false;
    }

    const updatedGoals = goals.map(goal =>
      goal.id === id ? updatedGoal : goal
    );
    setGoals(updatedGoals);
    setFilteredGoals(updatedGoals);
    storage.set(STORAGE_KEYS.GOALS, updatedGoals);
    return true;
  };

  const deleteGoal = (id: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== id);
    setGoals(updatedGoals);
    setFilteredGoals(updatedGoals);
    storage.set(STORAGE_KEYS.GOALS, updatedGoals);
  };

  const searchGoals = (query: string, filters?: {
    status?: string[];
    progressRange?: { min: number; max: number };
    dateRange?: { start: Date; end: Date };
  }) => {
    let result = goals;

    if (query) {
      const searchTerms = query.toLowerCase().split(' ');
      result = result.filter(goal => 
        searchTerms.some(term => 
          goal.title.toLowerCase().includes(term) || 
          goal.description.toLowerCase().includes(term)
        )
      );
    }

    if (filters?.status?.length) {
      result = result.filter(goal => 
        filters.status!.includes(goal.status)
      );
    }

    if (filters?.progressRange) {
      result = result.filter(goal => 
        goal.progress >= filters.progressRange!.min && 
        goal.progress <= filters.progressRange!.max
      );
    }

    if (filters?.dateRange) {
      result = result.filter(goal => 
        (!goal.deadline || goal.deadline >= filters.dateRange!.start) && 
        (!goal.deadline || goal.deadline <= filters.dateRange!.end)
      );
    }

    setFilteredGoals(result);
  };

  return { 
    goals, 
    filteredGoals, 
    addGoal, 
    updateGoal, 
    deleteGoal, 
    searchGoals 
  };
};