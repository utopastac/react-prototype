import { useEffect, useRef } from 'react';
import useHistoryStack from './useHistoryStack';
import { useLayoutData } from './useLayoutData';

/**
 * useHistoryManager
 * 
 * Custom hook that encapsulates all history management logic for the admin interface.
 * Handles automatic history capture, undo/redo operations, and state restoration.
 * 
 * This hook moves all the complex history logic out of AdminView for better
 * separation of concerns and reusability.
 */
interface UseHistoryManagerProps {
  setSelectedIdx?: (idx: number | null) => void;
  setSelectedSpecial?: (special: null | 'topbar' | 'bottombuttons' | 'toast') => void;
}

export const useHistoryManager = (props?: UseHistoryManagerProps) => {
  const { getLayoutData, restoreLayout } = useLayoutData();
  
  // Initialize history stack with current layout data
  const history = useHistoryStack(getLayoutData());
  
  // Track the last serialized state to detect changes
  const lastJsonRef = useRef<string | null>(null);
  
  // Flag to prevent infinite loops when restoring from history
  const isRestoringFromHistory = useRef(false);
  
  // Flag to ensure we only start auto-history after initial setup
  const hasInitialized = useRef(false);

  // On mount, push the initial state to history
  useEffect(() => {
    history.set(getLayoutData());
    lastJsonRef.current = JSON.stringify(getLayoutData());
    hasInitialized.current = true;
    // eslint-disable-next-line
  }, []);

  // Auto-history effect: track all layout state changes
  useEffect(() => {
    // Don't capture history before initialization
    if (!hasInitialized.current) return;
    
    // Don't capture history when we're restoring from history (prevents loops)
    if (isRestoringFromHistory.current) return;
    
    // Immediate capture without debouncing for more responsive undo/redo
    const currentData = getLayoutData();
    const currentJson = JSON.stringify(currentData);
    
    // Only create history entry if state actually changed
    if (currentJson === lastJsonRef.current) {
      return;
    }
    
    // Additional check: don't capture if the state is identical to the current history present
    if (history.present && JSON.stringify(history.present) === currentJson) {
      return;
    }
    
    // Add current state to history stack (no metadata needed)
    history.set(currentData);
    
    // Update our reference to prevent duplicate entries
    lastJsonRef.current = currentJson;
  }, [getLayoutData, history]);

  /**
   * Handle undo operation
   * 
   * FIXED: Uses the returned state from history.undo() to avoid React's async state updates.
   * This prevents timing issues where history.present hasn't updated yet when checked.
   */
  const handleUndo = () => {
    // Prevent multiple rapid undo calls
    if (isRestoringFromHistory.current) {
      return;
    }
    
    if (history.canUndo) {
      // Prevent auto-history from capturing this restoration
      isRestoringFromHistory.current = true;
      
      // Move to previous state in history stack
      const restoredState = history.undo();
      
      if (!restoredState) {
        return;
      }
      
      // Apply the restored state to the layout
      restoreLayout(restoredState);
      
      // Reset selection state since the layout has changed
      // This prevents issues where a selected component no longer exists
      if (props?.setSelectedIdx) {
        props.setSelectedIdx(null);
      }
      if (props?.setSelectedSpecial) {
        props.setSelectedSpecial(null);
      }
      
      // Allow auto-history to resume
      isRestoringFromHistory.current = false;
    }
  };

  /**
   * Handle redo operation
   * 
   * FIXED: Uses the returned state from history.redo() to avoid React's async state updates.
   * This prevents timing issues where history.present hasn't updated yet when checked.
   */
  const handleRedo = () => {
    // Prevent multiple rapid redo calls
    if (isRestoringFromHistory.current) {
      return;
    }
    
    if (history.canRedo) {
      // Prevent auto-history from capturing this restoration
      isRestoringFromHistory.current = true;
      
      // Move to next state in history stack
      const restoredState = history.redo();
      
      if (!restoredState) {
        return;
      }
      
      // Apply the restored state to the layout
      restoreLayout(restoredState);
      
      // Reset selection state since the layout has changed
      // This prevents issues where a selected component no longer exists
      if (props?.setSelectedIdx) {
        props.setSelectedIdx(null);
      }
      if (props?.setSelectedSpecial) {
        props.setSelectedSpecial(null);
      }
      
      // Allow auto-history to resume
      isRestoringFromHistory.current = false;
    }
  };

  /**
   * Jump to a specific history entry
   */
  const jumpToHistory = (idx: number) => {
    history.jumpTo(idx);
    restoreLayout(history.present);
    
    // Reset selection state since the layout has changed
    if (props?.setSelectedIdx) {
      props.setSelectedIdx(null);
    }
    if (props?.setSelectedSpecial) {
      props.setSelectedSpecial(null);
    }
  };

  /**
   * Clear all history
   */
  const clearHistory = () => {
    history.clear();
  };

  return {
    // History state
    canUndo: history.canUndo,
    canRedo: history.canRedo,
    past: history.past,
    future: history.future,
    present: history.present,
    
    // History actions
    handleUndo,
    handleRedo,
    jumpToHistory,
    clearHistory,
    
    // History stack for advanced usage (like HistoryModal)
    history,
  };
}; 