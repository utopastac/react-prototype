import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AdminLayoutProvider, useAdminLayoutContext, useActiveLayout } from 'src/admin/contexts/AdminLayoutContext';
import PhonePreview from 'src/builder/PhonePreview';
import { useHistoryManager } from 'src/builder/hooks/useHistoryManager';
import { useLayoutData } from 'src/builder/hooks/useLayoutData';
import styles from 'src/builder/index.module.sass';
import layoutsStyles from 'src/builder/layouts.module.sass';
import AdminToast from 'src/admin/components/Toast';
import ToolbarButton from 'src/admin/components/ToolbarButton';
import * as Icons from 'src/data/Icons';
import { AdminTemplate, AdminTemplates } from 'src/builder/Templates';
import ModalHandler from 'src/builder/components/ModalHandler';
import { useLocalStorage } from 'src/builder/hooks/useLocalStorage';
import { useUrlSharing } from 'src/builder/hooks/useUrlSharing';
import JsonPanel from 'src/builder/components/JsonPanel';
import GlobalSettingsPanel from 'src/builder/components/GlobalSettingsPanel';
import ToolbarPanel from 'src/builder/components/ToolbarPanel';
import { useKeyboardShortcuts } from 'src/builder/hooks/useKeyboardShortcuts';
import SelectInput from 'src/admin/components/LabeledInput/SelectInput';
import {
  INITIAL_TOP_BAR_PROPS,
  INITIAL_BOTTOM_BUTTONS_PROPS,
  INITIAL_TOAST_PROPS,
  INITIAL_STATUS_BAR_PROPS,
} from 'src/builder/LayoutContext';
import { AdminThemeProvider, useAdminTheme, useAdminThemeDispatch } from 'src/admin/contexts/AdminThemeContext';

/**
 * BuilderView
 *
 * The main admin interface for building and editing UI layouts.
 * Features:
 * 
 * - Multiple phone previews in a grid layout
 * - Tab navigation between layouts
 * - Cross-layout drag-and-drop
 * - Independent prop editing for each layout
 * - Save/load functionality for layout state
 * - History management with undo/redo
 */

interface BuilderViewProps {
  theme: string;
  scale: string;
  device: string;
  font: string;
}

// Utility to update deeply nested state (dot/bracket notation, arrays, deep objects)
function updateNestedState<T>(prev: T, fullKey: string, value: any): T {
  const keys = fullKey.split(/\.|\[|\]/).filter(Boolean);
  function setDeep(obj: any, keys: string[], value: any): any {
    if (keys.length === 0) return value;
    const [key, ...rest] = keys;
    if (/^\d+$/.test(key)) {
      const idx = parseInt(key, 10);
      const arr = Array.isArray(obj) ? [...obj] : [];
      arr[idx] = setDeep(arr[idx], rest, value);
      return arr;
    } else {
      return {
        ...obj,
        [key]: setDeep(obj && obj[key], rest, value)
      };
    }
  }
  return setDeep(prev, keys, value);
}

