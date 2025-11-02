// AdminView.tsx
//
// The main admin/editor interface for building and previewing UI layouts.
// Handles layout state, drag-and-drop, prop editing, modals, keyboard shortcuts,
// and integration with special UI elements (top bar, bottom buttons).
// Highly modular and extensible for rapid prototyping and UI testing.

import React, { useEffect, useState, useRef } from 'react';
import { useTabBackgroundDispatch, WHITE } from 'src/containers/TabBackgroundContext';
import { FormblockerComponents, ComponentPropMeta, initialComponentProps } from 'src/data/Components';
import styles from './index.module.sass';
import IOSStatusBar from 'src/components/IOSStatusBar';
import IOSHomeIndicator from 'src/components/IOSHomeIndicator';
import { ICON_24 } from 'src/components/Icon';
import * as Icons from 'src/data/Icons';
import TopBar, { TopBarPropMeta } from 'src/components/TopBar';
import ButtonGroup, { ButtonGroupPropMeta } from 'src/components/ButtonGroup';
import StringInput from './LabeledInput/StringInput';
import PhonePreviewContent from './PhonePreviewContent';
import GenericPropEditor from './GenericPropEditor';
import { motion, AnimatePresence } from 'framer-motion';
import EditorToolbar from './components/EditorToolbar';
import AdminToast from 'src/admin/components/Toast';
import {
  handleDelete,
  handleDuplicate,
  handleMoveUp,
  handleMoveDown
} from './componentHandlers';
import { AdminTemplate } from './Templates';
import ToolbarButton from './components/ToolbarButton';
import SettingsPanel from './components/SettingsPanel';
import ComponentPanel from './components/ComponentPanel';
import {
  InsertModal,
  SaveModal,
  LoadModal,
  ShortcutsModal,
  ShareModal,
  ClearModal,
  WelcomeModal
} from './Modals';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useUrlSharing } from './hooks/useUrlSharing';
import JsonPanel from './components/JsonPanel';
import Toast, { ToastPropMeta } from 'src/components/Toast';
import { useHistoryManager } from './hooks/useHistoryManager';
import { useLayoutContext, INITIAL_TOAST_PROPS, INITIAL_STATUS_BAR_PROPS } from './LayoutContext';
import HistoryModal from './Modals/HistoryModal';

type ModalType = null | "insert" | "save" | "load" | "shortcuts" | "share" | "clear" | "welcome";

interface AdminProps {
  theme: string;
  scale: string;
  device: string;
  font: string;
  tabBackground: string;
}

/**
 * AdminView
 *
 * The root admin/editor interface for building UI layouts.
 * Manages all high-level state, drag-and-drop, prop editing, modals, and panels.
 * Integrates with custom hooks for keyboard shortcuts, persistence, and sharing.
 *
 * - dropped: array of components in the layout
 * - selectedIdx: which component is selected for editing
 * - selectedSpecial: which special UI element (top bar, bottom buttons) is selected
 * - openModal: which modal dialog is open
 * - showAdminPanel: whether the component palette/settings are visible
 * - showComponentNames, isAltPressed, etc.: various UI/UX flags
 */
