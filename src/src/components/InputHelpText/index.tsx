import React from "react";
import styles from "./index.module.sass";
import Icon from "src/components/Icon";

export interface InputHelpTextProps {
  children: React.ReactNode;
  helpIcon?: string;
}

const InputHelpText: React.FC<InputHelpTextProps> = ({ children, helpIcon }) => {
  return (
    <div className={styles.HelpText}>
      {helpIcon && <Icon icon={helpIcon} size="16" color="standard" />}
      <p>{children}</p>
    </div>
  );
};

export default InputHelpText;

