import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import { Providers } from './Providers';

import './styles/variables.css';
import './index.sass';

import { HashRouter, Routes, Route } from 'react-router-dom';

import MultiLayoutAdminView from 'src/admin/MultiLayoutAdminView.tsx';
import { useTheme } from './containers/ThemeContext';
import { useTabBackground } from './containers/TabBackgroundContext';

// Wrapper to inject theme-related props
function WithThemeProps({ Component }: { Component: React.ComponentType<any> }) {
  const themeObject = useTheme();
  const { theme, scale, device } = themeObject;
  const tabBackground = useTabBackground();
  return <Component theme={theme} scale={scale} device={device} tabBackground={tabBackground} />;
}

/**
 * AppWrapper component that handles routing and theme context
 * This component wraps the main App and AdminView with necessary context providers
 * and determines which route to render based on the current URL
 */
function AppWrapper() {
  return (
    <div>
      <Routes>
        {/* Multi Admin panel route - accessible at /multi-admin */}
        <Route
          path="/multi-admin"
          element={
            <WithThemeProps Component={MultiLayoutAdminView} />
          }
        />
        
        {/* Default route - renders the main App component for all other paths */}
        <Route 
          path="/*" 
          element={<WithThemeProps Component={App} />} 
        />
      </Routes>
    </div>
  );
}

/**
 * Application entry point
 * Creates the root React element and renders the application with:
 * - StrictMode for development warnings and checks
 * - HashRouter for client-side routing with hash-based URLs
 * - Providers wrapper for global context and state management
 * - AppWrapper component that handles routing logic
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Providers>
        <AppWrapper />
      </Providers>
    </HashRouter>
  </StrictMode>,
)