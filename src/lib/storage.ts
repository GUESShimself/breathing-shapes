import { PresetStorage, BreathingPattern } from '../types/preset';

const STORAGE_KEY = 'breathing-app-presets';

/**
 * Get all presets from localStorage
 */
export const getPresetsFromStorage = (): PresetStorage | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading presets from localStorage:', error);
    return null;
  }
};

/**
 * Save presets to localStorage
 */
export const savePresetsToStorage = (storage: PresetStorage): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
    return true;
  } catch (error) {
    console.error('Error saving presets to localStorage:', error);
    return false;
  }
};

/**
 * Get a specific preset by ID
 */
export const getPresetById = (id: string): BreathingPattern | null => {
  const storage = getPresetsFromStorage();
  if (!storage) return null;
  return storage.presets.find(p => p.id === id) || null;
};

/**
 * Add a new preset
 */
export const addPreset = (preset: BreathingPattern): boolean => {
  const storage = getPresetsFromStorage();
  if (!storage) return false;

  storage.presets.push(preset);
  storage.lastUpdated = Date.now();

  return savePresetsToStorage(storage);
};

/**
 * Update an existing preset
 */
export const updatePreset = (id: string, updates: Partial<BreathingPattern>): boolean => {
  const storage = getPresetsFromStorage();
  if (!storage) return false;

  const index = storage.presets.findIndex(p => p.id === id);
  if (index === -1) return false;

  storage.presets[index] = { ...storage.presets[index], ...updates };
  storage.lastUpdated = Date.now();

  return savePresetsToStorage(storage);
};

/**
 * Delete a preset
 */
export const deletePreset = (id: string): boolean => {
  const storage = getPresetsFromStorage();
  if (!storage) return false;

  storage.presets = storage.presets.filter(p => p.id !== id);
  storage.lastUpdated = Date.now();

  return savePresetsToStorage(storage);
};

/**
 * Set the selected preset ID
 */
export const setSelectedPreset = (id: string): boolean => {
  const storage = getPresetsFromStorage();
  if (!storage) return false;

  storage.selectedPresetId = id;
  storage.lastUpdated = Date.now();

  return savePresetsToStorage(storage);
};

/**
 * Clear all presets from storage
 */
export const clearStorage = (): boolean => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};
