// src/utils/dataManagement.ts
export const exportData = () => {
  const data = {
    notes: storage.get(STORAGE_KEYS.NOTES),
    goals: storage.get(STORAGE_KEYS.GOALS),
    tasks: storage.get(STORAGE_KEYS.TASKS)
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `lifetrack_backup_${new Date().toISOString()}.json`;
  link.click();
};

export const importData = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string);
      
      if (data.notes) storage.set(STORAGE_KEYS.NOTES, data.notes);
      if (data.goals) storage.set(STORAGE_KEYS.GOALS, data.goals);
      if (data.tasks) storage.set(STORAGE_KEYS.TASKS, data.tasks);

      window.location.reload(); // Refresh to load new data
    } catch (error) {
      console.error("Import failed", error);
    }
  };
  reader.readAsText(file);
};