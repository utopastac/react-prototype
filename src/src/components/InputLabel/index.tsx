import React from "react";
import styles from "./index.module.sass";

export interface InputLabelProps {
  children: React.ReactNode;
}

const InputLabel: React.FC<InputLabelProps> = ({ children }) => {
  return <label className={styles.Label}>{children}</label>;
};

export default InputLabel;

