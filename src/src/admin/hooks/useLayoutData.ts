// useLayoutData.ts
//
// Custom React hook for serializing and restoring admin layout state.
// Used by useUrlSharing and useLocalStorage for persistence and sharing.
// Handles mapping between runtime state and serializable layout data.

import { useLayoutContext } from '../LayoutContext';
import { FormblockerComponents } from 'src/data/Components';

export interface LayoutData {
  dropped: Array<{ name: string; props: any }>;
  topBarProps: any;
  showTopBar: boolean;
  bottomButtonsProps: any;
  showBottomButtons: boolean;
  showToast: boolean;
  toastProps: any;
  showStatusBar: boolean; // <-- add
  statusBarProps: any;    // <-- add
  description?: string;   // <-- add for multi-layout compatibility
}

/**
 * useLayoutData (Context version)
 *
 * Provides serialization and restoration of layout state for sharing and persistence.
 * Converts between runtime state (with component references) and serializable data.
 * Uses LayoutContext for state and dispatch.
 * 
 * CRITICAL ISSUE FOR HISTORY SYSTEM:
 * The getLayoutData() function returns a LayoutData object that contains only
 * serializable data (no component references), but the history system stores
 * this exact structure. However, when we restore from history, we call
 * restoreLayout() which expects a LayoutData object and converts it back to
 * runtime state with component references.
 * 
 * This should work correctly, but there might be edge cases where the
 * serialization/deserialization process doesn't preserve all necessary data.
 */
export const useLayoutData = () => {
  const [state, dispatch] = useLayoutContext();

  /**
   * Get current layout data for sharing/downloading
   * 
   * This function serializes the current layout state into a format that can be:
   * - Stored in localStorage
   * - Shared via URL
   * - Saved to history stack
   * - Transmitted over network
   * 
   * It strips out non-serializable data like component references and keeps
   * only the essential layout configuration.
   * 
   * @returns LayoutData object with serializable layout configuration
   */
  const getLayoutData = (): LayoutData => {
    return {
      dropped: state.dropped.map(c => ({ name: c.name, props: { ...c.props } })),
      topBarProps: state.topBarProps,
      showTopBar: state.showTopBar,
      bottomButtonsProps: state.bottomButtonsProps,
      showBottomButtons: state.showBottomButtons,
      showToast: state.showToast,
      toastProps: state.toastProps,
      showStatusBar: state.showStatusBar, // <-- add
      statusBarProps: state.statusBarProps, // <-- add
      description: state.description // <-- add
    };
  };

  /**
   * Restore layout from serialized data
   * 
   * This function takes a LayoutData object (from getLayoutData, localStorage,
   * URL sharing, or history stack) and restores it to the runtime layout state.
   * 
   * It converts the serialized data back into runtime state by:
   * - Mapping component names back to component references
   * - Restoring all layout configuration properties
   * 
   * NOTE: Selection state (selectedIdx, selectedSpecial) is managed separately
   * in AdminView as local state, so we don't restore it here. The AdminView
   * should handle resetting selection when layout is restored.
   * 
   * @param data - LayoutData object to restore from
   */
  const restoreLayout = (data: LayoutData) => {
    dispatch({
      type: 'UPDATE',
      payload: {
        dropped: (data.dropped || []).map((item: any) => ({
          name: item.name,
          Component: (FormblockerComponents as any)[item.name],
          props: item.props || {}
        })),
        topBarProps: data.topBarProps,
        showTopBar: !!data.showTopBar,
        bottomButtonsProps: data.bottomButtonsProps,
        showBottomButtons: !!data.showBottomButtons,
        showToast: !!data.showToast,
        toastProps: data.toastProps,
        showStatusBar: !!data.showStatusBar, // <-- add
        statusBarProps: data.statusBarProps, // <-- add
        description: data.description // <-- add
      }
    });
  };

  return {
    getLayoutData,
    restoreLayout
  };
}; 