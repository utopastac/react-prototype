import React, { useState, useRef, useEffect } from 'react';
import Icon from 'src/components/Icon';
import IconPicker from './index';
import styles from './IconPickerInput.module.sass';

interface IconPickerInputProps {
  label?: string;
  value: any;
  onChange: (value: any) => void;
}

const IconPickerInput: React.FC<IconPickerInputProps> = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | undefined>(undefined);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // Position modal to the right of the button
      // The Modal component offsets by 320px to the left, so we need to add that plus extra space
      // to position it well to the right of the input button
      setPosition({
        x: rect.right + 600, // Position much further to the right
        y: rect.bottom + 8
      });
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSelect = (icon: any) => {
    onChange(icon);
    setIsOpen(false);
  };

  return (
    <>
      <div className={styles.Input}>
        {label && <label><span>{label}</span></label>}
        <button
          ref={buttonRef}
          type="button"
          className={styles.IconButton}
          onClick={handleOpen}
        >
          {value ? (
            <div className={styles.IconPreview}>
              <Icon icon={value} size="24" color="prominent" />
            </div>
          ) : (
            <span className={styles.Placeholder}>Select an icon...</span>
          )}
        </button>
      </div>
      {isOpen && (
        <IconPicker
          value={value}
          onChange={handleSelect}
          onClose={handleClose}
          x={position?.x}
          y={position?.y}
        />
      )}
    </>
  );
};

export default IconPickerInput;

