import React from 'react';
import styles from 'src/admin/components/LabeledInput/index.module.sass';

interface StringInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  inputStyle?: React.CSSProperties;
}

const StringInput: React.FC<StringInputProps> = ({ 
  label, 
  value, 
  onChange, 
  inputStyle 
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className={styles.Input}>
      <label>{label}</label>
      <input
        ref={inputRef}
        type="text"
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        style={inputStyle}
        onFocus={handleFocus}
      />
    </div>
  );
};

export default StringInput; 