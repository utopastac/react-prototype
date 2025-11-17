import React from 'react';
import { motion } from 'framer-motion';
import ToolsSection from 'src/builder/components/ToolsSection';
import ToolbarButton from 'src/admin/components/ToolbarButton';
import ThemeSection from 'src/admin/components/ThemeSection';
import BooleanInput from 'src/admin/components/LabeledInput/BooleanInput';
import TextButton from 'src/admin/components/TextButton';
import Header from 'src/admin/components/Header';
import * as Icons from 'src/data/Icons';
import styles from 'src/builder/index.module.sass';

/**
 * Props interface for the SettingsPanel component
 * Controls various UI visibility and functionality settings
 */
interface SettingsPanelProps {
  /** Controls whether the admin panel is visible */
  showAdminPanel: boolean;
  /** Controls whether the property editor is visible (affects panel styling) */
  isPropEditorVisible: boolean;
  /** Width of the right panel in pixels */
  rightPanelWidth: number;
  /** Controls visibility of the top navigation bar */
  showTopBar: boolean;
  /** Controls visibility of bottom action buttons */
  showBottomButtons: boolean;
  /** Callback to toggle top bar visibility */
  onShowTopBarChange: (value: boolean) => void;
  /** Callback to toggle bottom buttons visibility */
  onShowBottomButtonsChange: (value: boolean) => void;
  /** Callback to clear/reset the current layout */
  onClearLayout: () => void;
  /** Callback to toggle JSON panel visibility */
  onShowJsonPanel: () => void;
  /** Controls visibility of the JSON panel */
  showJsonPanel: boolean;
  /** Optional callback to reset the welcome modal state */
  onResetWelcomeModal?: () => void;
  /** Controls visibility of toast notifications */
  showToast: boolean;
  /** Callback to toggle toast visibility */
  onShowToastChange: (value: boolean) => void;
}

/**
 * SettingsPanel Component
 * 
 * A collapsible admin panel that provides controls for:
 * - Theme customization
 * - UI element visibility toggles
 * - Layout management
 * - JSON panel access
 * 
 * Uses Framer Motion for smooth animations and responsive design
 */
const SettingsPanel: React.FC<SettingsPanelProps> = ({
  showAdminPanel,
  isPropEditorVisible,
  rightPanelWidth,
  showTopBar,
  showBottomButtons,
  onShowTopBarChange,
  onShowBottomButtonsChange,
  onClearLayout,
  onShowJsonPanel,
  showJsonPanel,
  onResetWelcomeModal,
  showToast,
  onShowToastChange
}) => {
  return (
    <motion.div
      className={`${styles.AdminPanel} ${styles.rightSide}`}
      // Animation configuration for panel entrance/exit
      initial={{ width: 0, opacity: 0, x: 0 }}
      animate={{
        width: rightPanelWidth,
        // Reduce opacity when prop editor is visible
        opacity: isPropEditorVisible ? 0.7 : 1,
        x: isPropEditorVisible ? -48 : 0,
        scale: isPropEditorVisible ? 0.97 : 1,
        borderRadius: isPropEditorVisible ? 12 : 0,
        boxShadow: isPropEditorVisible ? '-8px 0 24px -8px rgba(0,0,0,0.12)' : 'none'
      }}
      exit={{ width: 0, opacity: 0, x: 0 }}
      // Spring animation for smooth, natural movement
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      key="admin-panel"
    >
      <div className={styles.Tools}>
        {/* Panel header with title and JSON toggle button */}
        <Header 
          title="Settings" 
          actions={
            <ToolbarButton 
              onClick={onShowJsonPanel} 
              icon={Icons.CategoryTechnology32} 
              title={`${!showJsonPanel ? "Show" : "Hide"} layout JSON`} 
              position="left" 
            />
          }
        />
        
        <div className={styles.Controls}>
          {/* Theme customization section */}
          <ToolsSection>
            <ThemeSection />
          </ToolsSection>
          
          {/* UI visibility controls section */}
          <ToolsSection>
            <BooleanInput 
              label="Show Top Bar" 
              value={showTopBar} 
              onChange={onShowTopBarChange} 
            />
            <BooleanInput 
              label="Show Bottom Buttons" 
              value={showBottomButtons} 
              onChange={onShowBottomButtonsChange} 
            />
            <BooleanInput 
              label="Show Toast" 
              value={showToast} 
              onChange={onShowToastChange} 
            />
          </ToolsSection>
          
          {/* Layout management section */}
          <ToolsSection>
            <TextButton 
              onClick={onClearLayout} 
              variant="secondary" 
              text="Clear Layout" 
            />
            {/* Conditionally render welcome modal reset button */}
            {onResetWelcomeModal && (
              <TextButton 
                onClick={onResetWelcomeModal} 
                variant="tertiary" 
                text="Reset Welcome Modal" 
              />
            )}
          </ToolsSection>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPanel; 