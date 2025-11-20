import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransition, defaultTransition } from 'src/containers/TransitionContext';
import type { TransitionType } from 'src/containers/TransitionContext';

/**
 * Custom hook that combines React Router navigation with transition animations.
 * 
 * This hook provides a unified way to navigate between routes while triggering
 * smooth page transitions. It's used throughout the app to create consistent
 * navigation experiences with visual feedback.
 * 
 * The hook works by:
 * 1. Setting the desired transition animation via the TransitionContext
 * 2. Using a microtask (Promise.resolve().then()) to ensure the transition
 *    is set before navigation occurs
 * 3. Navigating to the specified path using React Router
 * 
 * Usage patterns found in the codebase:
 * - Avatar clicks in TitleBar: transitionNavigate('/account', transitions.slideInOver)
 * - Back button navigation: transitionNavigate(-1, transitions.closeModal)
 * - Button actions with custom transitions for different navigation contexts
 * 
 * @returns A function that accepts a path (string or number) and optional transition
 * 
 * @example
 * const transitionNavigate = useTransitionNavigate();
 * 
 * // Navigate to a specific route with default transition
 * transitionNavigate('/account');
 * 
 * // Navigate with custom transition animation
 * transitionNavigate('/settings', transitions.slideInRight);
 * 
 * // Navigate back in history with close modal transition
 * transitionNavigate(-1, transitions.closeModal);
 */
export function useTransitionNavigate() {
  const navigate = useNavigate();
  const { setTransition } = useTransition();

  return useCallback((path: string | number, transition?: TransitionType) => {
    // Set the transition animation (defaults to defaultTransition if none provided)
    setTransition(transition || defaultTransition);
    
    // Use a microtask to ensure the transition is set before navigation
    // This prevents race conditions where navigation might occur before
    // the transition context is updated
    Promise.resolve().then(() => {
      if (typeof path === 'number') {
        navigate(path); // History navigation (e.g., -1 for back, 1 for forward)
      } else {
        navigate(path); // Path navigation (e.g., '/account', '/settings')
      }
    });
  }, [navigate, setTransition]);
}

// Re-export types and transitions for convenience
export type { TransitionType } from 'src/containers/TransitionContext';
export { transitions } from 'src/containers/TransitionContext';