const AdminView: React.FC<AdminProps> = ({ theme, scale, device, font, tabBackground }) => {
  const [layoutState, dispatch] = useLayoutContext();

  // Local UI state (modals, search, etc.)
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [search, setSearch] = useState('');
  const [modalPos, setModalPos] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [insertIdx, setInsertIdx] = useState<number | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<AdminTemplate | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(true);
  const phonePreviewRef = React.useRef<HTMLDivElement>(null);
  const [showJsonPanel, setShowJsonPanel] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const editorToolbarRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = React.useState<string | null>(null);

  // Ephemeral UI state (moved from LayoutContext)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [selectedSpecial, setSelectedSpecial] = useState<null | 'topbar' | 'bottombuttons' | 'toast'>(null);
  const [isAltPressed, setIsAltPressed] = useState(false);
  const [showComponentNames, setShowComponentNames] = useState(false);

  // Derived state
  const isPropEditorVisible = Boolean((selectedIdx !== null && layoutState.dropped[selectedIdx]) || selectedSpecial);
  const isJsonPanelVisible = showJsonPanel && !isPropEditorVisible;

  const tabBackgroundDispatch = useTabBackgroundDispatch();
  const adminPanelWidth = 360;
  const rightPanelWidth = 280;

  useEffect(()=>{
    tabBackgroundDispatch({type: WHITE});
  }, []);

  // Check if user has seen welcome modal before
  useEffect(() => {
    const hasSeenWelcome = window.localStorage.getItem('interventions-hub-welcome-seen');
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true);
    }
  }, []);

  // Close any open modals when admin panel is hidden
  useEffect(() => {
    if (!showAdminPanel) {
      setOpenModal(null);
      setShowWelcomeModal(false);
    }
  }, [showAdminPanel]);

  // Close modals when clicking outside of them
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Check if any modal is open
      const isAnyModalOpen = openModal !== null || showWelcomeModal || showHistoryModal;
      if (!isAnyModalOpen) return;

      // Check if click is on a modal element
      const modalElements = document.querySelectorAll('[data-modal-content]');
      for (const modalEl of modalElements) {
        if (modalEl.contains(e.target as Node)) {
          return; // Click was inside a modal, don't close
        }
      }

      // Click was outside all modals, close them
      if (openModal !== null) {
        setOpenModal(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openModal, showWelcomeModal, showHistoryModal]);

  // Reset function to restore all state to initial values
  const handleReset = () => {
    console.log('[DISPATCH] RESET');
    dispatch({ type: 'RESET' });
  };

  // Deselect on click outside the prop editor or toolbar
  useEffect(() => {
    if (selectedIdx === null && !selectedSpecial) return;
    const handleClick = (e: MouseEvent) => {
      const rightPanel = rightPanelRef.current;
      const editorToolbar = editorToolbarRef.current;
      if (rightPanel && rightPanel.contains(e.target as Node)) return;
      if (editorToolbar && editorToolbar.contains(e.target as Node)) return;
      // Check if click is on a dropped component or special component
      const droppedEls = document.querySelectorAll('[data-dropped-component], [data-special-component]');
      for (const el of droppedEls) {
        if (el.contains(e.target as Node)) return;
      }
      setSelectedIdx(null);
      setSelectedSpecial(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [selectedIdx, selectedSpecial]);

  // ===== HISTORY MANAGEMENT =====
  // 
  // All history logic has been moved to useHistoryManager hook for better
  // separation of concerns and reusability.
  const historyManager = useHistoryManager({
    setSelectedIdx,
    setSelectedSpecial,
  });

  // --- Prop change handlers (no manual history push) ---
  const handleMetaPropChange = (fullKey: string, value: any) => {
    if (selectedIdx === null) return;
    const prevProps = layoutState.dropped[selectedIdx]?.props;
    const newProps = updateNestedState(prevProps, fullKey, value);
    if (JSON.stringify(prevProps) === JSON.stringify(newProps)) return;
    console.log('[DISPATCH] UPDATE dropped component props:', fullKey, value);
    dispatch({ type: 'UPDATE', payload: { dropped: layoutState.dropped.map((item, idx) =>
      idx === selectedIdx
        ? { ...item, props: newProps }
        : item
    ) } });
  };

  const handleSpecialMetaPropChange = (which: 'topbar' | 'bottombuttons' | 'toast') => (fullKey: string, value: any) => {
    if (which === 'topbar') {
      dispatch({ type: 'UPDATE', payload: { topBarProps: updateNestedState(layoutState.topBarProps, fullKey, value) } });
    } else if (which === 'bottombuttons') {
      dispatch({ type: 'UPDATE', payload: { bottomButtonsProps: updateNestedState(layoutState.bottomButtonsProps, fullKey, value) } });
    } else if (which === 'toast') {
      dispatch({ type: 'UPDATE', payload: { toastProps: updateNestedState(layoutState.toastProps, fullKey, value) } });
    }
  };

  // Render a prop editor for a special component (top bar, bottom buttons)
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
      values={values}
      onChange={onChange}
      onDismiss={onDismiss}
    />
  );

  // Render prop editor for selected dropped component
  const renderPropEditor = () => {
    if (selectedIdx === null || !layoutState.dropped[selectedIdx]) return null;
    const { name, props } = layoutState.dropped[selectedIdx];
    const meta = ComponentPropMeta[name as keyof typeof ComponentPropMeta] as any;
    return (
      <div className={styles.Editor}>
        {/* Toolbar for component actions - REMOVED */}
        {meta ? (
          <GenericPropEditor title='Component Settings' meta={meta} values={props} onChange={handleMetaPropChange} onDismiss={() => setSelectedIdx(null)} />
        ) : Object.entries(props).map(([key, value]) => (
          <StringInput
            key={key}
            label={key}
            value={value !== undefined ? String(value) : ''}
            onChange={(val: string) => handleMetaPropChange(key, val)}
          />
        ))}
      </div>
    );
  };

  // Render prop editor for TopBar or ButtonGroup (special components)
  const renderSpecialPropEditor = () => {
    if (!selectedSpecial) return null;
    if (selectedSpecial === 'topbar') {
      return renderSpecialPanel(
        'Top Bar Settings',
        TopBarPropMeta,
        layoutState.topBarProps,
        handleSpecialMetaPropChange('topbar'),
        () => setSelectedSpecial(null)
      );
    } else if (selectedSpecial === 'bottombuttons') {
      return renderSpecialPanel(
        'Bottom Buttons Settings',
        ButtonGroupPropMeta,
        layoutState.bottomButtonsProps,
        handleSpecialMetaPropChange('bottombuttons'),
        () => setSelectedSpecial(null)
      );
    } else if (selectedSpecial === 'toast') {
      return renderSpecialPanel(
        'Toast Settings',
        ToastPropMeta,
        layoutState.toastProps,
        handleSpecialMetaPropChange('toast'),
        () => setSelectedSpecial(null)
      );
    }
    return null;
  };

  // Apply a template (predefined layout)
  const handleApplyTemplate = (template: AdminTemplate) => {
    const payload = {
      dropped: template.dropped.map(c => ({ ...c, props: { ...c.props } })),
      topBarProps: template.topBarProps ?? layoutState.topBarProps,
      showTopBar: !!template.topBarProps,
      bottomButtonsProps: template.bottomButtonsProps ?? layoutState.bottomButtonsProps,
      showBottomButtons: !!template.bottomButtonsProps,
      showStatusBar: template.statusBarProps !== undefined ? true : layoutState.showStatusBar,
      toastProps: template.toastProps ? { ...INITIAL_TOAST_PROPS, ...template.toastProps } : layoutState.toastProps,
      statusBarProps: template.statusBarProps ? { ...INITIAL_STATUS_BAR_PROPS, ...template.statusBarProps } : layoutState.statusBarProps,
    };
    console.log('[DISPATCH] UPDATE (apply template):', payload);
    dispatch({ type: 'UPDATE', payload });
    setSelectedIdx(null);
    setSelectedSpecial(null);
    setSelectedTemplate(template);
  };

  // ===== MODAL HANDLERS =====
  // Open Insert modal
  const handleOpenInsertModal = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setModalPos({ x: e.pageX, y: e.pageY });
    setInsertIdx(idx + 1);
    setOpenModal("insert");
  };
  // Open Save modal
  const handleOpenSave = () => {
    localStorage.setSaveName('');
    setOpenModal("save");
  };
  // Open Load modal
  const handleOpenLoad = () => {
    localStorage.setLoadList(localStorage.getLoadList());
    setOpenModal("load");
    localStorage.setLoadError('');
  };
  // Show keyboard shortcuts modal
  const handleShowKeyboardShortcuts = () => {
    setOpenModal("shortcuts");
  };
  // Share handler (HashRouter version)
  const handleShare = () => {
    urlSharing.handleShare();
    setOpenModal("share");
  };

  // Welcome modal handler
  const handleCloseWelcomeModal = () => {
    window.localStorage.setItem('interventions-hub-welcome-seen', 'true');
    setShowWelcomeModal(false);
  };

  // Reset welcome modal for testing
  const handleResetWelcomeModal = () => {
    window.localStorage.removeItem('interventions-hub-welcome-seen');
    setShowWelcomeModal(true);
  };

  // --- Context-based setter wrappers ---
  const setSelectedIdxCompat: React.Dispatch<React.SetStateAction<number | null>> = (value) => {
    const resolved = typeof value === 'function' ? value(selectedIdx) : value;
    setSelectedIdx(resolved);
  };
  const setIsAltPressedCompat: React.Dispatch<React.SetStateAction<boolean>> = (value) => {
    const resolved = typeof value === 'function' ? value(isAltPressed) : value;
    setIsAltPressed(resolved);
  };

  // Keyboard shortcuts for navigation, duplication, deletion, etc.
  useKeyboardShortcuts({
    selectedIdx: selectedIdx,
    dropped: layoutState.dropped,
    dispatch,
    setSelectedIdx: setSelectedIdxCompat,
    setIsAltPressed: setIsAltPressedCompat,
    setShowComponentNames: (val) => {
      const newVal = typeof val === 'function' ? val(showComponentNames) : val;
      setShowComponentNames(newVal);
    },
    setShowAdminPanel: (val) => {
      const newVal = typeof val === 'function' ? val(showAdminPanel) : val;
      setShowAdminPanel(newVal);
    },
    handleReset: ()=>{
      setOpenModal("clear");
    },
    handleSave: ()=>{
      setOpenModal("save");
    },
    handleUndo: historyManager.handleUndo, // pass undo
    handleRedo: historyManager.handleRedo, // pass redo
    canUndo: historyManager.canUndo,
    canRedo: historyManager.canRedo,
  });

  // Drag-and-drop logic for rearranging components
  const dragAndDrop = useDragAndDrop({
    dropped: layoutState.dropped,
    dispatch,
  });

  // Local storage persistence for saving/loading layouts
  const localStorage = useLocalStorage();

  // URL sharing logic for sharing layouts via URL
  const urlSharing = useUrlSharing();

  // Handler to add a dropped component (for drag-and-drop from palette)
  const handleDroppedComponentAdd = (
    newComponent: { name: string; Component: React.ComponentType<any>; props: any },
    idx?: number | null
  ) => {
    console.log('[DROPPED COMPONENT ADD]', newComponent, idx);
    const newDropped = [...layoutState.dropped];
    let newSelectedIdx: number;
    if (typeof idx === 'number' && idx >= 0 && idx <= newDropped.length) {
      newDropped.splice(idx, 0, newComponent);
      newSelectedIdx = idx;
    } else {
      newDropped.push(newComponent);
      newSelectedIdx = newDropped.length - 1;
    }
    console.log('[DISPATCH] UPDATE (add component):', { dropped: newDropped });
    dispatch({ type: 'UPDATE', payload: { dropped: newDropped } });
    setSelectedIdx(newSelectedIdx);
  };

  // Insert component from modal (batch update: dropped + selectedIdx)
  const handleInsertComponent = (name: string) => {
    if (insertIdx == null) return;
    const Component = (FormblockerComponents as any)[name];
    if (!Component) return;
    const newDropped = [...layoutState.dropped];
    newDropped.splice(insertIdx, 0, {
      name,
      Component,
      props: initialComponentProps[name] || {}
    });
    console.log('[DISPATCH] UPDATE (insert component):', { dropped: newDropped });
    dispatch({ type: 'UPDATE', payload: { dropped: newDropped } });
    setSelectedIdx(insertIdx);
    setOpenModal(null);
    setInsertIdx(null);
  };
  // Save current state
  const handleSave = () => {
    const success = localStorage.handleSave();
    if (success) {
      setOpenModal(null);
      setToast('✅ Saved successfully');
    }
  };
  // Load a saved state
  const handleLoad = (name: string) => {
    const success = localStorage.handleLoad(name);
    if (success) {
      setOpenModal(null);
      setToast('✅ Loaded successfully');
    }
  };
  // Delete a save
  const handleDeleteSave = (name: string) => {
    localStorage.handleDeleteSave(name);
  };

  /**
   * updateNestedState
   *
   * Helper to update deeply nested state (dot/bracket notation, arrays, deep objects)
   * Used for prop editing in GenericPropEditor and special panels.
   */
  function updateNestedState<T>(prev: T, fullKey: string, value: any): T {
    const keys = fullKey.split(/\.|\[|\]/).filter(Boolean);
    // Recursively walk the keys
    function setDeep(obj: any, keys: string[], value: any): any {
      if (keys.length === 0) return value;
      const [key, ...rest] = keys;
      // If key is an array index
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

  // Main render: admin panel, phone preview, prop editor, modals, etc.
  return (
    <div className={styles.Main}>
      {/* Tools Panel (toggleable, animated) */}
      <AnimatePresence>
        {showAdminPanel && (
          <ComponentPanel
            showAdminPanel={showAdminPanel}
            adminPanelWidth={adminPanelWidth}
            search={search}
            onSearchChange={setSearch}
            onHideAdminPanel={() => setShowAdminPanel(false)}
            onShowKeyboardShortcuts={handleShowKeyboardShortcuts}
            onOpenSave={handleOpenSave}
            onOpenLoad={handleOpenLoad}
            onShare={handleShare}
            onDragStart={dragAndDrop.setDraggedName}
            onDragEnd={() => dragAndDrop.setDraggedName(null)}
            onComponentClick={(name, Component) => {
              dispatch({ type: 'UPDATE', payload: {
                dropped: [...layoutState.dropped, { name, Component, props: { ...initialComponentProps[name] } }]
              }});
              setSelectedIdx(layoutState.dropped.length);
            }}
            droppedLength={layoutState.dropped.length}
            selectedTemplate={selectedTemplate}
            onApplyTemplate={handleApplyTemplate}
            onShowHistory={() => setShowHistoryModal(true)}
          />
        )}
      </AnimatePresence>

      <div
        className={styles.CenterContainer}
        data-theme={theme}
        data-text-scale={scale}
        data-device={device}
        data-font={font}
        data-tab-bg={tabBackground}
      >
          
        <div
          className={[
            styles.PhonePreview,
            dragAndDrop.isPhoneDragOver ? styles.PhonePreviewDragOver : ''
          ].filter(Boolean).join(' ')}
          ref={phonePreviewRef}
          onDrop={dragAndDrop.handleDrop}
          onDragOver={dragAndDrop.handleDragOver}
          onDragEnter={dragAndDrop.handleDragEnter}
          onDragLeave={dragAndDrop.handleDragLeave}
          onDragEnd={dragAndDrop.handleDragEnd}
        >
          <PhonePreviewContent
            dropped={layoutState.dropped}
            selectedIdx={selectedIdx}
            setSelectedIdx={setSelectedIdxCompat}
            draggedIdx={dragAndDrop.draggedIdx}
            setDraggedIdx={dragAndDrop.setDraggedIdx}
            dragOverIdx={dragAndDrop.dragOverIdx}
            setDragOverIdx={dragAndDrop.setDragOverIdx}
            isAltPressed={isAltPressed}
            setIsAltPressed={setIsAltPressed}
            showTopBar={layoutState.showTopBar}
            topBarProps={layoutState.topBarProps}
            setSelectedSpecial={setSelectedSpecial}
            showBottomButtons={layoutState.showBottomButtons}
            bottomButtonsProps={layoutState.bottomButtonsProps}
            showToast={layoutState.showToast}
            toastProps={layoutState.toastProps}
            setDropped={(updater) => {
              const newDropped = typeof updater === 'function' ? updater(layoutState.dropped) : updater;
              dispatch({ type: 'UPDATE', payload: { dropped: newDropped } });
            }}
            styles={styles}
            TopBar={TopBar}
            ButtonGroup={ButtonGroup}
            Toast={Toast}
            IOSStatusBar={IOSStatusBar}
            IOSHomeIndicator={IOSHomeIndicator}
            showComponentNames={showComponentNames}
            selectedSpecial={selectedSpecial}
            onOpenInsertModal={handleOpenInsertModal}
            onDuplicate={idx => handleDuplicate({ dispatch, selectedIdx: idx, dropped: layoutState.dropped, setSelectedIdx })}
            onDelete={idx => handleDelete({ dispatch, selectedIdx: idx, dropped: layoutState.dropped, setSelectedIdx })}
            onDragEnd={dragAndDrop.handleDragEnd}
            onDroppedComponentAdd={handleDroppedComponentAdd}
          />
        </div>
        {/* EditorToolbar fixed next to PhonePreview */}
        {selectedIdx !== null && layoutState.dropped[selectedIdx] && (
          <EditorToolbar
            ref={editorToolbarRef}
            onDelete={() => handleDelete({ dispatch, selectedIdx: selectedIdx, dropped: layoutState.dropped, setSelectedIdx })}
            onDuplicate={() => handleDuplicate({ dispatch, selectedIdx: selectedIdx, dropped: layoutState.dropped, setSelectedIdx })}
            onMoveUp={() => handleMoveUp({ dispatch, selectedIdx: selectedIdx, dropped: layoutState.dropped, setSelectedIdx })}
            onMoveDown={() => handleMoveDown({ dispatch, selectedIdx: selectedIdx, dropped: layoutState.dropped, setSelectedIdx })}
            disableUp={selectedIdx === 0}
            disableDown={selectedIdx === layoutState.dropped.length - 1}
          />
        )}
      </div>

      {/* Insert Component Modal */}
      {openModal === "insert" && (
        <InsertModal
          modalPos={modalPos}
          onInsertComponent={handleInsertComponent}
          onClose={() => setOpenModal(null)}
        />
      )}

      {/* Toggle button for admin panel (top left, only when hidden) */}
      {!showAdminPanel && (
        <div className={styles.AdminToggle}>
          <ToolbarButton
            onClick={() => setShowAdminPanel(true)}
            title="Show admin panel (⌘.)"
            icon={Icons.Wallet24}
            iconSize={ICON_24}
          />
        </div>
      )}

      <AnimatePresence>
        {showAdminPanel && (
          <SettingsPanel
            showAdminPanel={showAdminPanel}
            isPropEditorVisible={isPropEditorVisible}
            rightPanelWidth={rightPanelWidth}
            showTopBar={layoutState.showTopBar}
            showBottomButtons={layoutState.showBottomButtons}
            showToast={layoutState.showToast}
            onShowTopBarChange={() => dispatch({ type: 'UPDATE', payload: { showTopBar: !layoutState.showTopBar } })}
            onShowBottomButtonsChange={() => dispatch({ type: 'UPDATE', payload: { showBottomButtons: !layoutState.showBottomButtons } })}
            onShowToastChange={() => dispatch({ type: 'UPDATE', payload: { showToast: !layoutState.showToast } })}
            onClearLayout={() => setOpenModal("clear")}
            onShowJsonPanel={() => setShowJsonPanel(v => !v)}
            showJsonPanel={showJsonPanel}
            onResetWelcomeModal={handleResetWelcomeModal}
          />
        )}
      </AnimatePresence>

      {/* Prop Editor Panel (only shown if needed) */}
      <AnimatePresence>
        {isPropEditorVisible && showAdminPanel && (
          <motion.div
            className={`${styles.AdminPanel} ${styles.propEditor}`}
            ref={rightPanelRef}
            initial={{ x: '100%'}}
            animate={{ x: 0}}
            exit={{ x: '100%'}}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          >
            {selectedIdx !== null && layoutState.dropped[selectedIdx]
              ? renderPropEditor()
              : renderSpecialPropEditor()}
          </motion.div>
        )}
      </AnimatePresence>

      <JsonPanel
        visible={isJsonPanelVisible && showAdminPanel}
        onClose={() => setShowJsonPanel(false)}
        getLayoutData={urlSharing.getLayoutData}
        showToast={setToast}
      />

      {/* Save Modal */}
      {openModal === "save" && (
        <SaveModal
          saveName={localStorage.saveName}
          onSaveNameChange={localStorage.setSaveName}
          onSave={handleSave}
          onClose={() => setOpenModal(null)}
        />
      )}

      {/* Load Modal */}
      {openModal === "load" && (
        <LoadModal
          loadList={localStorage.loadList}
          loadError={localStorage.loadError}
          onLoad={handleLoad}
          onDeleteSave={handleDeleteSave}
          onClose={() => setOpenModal(null)}
        />
      )}

      {/* Keyboard Shortcuts Modal */}
      {openModal === "shortcuts" && (
        <ShortcutsModal onClose={() => setOpenModal(null)} />
      )}

      {/* Share Modal */}
      {openModal === "share" && (
        <ShareModal
          shareUrl={urlSharing.shareUrl}
          layoutData={urlSharing.getLayoutData()}
          onClose={() => setOpenModal(null)}
          showToast={setToast}
        />
      )}

      {/* Clear Confirmation Modal */}
      {openModal === "clear" && (
        <ClearModal
          onClear={() => { setOpenModal(null); handleReset(); }}
          onClose={() => setOpenModal(null)}
        />
      )}

      {/* Welcome Modal (shows on first visit) */}
      {showWelcomeModal && (
        <WelcomeModal onClose={handleCloseWelcomeModal} />
      )}

      {/* History Modal - shows history stack for debugging */}
      {showHistoryModal && (
        <HistoryModal
          history={historyManager.history}
          onClose={() => setShowHistoryModal(false)}
          onJumpTo={idx => {
            // Jump to specific history entry and restore layout
            historyManager.jumpToHistory(idx);
            setShowHistoryModal(false);
          }}
        />
      )}

      {toast && <AdminToast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
};

export default AdminView;