import { NavigateFunction } from 'react-router-dom';
import { TransitionType, defaultTransition } from 'src/containers/TransitionContext';

type DelayedNavigationParams = {
  route: string;
  delay?: number;
  transition?: TransitionType;
  navigate: NavigateFunction;
  setTransition: (transition: TransitionType) => void;
};

let timeoutId: ReturnType<typeof setTimeout> | undefined;

/**
 * Navigates to a specified route after a delay
 * @param params - Navigation parameters including route, delay, and optional transition
 * @returns A function to cancel the delayed navigation if needed
 */
export const delayedNavigation = ({
  route,
  delay = 300, // Default to 300ms to match typical transition duration
  transition = defaultTransition,
  navigate,
  setTransition
}: DelayedNavigationParams): (() => void) => {
  // Clear any existing timeout
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  // Set the transition if provided
  if (transition) {
    setTransition(transition);
  }

  // Set up the delayed navigation
  timeoutId = setTimeout(() => {
    navigate(route);
  }, delay);

  // Return a cleanup function
  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
};