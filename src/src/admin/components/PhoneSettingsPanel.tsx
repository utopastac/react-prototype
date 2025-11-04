import React from 'react';
import { motion } from 'framer-motion';
import ToolsSection from './ToolsSection';
import ToolbarButton from 'src/admin/components/ToolbarButton';
import BooleanInput from '../LabeledInput/BooleanInput';
import TextButton from './TextButton';
import Signature from './Signature';
import SelectInput from '../LabeledInput/SelectInput';
import * as Icons from 'src/data/Icons';
import { IconSize } from 'src/components/Icon';
import styles from '../index.module.sass';
import { useActiveLayout } from '../AdminLayoutContext';
import { AdminTemplates, AdminTemplate } from '../Templates';
import LabeledInput from '../LabeledInput';
import { usePanelResize } from '../hooks/usePanelResize';

interface PhoneSettingsPanelProps {
  showAdminPanel: boolean;
  isPropEditorVisible: boolean;
  rightPanelWidth: number;
  setRightPanelWidth: (w: number) => void;
  showTopBar: boolean;
  showBottomButtons: boolean;
  showToast: boolean;
  onShowTopBarChange: () => void;
  onShowBottomButtonsChange: () => void;
  onShowToastChange: () => void;
  onClearLayout: () => void;
  onDeselectPhone: () => void;
  selectedTemplate: AdminTemplate | null;
  onApplyTemplate: (template: AdminTemplate) => void;
  showStatusBar: boolean;
  onShowStatusBarChange: () => void;
  phoneName: string;
}

const PhoneSettingsPanel: React.FC<PhoneSettingsPanelProps> = ({
  showAdminPanel,
  isPropEditorVisible,
  rightPanelWidth,
  setRightPanelWidth,
  showTopBar,
  showBottomButtons,
  showToast,
  onShowTopBarChange,
  onShowBottomButtonsChange,
  onShowToastChange,
  onClearLayout,
  onDeselectPhone,
  selectedTemplate,
  onApplyTemplate,
  showStatusBar,
  onShowStatusBarChange,
  phoneName
}) => {
  const { layout, updateLayout } = useActiveLayout();

  // --- Resizing logic ---
  const [width, resizeHandle, isResizing, , isHoveringEdge] = usePanelResize({
    initialWidth: 280,
    minWidth: 220,
    maxWidth: 480,
    edge: 'left',
    width: rightPanelWidth,
    setWidth: setRightPanelWidth,
  });
  // --- End resizing logic ---

  return (
    <motion.div
      className={`${styles.AdminPanel} ${styles.rightSide} ${styles.phoneSettings}${isHoveringEdge || isResizing ? ' ' + styles.resizing : ''}`}
      style={{ width: width, borderLeftColor: (isHoveringEdge || isResizing) ? '#00C244' : undefined }}
      initial={{ x: '100%' }}
      animate={{ 
        x: 0,
        scale: 1,
        borderRadius: 0,
        boxShadow: '-8px 0 24px -8px rgba(0,0,0,0.12)'
      }}
      exit={{ x: '100%' }}
      //transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      transition={{ duration: 0 }}
    >
      {/* Draggable left edge */}
      {resizeHandle}
      <div style={{ height: '100%', position: 'relative' }}>
        <div 
          className={styles.Tools}
          style={{ 
            opacity: isPropEditorVisible ? 0.3 : 1,
            backgroundColor: 'white',
            filter: isPropEditorVisible ? 'grayscale(0.3)' : 'none'
          }}
        >
          <header className={styles.PanelHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ margin: 0 }}>{phoneName}</h2>
              <ToolbarButton
                onClick={onDeselectPhone}
                icon={Icons.Failed16}
                title="Close"
                position="bottom"
              />
            </div>
          </header>
          <div className={styles.Controls}>
            <ToolsSection>
              <LabeledInput
                config={{ type: 'textarea', label: 'Description' }}
                value={layout?.description || ''}
                onChange={val => updateLayout({ description: val })}
              />
            </ToolsSection>
            <ToolsSection>
              <SelectInput
                value={selectedTemplate?.name || ''}
                options={[
                  { value: '', label: 'Choose a template' },
                  ...AdminTemplates.map(t => ({ value: t.name, label: t.name }))
                ]}
                onChange={val => {
                  const t = AdminTemplates.find(t => t.name === val);
                  if (t) onApplyTemplate(t);
                }}
              />
            </ToolsSection>
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
              <BooleanInput 
                label="Show Status Bar" 
                value={showStatusBar} 
                onChange={onShowStatusBarChange} 
              />
            </ToolsSection>
            <ToolsSection>
              <TextButton 
                onClick={onClearLayout} 
                variant="secondary" 
                text="Clear Layout" 
              />
            </ToolsSection>
          </div>
          <Signature
            contact="Contact @pwright"
            buttonTitle="App preview"
            buttonIcon={Icons.DeviceMobile24}
            buttonIconSize={"24" as IconSize}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default PhoneSettingsPanel;
