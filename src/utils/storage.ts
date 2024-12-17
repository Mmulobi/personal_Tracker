// Storage keys constants
export const STORAGE_KEYS = {
  TASKS: 'lifetrack_tasks',
  NOTES: 'lifetrack_notes',
  GOALS: 'lifetrack_goals',
  EVENTS: 'lifetrack_events',
  THEME: 'lifetrack_theme',
} as const;

// Storage utility type
type StorageKey = keyof typeof STORAGE_KEYS;

// Storage utility class
class StorageUtil {
  get<T>(key: StorageKey): T | null {
    try {
      const item = localStorage.getItem(STORAGE_KEYS[key]);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error retrieving ${key} from localStorage:`, error);
      return null;
    }
  }

  set<T>(key: StorageKey, value: T): void {
    try {
      localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }

  remove(key: StorageKey): void {
    try {
      localStorage.removeItem(STORAGE_KEYS[key]);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  }

  clear(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}

// Export a single instance
export const storage = new StorageUtil();