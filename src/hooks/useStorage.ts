import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import type { StorageKey } from '../types';

export function useStorage<T>(key: StorageKey) {
  const [value, setValue] = useState<T | null>(() => storage.get<T>(key));

  useEffect(() => {
    if (value !== null) {
      storage.set(key, value);
    }
  }, [key, value]);

  return [value, setValue] as const;
}