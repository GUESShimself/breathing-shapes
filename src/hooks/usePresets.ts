import { useState, useEffect, useCallback } from 'react';
import { BreathingPattern } from '../types/preset';
import {
  getPresetsFromStorage,
  savePresetsToStorage,
  addPreset as addPresetToStorage,
  updatePreset as updatePresetInStorage,
  deletePreset as deletePresetFromStorage,
  setSelectedPreset as setSelectedPresetInStorage,
} from '../lib/storage';
import { getDefaultPresetStorage } from '../data/defaultPresets';

export const usePresets = () => {
  const [presets, setPresets] = useState<BreathingPattern[]>([]);
  const [selectedPresetId, setSelectedPresetIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize presets from localStorage or use defaults
  useEffect(() => {
    const storage = getPresetsFromStorage();

    if (storage) {
      setPresets(storage.presets);
      setSelectedPresetIdState(storage.selectedPresetId);
    } else {
      // First time - initialize with defaults
      const defaultStorage = getDefaultPresetStorage();
      savePresetsToStorage(defaultStorage);
      setPresets(defaultStorage.presets);
      setSelectedPresetIdState(defaultStorage.selectedPresetId);
    }

    setIsLoading(false);
  }, []);

  // Get currently selected preset
  const selectedPreset = presets.find(p => p.id === selectedPresetId) || presets[0] || null;

  // Add a new preset
  const addPreset = useCallback((preset: BreathingPattern) => {
    const success = addPresetToStorage(preset);
    if (success) {
      setPresets(prev => [...prev, preset]);
    }
    return success;
  }, []);

  // Update an existing preset
  const updatePreset = useCallback((id: string, updates: Partial<BreathingPattern>) => {
    const success = updatePresetInStorage(id, updates);
    if (success) {
      setPresets(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    }
    return success;
  }, []);

  // Delete a preset
  const deletePreset = useCallback(
    (id: string) => {
      const success = deletePresetFromStorage(id);
      if (success) {
        setPresets(prev => prev.filter(p => p.id !== id));
        // If deleted preset was selected, select the first one
        if (selectedPresetId === id && presets.length > 1) {
          const newSelectedId = presets[0].id;
          setSelectedPresetInStorage(newSelectedId);
          setSelectedPresetIdState(newSelectedId);
        }
      }
      return success;
    },
    [selectedPresetId, presets]
  );

  // Select a preset
  const selectPreset = useCallback((id: string) => {
    const success = setSelectedPresetInStorage(id);
    if (success) {
      setSelectedPresetIdState(id);
    }
    return success;
  }, []);

  // Toggle favorite status
  const toggleFavorite = useCallback(
    (id: string) => {
      const preset = presets.find(p => p.id === id);
      if (preset) {
        return updatePreset(id, { isFavorite: !preset.isFavorite });
      }
      return false;
    },
    [presets, updatePreset]
  );

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    const defaultStorage = getDefaultPresetStorage();
    const success = savePresetsToStorage(defaultStorage);
    if (success) {
      setPresets(defaultStorage.presets);
      setSelectedPresetIdState(defaultStorage.selectedPresetId);
    }
    return success;
  }, []);

  return {
    presets,
    selectedPreset,
    selectedPresetId,
    isLoading,
    addPreset,
    updatePreset,
    deletePreset,
    selectPreset,
    toggleFavorite,
    resetToDefaults,
  };
};
