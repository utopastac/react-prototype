import React from 'react';
import styles from 'src/admin/components/LabeledInput/index.module.sass';
import { formatSelectOptionLabel } from 'src/helpers/Utils';

interface SelectInputOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  label?: string;
  value: string;
  options: (string | SelectInputOption)[];
  onChange: (value: string) => void;
  inputStyle?: React.CSSProperties;
}

const SelectInput: React.FC<SelectInputProps> = ({ 
  label, 
  value, 
  options, 
  onChange, 
  inputStyle 
}) => {
  // Normalize options to { value, label }
  const normalizedOptions: SelectInputOption[] = options
    .filter(Boolean)
    .map(opt => {
      if (typeof opt === 'string') {
        const formattedLabel = formatSelectOptionLabel(opt);
        return { 
          value: opt, 
          label: formattedLabel 
        };
      } else {
        // Always format the label, even if provided
        const formattedLabel = formatSelectOptionLabel(opt.label ?? opt.value);
        return { 
          ...opt, 
          label: formattedLabel 
        };
      }
    });
  const displayValue = value === undefined ? '' : value;

  return (
    <div className={styles.Input}>
      {label && <label><span>{label}</span></label>}
      <select
        value={displayValue}
        onChange={e => onChange(e.target.value)}
        style={inputStyle}
      >
        {normalizedOptions.map(opt => (
          <option key={opt.value} value={opt.value} disabled={opt.value === ''} hidden={opt.value === ''}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput; 