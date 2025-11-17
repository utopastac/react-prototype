import React from 'react';
import ToolbarButton from 'src/admin/components/ToolbarButton';
import EditableLabel from 'src/admin/components/EditableLabel';
import * as Icons from 'src/data/Icons';
import styles from './index.module.sass';

export interface HeaderProps {
  title: string;
  onClose?: () => void;
  actions?: React.ReactNode;
  size?: 'default' | 'small' | 'large' | 'section';
  showBorder?: boolean;
  onRenameFinish?: (newName: string) => void;
  onRenameCancel?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  onClose, 
  actions, 
  size = 'default', 
  showBorder = false,
  onRenameFinish,
  onRenameCancel
}) => {
  const isEditable = onRenameFinish !== undefined;
  
  return (
    <header className={`${styles.Header} ${size === 'small' ? styles.small : ''} ${size === 'large' ? styles.large : ''} ${size === 'section' ? styles.section : ''} ${showBorder ? styles.withBorder : ''}`}>
      <div className={styles.content}>
        <h2 className={styles.title}>
          {isEditable ? (
            <EditableLabel
              label={title}
              onRenameFinish={onRenameFinish}
              onRenameCancel={onRenameCancel || (() => {})}
              size="header"
            />
          ) : (
            title
          )}
        </h2>
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

