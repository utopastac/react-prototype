import React from 'react';
import { motion } from 'framer-motion';
import ToolbarButton from './ToolbarButton';
import * as Icons from 'src/data/Icons';
import styles from '../index.module.sass';

interface ToolbarPanelProps {
  onHideAdminPanel: () => void;
  onShowKeyboardShortcuts: () => void;
  onOpenSave: () => void;
  onOpenLoad: () => void;
  onShare: () => void;
  onOpenTemplates: () => void;
  onShowJsonPanel: () => void;
  showJsonPanel: boolean;
  showAdminPanel: boolean;
}

const ToolbarPanel: React.FC<ToolbarPanelProps> = ({
  onHideAdminPanel,
  onShowKeyboardShortcuts,
  onOpenSave,
  onOpenLoad,
  onShare,
  onOpenTemplates,
  onShowJsonPanel,
  showJsonPanel,
  showAdminPanel
}) => {
  if (!showAdminPanel) return null;

  return (
    <motion.div
      className={`${styles.AdminPanel} ${styles.toolbarPanel}`}
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 48, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
    >
      <div className={styles.ToolBarVertical}>
        <ToolbarButton
          onClick={onHideAdminPanel}
          title="Hide admin panel (⌘.)"
          icon={Icons.InterventionsHubCustomer16}
          iconSize={"24"}
        />
        <ToolbarButton 
          onClick={onShowKeyboardShortcuts} 
          title="Keyboard shortcuts (⌘k)" 
          icon={Icons.Keyboard24} 
        />
        <ToolbarButton 
          onClick={onOpenTemplates} 
          title="Flow library (⌘/)" 
          icon={Icons.DocumentW224} 
        />
        <ToolbarButton 
          onClick={onOpenSave} 
          title="Save (⌘s)" 
          icon={Icons.Download16} 
        />
        <ToolbarButton 
          onClick={onOpenLoad} 
          title="Load (⌘l)" 
          icon={Icons.Load24} 
        />
        <ToolbarButton 
          onClick={onShare} 
          title="Share (⌘p)" 
          icon={Icons.Hyperlink24 || Icons.Download16} 
        />
        <ToolbarButton 
          onClick={onShowJsonPanel} 
          title={`${!showJsonPanel ? "Show" : "Hide"} Multi-Layout JSON`} 
          icon={Icons.CategoryTechnology32} 
        />
      </div>
    </motion.div>
  );
};

export default ToolbarPanel;

