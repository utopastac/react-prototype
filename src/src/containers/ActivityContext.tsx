import React, { createContext, Dispatch, useContext, useReducer, ReactNode } from 'react';
import { Activity, ActivityItem } from "src/data/Activity";

/**
 * ActivityAction Type
 * 
 * Defines the possible actions that can be dispatched to modify the activity state.
 * Uses discriminated union pattern for type safety.
 * 
 * - ACTIVITY_ADD: Adds a new activity item to the list
 * - ACTIVITY_REMOVE: Removes an activity item at a specific index
 */
type ActivityAction = 
  | { type: typeof ACTIVITY_ADD; activity: ActivityItem }
  | { type: typeof ACTIVITY_REMOVE; index: number };

/**
 * ActivityContext
 * 
 * React context that provides the current list of activity items.
 * Contains transaction/activity data like payments, purchases, etc.
 * Initialized as null to ensure proper error handling in hooks.
 */
const ActivityContext = createContext<ActivityItem[] | null>(null);

/**
 * ActivityDispatchContext
 * 
 * React context that provides the dispatch function for modifying activity state.
 * Allows components to add/remove activities from the list.
 * Initialized as null to ensure proper error handling in hooks.
 */
const ActivityDispatchContext = createContext<Dispatch<ActivityAction> | null>(null);

/**
 * ActivityProvider Component
 * 
 * Wraps the application to provide activity state management.
 * Uses useReducer to manage the activity list with the ActivityReducer.
 * Initializes with the default activity data from src/data/Activity.
 * 
 * Provider Hierarchy:
 * - ActivityProvider is nested within UserProvider in the app's provider tree
 * - Provides both activity data and dispatch function to child components
 * 
 * @param children - React children to wrap with the activity context
 */
export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activity, dispatch] = useReducer<React.Reducer<ActivityItem[], ActivityAction>>(
    ActivityReducer,
    [...Activity] // Initialize with a copy of the default activity data
  );

  return (
    <ActivityContext.Provider value={activity}>
      <ActivityDispatchContext.Provider value={dispatch}>
        {children}
      </ActivityDispatchContext.Provider>
    </ActivityContext.Provider>
  );
}

/**
 * useActivity Hook
 * 
 * Custom hook to access the current activity list.
 * Provides type safety and error handling for context usage.
 * 
 * Usage Examples:
 * - Display activity list in ActivityView
 * - Access activity data for rendering in components
 * 
 * @returns Array of ActivityItem objects representing the current activity list
 * @throws Error if used outside of ActivityProvider
 */
export function useActivity() {
  const context = useContext(ActivityContext);
  if (context === null) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
}

/**
 * useActivityDispatch Hook
 * 
 * Custom hook to access the activity dispatch function.
 * Provides type safety and error handling for context usage.
 * 
 * Usage Examples:
 * - Add new activities in DevTools
 * - Remove activities from the list
 * - Modify activity data programmatically
 * 
 * @returns Dispatch function for modifying activity state
 * @throws Error if used outside of ActivityProvider
 */
export function useActivityDispatch() {
  const context = useContext(ActivityDispatchContext);
  if (context === null) {
    throw new Error('useActivityDispatch must be used within an ActivityProvider');
  }
  return context;
}

/**
 * ActivityReducer
 * 
 * Reducer function that handles state updates for the activity list.
 * Implements immutable state updates using spread operator.
 * 
 * Action Types:
 * - ACTIVITY_ADD: Appends a new activity to the end of the list
 * - ACTIVITY_REMOVE: Removes an activity at the specified index
 * 
 * @param activity - Current array of ActivityItem objects
 * @param action - ActivityAction to perform on the state
 * @returns New array of ActivityItem objects
 */
function ActivityReducer(activity: ActivityItem[], action: ActivityAction): ActivityItem[] {
  switch (action.type) {
    case ACTIVITY_ADD: {
      // Add new activity to the end of the list
      return [...activity, action.activity];
    }
    case ACTIVITY_REMOVE: {
      // Remove activity at specified index
      const newActivity = [...activity];
      newActivity.splice(action.index, 1);
      return newActivity;
    }
    default: {
      throw new Error(`Unknown action: ${(action as any).type}`);
    }
  }
}

/**
 * Action Type Constants
 * 
 * String constants used as action types in the reducer.
 * Using 'as const' ensures type safety and prevents accidental mutations.
 */
export const ACTIVITY_REMOVE = "ACTIVITY_REMOVE" as const;
export const ACTIVITY_ADD = "ACTIVITY_ADD" as const;

// Re-export ActivityItem type for convenience
export type { ActivityItem };


