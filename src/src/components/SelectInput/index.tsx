import React from "react";
import styles from "./index.module.sass";
import Icon, { IconPropMeta } from "src/components/Icon";
import InputLabel from "src/components/InputLabel";
import InputHelpText from "src/components/InputHelpText";
import * as Icons from "src/data/AllIcons";

export interface SelectInputProps {
  label?: string;
  body?: string;
  helpIcon?: string;
  placeholder: string;
}

const SelectInput: React.FC<SelectInputProps> = ({ label, body, helpIcon, placeholder }) => {
  return (
    <div className={styles.Main}>
      {label && <InputLabel>{label}</InputLabel>}
      <div className={styles.inputWrapper}>
        <input placeholder={placeholder} readOnly />
        <div className={styles.trailingIcon}>
          <Icon icon={Icons.System.Caret} size="24" color="standard" />
        </div>
      </div>
      {body && <InputHelpText helpIcon={helpIcon}>{body}</InputHelpText>}
    </div>
  );
};

export default SelectInput;

export const SelectInputPropMeta = {
  label: { type: 'string', label: 'Label' },
  body: { type: 'string', label: 'Body' },
  helpIcon: IconPropMeta.icon,
  placeholder: { type: 'string', label: 'Placeholder' },
};

