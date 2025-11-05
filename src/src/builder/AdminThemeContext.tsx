import React, { createContext, useReducer, useContext, ReactNode, Dispatch, useEffect } from 'react';

// Types for the admin theme state
export interface AdminThemeState {
  backgroundColor: string;
  phoneShadow: string;
  layoutSpacing: string;
  layoutOutline: string;
  adminPanelWidth: number;
  settingsPanelWidth: number;
}

// Action type
export type AdminThemeAction = {
  type: 'Update';
  payload: Partial<AdminThemeState>;
};

// Default state
const defaultAdminTheme: AdminThemeState = {
  backgroundColor: '#F4F4F4', // Slider zero
  phoneShadow: 'none', // Slider zero
  layoutSpacing: '96px',
  layoutOutline: '0px',
  adminPanelWidth: 320,
  settingsPanelWidth: 280,
};

const LOCALSTORAGE_KEY = 'interventions-hub-admin-theme';

// Reducer
function adminThemeReducer(state: AdminThemeState, action: AdminThemeAction): AdminThemeState {
  switch (action.type) {
    case 'Update':
      return { ...state, ...action.payload };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

// Contexts
const AdminThemeStateContext = createContext<AdminThemeState>(defaultAdminTheme);
const AdminThemeDispatchContext = createContext<Dispatch<AdminThemeAction> | undefined>(undefined);

// Provider
export const AdminThemeProvider = ({ children }: { children: ReactNode }) => {
  // Load initial state from localStorage if present
  const getInitialState = (): AdminThemeState => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LOCALSTORAGE_KEY);
      if (stored) {
        try {
          return { ...defaultAdminTheme, ...JSON.parse(stored) };
        } catch {}
      }
    }
    return defaultAdminTheme;
  };

  const [state, dispatch] = useReducer(adminThemeReducer, defaultAdminTheme, getInitialState);

  // Save to localStorage on any state change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  return (
    <AdminThemeStateContext.Provider value={state}>
      <AdminThemeDispatchContext.Provider value={dispatch}>
        {children}
      </AdminThemeDispatchContext.Provider>
    </AdminThemeStateContext.Provider>
  );
};

// Hooks
export function useAdminTheme() {
  return useContext(AdminThemeStateContext);
}

export function useAdminThemeDispatch() {
  const context = useContext(AdminThemeDispatchContext);
  if (context === undefined) {
    throw new Error('useAdminThemeDispatch must be used within an AdminThemeProvider');
  }
  return context;
} 