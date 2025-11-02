import React, { createContext, useReducer, useContext, Dispatch } from 'react';
import { LayoutState } from './LayoutContext';
import {
  INITIAL_TOP_BAR_PROPS,
  INITIAL_BOTTOM_BUTTONS_PROPS,
  INITIAL_TOAST_PROPS,
  INITIAL_STATUS_BAR_PROPS
} from './LayoutContext';

/**
 * AdminLayoutContext
 * 
 * Manages multiple layout states for the admin/editor interface.
 * This context supports multiple phone previews, each with independent state,
 * drag-and-drop, and prop editing capabilities.
 * 
 * SEPARATION OF CONCERNS:
 * - AdminLayoutState: Persistent data that defines multiple UI layouts
 * - Local State: Ephemeral UI state (selectedIdx, selectedSpecial, isAltPressed, etc.)
 * 
 * The layout state includes:
 * - Array of layout states (one per phone preview)
 * - Active layout selection
 * - Layout names for identification
 */

// ===== INITIAL VALUES =====

/** Default layout name template */
const DEFAULT_LAYOUT_NAME = (index: number) => `Layout ${index + 1}`;

/** Initial layout state with one default layout */
const INITIAL_LAYOUT_STATE = {
  layouts: [{
    dropped: [],
    showTopBar: true,
    topBarProps: INITIAL_TOP_BAR_PROPS,
    showBottomButtons: true,
    bottomButtonsProps: INITIAL_BOTTOM_BUTTONS_PROPS,
    showToast: false,
    toastProps: INITIAL_TOAST_PROPS,
    showStatusBar: true,
    statusBarProps: INITIAL_STATUS_BAR_PROPS,
    draggedName: null,
    description: '', // <-- add here
  }],
  activeLayoutIndex: 0, // -1 means no selection
  layoutNames: ['Layout 1'],
  draggedName: null,
  layoutPositions: { 0: { row: 0, col: 0 } },
  gridRows: 2,
  gridCols: 2,
};

/**
 * AdminLayoutState Interface
 * 
 * Defines the structure of persistent layout data.
 * This state is serialized for saving/loading layouts, URL sharing,
 * and history management (undo/redo).
 */
export interface AdminLayoutState {
  /** Array of layout states, one per phone preview */
  layouts: (LayoutState & { description?: string })[];
  /** Index of the currently active/selected layout */
  activeLayoutIndex: number;
  /** Names for each layout for display and identification */
  layoutNames: string[];
  /** Name of the layout currently being dragged */
  draggedName: string | null;
  layoutPositions: Record<number, { row: number, col: number }>;
  gridRows: number;
  gridCols: number;
}

// ===== REDUCER & ACTIONS =====

/**
 * AdminLayoutAction Types
 * 
 * Defines the actions that can be dispatched to update layout state.
 */
type AdminLayoutAction =
  | { type: 'ADD_LAYOUT', name?: string, index?: number }
  | { type: 'REMOVE_LAYOUT', index: number }
  | { type: 'SET_ACTIVE_LAYOUT', index: number }
  | { type: 'UPDATE_LAYOUT', index: number, payload: Partial<LayoutState> }
  | { type: 'DUPLICATE_LAYOUT', index: number }
  | { type: 'DUPLICATE_LAYOUT_AT_POSITION', index: number, position: number }
  | { type: 'REORDER_LAYOUTS', fromIndex: number, toIndex: number }
  | { type: 'RENAME_LAYOUT', index: number, name: string }
  | { type: 'RESET_ALL' }
  | { type: 'RESET_LAYOUT', index: number }
  | { type: 'SET_ALL_LAYOUTS', layouts: LayoutState[], names: string[], layoutPositions?: Record<number, { row: number, col: number }>, gridRows?: number, gridCols?: number }
  | { type: 'SET_DRAGGED_NAME', name: string | null }
  | { type: 'MOVE_LAYOUT_TO_POSITION', layoutIndex: number, newPosition: { row: number, col: number } }
  | { type: 'SWAP_LAYOUT_POSITIONS', layoutIndex1: number, layoutIndex2: number };

