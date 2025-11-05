import React from 'react';
import styles from './index.module.sass';
import Toggle from 'src/components/Toggle';

interface BooleanInputProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

const BooleanInput: React.FC<BooleanInputProps> = ({ 
  label, 
  value, 
  onChange
}) => {
  return (
    <div className={styles.Input} onClick={() => onChange(!value)} style={{cursor: 'pointer'}}>
      <label>{label}</label>
      <div className={styles.Toggle}>
        <Toggle checked={!!value} />
      </div>
    </div>
  );
};

export default BooleanInput; 