const BuilderViewContent: React.FC<BuilderViewProps> = ({
  theme,
  scale,
  device,
  font
}) => {
  const [layoutState, dispatch] = useAdminLayoutContext();
  const { layout: activeLayout, index: activeIndex } = useActiveLayout();
  
  // Local UI state
  const [showAdminPanel, setShowAdminPanel] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  // Add selectedTemplate state
  const [selectedTemplate, setSelectedTemplate] = useState<AdminTemplate | null>(null);
  // New: Prop editor visibility state
  const [isPropEditorVisible, setIsPropEditorVisible] = useState(false);

  // Global selection: only one component selected at a time across all phones
  const [selected, setSelected] = useState<{ phoneIndex: number, componentIndex: number } | null>(null);

  // Replace selectedSpecial state with per-phone structure
  type SelectedSpecial = { phoneIndex: number, type: 'topbar' | 'bottombuttons' | 'toast' | 'statusbar' } | null;
  const [selectedSpecial, setSelectedSpecial] = useState<SelectedSpecial>(null);

  // Effect: update isPropEditorVisible when selection changes
  useEffect(() => {
    if (
      (selected && layoutState.layouts[selected.phoneIndex] && layoutState.layouts[selected.phoneIndex].components[selected.componentIndex]) ||
      selectedSpecial
    ) {
      setIsPropEditorVisible(true);
    } else {
      setIsPropEditorVisible(false);
    }
  }, [selected, selectedSpecial, layoutState.layouts]);

  // Refs
  const phonePreviewRef = useRef<HTMLDivElement>(null);

  // Hooks
  const historyManager = useHistoryManager({
    setSelectedIdx: () => {}, // Not used in this implementation
    setSelectedSpecial: () => {} // Not used in this implementation
  });

  const layoutData = useLayoutData();

  // Panel dimensions (now in AdminThemeContext)
  const adminTheme = useAdminTheme();
  const setAdminTheme = useAdminThemeDispatch();

  // Zoom state
  const [zoomLevel, setZoomLevel] = useState(0.8);
  const ZOOM_STEP = 1.3;
  
  // Ref to PhonePreview's container for fit-to-screen calculations
  const phonePreviewContainerRef = useRef<HTMLDivElement | null>(null);
  
  // Track previous zoom for scroll position preservation
  const lastCenterRef = useRef<{centerX: number, centerY: number, prevZoom: number} | null>(null);

  // Zoom handlers
  const handleZoomIn = () => {
    const container = phonePreviewContainerRef.current;
    if (container) {
      lastCenterRef.current = {
        centerX: container.scrollLeft + container.clientWidth / 2,
        centerY: container.scrollTop + container.clientHeight / 2,
        prevZoom: zoomLevel
      };
    }
    setZoomLevel(prev => Math.min(prev * ZOOM_STEP, 3));
  };

  const handleZoomOut = () => {
    const container = phonePreviewContainerRef.current;
    if (container) {
      lastCenterRef.current = {
        centerX: container.scrollLeft + container.clientWidth / 2,
        centerY: container.scrollTop + container.clientHeight / 2,
        prevZoom: zoomLevel
      };
    }
    setZoomLevel(prev => Math.max(prev / ZOOM_STEP, 0.1));
  };

  const handleZoomReset = () => {
    const container = phonePreviewContainerRef.current;
    if (container) {
      lastCenterRef.current = {
        centerX: container.scrollLeft + container.clientWidth / 2,
        centerY: container.scrollTop + container.clientHeight / 2,
        prevZoom: zoomLevel
      };
    }
    setZoomLevel(1);
  };

  const handleFitToScreen = () => {
    // Use the calculated grid dimensions
    if (layoutState.gridRows === 0 || layoutState.gridCols === 0) return;
    
    // Calculate the grid size needed (including the extra row/column)
    const gridWidth = layoutState.gridCols * 300 + (layoutState.gridCols - 1) * 80; // 300px width + 80px gap
    const gridHeight = layoutState.gridRows * 500 + (layoutState.gridRows - 1) * 80; // 500px height + 80px gap
    
    // Get container dimensions
    const container = phonePreviewContainerRef.current;
    if (!container) return;
    
    const containerWidth = container.clientWidth - 112; // Account for padding
    const containerHeight = container.clientHeight - 112;
    
    // Calculate zoom level to fit
    const zoomX = containerWidth / gridWidth;
    const zoomY = containerHeight / gridHeight;
    const newZoom = Math.min(zoomX, zoomY, 1); // Don't zoom in beyond 100%
    
    // Ensure minimum zoom level to prevent labels from disappearing permanently
    // Use 0.5 as minimum (same as zoomHideLevel threshold)
    const minZoom = 0.5;
    setZoomLevel(Math.max(newZoom, minZoom));
  };
  
  // Preserve scroll position when zoom changes
  useEffect(() => {
    if (!lastCenterRef.current) return;
    const container = phonePreviewContainerRef.current;
    if (container) {
      const { centerX, centerY, prevZoom } = lastCenterRef.current;
      const scale = zoomLevel / prevZoom;
      const newCenterX = centerX * scale;
      const newCenterY = centerY * scale;
      // Set scroll position directly (no animation)
      container.scrollLeft = newCenterX - container.clientWidth / 2;
      container.scrollTop = newCenterY - container.clientHeight / 2;
    }
    lastCenterRef.current = null;
  }, [zoomLevel]);
  
  // Keyboard shortcuts for zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '=':
          case '+':
            e.preventDefault();
            handleZoomIn();
            break;
          case '-':
            e.preventDefault();
            handleZoomOut();
            break;
          case '0':
            e.preventDefault();
            handleZoomReset();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomLevel]);

  // Panel dimensions (now in AdminThemeContext)
  const rightPanelWidth = adminTheme.settingsPanelWidth;
  const setRightPanelWidth = (w: number) => setAdminTheme({ type: 'Update', payload: { settingsPanelWidth: w } });
  /**
   * Handle phone selection
   */
  const handlePhoneSelect = (index: number) => {
    dispatch({ type: 'SET_ACTIVE_LAYOUT', index });
  };

  /**
   * Handle resetting all layouts
   */
  const handleReset = () => {
    dispatch({ type: 'RESET_ALL' });
    setToast('🔄 All layouts reset');
  };

  // --- GRID HELPERS ---
  function recalcGridSize(layoutPositions: Record<number, { row: number, col: number }>) {
    let maxRow = 0, maxCol = 0;
    Object.values(layoutPositions).forEach(pos => {
      if (pos.row > maxRow) maxRow = pos.row;
      if (pos.col > maxCol) maxCol = pos.col;
    });
    return { gridRows: maxRow + 1, gridCols: maxCol + 1 };
  }
  // --- END GRID HELPERS ---

  // State for floating template picker
  const [templatePicker, setTemplatePicker] = useState<null | { row: number; col: number; pos: { x: number; y: number } }>(null);
  const [templatePickerValue, setTemplatePickerValue] = useState('');

  // Ref for the template picker panel
  const templatePickerRef = useRef<HTMLDivElement>(null);

  // Close template picker on outside click
  useEffect(() => {
    if (!templatePicker) return;
    const handleClick = (e: MouseEvent) => {
      if (templatePickerRef.current && !templatePickerRef.current.contains(e.target as Node)) {
        setTemplatePicker(null);
        setTemplatePickerValue('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [templatePicker]);

  // Intercept add layout to show template picker
  function handleAddLayoutAt(row: number, col: number, templateName?: string) {
    if (templateName) {
      const template = AdminTemplates.find(t => t.name === templateName);
      if (template) {
        handleAddLayoutWithTemplate(row, col, template);
        return;
      }
    }
    // Add blank layout
    const newLayouts = [...layoutState.layouts, { ...layoutState.layouts[0], showStatusBar: true }];
    const newNames = [...layoutState.layoutNames, `Layout ${layoutState.layouts.length + 1}`];
    const newIndex = newLayouts.length - 1;
    const newLayoutPositions = { ...layoutState.layoutPositions, [newIndex]: { row, col } };
    const { gridRows, gridCols } = recalcGridSize(newLayoutPositions);
    dispatch({
      type: 'SET_ALL_LAYOUTS',
      layouts: newLayouts,
      names: newNames,
      layoutPositions: newLayoutPositions,
      gridRows,
      gridCols,
    });
    dispatch({ type: 'SET_ACTIVE_LAYOUT', index: newIndex });
    setToast('✅ Added blank layout');
  }

  // Add layout with selected template
  function handleAddLayoutWithTemplate(row: number, col: number, template: AdminTemplate) {
    const newLayouts = [
      ...layoutState.layouts,
      {
        ...layoutState.layouts[0],
        components: template.components.map(c => ({ ...c, props: { ...c.props } })),
        topBarProps: template.topBarProps ?? INITIAL_TOP_BAR_PROPS,
        showTopBar: template.topBarProps !== undefined,
        bottomButtonsProps: template.bottomButtonsProps ?? INITIAL_BOTTOM_BUTTONS_PROPS,
        showBottomButtons: template.bottomButtonsProps !== undefined,
        toastProps: template.toastProps ? { ...INITIAL_TOAST_PROPS, ...template.toastProps } : INITIAL_TOAST_PROPS,
        statusBarProps: template.statusBarProps ? { ...INITIAL_STATUS_BAR_PROPS, ...template.statusBarProps } : INITIAL_STATUS_BAR_PROPS,
        showToast: false,
        showStatusBar: template.statusBarProps !== undefined ? true : layoutState.layouts[0].showStatusBar,
      },
    ];
    const newNames = [...layoutState.layoutNames, template.name];
    const newIndex = newLayouts.length - 1;
    const newLayoutPositions = { ...layoutState.layoutPositions, [newIndex]: { row, col } };
    const { gridRows, gridCols } = recalcGridSize(newLayoutPositions);
    dispatch({
      type: 'SET_ALL_LAYOUTS',
      layouts: newLayouts,
      names: newNames,
      layoutPositions: newLayoutPositions,
      gridRows,
      gridCols,
    });
    dispatch({ type: 'SET_ACTIVE_LAYOUT', index: newIndex });
    setTemplatePicker(null);
    setTemplatePickerValue('');
    setToast(`✅ Added layout: ${template.name}`);
  }
  // Example: Duplicate a layout to the right
  function handleDuplicateLayoutAt(index: number) {
    const layoutToDuplicate = layoutState.layouts[index];
    const nameToDuplicate = layoutState.layoutNames[index];
    const currentPos = layoutState.layoutPositions[index] || { row: 0, col: 0 };
    // Find all occupied columns in the current row
    const occupiedCols = new Set<number>();
    Object.values(layoutState.layoutPositions).forEach(pos => {
      if (pos.row === currentPos.row) occupiedCols.add(pos.col);
    });
    // Find the next available col in the same row
    let nextCol = currentPos.col + 1;
    while (occupiedCols.has(nextCol)) {
      nextCol++;
    }
    let newRow = currentPos.row;
    let newCol = nextCol;
    // If nextCol exceeds gridCols, move to next row, col=0
    const maxCol = Math.max(...Object.values(layoutState.layoutPositions).filter(pos => pos.row === currentPos.row).map(pos => pos.col), 0);
    if (nextCol > maxCol + 1) {
      // Find the first available col in the next row
      newRow = currentPos.row + 1;
      // Find all occupied cols in the new row
      const nextRowOccupiedCols = new Set<number>();
      Object.values(layoutState.layoutPositions).forEach(pos => {
        if (pos.row === newRow) nextRowOccupiedCols.add(pos.col);
      });
      newCol = 0;
      while (nextRowOccupiedCols.has(newCol)) {
        newCol++;
      }
    }
    const newLayouts = [...layoutState.layouts, { ...layoutToDuplicate }];
    const newNames = [...layoutState.layoutNames, `${nameToDuplicate} (Copy)`];
    const newIndex = newLayouts.length - 1;
    const newPos = { row: newRow, col: newCol };
    const newLayoutPositions = { ...layoutState.layoutPositions, [newIndex]: newPos };
    const { gridRows, gridCols } = recalcGridSize(newLayoutPositions);
    dispatch({
      type: 'SET_ALL_LAYOUTS',
      layouts: newLayouts,
      names: newNames,
      layoutPositions: newLayoutPositions,
      gridRows,
      gridCols,
    });
    dispatch({ type: 'SET_ACTIVE_LAYOUT', index: newIndex });
  }


  // Handler to apply a template to the selected phone (or active if none selected)
  const handleApplyTemplate = (template: AdminTemplate) => {
    const targetIndex = selected?.phoneIndex ?? activeIndex;
    dispatch({
      type: 'UPDATE_LAYOUT',
      index: targetIndex,
      payload: {
        components: template.components.map((c: { name: string; Component: React.ComponentType<any>; props: any }) => ({ ...c, props: { ...c.props } })),
        topBarProps: template.topBarProps ?? layoutState.layouts[targetIndex].topBarProps,
      showTopBar: !!template.topBarProps,
        bottomButtonsProps: template.bottomButtonsProps ?? layoutState.layouts[targetIndex].bottomButtonsProps,
        statusBarProps: template.statusBarProps,
      showBottomButtons: !!template.bottomButtonsProps,
        showStatusBar: template.statusBarProps !== undefined ? true : layoutState.layouts[targetIndex].showStatusBar,
      }
    });
    setSelectedTemplate(template);
    setToast(`✅ Applied template: ${template.name}`);
  };

  // Modal state for save/load/share/templates
  const [openModal, setOpenModal] = useState<null | 'save' | 'load' | 'share' | 'clearAll' | 'shortcuts' | 'templates'>(null);
  // Welcome modal state
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  // Modal coordinates from button click
  const [modalCoordinates, setModalCoordinates] = useState<{ x: number; y: number } | null>(null);

  // Show welcome modal if not seen
  useEffect(() => {
    const hasSeenWelcome = window.localStorage.getItem('interventions-hub-welcome-seen');
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true);
    }
  }, []);

  // Handler to reset welcome modal for testing
  const handleResetWelcomeModal = () => {
    window.localStorage.removeItem('interventions-hub-welcome-seen');
    setShowWelcomeModal(true);
  };

  // Local storage and sharing hooks
  const localStorage = useLocalStorage();
  const urlSharing = useUrlSharing();

  // Ref to prevent auto-save immediately after restore
  const justRestored = useRef(false);

  // Auto-restore from 'current' on mount, but only if not arriving from a shared URL
  useEffect(() => {
    const hash = window.location.hash;
    const queryIndex = hash.indexOf('?');
    let hasSharedLayout = false;
    if (queryIndex !== -1) {
      const params = new URLSearchParams(hash.substring(queryIndex + 1));
      if (params.get('layout')) {
        hasSharedLayout = true;
    }
    }
    if (!hasSharedLayout) {
      localStorage.loadCurrent();
      justRestored.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save to 'current' on any layout state change, but skip immediately after restore
  useEffect(() => {
    if (justRestored.current) {
      justRestored.current = false;
      return;
    }
    localStorage.saveCurrent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutState]);

  // Save handler for modal
  const handleSaveModal = () => {
    const success = localStorage.handleSave();
    if (success) {
      setOpenModal(null);
      setToast('✅ Saved successfully');
      localStorage.setSaveName('');
      localStorage.setLoadList(localStorage.getLoadList());
    }
  };
  // Load handler for modal
  const handleLoadModal = (name: string) => {
    const success = localStorage.handleLoad(name);
    if (success) {
      setOpenModal(null);
      setToast('✅ Loaded successfully');
    }
  };
  // Delete save handler
  const handleDeleteSaveModal = (name: string) => {
    localStorage.handleDeleteSave(name);
    localStorage.setLoadList(localStorage.getLoadList());
  };
  // Share handler for modal
  const handleShareModal = () => {
    urlSharing.handleShare();
    setOpenModal('share');
  };

  // JSON panel state
  const [showJsonPanel, setShowJsonPanel] = useState(false);


  // Deselect on click outside the prop editor
  useEffect(() => {
    if (!selected && !selectedSpecial) return;
    const handleClick = (e: MouseEvent) => {
      // Check if click is on a component or special component
      const droppedEls = document.querySelectorAll('[data-component], [data-special-component]');
      for (const el of droppedEls) {
        if (el.contains(e.target as Node)) return;
      }
      // Check if click is on the GlobalSettingsPanel
      const panel = document.querySelector(`.${styles.AdminPanel}.${styles.rightSide}`);
      if (panel && panel.contains(e.target as Node)) return;
      setSelected(null);
      setSelectedSpecial(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [selected, selectedSpecial]);

  // Helper to pass setOpenModal with correct type for keyboard shortcut hook
  const setOpenModalString = (modal: string) => {
    setOpenModal(modal as any);
  };

  useKeyboardShortcuts({
    selected,
    layoutState,
    dispatch,
    setSelected,
    handleReset: () => setOpenModal('clearAll'),
    handleSave: () => setOpenModal('save'),
    handleUndo: historyManager.handleUndo,
    handleRedo: historyManager.handleRedo,
    canUndo: historyManager.canUndo,
    canRedo: historyManager.canRedo,
    setShowAdminPanel,
    // New handlers for keyboard shortcuts:
    handleLoad: () => {
      localStorage.setLoadList(localStorage.getLoadList());
      setOpenModal('load');
    },
    handleShowShortcuts: () => setOpenModal('shortcuts'),
    handleShareModal: handleShareModal,
    setOpenModal: setOpenModalString,
    handleShowTemplates: () => setOpenModal('templates'),
  });

  return (
    <div className={styles.Main}>

      {/* Floating Template Picker */}
      {templatePicker && (
        <div
          ref={templatePickerRef}
          style={{
            position: 'fixed',
            left: templatePicker.pos.x,
            top: templatePicker.pos.y,
            zIndex: 1000,
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: 8,
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            padding: 16,
            minWidth: 220,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <SelectInput
            label="Choose a template"
            value={templatePickerValue}
            options={[{ value: '', label: 'Choose a template' }, ...AdminTemplates.map(t => ({ value: t.name, label: t.name }))]}
            onChange={val => {
              setTemplatePickerValue(val);
              const t = AdminTemplates.find(t => t.name === val);
              if (t) {
                handleAddLayoutAt(templatePicker.row, templatePicker.col, t.name);
              }
            }}
          />
        </div>
      )}

      {/* Modal Handler */}
      <ModalHandler
        openModal={openModal}
        setOpenModal={(modal) => {
          setOpenModal(modal);
          if (!modal) {
            setModalCoordinates(null);
          }
        }}
        showWelcomeModal={showWelcomeModal}
        setShowWelcomeModal={setShowWelcomeModal}
        saveName={localStorage.saveName}
        onSaveNameChange={localStorage.setSaveName}
        onSave={handleSaveModal}
        loadList={localStorage.loadList}
        loadError={localStorage.loadError}
        onLoad={handleLoadModal}
        onDeleteSave={handleDeleteSaveModal}
        shareUrl={urlSharing.shareUrl}
        layoutData={urlSharing.getLayoutData()}
        showToast={setToast}
        onLoadComplete={data => {
          console.log('BuilderView received data:', data);
          dispatch({
            type: 'SET_ALL_LAYOUTS',
            layouts: data.layouts,
            names: data.names,
            layoutPositions: data.layoutPositions,
            gridRows: data.gridRows,
            gridCols: data.gridCols,
          });
          setOpenModal(null);
          setModalCoordinates(null);
          setToast('✅ Loaded flow');
        }}
        onClear={() => {
          handleReset();
        }}
        modalCoordinates={modalCoordinates}
      />

      {/* Global Settings Panel */}
      <AnimatePresence>
        {showAdminPanel && (
          <GlobalSettingsPanel
            isPropEditorVisible={isPropEditorVisible}
            rightPanelWidth={rightPanelWidth}
            setRightPanelWidth={setRightPanelWidth}
            onResetWelcomeModal={handleResetWelcomeModal}
            onOpenClearAllLayoutsModal={() => setOpenModal('clearAll')}
            isPhoneSettingsVisible={activeIndex >= 0 && activeLayout !== null}
            onClosePhoneSettings={() => dispatch({ type: 'SET_ACTIVE_LAYOUT', index: -1 })}
            selected={selected}
            selectedSpecial={selectedSpecial}
            layoutState={layoutState}
            dispatch={dispatch}
            onSetSelected={setSelected}
            onSetSelectedSpecial={setSelectedSpecial}
            onSetIsPropEditorVisible={setIsPropEditorVisible}
            updateNestedState={updateNestedState}
            phoneName={activeIndex >= 0 ? layoutState.layoutNames[activeIndex] : ''}
            selectedTemplate={selectedTemplate}
            onApplyTemplate={handleApplyTemplate}
            showTopBar={activeIndex >= 0 && activeLayout ? !!activeLayout.showTopBar : false}
            showBottomButtons={activeIndex >= 0 && activeLayout ? !!activeLayout.showBottomButtons : false}
            showToast={activeIndex >= 0 && activeLayout ? !!activeLayout.showToast : false}
            showStatusBar={activeIndex >= 0 && activeLayout ? !!activeLayout.showStatusBar : false}
            onShowTopBarChange={() => {
              if (activeIndex >= 0 && activeLayout) {
                dispatch({
                  type: 'UPDATE_LAYOUT',
                  index: activeIndex,
                  payload: { showTopBar: !activeLayout.showTopBar }
                });
              }
            }}
            onShowBottomButtonsChange={() => {
              if (activeIndex >= 0 && activeLayout) {
                dispatch({
                  type: 'UPDATE_LAYOUT',
                  index: activeIndex,
                  payload: { showBottomButtons: !activeLayout.showBottomButtons }
                });
              }
            }}
            onShowToastChange={() => {
              if (activeIndex >= 0 && activeLayout) {
                dispatch({
                  type: 'UPDATE_LAYOUT',
                  index: activeIndex,
                  payload: { showToast: !activeLayout.showToast }
                });
              }
            }}
            onShowStatusBarChange={() => {
              if (activeIndex >= 0 && activeLayout) {
                dispatch({
                  type: 'UPDATE_LAYOUT',
                  index: activeIndex,
                  payload: { showStatusBar: !activeLayout.showStatusBar }
                });
              }
            }}
            onClearLayout={() => {
              if (activeIndex >= 0 && activeLayout) {
                dispatch({ type: 'RESET_LAYOUT', index: activeIndex });
              }
            }}
            onDeselectPhone={() => dispatch({ type: 'SET_ACTIVE_LAYOUT', index: -1 })}
            onDroppedComponentClick={(layoutIdx, droppedIdx) => setSelected({ phoneIndex: layoutIdx, componentIndex: droppedIdx })}
            selectedLayout={selected ? { layoutIdx: selected.phoneIndex, droppedIdx: selected.componentIndex } : null}
          />
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div
        className={layoutsStyles.CenterContainer}
        data-theme={theme}
        data-text-scale={scale}
        data-device={device}
        data-font={font}
        style={{ background: adminTheme.backgroundColor }}
      >
        {/* Phone Preview Grid */}
        <div
          className={layoutsStyles.PhonePreviewContainer}
          ref={phonePreviewRef}
        >
          <PhonePreview
            showLabels={true}
            onPhoneSelect={handlePhoneSelect}
            selected={selected}
            setSelected={setSelected}
            setSelectedSpecial={setSelectedSpecial}
            selectedSpecial={selectedSpecial}
            onCanvasClick={() => dispatch({ type: 'SET_ACTIVE_LAYOUT', index: -1 })}
            layoutPositions={layoutState.layoutPositions}
            gridRows={layoutState.gridRows}
            gridCols={layoutState.gridCols}
            onAddLayoutAt={handleAddLayoutAt}
            onDuplicateLayoutAt={handleDuplicateLayoutAt}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            onContainerRef={(ref) => {
              phonePreviewContainerRef.current = ref;
            }}
          />
        </div>
      </div>

      {/* Toggle button for admin panel (top left, only when hidden) */}
      {!showAdminPanel && (
        <div className={styles.AdminToggle}>
          <ToolbarButton
            onClick={() => setShowAdminPanel(true)}
            title="Show admin panel"
            icon={Icons.Back}
            iconSize={"24"}
          />
        </div>
      )}

      {/* Toolbar Panel */}
      <AnimatePresence>
        <ToolbarPanel
          onHideAdminPanel={() => setShowAdminPanel(v => !v)}
          onShowKeyboardShortcuts={(e) => {
            setModalCoordinates({ x: e.pageX, y: e.pageY });
            setOpenModal('shortcuts');
          }}
          onOpenSave={(e) => {
            setModalCoordinates({ x: e.pageX, y: e.pageY });
            setOpenModal('save');
          }}
          onOpenLoad={(e) => {
            setModalCoordinates({ x: e.pageX, y: e.pageY });
            localStorage.setLoadList(localStorage.getLoadList());
            setOpenModal('load');
          }}
          onShare={(e) => {
            setModalCoordinates({ x: e.pageX, y: e.pageY });
            handleShareModal();
          }}
          onOpenTemplates={(e) => {
            setModalCoordinates({ x: e.pageX, y: e.pageY });
            setOpenModal('templates');
          }}
          onShowJsonPanel={() => setShowJsonPanel(v => !v)}
          showJsonPanel={showJsonPanel}
          zoomLevel={zoomLevel}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleZoomReset}
          onFitToScreen={handleFitToScreen}
        />
      </AnimatePresence>

      {/* JSON Panel */}
      <JsonPanel
        visible={showJsonPanel && showAdminPanel}
        onClose={() => setShowJsonPanel(false)}
        getLayoutData={layoutData.getLayoutData}
        showToast={setToast}
      />

      {/* Toggle button for admin panel */}
      {!showAdminPanel && (
        <div className={styles.AdminToggle}>
          <ToolbarButton
            onClick={() => setShowAdminPanel(true)}
            title="Show admin panel"
            icon={Icons.Back}
            iconSize={"24"}
          />
        </div>
      )}

      {/* Toast notifications */}
      {toast && <AdminToast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
};

/**
 * Wrapper component that provides the AdminLayoutProvider
 */
const BuilderView: React.FC<BuilderViewProps> = (props) => {
  return (
    <AdminLayoutProvider>
      <AdminThemeProvider>
        <BuilderViewContent {...props} />
      </AdminThemeProvider>
    </AdminLayoutProvider>
  );
};

export default BuilderView;