/**
 * AdminLayout Reducer
 * 
 * Handles state updates for the layout context.
 * 
 * @param state - Current layout state
 * @param action - Action to perform
 * @returns New layout state
 */
function adminLayoutReducer(state: AdminLayoutState, action: AdminLayoutAction): AdminLayoutState {
  switch (action.type) {
    case 'ADD_LAYOUT': {
      const newLayoutName = action.name || DEFAULT_LAYOUT_NAME(state.layouts.length);
      const insertIdx = typeof action.index === 'number' && action.index >= 0 && action.index <= state.layouts.length
        ? action.index
        : state.layouts.length;
      const newLayouts = [...state.layouts];
      const newNames = [...state.layoutNames];
      newLayouts.splice(insertIdx, 0, { ...INITIAL_LAYOUT_STATE.layouts[0] });
      newNames.splice(insertIdx, 0, newLayoutName);
      return {
        ...state,
        layouts: newLayouts,
        layoutNames: newNames,
        activeLayoutIndex: insertIdx, // Switch to new layout
        layoutPositions: { ...state.layoutPositions, [insertIdx]: { row: 0, col: 0 } },
        gridRows: 2,
        gridCols: 2,
      };
    }

    case 'REMOVE_LAYOUT': {
      if (state.layouts.length <= 1) return state; // Don't remove last layout
      
      const newLayouts = state.layouts.filter((_, index) => index !== action.index);
      const newNames = state.layoutNames.filter((_, index) => index !== action.index);
      
      // Adjust active index if needed
      let newActiveIndex = state.activeLayoutIndex;
      if (action.index <= state.activeLayoutIndex && state.activeLayoutIndex > 0) {
        newActiveIndex = state.activeLayoutIndex - 1;
      }
      
      return {
        ...state,
        layouts: newLayouts,
        layoutNames: newNames,
        activeLayoutIndex: newActiveIndex,
        layoutPositions: Object.fromEntries(Object.entries(state.layoutPositions).filter(([key]) => parseInt(key) !== action.index)),
        gridRows: 2,
        gridCols: 2,
      };
    }

    case 'SET_ACTIVE_LAYOUT': {
      // Allow -1 for no selection
      if (action.index < -1 || action.index >= state.layouts.length) return state;
      return {
        ...state,
        activeLayoutIndex: action.index
      };
    }

    case 'UPDATE_LAYOUT': {
      if (action.index < 0 || action.index >= state.layouts.length) return state;
      
      const newLayouts = [...state.layouts];
      newLayouts[action.index] = { ...newLayouts[action.index], ...action.payload };
      
      return {
        ...state,
        layouts: newLayouts,
        layoutPositions: { ...state.layoutPositions, [action.index]: state.layoutPositions[action.index] },
        gridRows: 2,
        gridCols: 2,
      };
    }

    case 'DUPLICATE_LAYOUT': {
      if (action.index < 0 || action.index >= state.layouts.length) return state;
      
      const layoutToDuplicate = state.layouts[action.index];
      const originalName = state.layoutNames[action.index];
      const newName = `${originalName} (Copy)`;
      
      return {
        ...state,
        layouts: [...state.layouts, { ...layoutToDuplicate, description: layoutToDuplicate.description || '' }],
        layoutNames: [...state.layoutNames, newName],
        activeLayoutIndex: state.layouts.length, // Switch to duplicated layout
        layoutPositions: { ...state.layoutPositions, [state.layouts.length]: { row: 0, col: 0 } },
        gridRows: 2,
        gridCols: 2,
      };
    }

    case 'DUPLICATE_LAYOUT_AT_POSITION': {
      if (action.index < 0 || action.index >= state.layouts.length) return state;
      if (action.position < 0 || action.position > state.layouts.length) return state;
      
      const layoutToDuplicate = state.layouts[action.index];
      const originalName = state.layoutNames[action.index];
      const newName = `${originalName} (Copy)`;
      
      const newLayouts = [...state.layouts];
      const newNames = [...state.layoutNames];
      
      newLayouts.splice(action.position, 0, { ...layoutToDuplicate });
      newNames.splice(action.position, 0, newName);
      
      return {
        ...state,
        layouts: newLayouts,
        layoutNames: newNames,
        activeLayoutIndex: action.position, // Switch to duplicated layout
        layoutPositions: { ...state.layoutPositions, [action.position]: { row: 0, col: 0 } },
        gridRows: 2,
        gridCols: 2,
      };
    }



    case 'REORDER_LAYOUTS': {
      const { fromIndex, toIndex } = action;
      if (fromIndex < 0 || fromIndex >= state.layouts.length || 
          toIndex < 0 || toIndex >= state.layouts.length) return state;
      
      const newLayouts = [...state.layouts];
      const newNames = [...state.layoutNames];
      
      // Move layout
      const [movedLayout] = newLayouts.splice(fromIndex, 1);
      newLayouts.splice(toIndex, 0, movedLayout);
      
      // Move name
      const [movedName] = newNames.splice(fromIndex, 1);
      newNames.splice(toIndex, 0, movedName);
      
      // Adjust active index
      let newActiveIndex = state.activeLayoutIndex;
      if (fromIndex === state.activeLayoutIndex) {
        newActiveIndex = toIndex;
      } else if (fromIndex < state.activeLayoutIndex && toIndex >= state.activeLayoutIndex) {
        newActiveIndex = state.activeLayoutIndex - 1;
      } else if (fromIndex > state.activeLayoutIndex && toIndex <= state.activeLayoutIndex) {
        newActiveIndex = state.activeLayoutIndex + 1;
      }
      
      return {
        ...state,
        layouts: newLayouts,
        layoutNames: newNames,
        activeLayoutIndex: newActiveIndex,
        layoutPositions: Object.fromEntries(Object.entries(state.layoutPositions).map(([key, value]) => {
          if (parseInt(key) === fromIndex) return [toIndex.toString(), value];
          if (parseInt(key) === toIndex) return [fromIndex.toString(), value];
          return [key, value];
        })),
        gridRows: 2,
        gridCols: 2,
      };
    }

    case 'RENAME_LAYOUT': {
      if (action.index < 0 || action.index >= state.layouts.length) return state;
      
      const newNames = [...state.layoutNames];
      newNames[action.index] = action.name;
      
      return {
        ...state,
        layoutNames: newNames,
        layoutPositions: { ...state.layoutPositions, [action.index]: state.layoutPositions[action.index] },
        gridRows: 2,
        gridCols: 2,
      };
    }

    case 'RESET_ALL': {
      return { ...INITIAL_LAYOUT_STATE };
    }

    case 'RESET_LAYOUT': {
      if (action.index < 0 || action.index >= state.layouts.length) return state;
      
      const newLayouts = [...state.layouts];
      newLayouts[action.index] = { ...INITIAL_LAYOUT_STATE.layouts[0], description: '' };
      
      return {
        ...state,
        layouts: newLayouts,
        layoutPositions: { ...state.layoutPositions, [action.index]: { row: 0, col: 0 } },
        gridRows: 2,
        gridCols: 2,
      };
    }

    case 'SET_ALL_LAYOUTS': {
      console.log('[REDUCER] SET_ALL_LAYOUTS called with:', action);
      const newState = {
        ...state,
        layouts: action.layouts,
        layoutNames: action.names,
        activeLayoutIndex: Math.min(state.activeLayoutIndex, action.layouts.length - 1),
        layoutPositions: action.layoutPositions || Object.fromEntries(action.layouts.map((_, index) => [index.toString(), { row: 0, col: 0 }])),
        gridRows: action.gridRows || 2,
        gridCols: action.gridCols || 2,
      };
      console.log('[REDUCER] SET_ALL_LAYOUTS new state:', newState);
      return newState;
    }

    case 'SET_DRAGGED_NAME':
      return { ...state, draggedName: action.name };

    case 'MOVE_LAYOUT_TO_POSITION': {
      const { layoutIndex, newPosition } = action;
      console.log('[REDUCER] MOVE_LAYOUT_TO_POSITION', layoutIndex, newPosition); // LOG
      // Log all keys and positions
      Object.entries(state.layoutPositions).forEach(([key, pos]) => {
        console.log(`[REDUCER] layoutPositions key=${key} pos=`, pos);
      });
      // Check if position is occupied by another layout
      const occupiedBy = Object.entries(state.layoutPositions).find(
        ([key, pos]) => pos.row === newPosition.row && pos.col === newPosition.col && parseInt(key) !== layoutIndex
      );
      
      const newPositions = { ...state.layoutPositions };
      
      if (occupiedBy) {
        const otherIndex = parseInt(occupiedBy[0]);
        const currentPos = newPositions[layoutIndex];
        console.log('[REDUCER] SWAP', layoutIndex, '<->', otherIndex); // LOG
        newPositions[layoutIndex] = newPosition;
        newPositions[otherIndex] = currentPos;
      } else {
        // Simple move
        newPositions[layoutIndex] = newPosition;
      }
      
      // Recalculate grid dimensions
      const allPositions = Object.values(newPositions);
      const maxRow = allPositions.length > 0 ? Math.max(...allPositions.map(p => p.row)) : 0;
      const maxCol = allPositions.length > 0 ? Math.max(...allPositions.map(p => p.col)) : 0;
      
      console.log('[REDUCER] new layoutPositions:', newPositions); // LOG
      return {
        ...state,
        layoutPositions: newPositions,
        gridRows: Math.max(maxRow + 2, 2), // +2 for extra space, minimum 2
        gridCols: Math.max(maxCol + 2, 2), // +2 for extra space, minimum 2
      };
    }

    case 'SWAP_LAYOUT_POSITIONS': {
      const { layoutIndex1, layoutIndex2 } = action;
      if (layoutIndex1 < 0 || layoutIndex1 >= state.layouts.length ||
          layoutIndex2 < 0 || layoutIndex2 >= state.layouts.length) return state;
      
      const newPositions = { ...state.layoutPositions };
      const pos1 = newPositions[layoutIndex1];
      const pos2 = newPositions[layoutIndex2];
      
      if (pos1 && pos2) {
        newPositions[layoutIndex1] = pos2;
        newPositions[layoutIndex2] = pos1;
      }
      
      return {
        ...state,
        layoutPositions: newPositions,
      };
    }

    default:
      return state;
  }
}

