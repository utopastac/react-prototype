import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AdminLayoutProvider, useAdminLayoutContext, useActiveLayout } from './AdminLayoutContext';
import PhonePreview from './PhonePreview';
import { useHistoryManager } from './hooks/useHistoryManager';
import { useLayoutData } from './hooks/useLayoutData';
import styles from './index.module.sass';
import layoutsStyles from './layouts.module.sass';
import ComponentPanel from './components/ComponentPanel';
import AdminToast from './components/Toast';
// ToolbarButton and icons moved into AdminPanelToggle component
import { AdminTemplate, AdminTemplates } from './Templates';
import { WelcomeModal } from './Modals';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useUrlSharing } from './hooks/useUrlSharing';
import JsonPanel from './components/JsonPanel';
import GlobalSettingsPanel from './components/GlobalSettingsPanel';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
// SelectInput no longer used here; TemplatePicker encapsulates selection
import TemplatePicker from './components/TemplatePicker/TemplatePicker';
import AdminPanelToggle from './components/AdminPanelToggle/AdminPanelToggle';
import ModalsManager from './components/ModalsManager/ModalsManager';
import updateNestedState from './utils/updateNestedState';
import {
  INITIAL_TOP_BAR_PROPS,
  INITIAL_BOTTOM_BUTTONS_PROPS,
  INITIAL_TOAST_PROPS,
  INITIAL_STATUS_BAR_PROPS,
} from './LayoutContext';
import { AdminThemeProvider, useAdminTheme, useAdminThemeDispatch } from './AdminThemeContext';

/**
 * AdminView
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

interface AdminViewProps {
  theme: string;
  scale: string;
  device: string;
  font: string;
  tabBackground: string;
}

// updateNestedState moved to ./utils/updateNestedState

const AdminViewContent: React.FC<AdminViewProps> = ({
  theme,
  scale,
  device,
  font,
  tabBackground
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

  // Panel dimensions (now in AdminThemeContext)
  const adminPanelWidth = adminTheme.adminPanelWidth;
  const rightPanelWidth = adminTheme.settingsPanelWidth;
  const setAdminPanelWidth = (w: number) => setAdminTheme({ type: 'Update', payload: { adminPanelWidth: w } });
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
  // internal value handled inside TemplatePicker component

  // TemplatePicker outside-click is now handled inside TemplatePicker component

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

  // Show welcome modal if not seen
  useEffect(() => {
    const hasSeenWelcome = window.localStorage.getItem('interventions-hub-welcome-seen');
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true);
    }
  }, []);

  // Handler to close welcome modal
  const handleCloseWelcomeModal = () => {
    window.localStorage.setItem('interventions-hub-welcome-seen', 'true');
    setShowWelcomeModal(false);
  };

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
        <TemplatePicker
          picker={templatePicker}
          onClose={() => setTemplatePicker(null)}
          onSelectTemplate={(row, col, template) => {
            handleAddLayoutWithTemplate(row, col, template);
            }}
          />
      )}
      {/* Component Panel */}
      <AnimatePresence>
        {showAdminPanel && (
          <ComponentPanel
            key="component-panel"
            showAdminPanel={showAdminPanel}
            adminPanelWidth={adminPanelWidth}
            setAdminPanelWidth={setAdminPanelWidth}
            onHideAdminPanel={() => setShowAdminPanel(false)}
            onShowKeyboardShortcuts={() => setOpenModal('shortcuts')}
            onOpenSave={() => setOpenModal('save')}
            onOpenLoad={() => {
              localStorage.setLoadList(localStorage.getLoadList());
              setOpenModal('load');
            }}
            onShare={handleShareModal}
            onOpenTemplates={() => setOpenModal('templates')}
            onDroppedComponentClick={(layoutIdx, droppedIdx) => setSelected({ phoneIndex: layoutIdx, componentIndex: droppedIdx })}
            selected={selected ? { layoutIdx: selected.phoneIndex, droppedIdx: selected.componentIndex } : null}
          />
        )}
      </AnimatePresence>

      {/* Template Modal */}
      <ModalsManager
        openModal={openModal}
        onClose={() => setOpenModal(null)}
        saveName={localStorage.saveName}
        onSaveNameChange={localStorage.setSaveName}
        onSave={handleSaveModal}
        loadList={localStorage.loadList}
        loadError={localStorage.loadError}
        onLoad={handleLoadModal}
        onDeleteSave={handleDeleteSaveModal}
        shareUrl={urlSharing.shareUrl}
        layoutDataForShare={urlSharing.getLayoutData()}
        setToast={setToast}
        onTemplatesLoadComplete={data => {
            dispatch({
              type: 'SET_ALL_LAYOUTS',
              layouts: data.layouts,
              names: data.names,
              layoutPositions: data.layoutPositions,
              gridRows: data.gridRows,
              gridCols: data.gridCols,
            });
            setOpenModal(null);
        }}
        onClearAllConfirm={handleReset}
        />

      {/* Main Content Area */}
      <div
        className={layoutsStyles.CenterContainer}
        data-theme={theme}
        data-text-scale={scale}
        data-device={device}
        data-font={font}
        data-tab-bg={tabBackground}
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
          />
        </div>
      </div>

      {/* Toggle button for admin panel (top left, only when hidden) */}
      {!showAdminPanel && (
        <AdminPanelToggle onShow={() => setShowAdminPanel(true)} />
      )}

      {/* Global Settings Panel */}
      <AnimatePresence>
        {showAdminPanel && (
          <GlobalSettingsPanel
            isPropEditorVisible={isPropEditorVisible}
            rightPanelWidth={rightPanelWidth}
            setRightPanelWidth={setRightPanelWidth}
            onShowJsonPanel={() => setShowJsonPanel(v => !v)}
            showJsonPanel={showJsonPanel}
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
          />
        )}
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
        <AdminPanelToggle onShow={() => setShowAdminPanel(true)} />
      )}

      {/* Toast notifications */}
      {toast && <AdminToast message={toast} onDone={() => setToast(null)} />}

      {/* Welcome Modal (shows on first visit) */}
      {showWelcomeModal && (
        <WelcomeModal onClose={handleCloseWelcomeModal} />
      )}
    </div>
  );
};

/**
 * Wrapper component that provides the AdminLayoutProvider
 */
const AdminView: React.FC<AdminViewProps> = (props) => {
  return (
    <AdminLayoutProvider>
      <AdminThemeProvider>
        <AdminViewContent {...props} />
      </AdminThemeProvider>
    </AdminLayoutProvider>
  );
};

export default AdminView;