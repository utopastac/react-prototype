import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useSpinning } from 'src/hooks/useSpinning';
import { TiltState } from 'src/containers/TiltContext';

/**
 * PhoneEffectsContext - Centralized state management for phone interface effects
 * 
 * This context provides a unified interface for controlling various phone effects
 * and animations applied to the phone interface in the Interventions Hub. It manages:
 * 
 * - Phone visibility (show/hide the entire phone interface)
 * - Phone tilt effects (3D tilt based on mouse movement)
 * - Spinning animations (continuous rotation with blur effects)
 * - Blur effects (applied during tilt or spinning)
 * - Bounce animations (spring-like bouncing effects)
 * - Scale animations (zoom in/out effects)
 * 
 * The context integrates with:
 * - App.tsx: Main application component that applies these effects
 * - DevTools: Admin interface for toggling effects via UI controls
 * - Keyboard shortcuts: Global hotkeys for quick effect toggling
 * - TiltContainer: Component that applies tilt transforms
 * - Phone effects components: BounceEffect, ScaleContainer, etc.
 * 
 * Usage patterns:
 * - Keyboard shortcuts: "/" (hide), "," (tilt), "wow" (spin), "blur", "bounce", "scale"
 * - ESC key: Clears all active effects
 * - DevTools panel: UI controls for all effects
 * - Programmatic: Direct function calls for custom interactions
 */
interface PhoneEffectsContextType {
  // Phone visibility - controls whether the entire phone interface is rendered
  phoneVisible: boolean;
  togglePhoneVisibility: () => void;
  
  // Phone tilt - enables/disables 3D tilt effects based on mouse movement
  phoneTilt: boolean;
  togglePhoneTilt: () => void;
  
  // Spinning - continuous rotation animation with dynamic speed and blur
  isSpinning: boolean;
  toggleSpinning: () => void;
  
  // Blur - applies blur effects during tilt or spinning animations
  blurEnabled: boolean;
  toggleBlur: () => void;
  
  // Bounce - spring-like bouncing animation effect
  bounceEnabled: boolean;
  toggleBounce: () => void;
  
  // Scale - zoom in/out animation effect
  scaleEnabled: boolean;
  toggleScale: () => void;
  
  // Tilt state - current 3D transform values (x, y, blur, z rotation)
  tilt: TiltState;
  setTilt: (tilt: TiltState) => void;
}

// Create the React context with undefined as initial value
// This ensures proper TypeScript checking when consuming the context
const PhoneEffectsContext = createContext<PhoneEffectsContextType | undefined>(undefined);

interface PhoneEffectsProviderProps {
  children: React.ReactNode;
}

/**
 * PhoneEffectsProvider - Context provider component
 * 
 * Manages all phone effect states and provides toggle functions for each effect.
 * Integrates with the useSpinning hook for advanced spinning animations.
 * 
 * Key features:
 * - State management for all phone effects
 * - Keyboard shortcut handling (ESC to clear effects)
 * - Integration with spinning hook for complex animations
 * - Callback memoization for performance optimization
 * 
 * Provider hierarchy (from Providers.tsx):
 * ThemeProvider → UserProvider → ActivityProvider → LayersProvider → 
 * TransitionProvider → TiltProvider → PhoneEffectsProvider
 */
