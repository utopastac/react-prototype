// componentHandlers.ts
//
// Generic handler functions for manipulating the list of components in the admin UI.
// Includes delete, duplicate, move up/down, and selection navigation.
// Used by AdminView and related components for layout editing actions.

import type { LayoutState } from './LayoutContext';

interface DroppedComponent {
  name: string;
  Component: React.ComponentType<any>;
  props: any;
}

interface HandlerParams {
  dispatch: (action: { type: 'UPDATE'; payload: Partial<LayoutState> }) => void;
  selectedIdx: number | null;
  components: LayoutState['components'];
  setSelectedIdx: (idx: number | null) => void;
}

/**
 * handleDelete
 *
 * Removes the selected component from the components list.
 * After deletion, selects the previous component if possible, or clears selection.
 */
export function handleDelete(params: HandlerParams) {
  if (params.selectedIdx === null) return;
  const newComponents = params.components.filter((_, i) => i !== params.selectedIdx);
  const newSelectedIdx = params.selectedIdx > 0 ? params.selectedIdx - 1 : null;
  params.dispatch({ type: 'UPDATE', payload: { components: newComponents } });
  params.setSelectedIdx(newSelectedIdx);
}

/**
 * handleDuplicate
 *
 * Duplicates the selected component, inserting the copy immediately after the original.
 * The new component is selected after duplication.
 */
export function handleDuplicate(params: HandlerParams) {
  if (params.selectedIdx === null || !params.components[params.selectedIdx]) return;
  const item = params.components[params.selectedIdx];
  const newComponents = [...params.components];
  newComponents.splice(params.selectedIdx + 1, 0, {
    ...item,
    props: { ...item.props },
  });
  params.dispatch({ type: 'UPDATE', payload: { components: newComponents } });
  params.setSelectedIdx(params.selectedIdx + 1);
}

/**
 * handleMoveUp
 *
 * Moves the selected component up by one position in the components list.
 * After moving, the moved component remains selected.
 */
export function handleMoveUp(params: HandlerParams) {
  if (params.selectedIdx === null || params.selectedIdx <= 0) return;
  const newComponents = [...params.components];
  [newComponents[params.selectedIdx - 1], newComponents[params.selectedIdx]] = [newComponents[params.selectedIdx], newComponents[params.selectedIdx - 1]];
  params.dispatch({ type: 'UPDATE', payload: { components: newComponents } });
  params.setSelectedIdx(params.selectedIdx - 1);
}

/**
 * handleMoveDown
 *
 * Moves the selected component down by one position in the components list.
 * After moving, the moved component remains selected.
 */
export function handleMoveDown(params: HandlerParams) {
  if (params.selectedIdx === null || params.selectedIdx >= params.components.length - 1) return;
  const newComponents = [...params.components];
  [newComponents[params.selectedIdx + 1], newComponents[params.selectedIdx]] = [newComponents[params.selectedIdx], newComponents[params.selectedIdx + 1]];
  params.dispatch({ type: 'UPDATE', payload: { components: newComponents } });
  params.setSelectedIdx(params.selectedIdx + 1);
}

/**
 * handleSelectPrevious
 *
 * Selects the previous component in the components list.
 * If nothing is selected, selects the last component.
 *
 * @param setSelectedIdx - setter for selected index
 * @param selectedIdx - current selected index
 * @param components - current components array
 */
export function handleSelectPrevious(params: HandlerParams) {
  if (params.selectedIdx === null) {
    // If nothing is selected, select the last component
    if (params.components.length > 0) {
      params.setSelectedIdx(params.components.length - 1);
    }
  } else if (params.selectedIdx > 0) {
    // Select the previous component
    params.setSelectedIdx(params.selectedIdx - 1);
  }
}

/**
 * handleSelectNext
 *
 * Selects the next component in the components list.
 * If nothing is selected, selects the first component.
 *
 * @param setSelectedIdx - setter for selected index
 * @param selectedIdx - current selected index
 * @param components - current components array
 */
export function handleSelectNext(params: HandlerParams) {
  if (params.selectedIdx === null) {
    // If nothing is selected, select the first component
    if (params.components.length > 0) {
      params.setSelectedIdx(0);
    }
  } else if (params.selectedIdx < params.components.length - 1) {
    // Select the next component
    params.setSelectedIdx(params.selectedIdx + 1);
  }
} 