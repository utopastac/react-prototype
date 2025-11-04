import * as React from "react";
import { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';

// ===== ACTION TYPES =====
/**
 * Action type for updating theme state
 * Used by the reducer to identify theme update actions
 */
export const UPDATE_THEME = 'UPDATE_THEME';

// ===== THEME CONSTANTS =====
/**
 * Theme color schemes
 * These constants define the available color themes for the application
 * Each theme has corresponding CSS variables defined in _colors.sass
 */
export const LIGHT = "light";      // Default light theme with white background
export const DARK = "dark";        // Dark theme with black background

// ===== SCALE CONSTANTS =====
/**
 * Text scaling options
 * These control the overall text size scaling across the application
 * Applied via CSS custom properties in _theme.sass
 */
export const SCALE_1 = "THEME_SCALE_1";                    // 100% (default)
export const SCALE_0_POINT_75 = "THEME_SCALE_0_POINT_75";  // 75% scaling
export const SCALE_1_POINT_1 = "THEME_SCALE_1_POINT_1";    // 110% scaling
export const SCALE_1_POINT_2 = "THEME_SCALE_1_POINT_2";    // 120% scaling
export const SCALE_1_POINT_5 = "THEME_SCALE_1_POINT_5";    // 150% scaling

// ===== DEVICE CONSTANTS =====
/**
 * Device size presets
 * These control the viewport dimensions for different device simulations
 * Applied via CSS custom properties in _theme.sass
 */
export const DEVICE_EXTRA_SMALL = "THEME_DEVICE_EXTRA_SMALL";  // 320x568 (iPhone SE)
export const DEVICE_SMALL = "THEME_DEVICE_SMALL";              // 340x708 (iPhone 12)
export const DEVICE_STANDARD = "THEME_DEVICE_STANDARD";        // 375x812 (iPhone 13)
export const DEVICE_LARGE = "THEME_DEVICE_LARGE";              // 440x956 (iPhone 14 Pro Max)

// ===== TYPE DEFINITIONS =====
/**
 * ThemeObject Interface
 * 
 * Defines the structure of the theme state object.
 * Contains all theme-related configuration that can be modified.
 * 
 * Properties:
 * - theme: Color scheme (LIGHT, DARK)
 * - scale: Text scaling factor (SCALE_* constants)
 * - device: Device size preset (DEVICE_* constants)
 */
export interface ThemeObject {
  theme: string,
  scale: string,
  device: string
}

/**
 * Default theme configuration
 * Used as the initial state for the theme reducer
 * These values are applied to the root element as data attributes
 */
const defaultParams: ThemeObject = {
  theme: LIGHT,
  scale: SCALE_1,
  device: DEVICE_STANDARD
};

/**
 * UpdateThemeAction Interface
 * 
 * Defines the action type for updating theme state.
 * Uses a partial ThemeObject to allow updating individual properties.
 */
interface UpdateThemeAction {
  type: typeof UPDATE_THEME;
  payload: Partial<ThemeObject>;
}

// ===== TYPE ALIASES =====
type ThemeAction = UpdateThemeAction;
type ThemeDispatch = Dispatch<ThemeAction>;

// ===== CONTEXT CREATION =====
/**
 * ThemeContext
 * 
 * React context that provides the current theme state.
 * Contains the current values for theme, scale, font, and device.
 * Initialized with defaultParams to ensure proper TypeScript typing.
 */
const ThemeContext = createContext<ThemeObject>(defaultParams);

/**
 * ThemeDispatchContext
 * 
 * React context that provides the dispatch function for modifying theme state.
 * Allows components to update theme properties through the reducer.
 * Initialized as null to ensure proper error handling in hooks.
 */
const ThemeDispatchContext = createContext<ThemeDispatch | null>(null);

// ===== PROVIDER COMPONENT =====
/**
 * ThemeProvider Component
 * 
 * Wraps the application to provide theme state management.
 * Uses useReducer to manage theme state with predictable state transitions.
 * 
 * Provider Hierarchy:
 * - ThemeProvider is the outermost provider in the app's provider tree
 * - All other providers (UserProvider, ActivityProvider, etc.) are nested within it
 * - This ensures theme context is available throughout the entire application
 * 
 * Usage:
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * 
 * @param children - React children to wrap with theme context
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, dispatch] = useReducer(themeReducer, defaultParams);

  return (
    <ThemeContext.Provider value={theme}>
      <ThemeDispatchContext.Provider value={dispatch}>
        {children}
      </ThemeDispatchContext.Provider>
    </ThemeContext.Provider>
  );
}

// ===== CUSTOM HOOKS =====
/**
 * useTheme Hook
 * 
 * Custom hook to access the current theme state.
 * Provides type safety and easy access to theme properties.
 * 
 * Usage Examples:
 * - const { theme, scale, device, font } = useTheme();
 * - const themeObject = useTheme();
 * 
 * @returns Current theme state object
 */
export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * useThemeDispatch Hook
 * 
 * Custom hook to access the theme dispatch function.
 * Provides type safety and error handling for context usage.
 * 
 * Usage Examples:
 * - const dispatch = useThemeDispatch();
 * - dispatch({ type: UPDATE_THEME, payload: { theme: DARK } });
 * - dispatch({ type: UPDATE_THEME, payload: { scale: SCALE_1_POINT_2 } });
 * 
 * @returns Dispatch function for modifying theme state
 * @throws Error if used outside of ThemeProvider
 */
export function useThemeDispatch() {
  const context = useContext(ThemeDispatchContext);
  if (context === null) {
    throw new Error('useThemeDispatch must be used within a ThemeProvider');
  }
  return context;
}

// ===== REDUCER FUNCTION =====
/**
 * themeReducer Function
 * 
 * Reducer function that handles theme state updates.
 * Uses the standard reducer pattern with action types and payloads.
 * 
 * Action Types:
 * - UPDATE_THEME: Updates theme properties with partial ThemeObject
 * 
 * Usage:
 * The reducer is used internally by the ThemeProvider and should not be called directly.
 * Use the useThemeDispatch hook to dispatch actions.
 * 
 * @param theme - Current theme state
 * @param action - Action object containing type and payload
 * @returns Updated theme state
 * @throws Error for unknown action types
 */
function themeReducer(theme: ThemeObject, action: ThemeAction): ThemeObject {
  switch (action.type) {
    case UPDATE_THEME: {
      // Merge the current theme with the partial update
      // This allows updating individual properties without affecting others
      return { ...theme, ...action.payload };
    }
    default: {
      throw new Error('Unknown action: ' + (action as any).type);
    }
  }
}

