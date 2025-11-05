import React from "react";
import styles from "./index.module.sass";
import Icon, { IconPropMeta } from "src/components/Icon";

export interface InputProps {
  label?: string;
  body?: string;
  helpIcon?: string;
  trailingIcon?: string;
  placeholder: string;
}

const Input: React.FC<InputProps> = ({ label, body, helpIcon, trailingIcon, placeholder }) => {
  return (
    <div className={styles.Main}>
      { label && <label>{label}</label> }
      <div className={styles.inputWrapper}>
        <input placeholder={placeholder} />
        { trailingIcon && (
          <div className={styles.trailingIcon}>
            <Icon icon={trailingIcon} size="24" color="standard" />
          </div>
         )}
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

interface InputStackedHorizontalProps {
  label1?: string;
  body1?: string;
  placeholder1: string;
  label2?: string;
  body2?: string;
  placeholder2: string;
}

const InputStackedHorizontal: React.FC<InputStackedHorizontalProps> = ({
  label1, body1, placeholder1,
  label2, body2, placeholder2
}) => {
  return (
    <div className={styles.Wrapper}>
      <Input label={label1} body={body1} placeholder={placeholder1} />
      <Input label={label2} body={body2} placeholder={placeholder2} />
    </div>
  );
};

export default Input;
export { InputStackedHorizontal };

export const InputPropMeta = {
  label: { type: 'string', label: 'Label' },
  body: { type: 'string', label: 'Body' },
  helpIcon: IconPropMeta.icon,
  placeholder: { type: 'string', label: 'Placeholder' },
  trailingIcon: { ...IconPropMeta.icon, label: 'Trailing Icon' },
};

export const InputStackedHorizontalPropMeta = {
  label1: { type: 'string', label: 'Label 1' },
  body1: { type: 'string', label: 'Body 1' },
  placeholder1: { type: 'string', label: 'Placeholder 1' },
  label2: { type: 'string', label: 'Label 2' },
  body2: { type: 'string', label: 'Body 2' },
  placeholder2: { type: 'string', label: 'Placeholder 2' },
};
