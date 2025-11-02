import { useState, useCallback } from 'react';

/**
 * useHistoryStack
 *
 * Simplified undo/redo stack for layout state snapshots.
 * 
 * DATA STRUCTURE:
 * - past: Array of previous state snapshots (oldest first)
 * - present: Current state snapshot
 * - future: Array of future state snapshots (newest first, for redo)
 * 
 * Each history entry is just the state data itself - no metadata needed
 * since we only care about restoring layout snapshots.
 * 
 * USAGE PATTERN:
 *   const { present, set, undo, redo, canUndo, canRedo, clear } = useHistoryStack(initialState);
 * 
 * FIXED ISSUES:
 * 1. Removed metadata (label, source, timestamp) - only store state data
 * 2. Simplified data flow - no more moving metadata around unnecessarily
 * 3. Cleaner API - set() takes just the state, no optional parameters
 * 4. More predictable behavior - what you store is exactly what you get back
 */
function useHistoryStack<T>(initialPresent: T) {
  // Simplified: just store state snapshots, no metadata
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState<T>(initialPresent);
  const [future, setFuture] = useState<T[]>([]);

  /**
   * Set a new present state and push current to past
   * 
   * FIXED: Now only stores the state data itself, no metadata wrapper
   * 
   * @param newPresent - The new state snapshot to set as current
   */
  const set = useCallback((newPresent: T) => {
    // Push current state to past (no metadata wrapper)
    setPast(prev => [...prev, present]);
    // Set new present state (no metadata wrapper)
    setPresent(newPresent);
    // Clear redo stack when new state is set
    setFuture([]);
  }, [present]); // Removed past.length and future.length dependencies

  /**
   * Undo: move present to future, pop from past
   * 
   * FIXED: Returns the restored state immediately to avoid React's async state updates.
   * This prevents timing issues where history.present hasn't updated yet when checked.
   * 
   * FLOW:
   * 1. Take current present and add it to future (for redo)
   * 2. Take the last item from past and make it the new present
   * 3. Remove that item from past
   * 4. Return the new present state immediately
   */
  const undo = useCallback(() => {
    if (past.length === 0) {
      return null;
    }
    
    // Get the previous state from past
    const previousState = past[past.length - 1];
    
    // Update all state atomically
    setPast(prevPast => prevPast.slice(0, -1));
    setFuture(prevFuture => [present, ...prevFuture]);
    setPresent(previousState);
    
    // Return the new present state immediately
    return previousState;
  }, [present, past]);

  /**
   * Redo: move present to past, shift from future
   * 
   * FIXED: Returns the restored state immediately to avoid React's async state updates.
   * This prevents timing issues where history.present hasn't updated yet when checked.
   * 
   * FLOW:
   * 1. Take current present and add it to past
   * 2. Take the first item from future and make it the new present
   * 3. Remove that item from future
   * 4. Return the new present state immediately
   */
  const redo = useCallback(() => {
    if (future.length === 0) {
      return null;
    }
    
    // Get the next state from future
    const nextState = future[0];
    
    // Update all state atomically
    setPast(prevPast => [...prevPast, present]);
    setPresent(nextState);
    setFuture(prevFuture => prevFuture.slice(1));
    
    // Return the new present state immediately
    return nextState;
  }, [present, future]);

  /**
   * Jump to a specific entry in the history (by flat index)
   * 
   * This creates a flat array of all history entries and jumps to a specific index.
   * Useful for debugging or advanced history navigation.
   * 
   * @param idx - Index in the flat history array
   */
  const jumpTo = useCallback((idx: number) => {
    // Compose flat history: past + present + future
    const all = [...past, present, ...future];
    if (idx < 0 || idx >= all.length) return;
    // Split the flat array at the target index
    setPast(all.slice(0, idx));
    setPresent(all[idx]);
    setFuture(all.slice(idx + 1));
  }, [past, present, future]);

  /**
   * Clear all history
   * 
   * Resets past and future arrays, keeping only the current present.
   */
  const clear = useCallback(() => {
    setPast([]);
    setFuture([]);
  }, []);

  // Computed properties for UI state
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  return {
    present,
    set,
    undo,
    redo,
    canUndo,
    canRedo,
    clear,
    setPresent,
    setPast,
    setFuture,
    past,
    future,
    jumpTo,
  };
}

export default useHistoryStack; 