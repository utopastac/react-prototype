import React from 'react';
import styles from './index.module.sass';

interface ToolsSectionProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const ToolsSection: React.FC<ToolsSectionProps> = ({ children, onClick, className = '' }) => (
  <div className={`${styles.ToolsSection} ${className}`} onClick={onClick}>
    {children}
  </div>
);

export default ToolsSection; 