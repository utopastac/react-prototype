import React from 'react';
import styles from './AdminPanelToggle.module.sass';
import ToolbarButton from '../../components/ToolbarButton';
import { ICON_24 } from 'src/components/Icon';
import * as Icons from 'src/data/Icons';

interface AdminPanelToggleProps {
  onShow: () => void;
}

const AdminPanelToggle: React.FC<AdminPanelToggleProps> = ({ onShow }) => {
  return (
    <div className={styles.AdminToggle}>
      <ToolbarButton
        onClick={onShow}
        title="Show admin panel"
        icon={Icons.Wallet24}
        iconSize={ICON_24}
      />
    </div>
  );
};

export default AdminPanelToggle;

