import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import MainNav from 'src/components/MainNav';
import PlatformView from 'src/views/PlatformView';
import PatternsView from 'src/views/PatternsView';
import { Providers } from './Providers';

import './styles/globals.css';
import './styles/variables.css';
import './index.sass';

import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import AdminView from 'src/admin/AdminView';
import { useTheme } from './containers/ThemeContext';

// Wrapper to inject theme-related props
function WithThemeProps({ Component }: { Component: React.ComponentType<any> }) {
  const themeObject = useTheme();
  const { theme, scale, device } = themeObject;
  return <Component theme={theme} scale={scale} device={device} />;
}

/**
 * AppWrapper component that handles routing and theme context
 * This component wraps the main App and AdminView with necessary context providers
 * and determines which route to render based on the current URL
 */
function AppWrapper() {
  return (
    <div>
      <MainNav />
      <Routes>
        {/* Default route -> Platform */}
        <Route path="/" element={<Navigate to="/platform" replace />} />

        {/* Admin panel */}
        <Route path="/admin" element={<WithThemeProps Component={AdminView} />} />

        {/* Top-level pages (no phone interface) */}
        <Route path="/platform" element={<WithThemeProps Component={PlatformView} />} />
        <Route path="/patterns" element={<WithThemeProps Component={PatternsView} />} />

        {/* Flows (phone interface) */}
        <Route path="/flows/*" element={<WithThemeProps Component={App} />} />
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