import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMultiLayoutContext, useActiveLayout } from './MultiLayoutContext';
import PhonePreviewContent from './PhonePreviewContent';
import styles from './index.module.sass';
import multiStyles from './multi.module.sass';
import TopBar from 'src/components/TopBar';
import ButtonGroup from 'src/components/ButtonGroup';
import Toast from 'src/components/Toast';
import IOSStatusBar from 'src/components/IOSStatusBar';
import IOSHomeIndicator from 'src/components/IOSHomeIndicator';
import Icon, { ICON_16, ICON_24, ICON_ADMIN, ICON_SUBTLE } from 'src/components/Icon';
import * as Icons from 'src/data/Icons';
import ToolbarButton from './components/ToolbarButton';
import { useMultiLayoutDragDrop } from './hooks/useMultiLayoutDragDrop';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import gsap from "gsap";
import { AdminTemplates } from './Templates';
import EditableLabel from './components/EditableLabel';
import { useAdminTheme } from './AdminThemeContext';

/**
 * MultiPhonePreview
 *
 * Renders multiple phone previews in a grid layout, each with independent state.
 * Supports drag-and-drop between phones, individual selection, and prop editing.
 * 
 * Features:
 * - Infinite grid layout with scrolling in both directions
 * - Individual phone selection and editing
 * - Cross-phone drag-and-drop
 * - Visual feedback for active/selected phones
 * - Responsive design
 * - Clickable empty spaces to add new layouts at specific positions
 * - Zoom functionality for overview and detailed views
 */

// Update prop types
type SelectedSpecial = { phoneIndex: number, type: 'topbar' | 'bottombuttons' | 'toast' | 'statusbar' } | null;
interface MultiPhonePreviewProps {
  /** Whether to show phone names/labels */
  showLabels?: boolean;
  /** Callback when a phone is selected */
  onPhoneSelect?: (index: number) => void;
  selected: { phoneIndex: number, componentIndex: number } | null;
  setSelected: (sel: { phoneIndex: number, componentIndex: number } | null) => void;
  setSelectedSpecial: (v: SelectedSpecial) => void;
  selectedSpecial: SelectedSpecial;
  isAltPressed: boolean;
  setIsAltPressed: React.Dispatch<React.SetStateAction<boolean>>;
  onCanvasClick?: () => void;
  onOpenInsertModal?: (phoneIndex: number, componentIndex: number, e: React.MouseEvent) => void;
  layoutPositions?: Record<number, { row: number, col: number }>;
  gridRows?: number;
  gridCols?: number;
  onAddLayoutAt?: (row: number, col: number, templateName?: string) => void;
  onDuplicateLayoutAt?: (index: number) => void;
}

// Grid position interface
interface GridPosition {
  row: number;
  col: number;
}

const ZOOM_STEP = 1.3; // 20% per step, adjust as desired

