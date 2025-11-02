// useLocalStorage.ts
//
// Custom React hook for saving and loading admin layouts to/from localStorage.
// Used by AdminView for persistence and restore functionality.
// Handles serialization, deserialization, and error handling for saves.

import { useState } from 'react';
import { useLayoutData, LayoutData } from './useLayoutData';
import { transformLayoutImageUrls } from 'src/utils/imageUrlTransformer';

/**
 * useLocalStorage
 *
 * Provides handlers for saving and loading layouts to/from localStorage.
 * Handles serialization, deserialization, and error handling for saves.
 */
export const useLocalStorage = () => {
  const [saveName, setSaveName] = useState('');
  const [loadList, setLoadList] = useState<string[]>([]);
  const [loadError, setLoadError] = useState('');

  const { getLayoutData, restoreLayout } = useLayoutData();

  // Helper: get all saves from localStorage
  const getAllSaves = () => {
    const raw = localStorage.getItem('funblocker_saves');
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  };

  // Helper: update saves in localStorage
  const setAllSaves = (saves: Record<string, any>) => {
    localStorage.setItem('funblocker_saves', JSON.stringify(saves));
  };

  /**
   * handleSave
   *
   * Saves the current layout to localStorage under the given saveName.
   * Returns true on success, false if saveName is empty.
   */
  const handleSave = () => {
    if (!saveName.trim()) return false;
    const saves = getAllSaves();
    // Transform image URLs before saving to ensure they work in production
    const layoutData = transformLayoutImageUrls(getLayoutData());
    saves[saveName] = layoutData;
    setAllSaves(saves);
    return true; // Indicate success
  };

  /**
   * handleLoad
   *
   * Loads a saved layout from localStorage by name.
   * Restores the layout state and returns true on success, false if not found.
   */
  const handleLoad = (name: string) => {
    const saves = getAllSaves();
    const data = saves[name];
    if (!data) {
      setLoadError('Save not found.');
      return false;
    }
    restoreLayout(data);
    setLoadError('');
    return true; // Indicate success
  };

  /**
   * handleDeleteSave
   *
   * Deletes a saved layout from localStorage by name.
   * Updates the load list after deletion.
   */
  const handleDeleteSave = (name: string) => {
    const saves = getAllSaves();
    delete saves[name];
    setAllSaves(saves);
    setLoadList(Object.keys(saves));
  };

  /**
   * getLoadList
   *
   * Returns a list of all saved layout names in localStorage.
   */
  const getLoadList = () => {
    const saves = getAllSaves();
    return Object.keys(saves);
  };

  return {
    saveName,
    setSaveName,
    loadList,
    setLoadList,
    loadError,
    setLoadError,
    handleSave,
    handleLoad,
    handleDeleteSave,
    getLoadList
  };
}; 