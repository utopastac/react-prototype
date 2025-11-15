import React from 'react';
import ToolbarButton from 'src/admin/components/ToolbarButton';
import * as Icons from 'src/data/Icons';
import styles from './index.module.sass';

export interface HeaderProps {
  title: string;
  onClose?: () => void;
  actions?: React.ReactNode;
  size?: 'default' | 'small' | 'large' | 'section';
}

const Header: React.FC<HeaderProps> = ({ title, onClose, actions, size = 'default' }) => {
  return (
    <header className={`${styles.Header} ${size === 'small' ? styles.small : ''} ${size === 'large' ? styles.large : ''} ${size === 'section' ? styles.section : ''}`}>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.actions}>
          {actions}
          {onClose && (
            <ToolbarButton
              onClick={onClose}
              icon={Icons.Close16}
              title="Close"
              position="bottom"
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

