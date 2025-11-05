import React from 'react';
import styles from './index.module.sass';

interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
}

const TextButton: React.FC<TextButtonProps> = ({ text, variant = 'primary', className = '', ...props }) => {
  const btnClass = [
    styles.Main,
    variant === 'secondary' ? styles.secondary : 
    variant === 'tertiary' ? styles.tertiary : 
    styles.primary,
    className
  ].filter(Boolean).join(' ');
  return (
    <button className={btnClass} {...props}>
      {text}
    </button>
  );
};

export default TextButton; 