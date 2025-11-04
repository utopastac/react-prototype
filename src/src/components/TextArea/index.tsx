import React, { useState } from "react";
import styles from "./index.module.sass";
import Icon, { IconPropMeta, IconSize, IconColor } from "../Icon";

export interface TextAreaProps {
  label: string;
  placeholder: string;
  body?: string;
  helpIcon?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ label, placeholder, body, helpIcon }) => {
  const [inputText, setInputText] = useState('');

  return (
    <div className={styles.Main}>
      <label>{label}</label>
      <textarea
        placeholder={placeholder}
        value={inputText}
        onChange={e => setInputText(e.target.value)}
      />
      { body && (
        <div className={styles.helpText}>
          { helpIcon && <Icon icon={helpIcon} size="16" color="standard" /> }
          <p>{body}</p>
        </div>
      )}
    </div>
  );
};

export default TextArea;

export const TextAreaPropMeta = {
  label: { type: 'string', label: 'Label' },
  placeholder: { type: 'string', label: 'Placeholder' },
  body: { type: 'string', label: 'Body' },
  helpIcon: IconPropMeta.icon,
};
