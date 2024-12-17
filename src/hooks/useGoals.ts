import { useState, useEffect } from 'react';
import { Goal } from '../types';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const storedGoals = storage.get<Goal[]>(STORAGE_KEYS.GOALS) ?? [];
    const parsedGoals = storedGoals.map(goal => ({
      ...goal,
      deadline: goal.deadline ? new Date(goal.deadline) : undefined
    }));
    setGoals(parsedGoals);
    setFilteredGoals(parsedGoals);
  }, []);

  const addGoal = (goalData: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: uuidv4(),
    };
    const updatedGoals = [newGoal, ...goals];
    setGoals(updatedGoals);
    setFilteredGoals(updatedGoals);
    storage.set(STORAGE_KEYS.GOALS, updatedGoals);
  };

  const updateGoal = (id: string, updates: Partial<Omit<Goal, 'id'>>) => {
    const updatedGoals = goals.map(goal =>
      goal.id === id
        ? { ...goal, ...updates }
        : goal
    );
    setGoals(updatedGoals);
    setFilteredGoals(updatedGoals);
    storage.set(STORAGE_KEYS.GOALS, updatedGoals);
  };

  const deleteGoal = (id: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== id);
    setGoals(updatedGoals);
    setFilteredGoals(updatedGoals);
    storage.set(STORAGE_KEYS.GOALS, updatedGoals);
  };

  const searchGoals = (query: string) => {
    if (!query.trim()) {
      setFilteredGoals(goals);
      return;
    }

    const searchTerms = query.toLowerCase().split(' ');
    const filtered = goals.filter(goal =>
      searchTerms.every(term =>
        goal.title.toLowerCase().includes(term) ||
        goal.description.toLowerCase().includes(term) ||
        goal.milestones.some(milestone => milestone.toLowerCase().includes(term))
      )
    );
    setFilteredGoals(filtered);
  };

  return {
    goals: filteredGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    searchGoals,
  };
};