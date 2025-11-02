import React, { useState } from "react";
import styles from "./index.module.sass";

export interface PINCheckProps {
  value?: string;
  onChange?: (value: string) => void;
  length?: number; // default 4
}

const DEFAULT_LENGTH = 4;

const PINCheck: React.FC<PINCheckProps> = ({ value, onChange, length = DEFAULT_LENGTH }) => {
  const [internalValue, setInternalValue] = useState("");
  const pin = value !== undefined ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, "").slice(0, length);
    if (onChange) onChange(val);
    else setInternalValue(val);
  };

  return (
    <div className={styles.Main}>
      <input
        className={styles.HiddenInput}
        type="tel"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={length}
        value={pin}
        onChange={handleChange}
        aria-label="PIN code"
      />
      <div className={styles.Circles} onClick={() => {
        // Focus the input when circles are clicked
        const input = document.querySelector(`.${styles.HiddenInput}`) as HTMLInputElement;
        if (input) input.focus();
      }}>
        {Array.from({ length }).map((_, i) => (
          <div
            key={i}
            className={`${styles.Circle} ${pin.length > i ? styles.filled : styles.empty}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PINCheck;

export const PINCheckPropMeta = {
  value: { type: 'string', label: 'PIN Value' },
  length: { type: 'number', label: 'PIN Length', default: 4 },
}; 