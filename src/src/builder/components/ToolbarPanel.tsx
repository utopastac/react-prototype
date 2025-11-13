import React from 'react';
import { motion } from 'framer-motion';
import ToolbarButton from './ToolbarButton';
import * as Icons from 'src/data/Icons';
import styles from '../index.module.sass';
import layoutsStyles from '../layouts.module.sass';

interface ToolbarPanelProps {
  onHideAdminPanel: () => void;
  onShowKeyboardShortcuts: React.MouseEventHandler<HTMLButtonElement>;
  onOpenSave: React.MouseEventHandler<HTMLButtonElement>;
  onOpenLoad: React.MouseEventHandler<HTMLButtonElement>;
  onShare: React.MouseEventHandler<HTMLButtonElement>;
  onOpenTemplates: React.MouseEventHandler<HTMLButtonElement>;
  onShowJsonPanel: () => void;
  showJsonPanel: boolean;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onFitToScreen: () => void;
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
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onFitToScreen
}) => {
  return (
    <motion.div
      className={`${styles.AdminPanel} ${styles.toolbarPanel}`}
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
    >
      <div className={styles.ToolBarVertical}>
        <div className={styles.ToolBarTopSection}>
          <ToolbarButton
            onClick={onHideAdminPanel}
            title="Toggle admin panel (⌘.)"
            icon={Icons.Panel16}
            iconSize={"24"}
            position="left"
          />
          <ToolbarButton 
            onClick={onShowKeyboardShortcuts} 
            title="Keyboard shortcuts (⌘k)" 
            icon={Icons.Keyboard16} 
            position="left"
          />
          <ToolbarButton 
            onClick={onOpenTemplates} 
            title="Flow library (⌘/)" 
            icon={Icons.Library16} 
            position="left"
          />
          <ToolbarButton 
            onClick={onOpenSave} 
            title="Save (⌘s)" 
            icon={Icons.Download16} 
            position="left"
          />
          <ToolbarButton 
            onClick={onOpenLoad} 
            title="Load (⌘l)" 
            icon={Icons.Load16} 
            position="left"
          />
          <ToolbarButton 
            onClick={onShare} 
            title="Share (⌘p)" 
            icon={Icons.Link16 } 
            position="left"
          />
          <ToolbarButton 
            onClick={onShowJsonPanel} 
            title={`${!showJsonPanel ? "Show" : "Hide"} JSON`} 
            icon={Icons.Code16} 
            position="left"
          />
        </div>
        {/* Zoom Controls */}
        <div className={styles.ToolBarZoomSection}>
          <ToolbarButton
            title="Zoom In (⌘ =)"
            onClick={onZoomIn}
            disabled={zoomLevel >= 3}
            icon={Icons.Add16}
            iconColor={"admin"}
            position="left"
          />
          <ToolbarButton
            title="Zoom Out (⌘ -)"
            onClick={onZoomOut}
            disabled={zoomLevel <= 0.1}
            icon={Icons.Subtract16}
            iconColor={"admin"}
            position="left"
          />
          <ToolbarButton
            title="Reset Zoom (⌘ 0)"
            onClick={onZoomReset}
            icon={Icons.Zoom16}
            iconColor={"admin"}
            position="left"
          />
          <ToolbarButton
            title="Fit to Screen"
            onClick={onFitToScreen}
            icon={Icons.Fit16}
            iconColor={"admin"}
            position="left"
          />
          <div className={layoutsStyles.ZoomLevel}>
            {Math.round(zoomLevel * 100)}%
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ToolbarPanel;

