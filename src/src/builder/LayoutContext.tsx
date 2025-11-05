import React, { createContext, useReducer, useContext, Dispatch } from 'react';
import { TopBarProps } from 'src/components/TopBar';
import { ButtonGroupProps } from 'src/components/ButtonGroup';

/**
 * LayoutContext
 * 
 * Manages persistent layout state for the admin/editor interface.
 * This context handles all state that represents the actual layout configuration
 * and should be persisted, shared, or restored from history.
 * 
 * SEPARATION OF CONCERNS:
 * - LayoutState: Persistent data that defines the UI layout (saved/shared/restored)
 * - Local State: Ephemeral UI state (selectedIdx, selectedSpecial, isAltPressed, etc.)
 * 
 * The layout state includes:
 * - Component composition (components with their props)
 * - Special UI elements (top bar, bottom buttons, toast)
 * - Visibility toggles for layout elements
 */

// ===== INITIAL VALUES =====
// These define the default state for a new layout

/** Empty array of components for initial state */
const INITIAL_COMPONENTS: { name: string; Component: React.ComponentType<any>; props: any }[] = [];

/** Default top bar visibility */
const INITIAL_SHOW_TOP_BAR = true;

/** Default top bar configuration */
export const INITIAL_TOP_BAR_PROPS: TopBarProps = {
  title: 'Intervention',
  left: undefined,
  right: undefined,
  inverse: false,
  isBackNavigation: false
};

/** Default bottom buttons visibility */
const INITIAL_SHOW_BOTTOM_BUTTONS = true;

/** Default bottom buttons configuration */
export const INITIAL_BOTTOM_BUTTONS_PROPS: ButtonGroupProps = {
  buttons: [{ title: 'Button' }],
  horizontal: false,
  inComponent: false,
  showHairline: false,
  disclaimer: '',
  size: 'BUTTON_CTA_SIZE'
};

/** Default toast visibility */
const INITIAL_SHOW_TOAST = false;

/** Default toast configuration */
export const INITIAL_TOAST_PROPS = { 
  headline: 'This is a toast!', 
  body: 'Toast body', 
  button: 'OK', 
  icon: '' 
};

export const INITIAL_STATUS_BAR_PROPS = {
  showNotch: false,
  transparent: false
}

/**
 * LayoutState Interface
 * 
 * Defines the structure of persistent layout data.
 * This state is serialized for saving/loading layouts, URL sharing,
 * and history management (undo/redo).
 * 
 * All properties in this interface represent the actual layout configuration
 * and should persist across sessions, navigation, and sharing.
 */
export interface LayoutState {
  /** Array of components in the layout */
  components: { name: string; Component: React.ComponentType<any>; props: any }[];
  /** Whether the top bar is visible in the layout */
  showTopBar: boolean;
  /** Configuration properties for the top bar */
  topBarProps: TopBarProps;
  /** Whether the bottom button group is visible in the layout */
  showBottomButtons: boolean;
  /** Configuration properties for the bottom button group */
  bottomButtonsProps: ButtonGroupProps;
  /** Whether the toast notification is visible in the layout */
  showToast: boolean;
  /** Configuration properties for the toast notification */
  toastProps: typeof INITIAL_TOAST_PROPS;
  /** Whether the iOS status bar is visible in the layout */
  showStatusBar: boolean;
  /** Configuration properties for the iOS status bar */
  statusBarProps: { showNotch?: boolean; transparent?: boolean };
  /** Optional description for the layout */
  description?: string;
}

/**
 * LayoutData Interface
 * 
 * Defines the structure of serializable layout data (without Component references).
 * This is used for saving/loading layouts, URL sharing, and history management.
 * 
 * Similar to LayoutState but with serializable component data (name and props only).
 */
export interface LayoutData {
  /** Array of component data (name and props only, no Component references) */
  components: Array<{ name: string; props: any }>;
  /** Configuration properties for the top bar */
  topBarProps: TopBarProps;
  /** Whether the top bar is visible in the layout */
  showTopBar: boolean;
  /** Configuration properties for the bottom button group */
  bottomButtonsProps: ButtonGroupProps;
  /** Whether the bottom button group is visible in the layout */
  showBottomButtons: boolean;
  /** Whether the toast notification is visible in the layout */
  showToast: boolean;
  /** Configuration properties for the toast notification */
  toastProps: typeof INITIAL_TOAST_PROPS;
  /** Whether the iOS status bar is visible in the layout */
  showStatusBar: boolean;
  /** Configuration properties for the iOS status bar */
  statusBarProps: { showNotch?: boolean; transparent?: boolean };
  /** Optional description for the layout */
  description?: string;
}

/**
 * Initial layout state
 * 
 * Provides the default values for a new layout.
 * This is used when creating a new layout or resetting to initial state.
 */
const INITIAL_LAYOUT_STATE: LayoutState = {
  components: INITIAL_COMPONENTS,
  showTopBar: INITIAL_SHOW_TOP_BAR,
  topBarProps: INITIAL_TOP_BAR_PROPS,
  showBottomButtons: INITIAL_SHOW_BOTTOM_BUTTONS,
  bottomButtonsProps: INITIAL_BOTTOM_BUTTONS_PROPS,
  showToast: INITIAL_SHOW_TOAST,
  toastProps: INITIAL_TOAST_PROPS,
  showStatusBar: true,
  statusBarProps: INITIAL_STATUS_BAR_PROPS,
  description: '',
};

// ===== REDUCER & ACTIONS =====

/**
 * LayoutAction Types
 * 
 * Defines the actions that can be dispatched to update layout state.
 * Uses a simple pattern with RESET and UPDATE actions for simplicity.
 */
type LayoutAction =
  | { type: 'RESET' }
  | { type: 'UPDATE', payload: Partial<LayoutState> };

/**
 * Layout Reducer
 * 
 * Handles state updates for the layout context.
 * 
 * @param state - Current layout state
 * @param action - Action to perform
 * @returns New layout state
 */
function layoutReducer(state: LayoutState, action: LayoutAction): LayoutState {
  switch (action.type) {
    case 'RESET':
      // Reset to initial state (used for clearing layout)
      return { ...INITIAL_LAYOUT_STATE };
    case 'UPDATE':
      // Update specific properties while preserving others
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// ===== CONTEXT CREATION =====

/**
 * Layout Context
 * 
 * React context that provides layout state and dispatch function.
 * The context value is a tuple: [state, dispatch]
 */
const LayoutContext = createContext<[LayoutState, Dispatch<LayoutAction>] | undefined>(undefined);

/**
 * Layout Provider Component
 * 
 * Wraps the application to provide layout state management.
 * Uses useReducer to manage state with the layoutReducer.
 * 
 * @param children - React children to wrap with the context
 */
export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useReducer(layoutReducer, INITIAL_LAYOUT_STATE);
  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
};

/**
 * useLayoutContext Hook
 * 
 * Custom hook to access the layout context.
 * Provides type safety and error handling for context usage.
 * 
 * @returns Tuple of [layoutState, dispatch] for managing layout
 * @throws Error if used outside of LayoutProvider
 */
export function useLayoutContext() {
  const ctx = useContext(LayoutContext);
  if (!ctx) {
    throw new Error('useLayoutContext must be used within a LayoutProvider');
  }
  return ctx;
} 