import * as React from "react";
import { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import { Avatars } from "src/data/Avatars";

/**
 * UserContext - React Context for Managing User State
 * 
 * This context provides centralized state management for user-related data
 * throughout the Interventions Hub. It manages user profile information, financial
 * balances, and provides a consistent interface for reading and updating
 * user data across all components.
 * 
 * Key Features:
 * - User profile data (name, headline, avatar)
 * - Professional info (title, company, location)
 * - Type-safe state updates via reducer pattern
 * - Error handling for context usage outside provider
 * 
 * Usage Patterns:
 * - Reading user data: const { name, headline } = useUser();
 * - Updating user data: const dispatch = useUserDispatch();
 *   dispatch({ type: UPDATE_USER, payload: { name: "New Name" } });
 * 
 * Provider Hierarchy:
 * The UserProvider is nested within ThemeProvider and wraps ActivityProvider,
 * ensuring user data is available to all child components in the app.
 */

// Action type constant for updating user data
export const UPDATE_USER = 'UPDATE_USER';

/**
 * UserObject Interface
 * 
 * Defines the structure of user data managed by this context.
 * All financial values are stored as strings to maintain precision
 * and avoid floating-point arithmetic issues.
 */
export interface UserObject {
  name: string,            // User's display name
  headline: string,        // User's LinkedIn headline
  avatar: string,          // Path to user's avatar image
  title: string,           // Current job title
  company: string,         // Current company
  location: string,        // User's location
  vanity: string,          // LinkedIn vanity username
  connectionsCount: number,// Number of connections
  followersCount: number,  // Number of followers
  profileUrl: string       // Full LinkedIn profile URL
}

/**
 * Default User Parameters
 * 
 * Initial state for new users. Generates random financial values
 * to simulate realistic user data for development and testing.
 * 
 * Note: In a production app, these would typically be loaded from
 * an API or local storage on app initialization.
 */
const defaultParams: UserObject = {
  name: "Peter Wright",
  headline: "Design Lead at ExampleCo | Building delightful products",
  avatar: Avatars.NinaD,
  title: "Design Lead",
  company: "ExampleCo",
  location: "San Francisco Bay Area",
  vanity: "peter-wright",
  connectionsCount: 500,
  followersCount: 1200,
  profileUrl: "https://www.linkedin.com/in/peter-wright/"
}

/**
 * Action Types for User State Management
 * 
 * Defines the structure of actions that can be dispatched to update
 * user state. Currently supports partial updates to any user property.
 */
interface UpdateUserAction {
  type: typeof UPDATE_USER;
  payload: Partial<UserObject>; // Allows updating any subset of user properties
}

// Union type for all possible user actions (currently just UPDATE_USER)
type UserAction = UpdateUserAction;

// Type alias for the dispatch function
type UserDispatch = Dispatch<UserAction>;

/**
 * React Contexts
 * 
 * Two separate contexts are used to follow React's recommended pattern
 * for separating state and dispatch functions:
 * - UserContext: Provides read-only access to current user state
 * - UserDispatchContext: Provides the dispatch function for state updates
 */
const UserContext = createContext<UserObject>(defaultParams);
const UserDispatchContext = createContext<UserDispatch | null>(null);

/**
 * UserProvider Component
 * 
 * Wraps the application (or a portion of it) to provide user state
 * and dispatch functions to all child components.
 * 
 * Uses useReducer for state management, providing predictable state
 * updates and better performance for complex state logic.
 * 
 * @param children - React components that will have access to user context
 */
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, dispatch] = useReducer(userReducer, defaultParams);

  return (
    <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

/**
 * useUser Hook
 * 
 * Custom hook for accessing the current user state.
 * Provides type-safe access to user data throughout the application.
 * 
 * Usage Examples:
 * - const { name, balance } = useUser();
 * - const user = useUser(); // Access all user properties
 * 
 * @returns Current user state object
 */
export function useUser() {
  return useContext(UserContext);
}

/**
 * useUserDispatch Hook
 * 
 * Custom hook for accessing the user dispatch function.
 * Provides type-safe way to update user state with error handling.
 * 
 * Usage Examples:
 * - const dispatch = useUserDispatch();
 * - dispatch({ type: UPDATE_USER, payload: { name: "New Name" } });
 * - dispatch({ type: UPDATE_USER, payload: { balance: "1000.00" } });
 * 
 * @returns Dispatch function for updating user state
 * @throws Error if used outside of UserProvider
 */
export function useUserDispatch() {
  const context = useContext(UserDispatchContext);
  if (context === null) {
    throw new Error('useUserDispatch must be used within a UserProvider');
  }
  return context;
}

/**
 * User Reducer Function
 * 
 * Handles state updates for user data. Uses the reducer pattern
 * to ensure predictable state transitions and enable future
 * expansion of action types.
 * 
 * Current Actions:
 * - UPDATE_USER: Merges partial user data with existing state
 * 
 * @param user - Current user state
 * @param action - Action to perform on the state
 * @returns Updated user state
 * @throws Error for unknown action types
 */
function userReducer(user: UserObject, action: UserAction): UserObject {
  switch (action.type) {
    case UPDATE_USER: {
      // Merge partial updates with existing state
      return { ...user, ...action.payload };
    }
    default: {
      // Type-safe error handling for unknown actions
      throw new Error('Unknown action: ' + (action as any).type);
    }
  }
}