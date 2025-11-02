import React, { createContext, useContext, useState } from 'react';

/**
 * TiltState interface - Defines the structure for 3D tilt and effect parameters
 * 
 * This interface represents the complete state of tilt effects applied to UI elements,
 * particularly the phone interface in the Interventions Hub. The values are used to create
 * realistic 3D tilt effects that respond to mouse movement and user interactions.
 * 
 * Properties:
 * - x: Rotation around the X-axis (vertical tilt) in degrees
 * - y: Rotation around the Y-axis (horizontal tilt) in degrees  
 * - blur: Blur amount in pixels (0 = no blur, higher values = more blur)
 * - z: Rotation around the Z-axis (spinning) in degrees
 * 
 * Usage examples:
 * - Mouse-based tilt: x/y values calculated from mouse position
 * - Spinning animation: z value continuously incremented
 * - Parallax effects: x/y values applied to background elements
 * - Blur effects: blur value applied during animations
 */
export interface TiltState {
  x: number;    // X-axis rotation (vertical tilt) in degrees
  y: number;    // Y-axis rotation (horizontal tilt) in degrees
  blur: number; // Blur amount in pixels
  z: number;    // Z-axis rotation (spinning) in degrees
}

/**
 * TiltContextType - TypeScript interface for the TiltContext
 * 
 * Defines the shape of the context value that will be provided to consumers.
 * Contains the current tilt state and a function to update it.
 */
type TiltContextType = {
  tilt: TiltState;                    // Current tilt state values
  setTilt: (tilt: TiltState) => void; // Function to update tilt state
};

/**
 * Default tilt state - Neutral position with no effects applied
 * 
 * Used as the initial state and as a reset value when clearing effects.
 * All values are set to 0 to represent a flat, untilted surface.
 */
const defaultTilt: TiltState = {
  x: 0,    // No vertical tilt
  y: 0,    // No horizontal tilt
  blur: 0, // No blur effect
  z: 0     // No rotation
};

/**
 * TiltContext - React context for managing tilt effects across the application
 * 
 * This context provides a centralized way to manage 3D tilt effects and visual
 * transformations throughout the Interventions Hub. It's used by multiple components
 * to create coordinated tilt effects that respond to user interactions.
 * 
 * Key consumers:
 * - TiltContainer: Applies 3D transforms based on tilt values
 * - ParallaxButton: Creates parallax effects using tilt values
 * - PhoneEffectsContext: Integrates with spinning and other phone effects
 * - useSpinning hook: Manages spinning animations using tilt state
 * 
 * The context is provided at the app level in Providers.tsx and consumed
 * by components that need to read or update tilt state.
 */
const TiltContext = createContext<TiltContextType>({
  tilt: defaultTilt,
  setTilt: () => {} // No-op function as fallback
});

/**
 * useTilt - Custom hook for consuming the TiltContext
 * 
 * Provides easy access to the current tilt state and setTilt function.
 * This hook should be used by any component that needs to read or modify
 * tilt effects. It ensures proper TypeScript typing and error handling.
 * 
 * @returns {TiltContextType} Object containing tilt state and setTilt function
 * 
 * Usage example:
 * ```tsx
 * const { tilt, setTilt } = useTilt();
 * // tilt.x, tilt.y, tilt.blur, tilt.z - current values
 * // setTilt(newTiltState) - update tilt state
 * ```
 */
export const useTilt = () => useContext(TiltContext);

/**
 * TiltProvider - Context provider component for tilt effects
 * 
 * Manages the tilt state using React's useState hook and provides
 * the state and update function to all child components through context.
 * 
 * This provider is typically placed high in the component tree (in Providers.tsx)
 * so that all components that need tilt effects can access the shared state.
 * 
 * The provider hierarchy ensures that tilt effects are coordinated across
 * the entire application, allowing for smooth transitions and consistent
 * visual behavior.
 * 
 * @param {React.ReactNode} children - Child components that will have access to tilt context
 * 
 * Provider hierarchy (from Providers.tsx):
 * ThemeProvider → UserProvider → ActivityProvider → LayersProvider → 
 * TabBackgroundProvider → TransitionProvider → 
 * TiltProvider → PhoneEffectsProvider
 */
export const TiltProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize tilt state with default values (no tilt, no blur, no rotation)
  const [tilt, setTilt] = useState<TiltState>(defaultTilt);

  return (
    <TiltContext.Provider value={{ tilt, setTilt }}>
      {children}
    </TiltContext.Provider>
  );
};

// Export the context for direct access if needed (rarely used)
export default TiltContext; 