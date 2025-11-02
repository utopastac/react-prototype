import React from "react";
import styles from "./index.module.sass";

export interface RadioProps {
  checked: boolean;
}

const Radio: React.FC<RadioProps> = ({ checked }) => {
  return (
    <div className={`${styles.Main} ${checked ? styles.checked : ""}`}>
    </div>
  );
};

export default Radio;
