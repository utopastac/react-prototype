import React from "react";
import styles from "./index.module.sass";
import * as Icons from "src/data/AllIcons"
import Icon, { IconPropMeta } from "src/components/Icon";
import InputLabel from "src/components/InputLabel";
import InputHelpText from "src/components/InputHelpText";

export interface GlobalSearchInputProps {
  placeholder: string;
  label?: string;
  body?: string;
  helpIcon?: string;
}

const GlobalSearchInput: React.FC<GlobalSearchInputProps> = ({ placeholder, label, body, helpIcon }) => {
  return (
    <div className={styles.Main}>
      {label && <InputLabel>{label}</InputLabel>}
      <div className={styles.inputWrapper}>
        <div className={styles.icon}>
          <Icon icon={Icons.System.SearchSmall} size="16" color="standard" />
        </div>
        <input placeholder={placeholder}></input>
      </div>
      {body && <InputHelpText helpIcon={helpIcon}>{body}</InputHelpText>}
    </div>
  );
};

export default GlobalSearchInput;

export const GlobalSearchInputPropMeta = {
  placeholder: { type: 'string', label: 'Placeholder' },
  label: { type: 'string', label: 'Label' },
  body: { type: 'string', label: 'Body' },
  helpIcon: IconPropMeta.icon,
};

