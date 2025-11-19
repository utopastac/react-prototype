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
  orientation?: 'left' | 'right';
  checked?: boolean;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

const InputCard = ({ title, body, right, orientation = 'right', checked, onClick }: InputCardProps) => {
  const [checkedValue, setCheckedValue] = useState(checked ?? false);

  useEffect(() => {
    if (checked !== undefined) {
      setCheckedValue(checked);
    }
  }, [checked]);

  const controlElement = () => {
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

  const isLeftOriented = orientation === 'left';

  return (
    <div 
      className={`${styles.Main} ${checkedValue ? styles.checked : ''}`} 
      onClick={onClick ?? (() => { setCheckedValue(!checkedValue); })}
    >
      <div className={`${styles.card} ${isLeftOriented ? styles.leftOriented : ''}`}>
        {isLeftOriented && controlElement()}
        <div className={styles.textContent}>
          <h5>{title}</h5>
          {body && <p>{body}</p>}
        </div>
        {!isLeftOriented && controlElement()}
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
  orientation: { type: 'select', label: 'Orientation', options: ['left', 'right'] },
  checked: { type: 'boolean', label: 'Checked' },
};
