import React from "react";
import styles from "./index.module.sass";
import * as Icons from "src/data/AllIcons"
import Icon, { IconPropMeta } from "src/components/Icon";

export interface SearchInputProps {
  placeholder: string;
  label?: string;
  body?: string;
  helpIcon?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ placeholder, label, body, helpIcon }) => {
  return (
    <div className={styles.Main}>
      { label && <label>{label}</label> }
      <div className={styles.inputWrapper}>
        <div className={styles.icon}>
          <Icon icon={Icons.System.SearchSmall} size="16" color="standard" />
        </div>
        <input placeholder={placeholder}></input>
      </div>
      { body && (
        <div className={styles.helpText}>
          { helpIcon && <Icon icon={helpIcon} size="16" color="standard" /> }
          <p>{body}</p>
        </div>
      )}
    </div>
  );
};

export default SearchInput;

export const SearchInputPropMeta = {
  placeholder: { type: 'string', label: 'Placeholder' },
  label: { type: 'string', label: 'Label' },
  body: { type: 'string', label: 'Body' },
  helpIcon: IconPropMeta.icon,
};

