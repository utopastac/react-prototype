import React, { useState, useRef, useEffect } from 'react';
import styles from './index.module.sass';

interface EditableLabelProps {
  label: string;
  onRenameFinish: (newValue: string) => void;
  onRenameCancel: () => void;
  className?: string;
  inputClassName?: string;
}

const EditableLabel: React.FC<EditableLabelProps> = ({
  label,
  onRenameFinish,
  onRenameCancel,
  className,
  inputClassName,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(label);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const sizerRef = useRef<HTMLSpanElement | null>(null);

  // Enter edit mode on double click
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue(label);
    setIsEditing(true);
  };

  // Auto-focus and select input when editing
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Auto-size input width
  useEffect(() => {
    if (isEditing && sizerRef.current && inputRef.current) {
      inputRef.current.style.width = (sizerRef.current.offsetWidth + 8) + 'px';
    }
  }, [inputValue, isEditing]);

  // Handle finish
  const finish = () => {
    const trimmed = inputValue.trim();
    if (trimmed && trimmed !== label) {
      onRenameFinish(trimmed);
    }
    setIsEditing(false);
  };

  // Handle cancel
  const cancel = () => {
    setIsEditing(false);
    setInputValue(label);
    onRenameCancel();
  };

  return (
    <div
      className={[styles.EditableLabel].filter(Boolean).join(' ')}
      onDoubleClick={handleDoubleClick}
      style={{ display: 'inline-block', position: 'relative' }}
    >
      {isEditing ? (
        <>
          <input
            type="text"
            value={inputValue}
            ref={inputRef}
            onChange={e => setInputValue(e.target.value)}
            onBlur={finish}
            onKeyDown={e => {
              if (e.key === 'Enter') finish();
              if (e.key === 'Escape') cancel();
            }}
            className={`${styles.EditableLabelInput} ${inputClassName ? inputClassName : ''}`}
            style={{ minWidth: 20 }}
          />
          <span
            ref={sizerRef}
            className={styles.EditableLabelSizer}
          >
            {inputValue || ' '}
          </span>
        </>
      ) : (
        <span className={`${styles.label} ${className ? className : ''}`}>{label}</span>
      )}
    </div>
  );
};

export default EditableLabel; 