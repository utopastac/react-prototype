import React from "react";
import styles from "./index.module.sass";

export interface SwitchProps {
  checked: boolean;
  title?: string;
  helperText?: string;
}

const Switch: React.FC<SwitchProps> = ({ checked, title, helperText }) => {
  return (
    <div className={styles.Main}>
      {(title || helperText) && (
        <div className={styles.textContent}>
          {title && <label className={styles.title}>{title}</label>}
          {helperText && <p className={styles.helperText}>{helperText}</p>}
        </div>
      )}
      <div className={styles.switchWrapper}>
        <span className={styles.label}>{checked ? "On" : "Off"}</span>
        <div className={`${styles.switch} ${checked ? styles.checked : ""}`}>
          <div className={styles.knob}></div>
        </div>
      </div>
    </div>
  );
};

export default Switch;

export const SwitchPropMeta = {
  checked: { type: 'boolean', label: 'Checked' },
  title: { type: 'string', label: 'Title' },
  helperText: { type: 'string', label: 'Helper Text' },
};

