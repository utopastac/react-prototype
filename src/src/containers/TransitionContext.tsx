import React, { createContext, useContext, useState } from 'react';

/**
 * TransitionType - Defines the structure for page transition animations
 * 
 * This type represents a complete transition configuration that can be used
 * with Framer Motion's motion components. Each transition consists of:
 * - initial: Starting state of the animation
 * - animate: Target state to animate towards
 * - exit: State when the component is being removed
 * - transition: Optional timing and easing configuration
 */
export type TransitionType = {
  initial: any;
  animate: any;
  exit: any;
  transition?: any;
};

/**
 * TransitionContextType - Defines the context interface
 * 
 * Provides two main functions:
 * - setTransition: Updates the current transition animation
 * - currentTransition: The currently active transition configuration
 */
type TransitionContextType = {
  setTransition: (transition: TransitionType) => void;
  currentTransition: TransitionType;
};

/**
 * Default transition properties used across the application
 * 
 * These values provide consistent timing and easing for all transitions:
 * - duration: 0.3 seconds (300ms) - matches typical mobile app transitions
 * - ease: Custom cubic-bezier curve for smooth, natural motion
 */
export const defaultTransitionProperties = {
  duration: 0.3,
  ease: [0.2, 0.65, 0.3, 0.9]
}

/**
 * Default transition - Standard slide-in from right animation
 * 
 * Used as the fallback transition for most navigation actions.
 * Creates a smooth slide-in effect that feels natural for forward navigation.
 */
export const defaultTransition:TransitionType = {
  initial: { opacity: 0, scale: 0.95, x: 280 },
  animate: { opacity: 1, scale: 1, x: 0 },
  exit: { opacity: 0, scale: 0.95, x: -280 },
  transition: { 
    ...defaultTransitionProperties
  }
};

/**
 * No transition - Instant state change with no animation
 * 
 * Used when you want to change routes without any visual transition,
 * such as for immediate navigation or when animations might be disruptive.
 */
export const noTransition:TransitionType = {
  initial: { opacity: 0, scale: 1, x: 0 },
  animate: { opacity: 1, scale: 1, x: 0 },
  exit: { opacity: 0, x: 0 },
  transition: { 
    duration: 0
  }
};

/**
 * Slide in from right - Enhanced version of default transition
 * 
 * Similar to defaultTransition but with a more subtle exit animation.
 * Used for forward navigation flows where you want a gentler exit effect.
 */
export const slideInRight:TransitionType = {
  initial: { opacity: 0, scale: 0.95, x: 280 },
  animate: { opacity: 1, scale: 1, x: 0 },
  exit: { opacity: 0, scale: 0.95, x: -50 },
  transition: { 
    ...defaultTransitionProperties
  }
};

/**
 * Slide in from left - Backward navigation animation
 * 
 * Used when navigating back in the app's history or when going to
 * a previous screen. Creates a natural "going back" feeling.
 */
export const slideInLeft:TransitionType = {
  initial: { opacity: 0, scale: 0.95, x: -280 },
  animate: { opacity: 1, scale: 1, x: 0 },
  exit: { opacity: 0, scale: 0.95, x: 50 },
  transition: { 
    ...defaultTransitionProperties
  }
};

/**
 * Slide in from bottom - Modal-like upward animation
 * 
 * Used for content that should appear from below, such as modals,
 * bottom sheets, or content that feels like it's "rising up".
 */
export const slideInUp:TransitionType = {
  initial: { opacity: 0, scale: 0.95, y: 280 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -50 },
  transition: { 
    ...defaultTransitionProperties
  }
};

/**
 * Slide in over - Modal overlay animation
 * 
 * Used for modal dialogs and overlays that should appear over
 * existing content. The initial state starts below the viewport
 * and animates up to cover the screen.
 */
export const slideInOver:TransitionType = {
  initial: { opacity: 1, scale: 1, y: 700 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0.7, scale: 0.9, y: 50 },
  transition: { 
    ...defaultTransitionProperties
  }
};

/**
 * Close modal - Modal dismissal animation
 * 
 * Used when closing modals or overlays. The exit animation
 * slides the content down and out of view, creating a natural
 * "closing" effect.
 */
export const closeModal:TransitionType = {
  initial: { opacity: 0.7, scale: 0.9, y: 50 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 1, scale: 1, y: 700, zIndex: 1000 },
  transition: { 
    ...defaultTransitionProperties
  }
};

/**
 * Slide in from top - Downward animation
 * 
 * Used for content that should appear from above, such as
 * dropdown menus, notifications, or content that feels like
 * it's "falling down" into place.
 */
export const slideInDown:TransitionType = {
  initial: { opacity: 0, scale: 0.95, y: -280 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 50 },
  transition: { 
    ...defaultTransitionProperties
  }
};

/**
 * Predefined transition collection
 * 
 * Exports all available transitions for easy importing and use
 * throughout the application. This provides a centralized place
 * to manage all transition animations.
 */
export const transitions = {
  defaultTransition,
  slideInRight,
  slideInLeft,
  slideInUp,
  slideInOver,
  closeModal,
  slideInDown
};

/**
 * TransitionContext - React context for managing page transitions
 * 
 * Creates a context that provides transition state management
 * throughout the application. The context value includes:
 * - setTransition: Function to update the current transition
 * - currentTransition: The currently active transition configuration
 */
const TransitionContext = createContext<TransitionContextType>({
  setTransition: () => {},
  currentTransition: defaultTransition
});

/**
 * TransitionProvider - Context provider component
 * 
 * Wraps the application to provide transition state management.
 * Uses useState to manage the current transition and provides
 * a setTransition function to update it.
 * 
 * Usage:
 * <TransitionProvider>
 *   <App />
 * </TransitionProvider>
 * 
 * The provider is typically included in the main Providers component
 * and is used by:
 * - AnimatedRoutes: Applies transitions to route changes
 * - useTransitionNavigate: Combines navigation with transitions
 * - useButtonAction: Handles button actions with transitions
 * - TopBar: Manages back navigation transitions
 * 
 * @param children - React children to wrap with transition context
 */
export const TransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTransition, setCurrentTransition] = useState<TransitionType>(defaultTransition);

  /**
   * setTransition - Updates the current transition animation
   * 
   * This function is called whenever a component wants to change
   * the transition animation. It updates the state and logs the
   * transition for debugging purposes.
   * 
   * @param transition - The new transition configuration to apply
   */
  const setTransition = (transition: TransitionType) => {
    setCurrentTransition(transition);
    console.log(transition)
  };

  return (
    <TransitionContext.Provider value={{ setTransition, currentTransition }}>
      {children}
    </TransitionContext.Provider>
  );
};

/**
 * useTransition - Custom hook to access transition context
 * 
 * Provides a convenient way to access the transition context
 * from any component within the TransitionProvider.
 * 
 * Returns an object with:
 * - setTransition: Function to update the current transition
 * - currentTransition: The currently active transition configuration
 * 
 * @returns TransitionContextType - The transition context value
 * 
 * @example
 * const { setTransition, currentTransition } = useTransition();
 * 
 * // Set a new transition
 * setTransition(slideInRight);
 * 
 * // Access current transition
 * console.log(currentTransition);
 */
export const useTransition = () => useContext(TransitionContext);