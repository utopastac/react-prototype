import { useNavigate } from 'react-router-dom';
import { useTransition, TransitionType } from 'src/containers/TransitionContext';
import { useLayersDispatch, ADD_LAYER, REMOVE_LAYER } from 'src/containers/LayersContext';
import React from 'react';

/**
 * Button Action Constants
 * 
 * These constants define the three main types of actions that buttons can perform:
 * - CLICK: Executes a simple onClick function
 * - PATH: Navigates to a new route with optional transition animation
 * - HALFSHEET: Opens a modal/halfsheet overlay
 */
export const BUTTON_ACTION_CLICK = "BUTTON_ACTION_CLICK";
export const BUTTON_ACTION_PATH = "BUTTON_ACTION_PATH";
export const BUTTON_ACTION_HALFSHEET = "BUTTON_ACTION_HALFSHEET";

/**
 * Union type for all possible button action types
 */
export type BUTTON_ACTIONS =
  typeof BUTTON_ACTION_CLICK |
  typeof BUTTON_ACTION_PATH |
  typeof BUTTON_ACTION_HALFSHEET;

/**
 * ButtonAction Interface
 * 
 * Defines the structure for button actions with the following properties:
 * - type: The action type (CLICK, PATH, or HALFSHEET)
 * - path: Optional route path for navigation (used with PATH type)
 * - transition: Optional transition animation (used with PATH type)
 * - halfSheet: Optional React component for modal overlay (used with HALFSHEET type)
 * - halfSheetProps: Optional props to pass to the halfsheet component
 */
export interface ButtonAction {
  type: BUTTON_ACTIONS;
  path?: string;
  transition?: TransitionType;
  halfSheet?: React.ComponentType;
  halfSheetProps?: object;
}

/**
 * Props for the useButtonAction hook
 * 
 * - action: Optional ButtonAction object that defines the action to perform
 * - onClick: Optional fallback function to call if no action is provided
 */
type UseButtonActionProps = {
  action?: ButtonAction;
  onClick?: () => void;
};

/**
 * useButtonAction Hook
 * 
 * A centralized hook that handles different types of button interactions across the app.
 * This hook provides a unified way to handle navigation, modal opening, and simple clicks.
 * 
 * Usage Patterns:
 * 
 * 1. Simple Click (no action provided):
 *    const clickHandler = useButtonAction({ onClick: () => console.log('clicked') });
 * 
 * 2. Navigation with transition:
 *    const clickHandler = useButtonAction({ 
 *      action: { 
 *        type: BUTTON_ACTION_PATH, 
 *        path: '/account', 
 *        transition: transitions.defaultTransition 
 *      } 
 *    });
 * 
 * 3. Open halfsheet modal:
 *    const clickHandler = useButtonAction({ 
 *      action: { 
 *        type: BUTTON_ACTION_HALFSHEET, 
 *        halfSheet: AccountSwitcherHalfsheet 
 *      } 
 *    });
 * 
 * 4. Simple action execution:
 *    const clickHandler = useButtonAction({ 
 *      action: { type: BUTTON_ACTION_CLICK }, 
 *      onClick: () => handleSubmit() 
 *    });
 * 
 * Dependencies:
 * - useNavigate: For route navigation
 * - useTransition: For managing page transition animations
 * - useLayersDispatch: For managing modal/halfsheet layers
 * 
 * @param props - Object containing optional action and onClick function
 * @returns A memoized click handler function that executes the appropriate action
 */
export function useButtonAction({ action, onClick }: UseButtonActionProps) {
  const navigate = useNavigate();
  const { setTransition } = useTransition();
  const layersDispatch = useLayersDispatch();

  const handleAction = React.useCallback(() => {
    if (action) {
      switch (action.type) {
        case BUTTON_ACTION_CLICK:
          // Execute the provided onClick function if available
          if (onClick) onClick();
          break;
          
        case BUTTON_ACTION_PATH:
          // Set transition animation if provided
          action.transition && setTransition(action.transition);
          // Remove any existing modal layers before navigation
          layersDispatch && layersDispatch({ type: REMOVE_LAYER });
          // Navigate to the specified path
          action.path && navigate(action.path);
          break;
          
        case BUTTON_ACTION_HALFSHEET:
          // Add a new modal layer with the specified component
          if (action.halfSheet && layersDispatch) {
            layersDispatch({
              type: ADD_LAYER,
              component: action.halfSheet,
              props: action.halfSheetProps,
            });
          }
          break;
          
        default:
          break;
      }
    } else {
      // Fallback: execute onClick if no action is provided
      onClick && onClick();
    }
  }, [action, onClick, navigate, setTransition, layersDispatch]);

  return handleAction;
} 