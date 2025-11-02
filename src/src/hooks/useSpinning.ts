import { useState, useEffect, useRef } from 'react';
import { TiltState } from 'src/containers/TiltContext';

/**
 * Custom hook that manages a spinning animation effect for the phone interface
 * 
 * This hook is used in the PhoneEffectsContext to provide a spinning animation
 * that can be triggered via keyboard shortcuts (typing "wow") or through the
 * DevTools panel. The spinning effect creates a continuous rotation animation
 * with dynamic speed changes and blur effects.
 * 
 * Usage in the app:
 * - App.tsx: Used via PhoneEffectsContext to enable/disable spinning
 * - PhoneEffectsContext.tsx: Integrates spinning with other phone effects
 * - DevTools: Provides UI controls for toggling the spinning effect
 * - TiltContainer: Applies the spinning rotation via CSS transforms
 * 
 * The spinning effect overrides normal tilt controls when active and provides
 * a smooth, performance-optimized animation using requestAnimationFrame.
 */
export const useSpinning = () => {
  // State to track whether the spinning animation is currently active
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  
  // Current rotation speed in degrees per frame (0-40 range)
  const [spinSpeed, setSpinSpeed] = useState<number>(0);
  
  // Current tilt state including rotation, blur, and position
  // This integrates with the TiltContainer component for tilt effects
  const [tilt, setTilt] = useState<TiltState>({ x: 0, y: 0, blur: 0, z: 0 });
  
  // Ref to track the cumulative rotation angle (in degrees)
  // This persists across animation frames for smooth continuous rotation
  const spinRef = useRef<number>(0);
  
  // Ref to store the current animation frame ID for cleanup
  const animationFrameRef = useRef<number | null>(null);

  /**
   * Main animation effect that handles the spinning animation loop
   * Uses requestAnimationFrame for smooth 60fps animation with proper cleanup
   */
  useEffect(() => {
    if (isSpinning) {
      let lastTime = performance.now();
      
      const animate = (currentTime: number) => {
        // Calculate delta time for frame-rate independent animation
        // This ensures consistent animation speed regardless of device performance
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        
        // Gradually increase spin speed up to a maximum of 40 degrees per frame
        // Creates a smooth acceleration effect when spinning starts
        setSpinSpeed(prev => {
          const newSpeed = Math.min(prev + 0.05, 40);
          return newSpeed;
        });
        
        // Update the cumulative rotation angle based on current speed and delta time
        // Normalize to ~60fps (16ms per frame) for consistent animation
        spinRef.current += spinSpeed * (deltaTime / 16);
        
        // Calculate blur effect based on spin speed
        // Higher speeds create more blur for a dynamic effect
        const spinPercentage = 40/spinSpeed;
        
        // Update tilt state with new rotation and blur values
        // The z-axis rotation creates the spinning effect in TiltContainer
        setTilt(prev => ({
          ...prev,
          z: spinRef.current,
          blur: spinSpeed / (2 * spinPercentage)
        }));
        
        // Continue the animation loop
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      
      // Start the animation loop
      animationFrameRef.current = requestAnimationFrame(animate);
      
      // Cleanup function to cancel animation when component unmounts or spinning stops
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    } else {
      // Reset all spinning values when animation stops
      spinRef.current = 0;
      setSpinSpeed(0);
    }
  }, [isSpinning, spinSpeed]);

  /**
   * Starts the spinning animation with a slow initial speed
   * Called when user triggers spinning via keyboard shortcut or DevTools
   */
  const startSpinning = () => {
    setIsSpinning(true);
    setSpinSpeed(0.1); // Start with slow speed for smooth acceleration
  };

  /**
   * Stops the spinning animation and resets all tilt values to neutral
   * Called when user stops spinning or when ESC key is pressed
   */
  const stopSpinning = () => {
    setIsSpinning(false);
    setTilt({ x: 0, y: 0, blur: 0, z: 0 });
  };

  /**
   * Toggles the spinning animation on/off
   * Used by keyboard shortcuts and DevTools controls
   */
  const toggleSpinning = () => {
    if (isSpinning) {
      stopSpinning();
    } else {
      startSpinning();
    }
  };

  /**
   * Updates the tilt state, but only when not spinning
   * This prevents manual tilt controls from interfering with the spinning animation
   * Used by TiltContainer to apply mouse-based tilt effects
   */
  const updateTilt = (newTilt: TiltState) => {
    if (!isSpinning) {
      setTilt(newTilt);
    }
  };

  return {
    isSpinning,        // Whether spinning animation is currently active
    tilt,              // Current tilt state (x, y, blur, z rotation)
    startSpinning,     // Function to start spinning animation
    stopSpinning,      // Function to stop spinning animation
    toggleSpinning,    // Function to toggle spinning on/off
    setTilt: updateTilt // Function to update tilt (only when not spinning)
  };
}; 