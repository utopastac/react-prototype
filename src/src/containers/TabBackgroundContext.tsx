import React, { createContext, useContext, useReducer, Dispatch, ReactNode } from 'react';

/**
 * TabBackgroundContext
 * 
 * A React Context that manages the background color/styling for different tabs and views
 * throughout the Interventions Hub interface. This context provides a centralized way to control
 * the visual appearance of the app's background based on the current view or user interaction.
 * 
 * USAGE PATTERNS:
 * - Views set their preferred background color on mount (e.g., CashView uses BRAND, ActivityView uses WHITE)
 * - Components like IOSStatusBar read the current background to adjust their styling
 * - Formblocker container can override background based on configuration data
 * - Navigation components can respond to background changes for visual consistency
 * 
 * BACKGROUND MODES:
 * - WHITE: Clean, minimal background for most standard views
 * - GREY: Subtle background for secondary or utility views
 * - BRAND: Branded background for primary features (like the main Cash tab)
 * - BLACK: Dark background for immersive experiences or modals
 */

// Define the possible background modes as constants for type safety and consistency
export const WHITE = "TAB_BACKGROUND_WHITE";
export const GREY = "TAB_BACKGROUND_GREY";
export const BRAND = "TAB_BACKGROUND_BRAND";
export const BLACK = "TAB_BACKGROUND_BLACK";

// Define the type for background modes - ensures only valid values can be used
export type TabBackgroundMode = typeof WHITE | typeof GREY | typeof BRAND | typeof BLACK;

// Define the action type for the reducer - simple action that just changes the mode
type TabBackgroundAction = {
  type: TabBackgroundMode;
};

// Create contexts with proper TypeScript types
// The main context holds the current background mode
const TabBackgroundContext = createContext<TabBackgroundMode | null>(null);
// The dispatch context provides the function to update the background mode
const TabBackgroundDispatchContext = createContext<Dispatch<TabBackgroundAction> | null>(null);

/**
 * Props interface for the TabBackgroundProvider component
 */
interface TabBackgroundProviderProps {
  children: ReactNode;
}

/**
 * TabBackgroundProvider
 * 
 * Provider component that wraps the app and provides background state management.
 * Uses useReducer for predictable state updates and provides both the current
 * background mode and a dispatch function to child components.
 * 
 * Default background is WHITE, which is the most common background for standard views.
 */
export function TabBackgroundProvider({ children }: TabBackgroundProviderProps) {
  const [mode, dispatch] = useReducer(
    tabBackgroundReducer,
    WHITE // Default to white background
  );

  return (
    <TabBackgroundContext.Provider value={mode}>
      <TabBackgroundDispatchContext.Provider value={dispatch}>
        {children}
      </TabBackgroundDispatchContext.Provider>
    </TabBackgroundContext.Provider>
  );
}

/**
 * useTabBackground Hook
 * 
 * Custom hook that provides access to the current background mode.
 * Used by components that need to read the current background to adjust their styling.
 * 
 * Example usage:
 * const tabBackground = useTabBackground();
 * // Use tabBackground to conditionally apply CSS classes or styles
 * 
 * @returns The current TabBackgroundMode
 * @throws Error if used outside of TabBackgroundProvider
 */
export function useTabBackground(): TabBackgroundMode {
  const context = useContext(TabBackgroundContext);
  if (context === null) {
    throw new Error('useTabBackground must be used within a TabBackgroundProvider');
  }
  return context;
}

/**
 * useTabBackgroundDispatch Hook
 * 
 * Custom hook that provides access to the dispatch function for updating the background mode.
 * Used by views and components that need to change the background when they mount or
 * when certain conditions are met.
 * 
 * Example usage:
 * const tabBackgroundDispatch = useTabBackgroundDispatch();
 * useEffect(() => {
 *   tabBackgroundDispatch({ type: BRAND });
 * }, []);
 * 
 * @returns The dispatch function for TabBackgroundAction
 * @throws Error if used outside of TabBackgroundProvider
 */
export function useTabBackgroundDispatch(): Dispatch<TabBackgroundAction> {
  const context = useContext(TabBackgroundDispatchContext);
  if (context === null) {
    throw new Error('useTabBackgroundDispatch must be used within a TabBackgroundProvider');
  }
  return context;
}

/**
 * tabBackgroundReducer
 * 
 * Simple reducer function that handles background mode changes.
 * Since the action only contains the new mode type, we simply return the action type.
 * This could be extended in the future to handle more complex state transitions
 * or additional background-related state.
 * 
 * @param _ - Previous state (unused in current implementation)
 * @param action - Action containing the new background mode
 * @returns The new background mode
 */
function tabBackgroundReducer(_: TabBackgroundMode, action: TabBackgroundAction): TabBackgroundMode {
  return action.type;
}
