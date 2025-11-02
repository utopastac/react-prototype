import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminLayoutProvider, useAdminLayoutContext, useActiveLayout } from './AdminLayoutContext';
import PhonePreview from './PhonePreview';
import LayoutTabs from './LayoutTabs';
import { useHistoryManager } from './hooks/useHistoryManager';
import { useLayoutData } from './hooks/useLayoutData';
import styles from './index.module.sass';
import layoutsStyles from './layouts.module.sass';
import ComponentPanel from './components/ComponentPanel';
import SettingsPanel from './components/SettingsPanel';
import AdminToast from './components/Toast';
import ToolbarButton from './components/ToolbarButton';
import Icon, { ICON_24, ICON_ADMIN } from 'src/components/Icon';
import * as Icons from 'src/data/Icons';
import GenericPropEditor from './GenericPropEditor';
import { ComponentPropMeta } from 'src/data/Components';
import TopBar, { TopBarPropMeta } from 'src/components/TopBar';
import ButtonGroup, { ButtonGroupPropMeta } from 'src/components/ButtonGroup';
import { ToastPropMeta } from 'src/components/Toast';
import {
  handleDelete,
  handleDuplicate,
  handleMoveUp,
  handleMoveDown,
  handleSelectPrevious,
  handleSelectNext
} from './componentHandlers';
import {
  handleDeleteMulti,
  handleMoveUpMulti,
  handleMoveDownMulti,
  handleDuplicateMulti,
  handleSelectPreviousMulti,
  handleSelectNextMulti
} from './adminComponentHandlers';
import { isEditingField } from 'src/helpers/Utils';
import { AdminTemplate, AdminTemplates } from './Templates';
import SaveModal from './Modals/SaveModal';
import LoadModal from './Modals/LoadModal';
import ShareModal from './Modals/ShareModal';
import { WelcomeModal, ShortcutsModal, FlowLibraryModal } from './Modals';
import ClearModal from './Modals/ClearModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useUrlSharing } from './hooks/useUrlSharing';
import lzString from 'lz-string';
import JsonPanel from './components/JsonPanel';
import GlobalSettingsPanel from './components/GlobalSettingsPanel';
import PhoneSettingsPanel from './components/PhoneSettingsPanel';
import InsertModal from './Modals/InsertModal';
import { FormblockerComponents, initialComponentProps } from 'src/data/Components';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import SelectInput from './LabeledInput/SelectInput';
import {
  INITIAL_TOP_BAR_PROPS,
  INITIAL_BOTTOM_BUTTONS_PROPS,
  INITIAL_TOAST_PROPS,
  INITIAL_STATUS_BAR_PROPS,
} from './LayoutContext';
import { IOSStatusBarPropMeta } from 'src/components/IOSStatusBar';
import { AdminThemeProvider, useAdminTheme, useAdminThemeDispatch } from './AdminThemeContext';
import { usePanelResize } from './hooks/usePanelResize';

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
  const [selectedPhoneIndex, setSelectedPhoneIndex] = useState<number | null>(null);
  // Add selectedTemplate state
  const [selectedTemplate, setSelectedTemplate] = useState<AdminTemplate | null>(null);
  // New: Prop editor visibility state
  const [isPropEditorVisible, setIsPropEditorVisible] = useState(false);
  // New: showComponentNames state (stub for now, can be implemented later)
  const [showComponentNames, setShowComponentNames] = useState(false);

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
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // Hooks
  const historyManager = useHistoryManager({
    setSelectedIdx: setSelectedPhoneIndex,
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

  // --- Prop Editor resizing logic ---
  const [propEditorWidth, propEditorResizeHandle, propEditorIsResizing, , propEditorIsHoveringEdge] = usePanelResize({
    initialWidth: 280,
    minWidth: 220,
    maxWidth: 480,
    edge: 'left',
    width: rightPanelWidth,
    setWidth: setRightPanelWidth,
  });
  // --- End Prop Editor resizing logic ---
  /**
   * Handle phone selection
   */
  const handlePhoneSelect = (index: number) => {
    setSelectedPhoneIndex(index);
    dispatch({ type: 'SET_ACTIVE_LAYOUT', index });
  };

  /**
   * Handle resetting all layouts
   */
  const handleReset = () => {
    dispatch({ type: 'RESET_ALL' });
    setSelectedPhoneIndex(null);
    setToast('🔄 All layouts reset');
  };

  // --- GRID HELPERS ---
  function getNextGridPosition(layoutPositions: Record<number, { row: number, col: number }>, gridRows: number, gridCols: number) {
    // Find the first empty spot in the grid
    const used = new Set(Object.values(layoutPositions).map(pos => `${pos.row},${pos.col}`));
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        if (!used.has(`${row},${col}`)) return { row, col };
      }
    }
    // If full, add a new row
    return { row: gridRows, col: 0 };
  }
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

  // Prop editor logic
  // Render prop editor for selected component (for the selected phone)
  const renderPropEditor = () => {
    if (!selected || !layoutState.layouts[selected.phoneIndex]) return null;
    const layout = layoutState.layouts[selected.phoneIndex];
    const components = layout.components;
    const comp = components[selected.componentIndex];
    if (!comp) return null;
    const meta = ComponentPropMeta[comp.name as keyof typeof ComponentPropMeta] as any;
    return (
      <div className={styles.Editor}>
        <GenericPropEditor
          title="Component Settings"
          meta={meta}
          values={comp.props}
          onChange={(fullKey, value) => {
            // Update nested props for the selected component
            const prevProps = comp.props;
    const newProps = updateNestedState(prevProps, fullKey, value);
            const newComponents = components.map((item, idx) =>
              idx === selected.componentIndex ? { ...item, props: newProps } : item
            );
            dispatch({
              type: 'UPDATE_LAYOUT',
              index: selected.phoneIndex,
              payload: { components: newComponents }
            });
          }}
          onDismiss={() => {
            setSelected(null);
            setIsPropEditorVisible(false);
          }}
        />
      </div>
    );
  };
  // Special prop change handler for a given phone
  const handleSpecialMetaPropChange = (which: 'topbar' | 'bottombuttons' | 'toast' | 'statusbar', phoneIndex: number) => (fullKey: string, value: any) => {
    const layout = layoutState.layouts[phoneIndex];
    if (which === 'topbar') {
      dispatch({
        type: 'UPDATE_LAYOUT',
        index: phoneIndex,
        payload: { topBarProps: updateNestedState(layout.topBarProps, fullKey, value) }
      });
    } else if (which === 'bottombuttons') {
      dispatch({
        type: 'UPDATE_LAYOUT',
        index: phoneIndex,
        payload: { bottomButtonsProps: updateNestedState(layout.bottomButtonsProps, fullKey, value) }
      });
    } else if (which === 'toast') {
      dispatch({
        type: 'UPDATE_LAYOUT',
        index: phoneIndex,
        payload: { toastProps: updateNestedState(layout.toastProps, fullKey, value) }
      });
    } else if (which === 'statusbar') {
      dispatch({
        type: 'UPDATE_LAYOUT',
        index: phoneIndex,
        payload: { statusBarProps: updateNestedState(layout.statusBarProps, fullKey, value) }
      });
    }
  };
  // Render a prop editor for a special component (top bar, bottom buttons, toast)
  const renderSpecialPanel = (
    title: string,
    meta: any,
    values: any,
    onChange: (fullKey: string, value: any) => void,
    onDismiss: () => void
  ) => (
    <GenericPropEditor
      title={title}
      meta={meta}
      values={values || {}}
      onChange={onChange}
      onDismiss={() => {
        onDismiss();
        setIsPropEditorVisible(false);
      }}
    />
    );
  // Render prop editor for TopBar, ButtonGroup, or Toast for the selected phone
  const renderSpecialPropEditor = () => {
    if (!selectedSpecial) return null;
    const layout = layoutState.layouts[selectedSpecial.phoneIndex];
    if (selectedSpecial.type === 'topbar') {
      return renderSpecialPanel(
        'Top Bar Settings',
        TopBarPropMeta,
        layout.topBarProps,
        handleSpecialMetaPropChange('topbar', selectedSpecial.phoneIndex),
        () => setSelectedSpecial(null)
      );
    } else if (selectedSpecial.type === 'bottombuttons') {
      return renderSpecialPanel(
        'Bottom Buttons Settings',
        ButtonGroupPropMeta,
        layout.bottomButtonsProps,
        handleSpecialMetaPropChange('bottombuttons', selectedSpecial.phoneIndex),
        () => setSelectedSpecial(null)
      );
    } else if (selectedSpecial.type === 'toast') {
      return renderSpecialPanel(
        'Toast Settings',
        ToastPropMeta,
        layout.toastProps,
        handleSpecialMetaPropChange('toast', selectedSpecial.phoneIndex),
        () => setSelectedSpecial(null)
      );
    } else if (selectedSpecial.type === 'statusbar') {
      return renderSpecialPanel(
        'Status Bar Settings',
        IOSStatusBarPropMeta,
        layout.statusBarProps,
        handleSpecialMetaPropChange('statusbar', selectedSpecial.phoneIndex),
        () => setSelectedSpecial(null)
      );
    }
    return null;
  };

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

  // Insert modal state: { phoneIndex, componentIndex, modalPos } | null
  const [insertModal, setInsertModal] = useState<{
    phoneIndex: number;
    componentIndex: number;
    modalPos: { x: number; y: number };
  } | null>(null);

  // Handler to open the insert modal for a given phone/component
  const handleOpenInsertModal = (
    phoneIndex: number,
    componentIndex: number,
    e: React.MouseEvent
  ) => {
    // Position modal near the button
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setInsertModal({
      phoneIndex,
      componentIndex,
      modalPos: { x: rect.right + 8, y: rect.top },
    });
  };

  // Handler to insert a component into the correct phone at the correct index
  const handleInsertComponent = (name: string) => {
    if (insertModal) {
      const { phoneIndex, componentIndex } = insertModal;
      const layout = layoutState.layouts[phoneIndex];
      const Component = (FormblockerComponents as any)[name];
      const newComponents = [...layout.components];
      newComponents.splice(componentIndex + 1, 0, {
        name,
        Component,
        props: { ...(initialComponentProps as any)[name] },
      });
      dispatch({
        type: 'UPDATE_LAYOUT',
        index: phoneIndex,
        payload: { components: newComponents },
      });
      setInsertModal(null);
      setSelected({ phoneIndex, componentIndex: componentIndex + 1 });
    }
  };

  // Handler to close the insert modal
  const handleCloseInsertModal = () => setInsertModal(null);

  // Deselect on click outside the prop editor
  useEffect(() => {
    if (!selected && !selectedSpecial) return;
    const handleClick = (e: MouseEvent) => {
      const rightPanel = rightPanelRef.current;
      if (rightPanel && rightPanel.contains(e.target as Node)) return;
      // Check if click is on a component or special component
      const droppedEls = document.querySelectorAll('[data-component], [data-special-component]');
      for (const el of droppedEls) {
        if (el.contains(e.target as Node)) return;
      }
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
    setShowComponentNames,
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
      {openModal === 'templates' && (
        <FlowLibraryModal
          onLoadComplete={data => {
            console.log('AdminView received data:', data);
            dispatch({
              type: 'SET_ALL_LAYOUTS',
              layouts: data.layouts,
              names: data.names,
              layoutPositions: data.layoutPositions,
              gridRows: data.gridRows,
              gridCols: data.gridCols,
            });
            setOpenModal(null);
            setToast('✅ Loaded flow');
          }}
          onClose={() => setOpenModal(null)}
        />
      )}

      {/* Keyboard Shortcuts Modal */}
      {openModal === 'shortcuts' && (
        <ShortcutsModal onClose={() => setOpenModal(null)} />
      )}

          {/* Save Modal */}
      {openModal === 'save' && (
        <SaveModal
          saveName={localStorage.saveName}
          onSaveNameChange={localStorage.setSaveName}
          onSave={handleSaveModal}
          onClose={() => setOpenModal(null)}
        />
      )}
      {/* Load Modal */}
      {openModal === 'load' && (
        <LoadModal
          loadList={localStorage.loadList}
          loadError={localStorage.loadError}
          onLoad={handleLoadModal}
          onDeleteSave={handleDeleteSaveModal}
          onClose={() => setOpenModal(null)}
        />
      )}
      {/* Share Modal */}
      {openModal === 'share' && (
        <ShareModal
          shareUrl={urlSharing.shareUrl}
          layoutData={urlSharing.getLayoutData()}
          onClose={() => setOpenModal(null)}
          showToast={setToast}
        />
      )}

      {/* Clear All Layouts Modal */}
      {openModal === 'clearAll' && (
        <ClearModal
          onClear={() => {
            setOpenModal(null);
            handleReset();
          }}
          onClose={() => setOpenModal(null)}
        />
      )}

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
            onOpenInsertModal={handleOpenInsertModal}
            layoutPositions={layoutState.layoutPositions}
            gridRows={layoutState.gridRows}
            gridCols={layoutState.gridCols}
            onAddLayoutAt={handleAddLayoutAt}
            onDuplicateLayoutAt={handleDuplicateLayoutAt}
          />
        </div>
      </div>
      {/* Insert Modal for adding components to a phone */}
      {insertModal && (
        <InsertModal
          modalPos={insertModal.modalPos}
          onInsertComponent={handleInsertComponent}
          onClose={handleCloseInsertModal}
        />
      )}

      {/* Toggle button for admin panel (top left, only when hidden) */}
      {!showAdminPanel && (
        <div className={styles.AdminToggle}>
          <ToolbarButton
            onClick={() => setShowAdminPanel(true)}
            title="Show admin panel"
            icon={Icons.Wallet24}
            iconSize={ICON_24}
          />
        </div>
      )}

      {/* Global Settings Panel */}
      <AnimatePresence>
        {showAdminPanel && (
          <GlobalSettingsPanel
            showAdminPanel={showAdminPanel}
            isPropEditorVisible={isPropEditorVisible}
            rightPanelWidth={rightPanelWidth}
            setRightPanelWidth={setRightPanelWidth}
            onShowJsonPanel={() => setShowJsonPanel(v => !v)}
            showJsonPanel={showJsonPanel}
            onResetWelcomeModal={handleResetWelcomeModal}
            onOpenClearAllLayoutsModal={() => setOpenModal('clearAll')}
            isPhoneSettingsVisible={activeIndex >= 0 && activeLayout !== null}
            onClosePhoneSettings={() => dispatch({ type: 'SET_ACTIVE_LAYOUT', index: -1 })}
          />
        )}
      </AnimatePresence>

      {/* Phone Settings Panel */}
      <AnimatePresence>
        {showAdminPanel && activeIndex >= 0 && activeLayout && (
          <PhoneSettingsPanel
            showAdminPanel={showAdminPanel}
            isPropEditorVisible={isPropEditorVisible}
            rightPanelWidth={rightPanelWidth}
            setRightPanelWidth={setRightPanelWidth}
            showTopBar={!!activeLayout.showTopBar}
            showBottomButtons={!!activeLayout.showBottomButtons}
            showToast={!!activeLayout.showToast}
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
            onClearLayout={() => {
              if (activeIndex >= 0 && activeLayout) {
                dispatch({ type: 'RESET_LAYOUT', index: activeIndex });
              }
            }}
            onDeselectPhone={() => dispatch({ type: 'SET_ACTIVE_LAYOUT', index: -1 })}
            selectedTemplate={selectedTemplate}
            onApplyTemplate={handleApplyTemplate}
            showStatusBar={!!activeLayout.showStatusBar}
            onShowStatusBarChange={() => {
              if (activeIndex >= 0 && activeLayout) {
                dispatch({
                  type: 'UPDATE_LAYOUT',
                  index: activeIndex,
                  payload: { showStatusBar: !activeLayout.showStatusBar }
                });
              }
            }}
            phoneName={layoutState.layoutNames[activeIndex]}
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

      {/* Prop Editor Panel (only shown if needed) */}
      <AnimatePresence>
        {isPropEditorVisible && (
          <motion.div
            className={`${styles.AdminPanel} ${styles.propEditor}${propEditorIsHoveringEdge || propEditorIsResizing ? ' ' + styles.resizing : ''}`}
            ref={rightPanelRef}
            style={{ width: propEditorWidth, borderLeftColor: (propEditorIsHoveringEdge || propEditorIsResizing) ? '#00C244' : undefined }}
            initial={{ x: '100%'}}
            animate={{ x: 0}}
            exit={{ x: '100%'}}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          >
            {/* Draggable left edge for resizing */}
            {propEditorResizeHandle}
            {selected && layoutState.layouts[selected.phoneIndex] && layoutState.layouts[selected.phoneIndex].components[selected.componentIndex]
              ? renderPropEditor()
              : renderSpecialPropEditor()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button for admin panel */}
      {!showAdminPanel && (
        <div className={styles.AdminToggle}>
          <ToolbarButton
            onClick={() => setShowAdminPanel(true)}
            title="Show admin panel"
            icon={Icons.Wallet24}
            iconSize={ICON_24}
          />
        </div>
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