const MultiPhonePreview: React.FC<MultiPhonePreviewProps> = (props) => {
  const {
    showLabels = true,
    onPhoneSelect,
    selected,
    setSelected,
    setSelectedSpecial,
    selectedSpecial,
    isAltPressed,
    setIsAltPressed
  } = props;
  const [multiLayoutState, dispatch] = useMultiLayoutContext();
  const { index: activeIndex } = useActiveLayout();
  const dragDrop = useMultiLayoutDragDrop();
  const adminTheme = useAdminTheme();
  
  // Per-phone selectedIdx state for prop editing
  const [selectedIdxs, setSelectedIdxs] = useState<(number | null)[]>(() =>
    multiLayoutState.layouts.map(() => null)
  );
  useEffect(() => {
    setSelectedIdxs(idxs => {
      if (idxs.length !== multiLayoutState.layouts.length) {
        return multiLayoutState.layouts.map((_, i) => idxs[i] ?? null);
      }
      return idxs;
    });
  }, [multiLayoutState.layouts.length]);
  
  // Local state for multi-phone interactions
  const [selectedPhoneIndex, setSelectedPhoneIndex] = useState<number | null>(null);
  
  // Grid position mapping - maps layout index to grid position
  // const [layoutPositions, setLayoutPositions] = useState<Map<number, GridPosition>>(new Map());

  // Zoom state
  const [zoomLevel, setZoomLevel] = useState(0.8);
  const [isZoomedOut, setIsZoomedOut] = useState(false);

  // Layout drag-and-drop state
  const [draggedLayoutIndex, setDraggedLayoutIndex] = useState<number | null>(null);
  const [dragOverGridPosition, setDragOverGridPosition] = useState<{ row: number, col: number } | null>(null);

  // Initialize first layout position if none exists
  useEffect(() => {
    if (multiLayoutState.layouts.length > 0 && Object.keys(multiLayoutState.layoutPositions).length === 0) {
      // dispatch({ type: 'SET_LAYOUT_POSITIONS', positions: new Map([[0, { row: 0, col: 0 }]]) });
    }
  }, [multiLayoutState.layouts.length, Object.keys(multiLayoutState.layoutPositions).length]);

  // Effect to auto-size the input width
  useEffect(() => {
    // No longer needed as EditableLabel handles its own sizing
  }, [multiLayoutState.layoutNames.length]);

  // Select all text in rename input when it appears
  useEffect(() => {
    // No longer needed as EditableLabel handles its own selection
  }, []);

  // Keyboard shortcuts for zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '=':
          case '+':
            e.preventDefault();
            handleZoomIn();
            break;
          case '-':
            e.preventDefault();
            handleZoomOut();
            break;
          case '0':
            e.preventDefault();
            handleZoomReset();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomLevel]);

  // Refs for drag-and-drop
  const phoneRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Ref for the scroll container
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomHideLevel = 0.5;
  // Replace lastCenterOffsetRef with a ref for center and zoom
  const lastCenterRef = useRef<{centerX: number, centerY: number, prevZoom: number} | null>(null);

  // Helper to find the layout closest to the center of the container
  function getClosestLayoutToCenter() {
    const container = containerRef.current;
    if (!container) return 0;
    const containerCenterX = container.scrollLeft + container.clientWidth / 2;
    const containerCenterY = container.scrollTop + container.clientHeight / 2;
    let minDist = Infinity;
    let closestIdx = 0;
    for (let i = 0; i < phoneRefs.current.length; i++) {
      const node = phoneRefs.current[i];
      if (!node) continue;
      const nodeCenterX = node.offsetLeft * zoomLevel + (node.offsetWidth * zoomLevel) / 2;
      const nodeCenterY = node.offsetTop * zoomLevel + (node.offsetHeight * zoomLevel) / 2;
      const dx = nodeCenterX - containerCenterX;
      const dy = nodeCenterY - containerCenterY;
      const dist = dx * dx + dy * dy;
      if (dist < minDist) {
        minDist = dist;
        closestIdx = i;
      }
    }
    return closestIdx;
  }

  // Zoom handlers
  const handleZoomIn = () => {
    const container = containerRef.current;
    if (container) {
      lastCenterRef.current = {
        centerX: container.scrollLeft + container.clientWidth / 2,
        centerY: container.scrollTop + container.clientHeight / 2,
        prevZoom: zoomLevel
      };
    }
    setZoomLevel(prev => {
      const newLevel = Math.min(prev * ZOOM_STEP, 3);
      setIsZoomedOut(newLevel < zoomHideLevel);
      return newLevel;
    });
  };

  const handleZoomOut = () => {
    const container = containerRef.current;
    if (container) {
      lastCenterRef.current = {
        centerX: container.scrollLeft + container.clientWidth / 2,
        centerY: container.scrollTop + container.clientHeight / 2,
        prevZoom: zoomLevel
      };
    }
    setZoomLevel(prev => {
      const newLevel = Math.max(prev / ZOOM_STEP, 0.1);
      setIsZoomedOut(newLevel < zoomHideLevel);
      return newLevel;
    });
  };

  const handleZoomReset = () => {
    const container = containerRef.current;
    if (container) {
      lastCenterRef.current = {
        centerX: container.scrollLeft + container.clientWidth / 2,
        centerY: container.scrollTop + container.clientHeight / 2,
        prevZoom: zoomLevel
      };
    }
    setZoomLevel(1);
    setIsZoomedOut(false);
  };

  const handleFitToScreen = () => {
    // Use the calculated grid dimensions
    if (multiLayoutState.gridRows === 0 || multiLayoutState.gridCols === 0) return;
    
    // Calculate the grid size needed (including the extra row/column)
    const gridWidth = multiLayoutState.gridCols * 300 + (multiLayoutState.gridCols - 1) * 80; // 300px width + 80px gap
    const gridHeight = multiLayoutState.gridRows * 500 + (multiLayoutState.gridRows - 1) * 80; // 500px height + 80px gap
    
    // Get container dimensions
    const container = containerRef.current;
    if (!container) return;
    
    const containerWidth = container.clientWidth - 112; // Account for padding
    const containerHeight = container.clientHeight - 112;
    
    // Calculate zoom level to fit
    const zoomX = containerWidth / gridWidth;
    const zoomY = containerHeight / gridHeight;
    const newZoom = Math.min(zoomX, zoomY, 1); // Don't zoom in beyond 100%
    
    setZoomLevel(newZoom);
    setIsZoomedOut(newZoom < 0.8);
  };

  /**
   * Handle phone selection
   */
  const handlePhoneSelect = (index: number) => {
    setSelectedPhoneIndex(index);
    dispatch({ type: 'SET_ACTIVE_LAYOUT', index });
    onPhoneSelect?.(index);
  };

  /**
   * Handle phone double-click for full-screen editing
   */
  const handlePhoneDoubleClick = (index: number) => {
    // (Removed unused onPhoneDoubleClick reference)
  };

  /**
   * Handle component actions within a phone
   */
  const handleComponentAction = (phoneIndex: number, action: string, componentIndex: number) => {
    const layout = multiLayoutState.layouts[phoneIndex];
    const newDropped = [...layout.dropped];
    
    switch (action) {
      case 'delete':
        newDropped.splice(componentIndex, 1);
        break;
      case 'duplicate':
        const component = newDropped[componentIndex];
        newDropped.splice(componentIndex + 1, 0, { ...component });
        break;
      case 'moveUp':
        if (componentIndex > 0) {
          [newDropped[componentIndex - 1], newDropped[componentIndex]] = 
            [newDropped[componentIndex], newDropped[componentIndex - 1]];
        }
        break;
      case 'moveDown':
        if (componentIndex < newDropped.length - 1) {
          [newDropped[componentIndex], newDropped[componentIndex + 1]] = 
            [newDropped[componentIndex + 1], newDropped[componentIndex]];
        }
        break;
    }
    
    dispatch({
      type: 'UPDATE_LAYOUT',
      index: phoneIndex,
      payload: { dropped: newDropped }
    });
  };

  // Add at the top of the component:
  const [componentDrag, setComponentDrag] = useState<{
    sourcePhoneIdx: number | null,
    draggedIdx: number | null,
    targetPhoneIdx: number | null,
    dragOverIdx: number | null,
    isAltPressed: boolean
  }>({ sourcePhoneIdx: null, draggedIdx: null, targetPhoneIdx: null, dragOverIdx: null, isAltPressed: false });

  // Replace per-phone drag state for components with this new state.

  // Keep arrays in sync with layouts
  useEffect(() => {
    // setDraggedIdxArr(arr => arr.length === multiLayoutState.layouts.length ? arr : multiLayoutState.layouts.map((_, i) => arr[i] ?? null));
    // setDragOverIdxArr(arr => arr.length === multiLayoutState.layouts.length ? arr : multiLayoutState.layouts.map((_, i) => arr[i] ?? null));
  }, [multiLayoutState.layouts.length]);

  // Global drag end listener to clear all drag over states
  useEffect(() => {
    const handleGlobalDragEnd = () => {
      console.log('[MultiPhonePreview] Global dragend - clearing all dragOverIdxArr');
      // setDragOverIdxArr(multiLayoutState.layouts.map(() => null));
    };
    window.addEventListener('dragend', handleGlobalDragEnd);
    return () => {
      window.removeEventListener('dragend', handleGlobalDragEnd);
    };
  }, [multiLayoutState.layouts.length]);

  // Drag-and-drop handlers for reordering within a phone
  const handleDragStart = (phoneIdx: number, idx: number, altKey: boolean) => {
    // setDraggedIdxArr(arr => { const newArr = [...arr]; newArr[phoneIdx] = idx; return newArr; });
    setIsAltPressed(altKey);
  };
  const handleDragOver = (phoneIdx: number, idx: number, altKey: boolean) => {
    // setDragOverIdxArr(arr => { const newArr = [...arr]; newArr[phoneIdx] = idx; return newArr; });
    setIsAltPressed(altKey);
  };
  const handleDragLeave = (phoneIdx: number) => {
    // setDragOverIdxArr(arr => { const newArr = [...arr]; newArr[phoneIdx] = null; return newArr; });
  };
  const handleDragEnd = (phoneIdx: number) => {
    // setDraggedIdxArr(arr => { const newArr = [...arr]; newArr[phoneIdx] = null; return newArr; });
    // setDragOverIdxArr(arr => { const newArr = [...arr]; newArr[phoneIdx] = null; return newArr; });
    setIsAltPressed(false);
  };
  const handleDrop = (phoneIdx: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const draggedIdx = componentDrag.draggedIdx;
    const dragOverIdx = componentDrag.dragOverIdx;
    if (dragDrop.draggedName) {
      // Pass the drop position to the multi-layout drag-and-drop system
      dragDrop.handleDrop(phoneIdx, dragOverIdx, e);
      return;
    }
    if (draggedIdx !== null && dragOverIdx !== null) {
      const layout = multiLayoutState.layouts[phoneIdx];
      let newDropped = [...layout.dropped];
      if (isAltPressed) {
        // Duplicate: always allow, even if dropping on same index
        const componentToCopy = newDropped[draggedIdx];
        newDropped.splice(dragOverIdx, 0, { ...componentToCopy });
        dispatch({ type: 'UPDATE_LAYOUT', index: phoneIdx, payload: { dropped: newDropped } });
        setSelected({ phoneIndex: phoneIdx, componentIndex: dragOverIdx });
      } else if (draggedIdx !== dragOverIdx) {
        // Move: only if different
        const [removed] = newDropped.splice(draggedIdx, 1);
        newDropped.splice(dragOverIdx, 0, removed);
        dispatch({ type: 'UPDATE_LAYOUT', index: phoneIdx, payload: { dropped: newDropped } });
        const currSel = selected;
        if (currSel && currSel.phoneIndex === phoneIdx) {
          setSelected({ phoneIndex: phoneIdx, componentIndex: dragOverIdx });
        }
      }
    }
    handleDragEnd(phoneIdx);
  };

  // Update drag handlers for components:
  const handleComponentDragStart = (phoneIdx: number, idx: number, altKey: boolean) => {
    setComponentDrag({
      sourcePhoneIdx: phoneIdx,
      draggedIdx: idx,
      targetPhoneIdx: phoneIdx,
      dragOverIdx: idx,
      isAltPressed: altKey
    });
  };
  const handleComponentDragOver = (phoneIdx: number, idx: number, altKey: boolean) => {
    setComponentDrag(prev => ({
      ...prev,
      targetPhoneIdx: phoneIdx,
      dragOverIdx: idx,
      isAltPressed: altKey
    }));
  };
  const handleComponentDragLeave = () => {
    setComponentDrag(prev => ({ ...prev, dragOverIdx: null }));
  };
  const handleComponentDragEnd = () => {
    setComponentDrag({ sourcePhoneIdx: null, draggedIdx: null, targetPhoneIdx: null, dragOverIdx: null, isAltPressed: false });
  };

  // Update drop handler for components to support cross-layout moves/copies:
  const handleComponentDrop = (phoneIdx: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dragDrop.draggedName) {
      // Handle palette drag-and-drop
      dragDrop.handleDrop(phoneIdx, componentDrag.dragOverIdx, e);
      handleComponentDragEnd();
      return;
    }
    const { sourcePhoneIdx, draggedIdx, targetPhoneIdx, dragOverIdx, isAltPressed } = componentDrag;
    if (
      sourcePhoneIdx !== null &&
      draggedIdx !== null &&
      targetPhoneIdx !== null &&
      dragOverIdx !== null
    ) {
      if (sourcePhoneIdx === targetPhoneIdx) {
        // Intra-layout move/copy (same as before)
        const layout = multiLayoutState.layouts[phoneIdx];
        let newDropped = [...layout.dropped];
        if (isAltPressed) {
          const componentToCopy = newDropped[draggedIdx];
          newDropped.splice(dragOverIdx, 0, { ...componentToCopy });
          dispatch({ type: 'UPDATE_LAYOUT', index: phoneIdx, payload: { dropped: newDropped } });
          setSelected({ phoneIndex: phoneIdx, componentIndex: dragOverIdx });
        } else if (draggedIdx !== dragOverIdx) {
          const [removed] = newDropped.splice(draggedIdx, 1);
          newDropped.splice(dragOverIdx, 0, removed);
          dispatch({ type: 'UPDATE_LAYOUT', index: phoneIdx, payload: { dropped: newDropped } });
          const currSel = selected;
          if (currSel && currSel.phoneIndex === phoneIdx) {
            setSelected({ phoneIndex: phoneIdx, componentIndex: dragOverIdx });
          }
        }
      } else {
        // Cross-layout move/copy
        const sourceLayout = multiLayoutState.layouts[sourcePhoneIdx];
        const targetLayout = multiLayoutState.layouts[targetPhoneIdx];
        let sourceDropped = [...sourceLayout.dropped];
        let targetDropped = [...targetLayout.dropped];
        const componentToMove = sourceDropped[draggedIdx];
        if (isAltPressed) {
          // Copy
          targetDropped.splice(dragOverIdx, 0, { ...componentToMove });
        } else {
          // Move
          sourceDropped.splice(draggedIdx, 1);
          targetDropped.splice(dragOverIdx, 0, componentToMove);
        }
        dispatch({ type: 'UPDATE_LAYOUT', index: sourcePhoneIdx, payload: { dropped: sourceDropped } });
        dispatch({ type: 'UPDATE_LAYOUT', index: targetPhoneIdx, payload: { dropped: targetDropped } });
        setSelected({ phoneIndex: targetPhoneIdx, componentIndex: dragOverIdx });
      }
    }
    handleComponentDragEnd();
  };

  // Scroll selected or active phone into view when selection changes (with GSAP)
  useEffect(() => {
    const indexToScroll = selected?.phoneIndex ?? activeIndex;
    const node = phoneRefs.current[indexToScroll];
    const container = containerRef.current;
    if (node && container) {
      // Calculate the offset to center the node horizontally and vertically
      const nodeRect = node.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const nodeCenterX = nodeRect.left + nodeRect.width / 2;
      const containerCenterX = containerRect.left + containerRect.width / 2;
      const scrollOffsetX = nodeCenterX - containerCenterX;

      const nodeCenterY = nodeRect.top + nodeRect.height / 2;
      const containerCenterY = containerRect.top + containerRect.height / 2;
      const scrollOffsetY = nodeCenterY - containerCenterY;

      // Animate both scrollLeft and scrollTop
      gsap.to(container, {
        scrollLeft: container.scrollLeft + scrollOffsetX,
        scrollTop: container.scrollTop + scrollOffsetY,
        duration: 0.3,
        ease: "power4.Out"
      });
    }
  }, [selected?.phoneIndex, activeIndex, multiLayoutState.layouts.length]);

  /**
   * Handle clicking on empty grid space to add a new layout at the specific position
   */
  const handleEmptySpaceClick = (
    e: React.MouseEvent,
    gridRow: number,
    gridCol: number,
    templateName?: string
  ) => {
    e.stopPropagation();
    if (props.onAddLayoutAt) {
      props.onAddLayoutAt(gridRow, gridCol, templateName);
    } else {
      // fallback (legacy, should not be used)
      const nextIndex = multiLayoutState.layouts.length;
      dispatch({ type: 'ADD_LAYOUT', name: templateName ?? `Layout ${nextIndex + 1}` });
    }
  };

  /**
   * Handle duplicating a layout - place it to the right
   */
  const handleDuplicateLayout = (index: number) => {
    if (props.onDuplicateLayoutAt) {
      props.onDuplicateLayoutAt(index);
    } else {
      // fallback (legacy, should not be used)
      dispatch({ type: 'DUPLICATE_LAYOUT_AT_POSITION', index, position: index + 1 });
    }
  };

  /**
   * Layout drag-and-drop handlers
   */
  const handleLayoutDragStart = (layoutIndex: number, e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDraggedLayoutIndex(layoutIndex);
    e.dataTransfer.setData('text/plain', layoutIndex.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleLayoutDragEnd = () => {
    setDraggedLayoutIndex(null);
    setDragOverGridPosition(null);
  };

  const handleLayoutDragOver = (e: React.DragEvent, gridRow: number, gridCol: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverGridPosition({ row: gridRow, col: gridCol });
  };

  const handleLayoutDrop = (e: React.DragEvent, gridRow: number, gridCol: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    const layoutIndex = parseInt(e.dataTransfer.getData('text/plain'));
    console.log('[DROP] layoutIndex:', layoutIndex, 'to', gridRow, gridCol); // LOG
    
    if (!isNaN(layoutIndex) && layoutIndex >= 0 && layoutIndex < multiLayoutState.layouts.length) {
      dispatch({ 
        type: 'MOVE_LAYOUT_TO_POSITION', 
        layoutIndex, 
        newPosition: { row: gridRow, col: gridCol } 
      });
    }
    
    setDraggedLayoutIndex(null);
    setDragOverGridPosition(null);
    setHoveredCell(null);
  };

  // Calculate grid dimensions and items with positions
  const { gridItems, gridDimensions } = useMemo(() => {
    const items: Array<{
      type: 'phone' | 'empty';
      index?: number;
      row: number;
      col: number;
      gridIndex: number;
    }> = [];
    
    // Calculate the actual grid bounds based on layout positions
    let minRow = 0, maxRow = 0;
    let minCol = 0, maxCol = 0;
    
    if (Object.keys(multiLayoutState.layoutPositions).length > 0) {
      minRow = Infinity;
      maxRow = -Infinity;
      minCol = Infinity;
      maxCol = -Infinity;
      
      for (const pos of Object.values(multiLayoutState.layoutPositions)) {
        minRow = Math.min(minRow, pos.row);
        maxRow = Math.max(maxRow, pos.row);
        minCol = Math.min(minCol, pos.col);
        maxCol = Math.max(maxCol, pos.col);
      }
    }
    
    // Add one extra row and column for empty spaces
    const gridRows = maxRow + 2; // +1 for current max, +1 for extra
    const gridCols = maxCol + 2; // +1 for current max, +1 for extra
    
    // Ensure minimum grid size of 2x2
    const finalRows = Math.max(gridRows, 2);
    const finalCols = Math.max(gridCols, 2);
    
    // Create the dynamic grid
    for (let row = 0; row < finalRows; row++) {
      for (let col = 0; col < finalCols; col++) {
        // Check if there's a layout at this position
        let layoutIndex = -1;
        for (const [index, pos] of Object.entries(multiLayoutState.layoutPositions)) {
          const idx = parseInt(index, 10);
          if (
            idx >= 0 &&
            idx < multiLayoutState.layouts.length &&
            pos.row === row &&
            pos.col === col
          ) {
            layoutIndex = idx;
            break;
          }
        }
        if (layoutIndex >= 0) {
          // This is a phone layout
          items.push({ 
            type: 'phone', 
            index: layoutIndex, 
            row, 
            col,
            gridIndex: row * finalCols + col 
          });
        } else {
          // This is an empty space
          items.push({ 
            type: 'empty', 
            row, 
            col,
            gridIndex: row * finalCols + col 
          });
        }
      }
    }
    
    return {
      gridItems: items,
      gridDimensions: { rows: finalRows, cols: finalCols }
    };
  }, [multiLayoutState.layouts.length, multiLayoutState.layoutPositions]);

  // Track which empty cell is hovered
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  // Add useEffect to scroll after zoom changes
  useEffect(() => {
    if (!lastCenterRef.current) return;
    const container = containerRef.current;
    if (container) {
      const { centerX, centerY, prevZoom } = lastCenterRef.current;
      const scale = zoomLevel / prevZoom;
      const newCenterX = centerX * scale;
      const newCenterY = centerY * scale;
      // Set scroll position directly (no animation)
      container.scrollLeft = newCenterX - container.clientWidth / 2;
      container.scrollTop = newCenterY - container.clientHeight / 2;
    }
    lastCenterRef.current = null;
  }, [zoomLevel]);

  return (
    <>
      {/* Zoom Controls */}
      <div className={multiStyles.ZoomControls}>
        <ToolbarButton
          title="Zoom In (⌘ =)"
          onClick={handleZoomIn}
          disabled={zoomLevel >= 3}
          icon={Icons.Add24}
          iconColor={ICON_ADMIN}
          position="left"
        />
        <ToolbarButton
          title="Zoom Out (⌘ -)"
          onClick={handleZoomOut}
          disabled={zoomLevel <= 0.1}
          icon={Icons.Subtract32}
          iconColor={ICON_ADMIN}
          position="left"
        />
        <ToolbarButton
          title="Reset Zoom (⌘ 0)"
          onClick={handleZoomReset}
          icon={Icons.Borrow24}
          iconColor={ICON_ADMIN}
          position="left"
        />
        <ToolbarButton
          title="Fit to Screen"
          onClick={handleFitToScreen}
          icon={Icons.NumberPad24}
          iconColor={ICON_ADMIN}
          position="left"
        />
        <div className={multiStyles.ZoomLevel}>
          {Math.round(zoomLevel * 100)}%
        </div>
      </div>

      <div
        className={multiStyles.MultiPhonePreview}
        ref={containerRef}
        onClick={e => {
          // Only trigger if the click is on the container itself, not a phone or child
          if (e.target === e.currentTarget && props.onCanvasClick) {
            props.onCanvasClick();
          }
        }}
      >
        <div 
          className={multiStyles.GridContent}
          style={{
            transform: `scale(${zoomLevel})`,
            gridTemplateColumns: `repeat(${gridDimensions.cols}, var(--view-width))`,
            gridTemplateRows: `repeat(${gridDimensions.rows}, var(--view-height))`,
            gap: adminTheme.layoutSpacing,
          }}
        >
          <AnimatePresence>
            {gridItems.map((item) => {
            if (item.type === 'phone' && item.index !== undefined) {
              const index = item.index;
              const layout = multiLayoutState.layouts[index];
              const isActive = index === activeIndex;
              
              return (
                <div
                  key={`phone-${index}`}
                  ref={el => phoneRefs.current[index] = el}
                  className={[
                    multiStyles.MultiPhoneItem,
                    // Only apply DraggedLayout if a layout is being dragged, not during component drags
                    draggedLayoutIndex === index && draggedLayoutIndex !== null ? multiStyles.DraggedLayout : ''
                  ].filter(Boolean).join(' ')}
                  style={{
                    gridRow: item.row + 1,
                    gridColumn: item.col + 1,
                  }}
                  onClick={() => handlePhoneSelect(index)}
                  // draggable removed from here
                  // onDragStart and onDragEnd removed from here
                  onDragOver={e => {
                    if (draggedLayoutIndex !== null) {
                      handleLayoutDragOver(e, item.row, item.col);
                    }
                  }}
                  onDrop={e => {
                    if (draggedLayoutIndex !== null) {
                      handleLayoutDrop(e, item.row, item.col);
                    }
                  }}
                >
                  {/* Phone Label */}
                  {showLabels && !isZoomedOut && (
                    <div
                      className={multiStyles.PhoneLabel}
                      style={{
                        transform: `scale(${1 / zoomLevel})`,
                        transformOrigin: 'top left',
                        cursor: 'grab',
                      }}
                      draggable
                      onDragStart={e => handleLayoutDragStart(index, e)}
                      onDragEnd={handleLayoutDragEnd}
                      data-label="Drag to move layout"
                    >
                      <EditableLabel
                        label={multiLayoutState.layoutNames[index]}
                        onRenameFinish={newName => dispatch({ type: 'RENAME_LAYOUT', index, name: newName })}
                        onRenameCancel={() => {}}
                        className={isActive ? multiStyles.ActiveLabel : undefined}
                      />
                    </div>
                  )}
                  <div
                    className={[
                      styles.PhonePreview,
                      isActive ? multiStyles.ActivePhone : multiStyles.InactivePhone,
                      (dragDrop.dragOverLayoutIndex === index || dragOverGridPosition?.row === item.row) ? styles.PhonePreviewDragOver : undefined
                    ].filter((v): v is string => Boolean(v)).join(' ')}
                    style={{ boxShadow: adminTheme.phoneShadow }}
                    onDrop={e => handleComponentDrop(index, e)}
                    onDragOver={e => {
                      if (dragDrop.draggedName) {
                        dragDrop.handleDragOver(index, e);
                      } else {
                        e.preventDefault();
                      }
                    }}
                    onDragLeave={e => {
                      if (dragDrop.draggedName) {
                        dragDrop.handleDragLeave();
                      } else {
                        handleDragLeave(index);
                      }
                    }}
                  >
                    <PhonePreviewContent
                      dropped={layout.dropped}
                      selectedIdx={selected && selected.phoneIndex === index ? selected.componentIndex : null}
                      setSelectedIdx={componentIndex => {
                        if (componentIndex === null) {
                          setSelected(null);
                        } else {
                          setSelected({ phoneIndex: index, componentIndex });
                        }
                      }}
                      draggedIdx={componentDrag.sourcePhoneIdx === index ? componentDrag.draggedIdx : null}
                      setDraggedIdx={val => handleComponentDragStart(index, val as number, isAltPressed)}
                      dragOverIdx={componentDrag.targetPhoneIdx === index ? componentDrag.dragOverIdx : null}
                      setDragOverIdx={val => handleComponentDragOver(index, val as number, isAltPressed)}
                      isAltPressed={componentDrag.isAltPressed}
                      setIsAltPressed={setIsAltPressed}
                      showTopBar={layout.showTopBar}
                      topBarProps={layout.topBarProps}
                      setSelectedSpecial={v => setSelectedSpecial(v ? { phoneIndex: index, type: v } : null)}
                      showBottomButtons={layout.showBottomButtons}
                      bottomButtonsProps={layout.bottomButtonsProps}
                      setDropped={(updater) => {
                        const newDropped = typeof updater === 'function' 
                          ? updater(layout.dropped) 
                          : updater;
                        dispatch({
                          type: 'UPDATE_LAYOUT',
                          index,
                          payload: { dropped: newDropped }
                        });
                      }}
                      styles={styles}
                      zoomLevel={zoomLevel}
                      isZoomedOut={isZoomedOut}
                      TopBar={TopBar}
                      ButtonGroup={ButtonGroup}
                      IOSStatusBar={IOSStatusBar}
                      showNotch={false}
                      IOSHomeIndicator={IOSHomeIndicator}
                      showComponentNames={false}
                      selectedSpecial={selectedSpecial?.phoneIndex === index ? selectedSpecial.type : null}
                      onOpenInsertModal={(e, componentIndex) => {
                        if (props.onOpenInsertModal) {
                          props.onOpenInsertModal(index, componentIndex, e);
                        }
                      }}
                      onDuplicate={(componentIndex) => handleComponentAction(index, 'duplicate', componentIndex)}
                      onDelete={(componentIndex) => handleComponentAction(index, 'delete', componentIndex)}
                      onDragEnd={handleComponentDragEnd}
                      showToast={layout.showToast}
                      toastProps={layout.toastProps}
                      Toast={Toast}
                      showStatusBar={layout.showStatusBar}
                      statusBarProps={layout.statusBarProps}
                    />
                  </div>
                  {/* Phone Actions */}
                  {!isZoomedOut && (
                    <div className={[
                      multiStyles.PhoneActions,
                      isActive ? multiStyles.active : ''
                    ].filter(Boolean).join(' ')}
                    style={{
                      transform: `scale(${1 / zoomLevel})`,
                      transformOrigin: 'center center',
                    }}>
                        <ToolbarButton
                          key={`duplicate-phone-${index}`}
                          title="Duplicate"
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            handleDuplicateLayout(index);
                          }}
                          icon={Icons.Copy16}
                          iconColor={ICON_ADMIN}
                          position="bottom"
                        />
                        <ToolbarButton
                          key={`delete-phone-${index}`}
                          title="Delete"
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            dispatch({ type: 'REMOVE_LAYOUT', index });
                          }}
                          icon={Icons.Clear16}
                          iconColor={ICON_ADMIN}
                          position="bottom"
                        />
                    </div>
                  )}
                </div>
              );
            } else {
              // Empty grid space
              const isHovered = hoveredCell && hoveredCell.row === item.row && hoveredCell.col === item.col;
              return (
                <motion.div
                  key={`empty-${item.gridIndex}`}
                  className={[
                    multiStyles.EmptyGridSpace,
                    draggedLayoutIndex !== null &&
                    dragOverGridPosition &&
                    dragOverGridPosition.row === item.row &&
                    dragOverGridPosition.col === item.col
                      ? multiStyles.DropTarget
                      : ''
                  ].filter(Boolean).join(' ')}
                  style={{
                    gridRow: item.row + 1,
                    gridColumn: item.col + 1,
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={() => setHoveredCell({ row: item.row, col: item.col })}
                  onMouseLeave={() => setHoveredCell(null)}
                  onClick={e => handleEmptySpaceClick(e, item.row, item.col)}
                  data-grid-row={item.row}
                  data-grid-col={item.col}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  onDragOver={e => handleLayoutDragOver(e, item.row, item.col)}
                  onDrop={e => {
                    if (draggedLayoutIndex !== null) {
                      handleLayoutDrop(e, item.row, item.col);
                    }
                  }}
                  onDragLeave={() => setDragOverGridPosition(null)}
                >
                  {!isZoomedOut && (
                    <>
                      {/* <div className={multiStyles.EmptySpaceIcon}>+</div> */}
                      {/* <div
                        className={multiStyles.EmptySpaceText}
                        style={{
                          transform: `scale(${1 / zoomLevel})`,
                          transformOrigin: 'center center',
                        }}
                      >
                        Add layout
                      </div> */}
                      {isHovered && (
                        <div
                          className={multiStyles.templatePicker}
                          onClick={e => e.stopPropagation()}
                        >
                          {(() => {
                            // Group templates by 'group', including 'Blank'
                            const grouped = AdminTemplates.reduce((acc, tmpl) => {
                              const group = tmpl.group || 'Other';
                              if (!acc[group]) acc[group] = [];
                              acc[group].push(tmpl);
                              return acc;
                            }, {} as Record<string, typeof AdminTemplates>);
                            return Object.entries(grouped).map(([group, templates]) => (
                              <div key={group}>
                                <h4
                                  className={multiStyles.templateGroupHeader}
                                  style={{
                                    transform: `scale(${1 / zoomLevel})`,
                                    marginBottom: 8/zoomLevel,
                                    transformOrigin: 'top left',
                                  }}
                                >
                                  {group}
                                </h4>
                                {templates.map(tmpl => (
                                  <div
                                    key={tmpl.name}
                                    className={multiStyles.templateRow}
                                    onClick={e => {
                                      e.stopPropagation();
                                      handleEmptySpaceClick(e, item.row, item.col, tmpl.name);
                                    }}
                                  >
                                    <span
                                      style={{
                                        transform: `scale(${1 / zoomLevel})`,
                                        transformOrigin: 'top left',
                                      }}>
                                      {tmpl.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ));
                          })()}
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              );
            }
          })}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default MultiPhonePreview; 