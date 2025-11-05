import React from 'react';
import styles from './index.module.sass';

export interface ShortcutItemProps {
  keyText: string;
  description: string;
  onClick?: (() => void);
}

const ShortcutItem: React.FC<ShortcutItemProps> = ({ keyText, description, onClick }) => {
  return (
    <div className={styles.Main} onClick={onClick} style={onClick ? { cursor: "pointer" } : {}}>
      <div><kbd className={styles.key}>{
        /[\u2318\u21E7\u232B]/.test(keyText)
          ? keyText.split('').map((char, i) =>
              ['⌘', '⇧', '⌫', '⎇', '⌥'].includes(char)
                ? <span key={i} className={styles.commandKey}>{char}</span>
                : char
            )
          : keyText
      }</kbd></div>
      <div className={styles.description}>{description}</div>
    </div>
  );
};

export default ShortcutItem; 