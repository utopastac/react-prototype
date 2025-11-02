import { useNavigate, useLocation } from 'react-router-dom';
import { useTransition } from 'src/containers/TransitionContext';
import { delayedNavigation } from 'src/utils/navigation';
import { TransitionType } from 'src/containers/TransitionContext';
import { useEffect, useRef, useCallback } from 'react';

type DelayedNavigationOptions = {
  route: string;
  delay?: number;
  transition?: TransitionType;
};

type NavigationFunction = (options: DelayedNavigationOptions) => () => void;

/**
 * A hook that provides a convenient way to use delayed navigation
 * @returns A function that takes navigation options and returns a cleanup function
 */
export const useDelayedNavigation = (): NavigationFunction => {
  const navigate = useNavigate();
  const { setTransition } = useTransition();
  const location = useLocation();
  const currentNavigationRef = useRef<(() => void) | null>(null);

  // Set up an effect to cancel navigation if route changes
  useEffect(() => {
    return () => {
      // Clean up the navigation when the route changes
      if (currentNavigationRef.current) {
        currentNavigationRef.current();
      }
    };
  }, [location.pathname]);

  // Create a stable callback that always returns a function
  return useCallback((options: DelayedNavigationOptions) => {
    // Cancel any existing navigation
    if (currentNavigationRef.current) {
      currentNavigationRef.current();
    }

    // Create the navigation function
    const navigationFn = delayedNavigation({
      ...options,
      navigate,
      setTransition
    });

    // Store the current navigation function
    currentNavigationRef.current = navigationFn;

    // Return the navigation function for manual cancellation if needed
    return navigationFn;
  }, [navigate, setTransition]);
}; 