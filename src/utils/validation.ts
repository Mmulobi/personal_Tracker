// src/utils/validation.ts
export const validateNote = (note: Partial<Note>): boolean => {
  if (!note.title || note.title.trim().length === 0) return false;
  if (note.title.length > 100) return false;
  if (note.content && note.content.length > 5000) return false;
  return true;
};

export const validateGoal = (goal: Partial<Goal>): boolean => {
  if (!goal.title || goal.title.trim().length === 0) return false;
  if (goal.title.length > 100) return false;
  if (goal.progress !== undefined && (goal.progress < 0 || goal.progress > 100)) return false;
  return true;
};