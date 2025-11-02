// useDragAndDrop.ts
//
// Custom React hook for managing drag-and-drop logic in the admin UI.
// Handles dragging components from the palette, reordering, and drop targets.
// Used by AdminView and PhonePreviewContent for layout editing.

import { useState, useRef, useEffect } from 'react';
import { FormblockerComponents, initialComponentProps } from 'src/data/Components';
import type { LayoutState } from '../LayoutContext';

interface DragAndDropProps {
  dropped: Array<{ name: string; Component: React.ComponentType<any>; props: any }>;
  dispatch: (action: { type: 'UPDATE'; payload: Partial<LayoutState> }) => void;
}

/**
 * useDragAndDrop
 *
 * Provides state and handlers for drag-and-drop interactions in the admin UI.
 * Supports dragging from the palette, reordering, and visual feedback.
 *
 * @param dropped - current dropped components array
 * @param setDropped - setter for dropped components array
 * @param setSelectedIdx - setter for selected index
 */
export const useDragAndDrop = ({ dropped, dispatch }: DragAndDropProps) => {
  // Name of the component being dragged from the palette (if any)
  const [draggedName, setDraggedName] = useState<string | null>(null);
  // Index of the component being dragged within the layout (if any)
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  // Index of the component currently being dragged over
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  // Whether the phone preview is being dragged over
  const [isPhoneDragOver, setIsPhoneDragOver] = useState(false);
  // Counter to track nested drag enter/leave events
  const dragOverCounter = useRef(0);

  // Global drag end listener to ensure isPhoneDragOver is reset
  useEffect(() => {
    const handleGlobalDragEnd = () => {
      console.log('Global drag end detected');
      dragOverCounter.current = 0;
      setIsPhoneDragOver(false);
    };

    document.addEventListener('dragend', handleGlobalDragEnd);
    return () => {
      document.removeEventListener('dragend', handleGlobalDragEnd);
    };
  }, []);

  /**
   * Handles dropping a component onto the phone preview.
   * Supports both palette drags (by name) and reordering.
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedName && (FormblockerComponents as any)[draggedName]) {
      console.log('[DND] Palette drop:', draggedName, 'at', dragOverIdx);
      let newDropped;
      let newSelectedIdx;
      const newComponent = {
        name: draggedName,
        Component: (FormblockerComponents as any)[draggedName],
        props: { ...initialComponentProps[draggedName] }
      };
      if (dragOverIdx !== null && dragOverIdx >= 0 && dragOverIdx <= dropped.length) {
        newDropped = [...dropped];
        newDropped.splice(dragOverIdx, 0, newComponent);
        newSelectedIdx = dragOverIdx;
      } else {
        newDropped = [...dropped, newComponent];
        newSelectedIdx = newDropped.length - 1;
      }
      dispatch({ type: 'UPDATE', payload: { dropped: newDropped, selectedIdx: newSelectedIdx } });
    } else if (draggedIdx !== null && dragOverIdx !== null && draggedIdx !== dragOverIdx) {
      console.log('[DND] Reorder drop: from', draggedIdx, 'to', dragOverIdx);
      let newDropped = [...dropped];
      const [removed] = newDropped.splice(draggedIdx, 1);
      newDropped.splice(dragOverIdx, 0, removed);
      dispatch({ type: 'UPDATE', payload: { dropped: newDropped, selectedIdx: dragOverIdx } });
    }
    setDraggedName(null);
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  // Prevent default to allow drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Track drag enter events for visual feedback
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    dragOverCounter.current += 1;
    if (dragOverCounter.current === 1) {
      setIsPhoneDragOver(true);
    }
  };

  // Track drag leave events for visual feedback
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    dragOverCounter.current -= 1;
    if (dragOverCounter.current === 0) {
      setIsPhoneDragOver(false);
    }
  };

  // Reset drag state on drag end
  const handleDragEnd = () => {
    dragOverCounter.current = 0;
    setIsPhoneDragOver(false);
  };

  return {
    draggedName,
    setDraggedName,
    draggedIdx,
    setDraggedIdx,
    dragOverIdx,
    setDragOverIdx,
    isPhoneDragOver,
    handleDrop,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDragEnd,
    dragOverCounter
  };
}; 