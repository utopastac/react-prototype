import React from "react";
import styles from "./index.module.sass";

export interface AdminToggleProps {
  checked: boolean;
}

const AdminToggle: React.FC<AdminToggleProps> = ({ checked }) => {
  return (
    <div className={`${styles.Main} ${checked ? styles.checked : ""}`}>
      <div className={styles.knob}></div>
    </div>
  );
};

export default AdminToggle;
