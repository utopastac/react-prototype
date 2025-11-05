import React from "react";
import styles from "./index.module.sass";
import Icon from "src/components/Icon";
import CheckboxChecked from 'src/assets/checkbox-checked.svg';

export interface CheckboxProps {
  checked: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked }) => {
  return (
    <div 
      className={`${styles.Main} ${checked ? styles.checked : ""}`}
      style={{ position: 'relative' }}
    >
      {checked && (
        <Icon
          icon={CheckboxChecked}
          size="16"
          color="inverse"
          className={styles.checkmark}
        />
      )}
    </div>
  );
};

export default Checkbox;