// ===== CONTEXT CREATION =====

/**
 * AdminLayout Context
 * 
 * React context that provides layout state and dispatch function.
 * The context value is a tuple: [state, dispatch]
 */
const AdminLayoutContext = createContext<[AdminLayoutState, Dispatch<AdminLayoutAction>] | undefined>(undefined);

/**
 * AdminLayout Provider Component
 * 
 * Wraps the application to provide layout state management.
 * Uses useReducer to manage state with the adminLayoutReducer.
 * 
 * @param children - React children to wrap with the context
 */
export const AdminLayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useReducer(adminLayoutReducer, INITIAL_LAYOUT_STATE);
  return <AdminLayoutContext.Provider value={value}>{children}</AdminLayoutContext.Provider>;
};

/**
 * useAdminLayoutContext Hook
 * 
 * Custom hook to access the layout context.
 * Provides type safety and error handling for context usage.
 * 
 * @returns Tuple of [layoutState, dispatch] for managing layouts
 * @throws Error if used outside of AdminLayoutProvider
 */
export function useAdminLayoutContext() {
  const ctx = useContext(AdminLayoutContext);
  if (!ctx) {
    throw new Error('useAdminLayoutContext must be used within an AdminLayoutProvider');
  }
  return ctx;
}

/**
 * useActiveLayout Hook
 * 
 * Convenience hook to get the currently active layout and its index.
 * 
 * @returns Object with active layout, index, and update function
 */
export function useActiveLayout() {
  const [state, dispatch] = useAdminLayoutContext();
  const activeIndex = state.activeLayoutIndex;
  const activeLayout = activeIndex >= 0 ? state.layouts[activeIndex] : null;

  const updateActiveLayout = (payload: Partial<LayoutState>) => {
    if (activeIndex >= 0) {
      dispatch({ type: 'UPDATE_LAYOUT', index: activeIndex, payload });
    }
  };

  return {
    layout: activeLayout,
    index: activeIndex,
    updateLayout: updateActiveLayout
  };
} 