import React, { createContext, useContext, useReducer, Dispatch, ReactNode, ComponentType } from 'react';

/**
 * Layer Type Definition
 * 
 * Represents a UI layer that can be stacked on top of the main application.
 * Each layer contains a React component and optional props to pass to that component.
 * 
 * This system is used for managing modals, halfsheets, overlays, and other UI elements
 * that need to appear above the main content with proper z-index stacking.
 */
type Layer = {
  component: ComponentType<any>;  // The React component to render
  props?: Record<string, any>;    // Optional props to pass to the component
};

/**
 * Layer Action Types
 * 
 * Defines all possible actions that can be performed on the layers stack:
 * - ADD_LAYER: Adds a new layer to the top of the stack
 * - REMOVE_LAYER: Removes the topmost layer from the stack
 * - CLOSE_LAYERS: Removes all layers (clears the entire stack)
 * - CHANGE_LAYER: Replaces the topmost layer with a new one
 */
type LayerAction = 
  | { type: typeof ADD_LAYER; component: ComponentType<any>; props?: Record<string, any> }
  | { type: typeof REMOVE_LAYER }
  | { type: typeof CLOSE_LAYERS }
  | { type: typeof CHANGE_LAYER; component: ComponentType<any>; props?: Record<string, any> };

/**
 * React Contexts for Layer Management
 * 
 * Two separate contexts are used to follow React's recommended pattern for complex state:
 * - LayersContext: Provides the current array of layers (read-only)
 * - LayersDispatchContext: Provides the dispatch function to modify layers (write-only)
 * 
 * This separation allows components to subscribe only to the data they need,
 * preventing unnecessary re-renders when only the dispatch function changes.
 */
const LayersContext = createContext<Layer[]>([]);
const LayersDispatchContext = createContext<Dispatch<LayerAction> | null>(null);

/**
 * LayersProvider Component
 * 
 * Wraps the application to provide layer management functionality.
 * Uses useReducer to manage the layers state with predictable state transitions.
 * 
 * Usage:
 * <LayersProvider>
 *   <App />
 * </LayersProvider>
 * 
 * @param children - React children to wrap with layer context
 */
export function LayersProvider({ children }: { children: ReactNode }) {
  const [layers, dispatch] = useReducer(LayersReducer, [] as Layer[]);

  return (
    <LayersContext.Provider value={layers}>
      <LayersDispatchContext.Provider value={dispatch}>
        {children}
      </LayersDispatchContext.Provider>
    </LayersContext.Provider>
  );
}

/**
 * useLayers Hook
 * 
 * Custom hook to access the current layers array.
 * Returns the read-only array of active layers.
 * 
 * Usage:
 * const layers = useLayers();
 * 
 * @returns Array of Layer objects representing the current layer stack
 */
export function useLayers() {
  return useContext(LayersContext);
}

/**
 * useLayersDispatch Hook
 * 
 * Custom hook to access the dispatch function for modifying layers.
 * Returns the dispatch function that can be used to add, remove, or modify layers.
 * 
 * Usage:
 * const layersDispatch = useLayersDispatch();
 * layersDispatch({ type: ADD_LAYER, component: MyModal, props: { title: "Hello" } });
 * 
 * @returns Dispatch function for layer actions, or null if not within provider
 */
export function useLayersDispatch() {
  return useContext(LayersDispatchContext);
}

/**
 * LayersReducer Function
 * 
 * Pure function that handles all layer state transitions based on dispatched actions.
 * Implements a stack-like behavior where layers are added/removed from the top.
 * 
 * State Management Patterns:
 * - Stack-based: New layers are added to the top, removed from the top
 * - Immutable: Always returns a new array, never mutates existing state
 * - Predictable: Each action has a clear, deterministic outcome
 * 
 * @param layers - Current array of layers (previous state)
 * @param action - Action to perform on the layers
 * @returns New array of layers (new state)
 */
function LayersReducer(layers: Layer[], action: LayerAction): Layer[] {
  switch (action.type) {
    case ADD_LAYER: {
      // Add a new layer to the top of the stack
      // This is used for opening modals, halfsheets, and other overlays
      return [...layers, { component: action.component, props: action.props }];
    }
    case REMOVE_LAYER: {
      // Remove the topmost layer from the stack
      // This is used for closing the most recent modal/overlay
      return layers.slice(0, layers.length - 1);
    }
    case CLOSE_LAYERS: {
      // Remove all layers, clearing the entire stack
      // This is used for emergency close or reset scenarios
      return [];
    }
    case CHANGE_LAYER: {
      // Replace the topmost layer with a new one
      // This is used for transitioning between different modals without closing
      if (layers.length === 0) {
        // If no layers exist, create a new layer
        return [{ component: action.component, props: action.props }];
      }
      // Replace the last layer while keeping all previous layers
      return [
        ...layers.slice(0, layers.length - 1),
        { component: action.component, props: action.props }
      ];
    }
    default: {
      // TypeScript exhaustive check - ensures all action types are handled
      throw Error('Unknown action: ' + (action as any).type);
    }
  }
}

/**
 * Layer Action Constants
 * 
 * String constants used to identify different types of layer actions.
 * These are exported for use in components that need to dispatch layer actions.
 * 
 * Usage Examples:
 * - ADD_LAYER: Open a modal or halfsheet
 * - REMOVE_LAYER: Close the current modal
 * - CLOSE_LAYERS: Close all open modals
 * - CHANGE_LAYER: Switch from one modal to another
 */
export const ADD_LAYER = "LAYERS_ACTION_ADD";
export const REMOVE_LAYER = "LAYERS_ACTION_REMOVE";
export const CLOSE_LAYERS = "LAYERS_ACTION_CLOSE";
export const CHANGE_LAYER = "LAYERS_ACTION_CHANGE";
