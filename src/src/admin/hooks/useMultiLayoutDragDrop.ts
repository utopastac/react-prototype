// Module-level variable to store draggedName globally
let globalDraggedName: string | null = null;

import { useState, useCallback, useEffect, useRef } from 'react';
import { useMultiLayoutContext } from '../MultiLayoutContext';
import { FormblockerComponents, initialComponentProps } from 'src/data/Components';

/**
 * MultiLayoutDragDropState Interface
 * 
 * Defines the state for multi-layout drag-and-drop operations.
 */
export interface MultiLayoutDragDropState {
  /** Index of the layout being dragged from */
  draggedLayoutIndex: number | null;
  /** Index of the component being dragged */
  draggedComponentIndex: number | null;
  /** Index of the layout being dragged over */
  dragOverLayoutIndex: number | null;
  /** Index of the component position being dragged over */
  dragOverComponentIndex: number | null;
  /** Whether alt key is pressed (for copy vs move) */
  isAltPressed: boolean;
  /** Whether the drag is over a valid drop target */
  isDragOverValid: boolean;
}

/**
 * useMultiLayoutDragDrop Hook
 * 
 * Custom hook that handles drag-and-drop operations across multiple phone layouts.
 * Supports moving and copying components between different layouts.
 * 
 * Features:
 * - Cross-layout component movement
 * - Alt+drag for copying components
 * - Visual feedback for drag operations
 * - Validation of drop targets
 */
export const useMultiLayoutDragDrop = () => {
  const [multiLayoutState, dispatch] = useMultiLayoutContext();
  // Remove local draggedName state and ref
  // For visual feedback (optional)
  const [dragOverLayoutIndex, setDragOverLayoutIndex] = useState<number | null>(null);

  // Add global dragend listener to clear draggedName
  useEffect(() => {
    const handleGlobalDragEnd = () => {
      console.log('[DND] Global dragend - clearing draggedName and dragOverLayoutIndex');
      dispatch({ type: 'SET_DRAGGED_NAME', name: null });
      setDragOverLayoutIndex(null);
    };
    window.addEventListener('dragend', handleGlobalDragEnd);
    return () => {
      window.removeEventListener('dragend', handleGlobalDragEnd);
    };
  }, [dispatch]);

  /**
   * Set dragged name (for palette drag)
   */
  const setDraggedNameWithLog = (name: string | null) => {
    console.log('[DND] setDraggedName:', name);
    dispatch({ type: 'SET_DRAGGED_NAME', name });
  };

  /**
   * Handle drop from palette onto a phone
   */
  const handleDrop = (layoutIndex: number, dropPosition: number | null, e: React.DragEvent) => {
    e.preventDefault();
    const name = multiLayoutState.draggedName;
    console.log('[DND] handleDrop called. draggedName:', name, 'layoutIndex:', layoutIndex, 'dropPosition:', dropPosition);
    if (!name) return;
    const Component = (FormblockerComponents as any)[name];
    const props = initialComponentProps[name] || {};
    if (!Component) {
      console.log('[DND] No component found for', name);
      return;
    }
    const layout = multiLayoutState.layouts[layoutIndex];
    const newDropped = [...layout.dropped];
    
    // Insert at the specified position, or at the end if no position specified
    const insertIndex = dropPosition !== null ? dropPosition : newDropped.length;
    newDropped.splice(insertIndex, 0, { name, Component, props });
    
    dispatch({
      type: 'UPDATE_LAYOUT',
      index: layoutIndex,
      payload: { dropped: newDropped }
    });
    setDraggedNameWithLog(null);
    setDragOverLayoutIndex(null);
  };

  // Allow drop
  const handleDragOver = (layoutIndex: number, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy'; // Ensure browser allows drop
    setDragOverLayoutIndex(layoutIndex);
  };

  // Clear drag over
  const handleDragLeave = () => {
    console.log('[DND] handleDragLeave - clearing dragOverLayoutIndex');
    setDragOverLayoutIndex(null);
  };

  return {
    draggedName: multiLayoutState.draggedName,
    setDraggedName: setDraggedNameWithLog,
    dragOverLayoutIndex,
    handleDrop,
    handleDragOver,
    handleDragLeave,
  };
}; 