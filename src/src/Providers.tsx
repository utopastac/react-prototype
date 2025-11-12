import React from 'react';
// import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from 'src/containers/ThemeContext';
import { LayersProvider } from 'src/containers/LayersContext.js';
import { UserProvider } from 'src/containers/UserContext.tsx';
import { TransitionProvider } from 'src/containers/TransitionContext';
import { TiltProvider } from 'src/containers/TiltContext';
import { PhoneEffectsProvider } from 'src/containers/PhoneEffectsContext';

/**
 * Props interface for the Providers component
 */
interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Providers component that wraps the entire application with all necessary context providers.
 * 
 * The providers are nested in a specific order to ensure proper dependency resolution:
 * - ThemeProvider: Provides theme context (light/dark mode, colors, etc.)
 * - UserProvider: Manages user state and authentication
 * - LayersProvider: Manages UI layer stacking and z-index coordination
 * - TransitionProvider: Handles page transitions and animations
 * - TiltProvider: Manages tilt effects for interactive elements
 * - PhoneEffectsProvider: Manages phone-specific UI effects and behaviors
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <UserProvider>
        <LayersProvider>
          <TransitionProvider>
            <TiltProvider>
              <PhoneEffectsProvider>
                {children}
              </PhoneEffectsProvider>
            </TiltProvider>
          </TransitionProvider>
        </LayersProvider>
      </UserProvider>
    </ThemeProvider>
  );
} 