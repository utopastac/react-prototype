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

  const handleOpen = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const modalOffsetLeft = 320; // Modal shifts itself left by 320px
      const modalOffsetTop = 32;   // Modal shifts itself up by 32px

      setPosition({
        x: rect.left + modalOffsetLeft,
        y: rect.top + modalOffsetTop,
      });
    }

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

