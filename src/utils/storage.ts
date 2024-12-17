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
    const item = localStorage.getItem(STORAGE_KEYS[key]);
    return item ? JSON.parse(item) : null;
  }

  set<T>(key: StorageKey, value: T): void {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
  }

  remove(key: StorageKey): void {
    localStorage.removeItem(STORAGE_KEYS[key]);
  }

  clear(): void {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }
}

// Export a single instance
export const storage = new StorageUtil();