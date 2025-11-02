// useKeyboardShortcuts.ts
//
// Custom React hook for handling keyboard shortcuts in the admin UI.
// Supports navigation, duplication, deletion, toggling panels, and more.
// Used by AdminView for power-user workflows and accessibility.

import { useEffect } from 'react';
import { isEditingField } from 'src/helpers/Utils';
import {
  handleDelete,
  handleSelectPrevious,
  handleSelectNext
} from '../componentHandlers';

interface KeyboardShortcutsProps {
  selectedIdx: number | null;
  dropped: Array<{ name: string; Component: React.ComponentType<any>; props: any }>;
  dispatch: (action: { type: 'UPDATE'; payload: any }) => void;
  setSelectedIdx: React.Dispatch<React.SetStateAction<number | null>>;
  setIsAltPressed: React.Dispatch<React.SetStateAction<boolean>>;
  setShowComponentNames: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAdminPanel: React.Dispatch<React.SetStateAction<boolean>>;
  handleReset: () => void;
  handleSave: () => void;
  handleUndo?: () => void;
  handleRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

/**
 * useKeyboardShortcuts
 *
 * Provides keyboard shortcut handlers for navigation, editing, and toggling UI in the admin UI.
 * Prevents shortcuts from firing when editing a field.
 *
 * @param props - all relevant state and setters
 */
export const useKeyboardShortcuts = ({
  selectedIdx,
  dropped,
  dispatch,
  setSelectedIdx,
  setIsAltPressed,
  setShowComponentNames,
  setShowAdminPanel,
  handleReset,
  handleSave,
  handleUndo,
  handleRedo,
  canUndo,
  canRedo
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    // List of supported shortcuts and their handlers
    const shortcuts = [
      {
        key: 'Backspace',
        condition: () => selectedIdx !== null && !isEditingField(),
        action: () => {
          handleDelete({ dispatch, selectedIdx, dropped, setSelectedIdx });
          return true; // prevent default
        }
      },
      {
        key: 'ArrowLeft',
        condition: () => !isEditingField(),
        action: () => {
          handleSelectPrevious({ dispatch, selectedIdx, dropped, setSelectedIdx });
          return true;
        }
      },
      {
        key: 'ArrowRight',
        condition: () => !isEditingField(),
        action: () => {
          handleSelectNext({ dispatch, selectedIdx, dropped, setSelectedIdx });
          return true;
        }
      },
      {
        key: 'ArrowUp',
        condition: () => selectedIdx !== null && !isEditingField(),
        action: () => {
          if (selectedIdx === null) return false;
          const newDropped = [...dropped];
          if (selectedIdx > 0) {
            [newDropped[selectedIdx - 1], newDropped[selectedIdx]] = [newDropped[selectedIdx], newDropped[selectedIdx - 1]];
            dispatch({ type: 'UPDATE', payload: { dropped: newDropped } });
            setSelectedIdx(selectedIdx - 1);
          }
          return true;
        }
      },
      {
        key: 'ArrowDown',
        condition: () => selectedIdx !== null && !isEditingField(),
        action: () => {
          if (selectedIdx === null) return false;
          const newDropped = [...dropped];
          if (selectedIdx < newDropped.length - 1) {
            [newDropped[selectedIdx + 1], newDropped[selectedIdx]] = [newDropped[selectedIdx], newDropped[selectedIdx + 1]];
            dispatch({ type: 'UPDATE', payload: { dropped: newDropped } });
            setSelectedIdx(selectedIdx + 1);
          }
          return true;
        }
      },
      {
        key: ',',
        condition: () => !isEditingField(),
        action: () => {
          setShowComponentNames(prev => !prev);
          return true;
        }
      },
      {
        key: 'c',
        condition: () => !isEditingField(),
        action: () => {
          handleReset();
          return true;
        }
      },
      {
        key: '.',
        condition: (e?: KeyboardEvent) => !!e && (e.metaKey || e.ctrlKey) && !isEditingField(),
        action: () => {
          setShowAdminPanel(prev => !prev);
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
      }
    ];

    // Main keydown handler for shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) setIsAltPressed(true);
      const shortcut = shortcuts.find(s => s.key === e.key && (!s.condition || s.condition(e)));
      if (shortcut && shortcut.condition && shortcut.condition(e)) {
        const shouldPreventDefault = shortcut.action(e);
        if (shouldPreventDefault) {
          e.preventDefault();
        }
      }
    };

    // Keyup handler to reset alt state
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.altKey) setIsAltPressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedIdx, dropped, dispatch, setSelectedIdx, setIsAltPressed, setShowComponentNames, setShowAdminPanel, handleReset, handleUndo, handleRedo, canUndo, canRedo]);
}; 