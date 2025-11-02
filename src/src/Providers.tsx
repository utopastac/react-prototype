import React from 'react';
// import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from 'src/containers/ThemeContext';
import { LayersProvider } from 'src/containers/LayersContext.js';
import { TabBackgroundProvider } from 'src/containers/TabBackgroundContext';
import { UserProvider } from 'src/containers/UserContext.tsx';
import { ActivityProvider } from 'src/containers/ActivityContext.tsx';
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
 * - ActivityProvider: Handles activity/transaction data and state
 * - LayersProvider: Manages UI layer stacking and z-index coordination
 * - TabBackgroundProvider: Manages background styling for different tabs/views
 * - TransitionProvider: Handles page transitions and animations
 * - TiltProvider: Manages tilt effects for interactive elements
 * - PhoneEffectsProvider: Manages phone-specific UI effects and behaviors
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <UserProvider>
        <ActivityProvider>
          <LayersProvider>
            <TabBackgroundProvider>
              <TransitionProvider>
                <TiltProvider>
                  <PhoneEffectsProvider>
                    {children}
                  </PhoneEffectsProvider>
                </TiltProvider>
              </TransitionProvider>
            </TabBackgroundProvider>
          </LayersProvider>
        </ActivityProvider>
      </UserProvider>
    </ThemeProvider>
  );
} 