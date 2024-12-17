import { Note, Goal, Task } from '../types';

export const validateNote = (note: Partial<Note>): boolean => {
  if (!note.title || note.title.trim().length === 0) {
    console.error('Note title cannot be empty');
    return false;
  }
  if (note.title.length > 100) {
    console.error('Note title cannot exceed 100 characters');
    return false;
  }
  if (note.content && note.content.length > 5000) {
    console.error('Note content cannot exceed 5000 characters');
    return false;
  }
  if (note.tags && note.tags.length > 10) {
    console.error('Maximum of 10 tags allowed');
    return false;
  }
  return true;
};

export const validateGoal = (goal: Partial<Goal>): boolean => {
  if (!goal.title || goal.title.trim().length === 0) {
    console.error('Goal title cannot be empty');
    return false;
  }
  if (goal.title.length > 100) {
    console.error('Goal title cannot exceed 100 characters');
    return false;
  }
  if (goal.description && goal.description.length > 500) {
    console.error('Goal description cannot exceed 500 characters');
    return false;
  }
  if (goal.progress !== undefined && (goal.progress < 0 || goal.progress > 100)) {
    console.error('Goal progress must be between 0 and 100');
    return false;
  }
  if (goal.deadline && goal.deadline < new Date()) {
    console.error('Goal deadline cannot be in the past');
    return false;
  }
  return true;
};

export const validateTask = (task: Partial<Task>): boolean => {
  if (!task.title || task.title.trim().length === 0) {
    console.error('Task title cannot be empty');
    return false;
  }
  if (task.title.length > 100) {
    console.error('Task title cannot exceed 100 characters');
    return false;
  }
  if (task.description && task.description.length > 500) {
    console.error('Task description cannot exceed 500 characters');
    return false;
  }
  if (task.dueDate && task.dueDate < new Date()) {
    console.error('Task due date cannot be in the past');
    return false;
  }
  return true;
};