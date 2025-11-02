import React, { useCallback, useMemo, useEffect, useState } from 'react';
import AnimatedRoutes from 'src/components/AnimatedRoutes';
import TiltContainer from 'src/components/PhoneEffects/TiltContainer';
import { TiltState } from 'src/containers/TiltContext';
import Layers from 'src/components/Layers';
import styles from "./app.module.sass";
import IOSStatusBar from 'src/components/IOSStatusBar';
import IOSHomeIndicator from 'src/components/IOSHomeIndicator';
import DevTools from 'src/admin/DevTools';
import BounceEffect from 'src/components/PhoneEffects/BounceEffect';
import ScaleContainer from 'src/components/PhoneEffects/ScaleContainer';
import useStringEndsWith from 'src/hooks/useStringEndsWith';
import { usePhoneEffects } from 'src/containers/PhoneEffectsContext';
import Icon, { ICON_24, ICON_PROMINENT } from 'src/components/Icon';
import * as Icons from 'src/data/Icons';
import { useNavigate } from 'react-router-dom';
import { isEditingField } from 'src/helpers/Utils';

// Valid keyboard patterns for phone control shortcuts
const VALID_KEYBOARD_PATTERNS = ['/', ',', 'wow', 'blur', 'bounce', 'scale'] as const;
type KeyboardPattern = typeof VALID_KEYBOARD_PATTERNS[number];

/**
 * Props interface for the main App component
 * These props control the visual appearance and behavior of the app
 */
interface AppProps {
  theme: string;        // Theme variant (light/dark)
  scale: string;        // Text scaling factor
  device: string;       // Device type for responsive design
  tabBackground: string; // Background color for tabs
}

/**
 * Main App component that serves as the root of the Interventions Hub interface
 * Handles phone effects, keyboard shortcuts, and navigation
 */
const App: React.FC<AppProps> = ({ theme, scale, device, tabBackground }) => {
  // Phone effects context provides state and controls for phone visibility and animations
  const { 
    phoneVisible,      // Whether the phone interface is visible
    phoneTilt,         // Whether phone tilt effect is enabled
    isSpinning,        // Whether phone is spinning
    blurEnabled,       // Whether blur effect is enabled
    bounceEnabled,     // Whether bounce effect is enabled
    scaleEnabled,      // Whether scale effect is enabled
    tilt,              // Current tilt state
    setTilt,           // Function to update tilt state
    togglePhoneVisibility, // Toggle phone visibility
    togglePhoneTilt,   // Toggle phone tilt effect
    toggleSpinning,    // Toggle spinning animation
    toggleBlur,        // Toggle blur effect
    toggleBounce,      // Toggle bounce effect
    toggleScale        // Toggle scale effect
  } = usePhoneEffects();
  
  const navigate = useNavigate();

  // DevTools panel state management
  const [isToolsOpen, setIsToolsOpen] = useState(true);
  const toggleTools = useCallback(() => {
    setIsToolsOpen(prev => !prev);
  }, []);

  /**
   * Global keyboard shortcut handler for DevTools
   * Opens/closes DevTools panel with Cmd+. (Mac) or Ctrl+. (Windows/Linux)
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when user is editing input fields
      if (isEditingField()) return;
      
      // Cmd+. or Ctrl+. to toggle DevTools
      if ((e.metaKey || e.ctrlKey) && e.key === '.') {
        e.preventDefault();
        toggleTools();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleTools]);

  /**
   * Handles keyboard pattern matches for phone control shortcuts
   * Maps specific key sequences to phone effect toggles
   */
  const handleInput = useCallback((pattern: string) => {
    if (!VALID_KEYBOARD_PATTERNS.includes(pattern as KeyboardPattern)) return;
    
    switch (pattern) {
      case '/':           // Toggle phone visibility
        togglePhoneVisibility();
        break;
      case ',':           // Toggle phone tilt effect
        togglePhoneTilt();
        break;
      case 'wow':         // Toggle spinning animation
        toggleSpinning();
        break;
      case 'blur':        // Toggle blur effect
        toggleBlur();
        break;
      case 'bounce':      // Toggle bounce effect
        toggleBounce();
        break;
      case 'scale':       // Toggle scale effect
        toggleScale();
        break;
    }
  }, [togglePhoneVisibility, togglePhoneTilt, toggleSpinning, toggleBlur, toggleBounce, toggleScale]);

  /**
   * Keyboard buffer hook that listens for specific key sequences
   * Triggers phone effect toggles when patterns are matched
   */
  useStringEndsWith({
    onMatch: handleInput,
    matchPatterns: [...VALID_KEYBOARD_PATTERNS]
  });

  /**
   * Handles tilt changes from the TiltContainer component
   * Only applies tilt effects when phone tilt is enabled and not spinning
   * Conditionally applies blur based on blurEnabled state
   */
  const handleTiltChange = useCallback((newTilt: TiltState) => {
    if(phoneTilt === true && !isSpinning) {
      setTilt({
        ...newTilt,
        blur: blurEnabled ? newTilt.blur : 0
      });
    }
  }, [phoneTilt, isSpinning, setTilt, blurEnabled]);

  // Memoize the routes to prevent unnecessary re-renders
  const routes = useMemo(() => (
    <div className={styles.routes}>
      <AnimatedRoutes />
    </div>
  ), []);

  return (
    <div 
      className={styles.Main}
      data-theme={theme}
      data-text-scale={scale}
      data-device={device}
      data-tab-bg={tabBackground}
    >
      {/* Home Button - Navigates to the main money view */}
      <button
        className={styles.homeButton}
        onClick={() => navigate('/money')}
        aria-label="Go to home"
        type="button"
      >
        <Icon icon={Icons.LogoUsd} size={ICON_24} color={ICON_PROMINENT} className={styles.homeIcon} />
      </button>
      
      <div className={styles.RootWrapper}>
        {/* Scale effect container - applies scaling animations */}
        <ScaleContainer enabled={scaleEnabled}>
          {/* Bounce effect container - applies bouncing animations */}
          <BounceEffect enabled={bounceEnabled}>
            {/* Phone interface - only renders when phoneVisible is true */}
            { phoneVisible &&
              <TiltContainer onTiltChange={handleTiltChange} tilt={tilt}>
                {/* Main application routes */}
                {routes}
                
                {/* iOS-style interface elements */}
                <IOSHomeIndicator/>
                <IOSStatusBar />
                
                {/* Layer management for overlays and modals */}
                <Layers />
              </TiltContainer>
            }
          </BounceEffect>
        </ScaleContainer>
      </div>
      
      {/* Development tools panel */}
      <DevTools isToolsOpen={isToolsOpen} toggleTools={toggleTools} />
    </div>
  );
}

export default App;