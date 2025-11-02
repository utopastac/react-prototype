import { useEffect, useRef } from 'react';
import { isEditingField } from 'src/helpers/Utils';
import { FormblockerComponents } from 'src/data/Components';
import {
  handleDeleteMulti,
  handleMoveUpMulti,
  handleMoveDownMulti,
  handleSelectPreviousMulti,
  handleSelectNextMulti,
  handleCopyMultiComponent,
  handlePasteMultiComponent
} from '../adminComponentHandlers';

interface KeyboardShortcutsProps {
  selected: { phoneIndex: number, componentIndex: number } | null;
  layoutState: any;
  dispatch: any;
  setSelected: any;
  handleReset: any;
  handleSave: any;
  handleUndo?: any;
  handleRedo?: any;
  canUndo?: boolean;
  canRedo?: boolean;
  setShowAdminPanel?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowComponentNames?: React.Dispatch<React.SetStateAction<boolean>>;
  handleLoad?: () => void;
  handleShowShortcuts?: () => void;
  handleShareModal?: () => void;
  setOpenModal?: (modal: string) => void;
  handleShowTemplates?: () => void;
}

export function useKeyboardShortcuts({
  selected,
  layoutState,
  dispatch,
  setSelected,
  handleReset,
  handleSave,
  handleUndo,
  handleRedo,
  canUndo,
  canRedo,
  setShowAdminPanel,
  setShowComponentNames,
  handleLoad,
  handleShowShortcuts,
  handleShareModal,
  setOpenModal,
  handleShowTemplates,
}: KeyboardShortcutsProps) {
  const clipboardRef = useRef<{ type: 'component' | 'layout', data: any } | null>(null);

  useEffect(() => {
    // Helper for deep cloning
    const deepClone = (obj: any) => JSON.parse(JSON.stringify(obj));

    const getCurrent = () => {
      if (!selected) return { components: [], phoneIndex: 0, componentIndex: null };
      const { phoneIndex, componentIndex } = selected;
      const layout = layoutState.layouts[phoneIndex];
      return { components: layout.components, phoneIndex, componentIndex };
    };

    const setSelectedIdx = (idx: number | null) => {
      if (!selected) return;
      setSelected(idx === null ? null : { phoneIndex: selected.phoneIndex, componentIndex: idx });
    };

    const shortcuts = [
      {
        key: 'Backspace',
        condition: () => selected && !isEditingField(),
        action: () => {
          const { components, phoneIndex, componentIndex } = getCurrent();
          handleDeleteMulti({
            dispatch,
            phoneIndex,
            componentIndex,
            components,
            setSelected
          });
          return true;
        }
      },
      {
        key: 'ArrowLeft',
        condition: () => !isEditingField(),
        action: () => {
          const { components, phoneIndex, componentIndex } = getCurrent();
          handleSelectPreviousMulti({
            phoneIndex,
            componentIndex,
            components,
            setSelected
          });
          return true;
        }
      },
      {
        key: 'ArrowRight',
        condition: () => !isEditingField(),
        action: () => {
          const { components, phoneIndex, componentIndex } = getCurrent();
          handleSelectNextMulti({
            phoneIndex,
            componentIndex,
            components,
            setSelected
          });
          return true;
        }
      },
      {
        key: 'ArrowUp',
        condition: () => selected && !isEditingField(),
        action: () => {
          const { components, phoneIndex, componentIndex } = getCurrent();
          handleMoveUpMulti({
            dispatch,
            phoneIndex,
            componentIndex,
            components,
            setSelected
          });
          return true;
        }
      },
      {
        key: 'ArrowDown',
        condition: () => selected && !isEditingField(),
        action: () => {
          const { components, phoneIndex, componentIndex } = getCurrent();
          handleMoveDownMulti({
            dispatch,
            phoneIndex,
            componentIndex,
            components,
            setSelected
          });
          return true;
        }
      },
      {
        key: ',',
        condition: () => !isEditingField(),
        action: () => {
          if (setShowComponentNames) setShowComponentNames((prev: boolean) => !prev);
          return true;
        }
      },
      {
        key: 'k',
        condition: (e?: KeyboardEvent) => !!e && (e.metaKey || e.ctrlKey) && !isEditingField(),
        action: () => {
          handleReset();
          return true;
        }
      },
      {
        key: '.',
        condition: (e?: KeyboardEvent) => !!e && (e.metaKey || e.ctrlKey) && !isEditingField(),
        action: () => {
          if (setShowAdminPanel) setShowAdminPanel((prev: boolean) => !prev);
          return true;
        }
      },
      {
        key: 's',
        condition: (e?: KeyboardEvent) => (e?.metaKey || e?.ctrlKey) && !isEditingField(),
        action: () => {
          handleSave();
          return true;
        }
      },
      {
        key: 'z',
        condition: (e?: KeyboardEvent) => (e?.metaKey || e?.ctrlKey) && !isEditingField(),
        action: (e?: KeyboardEvent) => {
          if (e?.shiftKey) {
            if (handleRedo && canRedo) {
              handleRedo();
              return true;
            }
          } else {
            if (handleUndo && canUndo) {
              handleUndo();
              return true;
            }
          }
          return false;
        }
      },
      {
        key: 'l',
        // Cmd/Ctrl+L: Open Load Modal
        condition: (e?: KeyboardEvent) => (e?.metaKey || e?.ctrlKey) && !isEditingField(),
        action: () => {
          if (typeof (window as any).handleOpenLoad === 'function') {
            (window as any).handleOpenLoad();
            return true;
          }
          if (typeof handleLoad === 'function') {
            handleLoad();
            return true;
          }
          if (typeof setOpenModal === 'function') {
            setOpenModal('load');
            return true;
          }
          return false;
        }
      },
      {
        key: 'k',
        // Cmd/Ctrl+K: Open Keyboard Shortcuts Modal
        condition: (e?: KeyboardEvent) => (e?.metaKey || e?.ctrlKey) && !isEditingField(),
        action: () => {
          if (typeof (window as any).handleShowShortcuts === 'function') {
            (window as any).handleShowShortcuts();
            return true;
          }
          if (typeof handleShowShortcuts === 'function') {
            handleShowShortcuts();
            return true;
          }
          if (typeof setOpenModal === 'function') {
            setOpenModal('shortcuts');
            return true;
          }
          return false;
        }
      },
      {
        key: 'p',
        // Cmd/Ctrl+P: Open Share Modal
        condition: (e?: KeyboardEvent) => (e?.metaKey || e?.ctrlKey) && !isEditingField(),
        action: () => {
          if (typeof (window as any).handleShareModal === 'function') {
            (window as any).handleShareModal();
            return true;
          }
          if (typeof handleShareModal === 'function') {
            handleShareModal();
            return true;
          }
          if (typeof setOpenModal === 'function') {
            setOpenModal('share');
            return true;
          }
          return false;
        }
      },
      {
        key: '/',
        // Cmd/Ctrl+/ : Open Flow Library (Templates) Modal
        condition: (e?: KeyboardEvent) => (e?.metaKey || e?.ctrlKey) && !isEditingField(),
        action: () => {
          if (typeof (window as any).handleShowTemplates === 'function') {
            (window as any).handleShowTemplates();
            return true;
          }
          if (typeof handleShowTemplates === 'function') {
            handleShowTemplates();
            return true;
          }
          if (typeof setOpenModal === 'function') {
            setOpenModal('templates');
            return true;
          }
          return false;
        }
      },
      {
        key: 'c',
        // Cmd/Ctrl+C: Copy component or layout
        condition: (e?: KeyboardEvent) => (e?.metaKey || e?.ctrlKey) && !isEditingField(),
        action: () => {
          return handleCopyMultiComponent({
            selected,
            layoutState,
            clipboardRef,
            deepClone
          });
        }
      },
      {
        key: 'v',
        // Cmd/Ctrl+V: Paste component or layout
        condition: (e?: KeyboardEvent) => (e?.metaKey || e?.ctrlKey) && !isEditingField(),
        action: () => {
          return handlePasteMultiComponent({
            selected,
            layoutState,
            dispatch,
            setSelected,
            clipboardRef,
            deepClone
          });
        }
      },
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      const shortcut = shortcuts.find(s => s.key === e.key && (!s.condition || s.condition(e)));
      if (shortcut && shortcut.condition && shortcut.condition(e)) {
        const shouldPreventDefault = shortcut.action(e);
        if (shouldPreventDefault) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selected, layoutState, dispatch, setSelected, setShowAdminPanel, setShowComponentNames, handleReset, handleSave, handleLoad, handleShowShortcuts, handleShareModal, setOpenModal, handleShowTemplates]);
} 