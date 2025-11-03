import { useState } from 'react';
import { useLayoutData, LayoutsData } from './useLayoutData';

export const useLocalStorage = () => {
  const [saveName, setSaveName] = useState('');
  const [loadList, setLoadList] = useState<string[]>([]);
  const [loadError, setLoadError] = useState('');

  const layoutData = useLayoutData();

  // Helper: get all saves from localStorage
  const getAllSaves = () => {
    const raw = localStorage.getItem('intervention_layout_saves');
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  };

  // Helper: update saves in localStorage
  const setAllSaves = (saves: Record<string, any>) => {
    localStorage.setItem('intervention_layout_saves', JSON.stringify(saves));
  };

  // Reserved key for auto-save
  const CURRENT_KEY = '__current__';

  // Save current layout
  const handleSave = () => {
    if (!saveName.trim()) return false;
    const saves = getAllSaves();
    saves[saveName] = layoutData.getLayoutData();
    setAllSaves(saves);
    return true;
  };

  // Load a saved layout
  const handleLoad = (name: string) => {
    const saves = getAllSaves();
    const data = saves[name];
    if (!data) {
      setLoadError('Save not found.');
      return false;
    }
    layoutData.restoreLayouts(data);
    setLoadError('');
    return true;
  };

  // Save current layout as 'current' (auto-save)
  const saveCurrent = () => {
    const saves = getAllSaves();
    saves[CURRENT_KEY] = layoutData.getLayoutData();
    setAllSaves(saves);
  };

  // Restore layout from 'current' (auto-restore)
  const loadCurrent = () => {
    const saves = getAllSaves();
    const data = saves[CURRENT_KEY];
    if (data) {
      layoutData.restoreLayouts(data);
      return true;
    }
    return false;
  };

  // Delete a save
  const handleDeleteSave = (name: string) => {
    const saves = getAllSaves();
    delete saves[name];
    setAllSaves(saves);
    setLoadList(Object.keys(saves));
  };

  // Get all save names (excluding 'current')
  const getLoadList = () => {
    const saves = getAllSaves();
    return Object.keys(saves).filter(name => name !== CURRENT_KEY);
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
    getLoadList,
    // Expose auto-save/restore helpers
    saveCurrent,
    loadCurrent
  };
}; 