import React from 'react';
import styles from 'src/admin/components/LabeledInput/index.module.sass';

interface TextAreaInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputStyle?: React.CSSProperties;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  inputStyle
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.select();
  };

  return (
    <div className={`${styles.TextAreaInput} ${styles.Input}`} style={inputStyle}>
      { label && <label>{label}</label> }
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={handleFocus}
      />
    </div>
  );
};

export default TextAreaInput; 