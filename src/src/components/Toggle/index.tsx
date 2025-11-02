import React from "react";
import styles from "./index.module.sass";

export interface ToggleProps {
  checked: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ checked }) => {
  return (
    <div className={`${styles.Main} ${checked ? styles.checked : ""}`}>
      <div className={styles.knob}></div>
    </div>
  );
};

export default Toggle;
