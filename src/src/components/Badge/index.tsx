import React from "react";
import styles from "./index.module.sass";

export interface BadgeProps {
  children?: React.ReactNode;
  type?: 'dot' | 'text';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  type,
  className 
}) => {
  // Auto-detect type based on whether children is provided
  const badgeType = type || (children ? 'text' : 'dot');

  const typeClass = badgeType === 'dot' ? styles.dot : styles.text;

  return (
    <span 
      className={[
        styles.Main,
        typeClass,
        className
      ].filter(Boolean).join(' ')}
    >
      {badgeType === 'text' && children}
    </span>
  );
};

export default Badge;

export const BadgePropMeta = {
  children: { type: 'string', label: 'Text' },
  type: {
    type: 'select',
    label: 'Type',
    options: ['dot', 'text']
  },
  className: { type: 'string', label: 'CSS Class' }
};

