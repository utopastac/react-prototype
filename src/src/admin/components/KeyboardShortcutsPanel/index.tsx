import React from 'react';
import styles from './index.module.sass';
import ShortcutItem from 'src/admin/components/ShortcutItem';

interface KeyboardShortcutsPanelProps {
  className?: string;
}

const KeyboardShortcutsPanel: React.FC<KeyboardShortcutsPanelProps> = ({ className }) => {
  const shortcuts = [
    { key: '←', description: 'Select previous component' },
    { key: '→', description: 'Select next component' },
    { key: '⌘ c', description: 'Clear layouts' },
    { key: '⌘ z', description: 'Undo' },
    { key: '⌘ ⇧ z', description: 'Redo' },
    { key: '⌘ s', description: 'Save' },
    { key: '⌘ l', description: 'Load' },
    { key: '⌘ p', description: 'Share' },
    { key: '⌘ k', description: 'Show keyboard shortcuts' },
    { key: '⌘ /', description: 'Show flow library' },
    { key: '⌘ .', description: 'Toggle admin panel' },
  ];

  return (
    <div className={styles.Main}>
      <div className={styles.ShortcutList}>
        {shortcuts.map((shortcut, index) => (
          <ShortcutItem key={index} keyText={shortcut.key} description={shortcut.description} />
        ))}
      </div>
    </div>
  );
};

export default KeyboardShortcutsPanel; 