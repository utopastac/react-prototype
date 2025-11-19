import React from "react";
import styles from "./index.module.sass";

export interface TagProps {
  children: React.ReactNode;
  size?: 'small' | 'large';
  type?: 'default' | 'negative' | 'positive' | 'caution' | 'neutral';
  className?: string;
}

const Tag: React.FC<TagProps> = ({ 
  children, 
  size = 'small',
  type = 'default',
  className 
}) => {
  const sizeClass = size === 'small' ? styles.small : styles.large;
  const typeClass = styles[type];

  return (
    <span 
      className={[
        styles.Main,
        sizeClass,
        typeClass,
        className
      ].filter(Boolean).join(' ')}
    >
      {children}
    </span>
  );
};

export default Tag;

export const TagPropMeta = {
  children: { type: 'string', label: 'Label' },
  size: {
    type: 'select',
    label: 'Size',
    options: ['small', 'large']
  },
  type: {
    type: 'select',
    label: 'Type',
    options: ['default', 'negative', 'positive', 'caution', 'neutral']
  },
  className: { type: 'string', label: 'CSS Class' }
};

