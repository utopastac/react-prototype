import { useAdminLayoutContext } from 'src/admin/contexts/AdminLayoutContext';
import { LayoutData } from 'src/builder/LayoutContext';
import { InterventionScreenComponents } from 'src/data/Components';

/**
 * LayoutsData Interface
 * 
 * Defines the structure of serializable layout data for multiple layouts.
 * This is used for saving/loading layouts, URL sharing, and history management.
 */
export interface LayoutsData {
  /** Array of layout data, one per phone preview */
  layouts: LayoutData[];
  /** Names for each layout for display and identification */
  layoutNames: string[];
  /** Index of the currently active layout */
  activeLayoutIndex: number;
  layoutPositions: Record<number, { row: number, col: number }>;
  gridRows: number;
  gridCols: number;
}

/**
 * useLayoutData Hook
 *
 * Provides serialization and restoration of layout state for sharing and persistence.
 * Converts between runtime state (with component references) and serializable data.
 * Uses AdminLayoutContext for state and dispatch.
 */
export const useLayoutData = () => {
  const [state, dispatch] = useAdminLayoutContext();

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
   * only the essential layout configuration for all layouts.
   * 
   * @returns LayoutsData object with serializable layout configuration
   */
  const getLayoutData = (): LayoutsData => {
    const layouts = state.layouts.map(layout => ({
      components: layout.components.map(c => ({ name: c.name, props: { ...c.props } })),
      topBarProps: layout.topBarProps,
      showTopBar: layout.showTopBar,
      bottomButtonsProps: layout.bottomButtonsProps,
      showBottomButtons: layout.showBottomButtons,
      showToast: layout.showToast,
      toastProps: layout.toastProps,
      showStatusBar: layout.showStatusBar,
      statusBarProps: layout.statusBarProps,
      description: layout.description
    }));
    
    return {
      layouts: layouts,
      layoutNames: state.layoutNames,
      activeLayoutIndex: state.activeLayoutIndex,
      layoutPositions: state.layoutPositions,
      gridRows: state.gridRows,
      gridCols: state.gridCols,
    };
  };

  /**
   * Restore layouts from serialized data
   * 
   * This function takes a LayoutsData object (from getLayoutData, localStorage,
   * URL sharing, or history stack) and restores it to the runtime layout state.
   * 
   * It converts the serialized data back into runtime state by:
   * - Mapping component names back to component references for all layouts
   * - Restoring all layout configuration properties
   * - Setting the active layout index
   * 
   * NOTE: Selection state (selectedIdx, selectedSpecial) is managed separately
   * in the parent component as local state, so we don't restore it here.
   * 
   * @param data - LayoutsData object to restore from
   */
  const restoreLayouts = (data: LayoutsData) => {
    const restoredLayouts = (data.layouts || []).map((layoutData: any) => ({
      components: (layoutData.components || []).map((item: any) => ({
        name: item.name,
        Component: (InterventionScreenComponents as any)[item.name],
        props: item.props || {}
      })),
      topBarProps: layoutData.topBarProps,
      showTopBar: !!layoutData.showTopBar,
      bottomButtonsProps: layoutData.bottomButtonsProps,
      showBottomButtons: !!layoutData.showBottomButtons,
      showToast: !!layoutData.showToast,
      toastProps: layoutData.toastProps,
      showStatusBar: layoutData.showStatusBar !== undefined ? !!layoutData.showStatusBar : true, // default true
      statusBarProps: layoutData.statusBarProps,
      description: layoutData.description
    }));

    // If grid info is missing, generate a default linear grid
    let layoutPositions = data.layoutPositions;
    let gridRows = data.gridRows;
    let gridCols = data.gridCols;
    if (!layoutPositions || !gridRows || !gridCols) {
      layoutPositions = {};
      for (let i = 0; i < restoredLayouts.length; i++) {
        layoutPositions[i] = { row: 0, col: i };
      }
      gridRows = 1;
      gridCols = restoredLayouts.length;
    }

    dispatch({
      type: 'SET_ALL_LAYOUTS',
      layouts: restoredLayouts,
      names: data.layoutNames || [],
      layoutPositions,
      gridRows,
      gridCols,
    });

    // Set active layout index if valid
    if (data.activeLayoutIndex !== undefined && 
        data.activeLayoutIndex >= 0 && 
        data.activeLayoutIndex < restoredLayouts.length) {
      dispatch({ type: 'SET_ACTIVE_LAYOUT', index: data.activeLayoutIndex });
    }
  };

  /**
   * Export layout data as JSON string
   * 
   * @returns JSON string representation of the layout data
   */
  const exportLayout = (): string => {
    return JSON.stringify(getLayoutData(), null, 2);
  };

  /**
   * Import layout data from JSON string
   * 
   * @param jsonString - JSON string to import from
   * @returns true if import was successful, false otherwise
   */
  const importLayout = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString) as LayoutsData;
      restoreLayouts(data);
      return true;
    } catch (error) {
      console.error('Failed to import layout data:', error);
      return false;
    }
  };

  /**
   * Get a single layout's data by index
   * 
   * @param index - Index of the layout to get data for
   * @returns LayoutData for the specified layout, or null if index is invalid
   */
  const getLayoutDataByIndex = (index: number): LayoutData | null => {
    if (index < 0 || index >= state.layouts.length) return null;
    
    const layout = state.layouts[index];
    return {
      components: layout.components.map(c => ({ name: c.name, props: { ...c.props } })),
      topBarProps: layout.topBarProps,
      showTopBar: layout.showTopBar,
      bottomButtonsProps: layout.bottomButtonsProps,
      showBottomButtons: layout.showBottomButtons,
      showToast: layout.showToast,
      toastProps: layout.toastProps,
      showStatusBar: layout.showStatusBar,
      statusBarProps: layout.statusBarProps,
      description: layout.description
    };
  };

  /**
   * Restore a single layout by index
   * 
   * @param index - Index of the layout to restore
   * @param layoutData - LayoutData to restore
   */
  const restoreLayoutByIndex = (index: number, layoutData: LayoutData) => {
    if (index < 0 || index >= state.layouts.length) return;
    
    const restoredLayout = {
      components: (layoutData.components || []).map((item: any) => ({
          name: item.name,
          Component: (InterventionScreenComponents as any)[item.name],
          props: item.props || {}
        })),
      topBarProps: layoutData.topBarProps,
      showTopBar: !!layoutData.showTopBar,
      bottomButtonsProps: layoutData.bottomButtonsProps,
      showBottomButtons: !!layoutData.showBottomButtons,
      showToast: !!layoutData.showToast,
      toastProps: layoutData.toastProps,
      showStatusBar: layoutData.showStatusBar !== undefined ? !!layoutData.showStatusBar : true, // default true
      statusBarProps: layoutData.statusBarProps,
      description: layoutData.description
    };

    dispatch({
      type: 'UPDATE_LAYOUT',
      index,
      payload: restoredLayout
    });
  };

  return {
    // Layout operations
    getLayoutData,
    restoreLayouts,
    exportLayout,
    importLayout,
    
    // Single layout operations (by index)
    getLayoutDataByIndex,
    restoreLayoutByIndex,
    
    // Current state
    layouts: state.layouts,
    layoutNames: state.layoutNames,
    activeLayoutIndex: state.activeLayoutIndex
  };
}; 