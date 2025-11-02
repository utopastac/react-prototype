import { useEffect } from 'react';
import { isEditingField } from 'src/helpers/Utils';

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
  useEffect(() => {
    const getCurrent = () => {
      if (!selected) return { components: [], phoneIndex: 0, componentIndex: null };
      const { phoneIndex, componentIndex } = selected;
      const layout = layoutState.layouts[phoneIndex];
      return { components: layout.components, phoneIndex, componentIndex };
    };

    const shortcuts = [
      {
        key: 'ArrowLeft',
        condition: () => !isEditingField(),
        action: () => {
          const { components, phoneIndex, componentIndex } = getCurrent();
          // Navigate to previous component
          if (componentIndex === null) {
            if (components.length > 0) {
              setSelected({ phoneIndex, componentIndex: components.length - 1 });
            }
          } else if (componentIndex > 0) {
            setSelected({ phoneIndex, componentIndex: componentIndex - 1 });
          }
          return true;
        }
      },
      {
        key: 'ArrowRight',
        condition: () => !isEditingField(),
        action: () => {
          const { components, phoneIndex, componentIndex } = getCurrent();
          // Navigate to next component
          if (componentIndex === null) {
            if (components.length > 0) {
              setSelected({ phoneIndex, componentIndex: 0 });
            }
          } else if (componentIndex < components.length - 1) {
            setSelected({ phoneIndex, componentIndex: componentIndex + 1 });
          }
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