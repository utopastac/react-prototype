import React, { useState, useEffect, MouseEvent } from "react";
import styles from "./index.module.sass";
import Radio from "src/components/Radio";
import Checkbox from "src/components/Checkbox";
//
export interface InputCardProps {
  title: string;
  body?: string;
  left?: Record<string, unknown>;
  right?: {
    type: 'radio' | 'checkbox';
  };
  checked?: boolean;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

const InputCard = ({ title, body, right, checked, onClick }: InputCardProps) => {
  const [checkedValue, setCheckedValue] = useState(checked ?? false);

  useEffect(() => {
    if (checked !== undefined) {
      setCheckedValue(checked);
    }
  }, [checked]);

  const rightElement = () => {
    if (!right) return null;
    switch (right.type) {
      case 'radio':
        return (
          <Radio checked={checkedValue} onClick={() => {}} />
        );
      case 'checkbox':
        return (
          <Checkbox checked={checkedValue} onClick={() => {}} />
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={`${styles.Main} ${checkedValue ? styles.checked : ''}`} 
      onClick={onClick ?? (() => { setCheckedValue(!checkedValue); })}
    >
      <div className={styles.card}>
        <div className={styles.textContent}>
          <h5>{title}</h5>
          {body && <p>{body}</p>}
        </div>
        {rightElement()}
      </div>
    </div>
  );
};

export default InputCard;

export const InputCardPropMeta = {
  title: { type: 'string', label: 'Title' },
  body: { type: 'string', label: 'Body' },
  left: { type: 'object', label: 'Left (custom object)' },
  right: {
    type: 'object',
    label: 'Right',
    fields: {
      type: { type: 'select', label: 'Right', options: ['radio', 'checkbox'] }
    }
  },
  checked: { type: 'boolean', label: 'Checked' },
};
