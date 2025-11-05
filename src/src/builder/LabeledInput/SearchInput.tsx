import React, { useRef } from 'react';
import styles from './index.module.sass';
import ToolbarButton from '../components/ToolbarButton';
import * as Icons from 'src/data/Icons';
import Icon from 'src/components/Icon';


interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  inputStyle?: React.CSSProperties;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  placeholder = 'Search...', 
  value, 
  onChange, 
  onClear,
  inputStyle,
  onFocus,
  onBlur
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange('');
    onClear?.();
    inputRef.current?.blur();
  };

  return (
    <div className={`${styles.SearchInput} ${styles.Input}`} style={{ position: 'relative' }}>
      <span className={styles.SearchIcon}>
        <Icon icon={Icons.Search16} size="16" color="subtle" />
      </span>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ 
          paddingRight: value ? 28 : undefined,
          ...inputStyle 
        }}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {value && (
        <ToolbarButton
          aria-label="Clear search"
          title="Clear search"
          onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            handleClear();
          }}
          icon={Icons.Failed16}
          iconSize={"16"}
          className={styles.ClearButton}
          position="left"
        />
      )}
    </div>
  );
};

export default SearchInput; 