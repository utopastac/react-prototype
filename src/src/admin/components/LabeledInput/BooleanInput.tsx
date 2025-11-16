import React from 'react';
import styles from 'src/admin/components/LabeledInput/index.module.sass';
import AdminToggle from 'src/admin/components/AdminToggle';

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
    <div className={`${styles.Input} ${styles.BooleanInput}`} onClick={() => onChange(!value)} style={{cursor: 'pointer'}}>
      <label>{label}</label>
      <div className={styles.Toggle}>
        <AdminToggle checked={!!value} />
      </div>
    </div>
  );
};

export default BooleanInput; 