export const PhoneEffectsProvider: React.FC<PhoneEffectsProviderProps> = ({ children }) => {
  // Core phone effect states - all default to safe values
  const [phoneVisible, setPhoneVisible] = useState<boolean>(true);  // Phone starts visible
  const [phoneTilt, setPhoneTilt] = useState<boolean>(false);       // Tilt starts disabled
  const [blurEnabled, setBlurEnabled] = useState<boolean>(false);   // Blur starts disabled
  const [bounceEnabled, setBounceEnabled] = useState<boolean>(false); // Bounce starts disabled
  const [scaleEnabled, setScaleEnabled] = useState<boolean>(false); // Scale starts disabled
  
  // Integrate with useSpinning hook for advanced spinning animations
  // This hook manages complex rotation logic, speed changes, and blur effects
  const { isSpinning, toggleSpinning, stopSpinning, tilt, setTilt } = useSpinning();

  /**
   * Toggle phone visibility on/off
   * Used by "/" keyboard shortcut and DevTools controls
   * When disabled, the entire phone interface is hidden from view
   */
  const togglePhoneVisibility = useCallback(() => {
    setPhoneVisible(prev => !prev);
  }, []);

  /**
   * Toggle phone tilt effect on/off
   * Used by "," keyboard shortcut and DevTools controls
   * Stops spinning when enabling tilt to prevent conflicts
   * When enabled, phone responds to mouse movement with 3D tilt effects
   */
  const togglePhoneTilt = useCallback(() => {
    stopSpinning(); // Prevent conflicts between spinning and tilt
    setPhoneTilt(prev => !prev);
  }, [stopSpinning]);

  /**
   * Toggle blur effect on/off
   * Used by "blur" keyboard shortcut and DevTools controls
   * When enabled, applies blur during tilt or spinning animations
   */
  const toggleBlur = useCallback(() => {
    setBlurEnabled(prev => !prev);
  }, []);

  /**
   * Toggle bounce effect on/off
   * Used by "bounce" keyboard shortcut and DevTools controls
   * When enabled, applies spring-like bouncing animation to the phone
   */
  const toggleBounce = useCallback(() => {
    setBounceEnabled(prev => !prev);
  }, []);

  /**
   * Toggle scale effect on/off
   * Used by "scale" keyboard shortcut and DevTools controls
   * When enabled, applies zoom in/out animation to the phone
   */
  const toggleScale = useCallback(() => {
    setScaleEnabled(prev => !prev);
  }, []);

  /**
   * Global keyboard shortcut handler for clearing all active phone effects
   * 
   * Listens for ESC key press and clears all active effects:
   * - Stops spinning animation if active
   * - Disables bounce effect if active
   * - Disables blur effect if active
   * - Disables scale effect if active
   * 
   * This provides a quick "reset" mechanism for users to clear all effects
   * and return to the default phone state.
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Clear spinning animation
        if (isSpinning) {
          stopSpinning();
        }
        // Clear bounce effect
        if (bounceEnabled) {
          setBounceEnabled(false);
        }
        // Clear blur effect
        if (blurEnabled) {
          setBlurEnabled(false);
        }
        // Clear scale effect
        if (scaleEnabled) {
          setScaleEnabled(false);
        }
      }
    };

    // Add global keyboard listener
    window.addEventListener('keydown', handleEscape);
    
    // Cleanup listener on unmount
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isSpinning, bounceEnabled, blurEnabled, scaleEnabled, stopSpinning]);

  // Create the context value object with all state and functions
  // This is memoized implicitly by React's context system
  const value = {
    phoneVisible,
    togglePhoneVisibility,
    phoneTilt,
    togglePhoneTilt,
    isSpinning,
    toggleSpinning,
    blurEnabled,
    toggleBlur,
    bounceEnabled,
    toggleBounce,
    scaleEnabled,
    toggleScale,
    tilt,
    setTilt
  };

  return (
    <PhoneEffectsContext.Provider value={value}>
      {children}
    </PhoneEffectsContext.Provider>
  );
};

/**
 * usePhoneEffects - Custom hook for consuming PhoneEffectsContext
 * 
 * Provides type-safe access to all phone effect state and functions.
 * Must be used within a PhoneEffectsProvider component.
 * 
 * Usage examples:
 * ```tsx
 * const { phoneVisible, togglePhoneVisibility, isSpinning } = usePhoneEffects();
 * 
 * // Toggle phone visibility
 * togglePhoneVisibility();
 * 
 * // Check if spinning is active
 * if (isSpinning) {
 *   // Handle spinning state
 * }
 * ```
 * 
 * @throws {Error} If used outside of PhoneEffectsProvider
 * @returns {PhoneEffectsContextType} All phone effect state and functions
 */
export const usePhoneEffects = (): PhoneEffectsContextType => {
  const context = useContext(PhoneEffectsContext);
  if (context === undefined) {
    throw new Error('usePhoneEffects must be used within a PhoneEffectsProvider');
  }
  return context;
}; 