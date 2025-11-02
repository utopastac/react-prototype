import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import ToolsSection from './ToolsSection';
import ToolbarButton from 'src/admin/components/ToolbarButton';
import ThemeSection from '../DevTools/ThemeSection';
import TextButton from './TextButton';
import Signature from './Signature';
import * as Icons from 'src/data/Icons';
import { ICON_24 } from 'src/components/Icon';
import styles from '../index.module.sass';
import SliderInput from '../LabeledInput/SliderInput';
import { useAdminTheme, useAdminThemeDispatch } from '../AdminThemeContext';
import { lerpColor, hexToRgb } from 'src/helpers/Utils';
import { usePanelResize } from '../hooks/usePanelResize';

interface GlobalSettingsPanelProps {
  showAdminPanel: boolean;
  isPropEditorVisible: boolean;
  rightPanelWidth: number;
  setRightPanelWidth: (w: number) => void;
  onShowJsonPanel: () => void;
  showJsonPanel: boolean;
  onResetWelcomeModal?: () => void;
  onOpenClearAllLayoutsModal?: () => void;
  isPhoneSettingsVisible: boolean;
  onClosePhoneSettings: () => void;
}

const GlobalSettingsPanel: React.FC<GlobalSettingsPanelProps> = ({
  showAdminPanel,
  isPropEditorVisible,
  rightPanelWidth,
  setRightPanelWidth,
  onShowJsonPanel,
  showJsonPanel,
  onResetWelcomeModal,
  onOpenClearAllLayoutsModal,
  isPhoneSettingsVisible,
  onClosePhoneSettings
}) => {
  const adminTheme = useAdminTheme();
  const setAdminTheme = useAdminThemeDispatch();

  // Map context value to slider (0-1) and vice versa
  const bgMin = '#1A1A1A';
  const bgMax = '#F4F4F4';
  const bgMinRgb = hexToRgb(bgMin);
  const bgMaxRgb = hexToRgb(bgMax);
  function backgroundToSlider(val: string) {
    // crude: 0 if min, 1 if max, else guess
    if (val.toLowerCase() === bgMin.toLowerCase() || val.toLowerCase() === bgMinRgb.toLowerCase()) return 0;
    if (val.toLowerCase() === bgMax.toLowerCase() || val.toLowerCase() === bgMaxRgb.toLowerCase()) return 1;
    return 0.5; // fallback
  }
  function sliderToBackground(t: number) {
    return lerpColor(bgMinRgb, bgMaxRgb, t);
  }

  const shadowMin = 'none';
  const shadowMax = '0 40px 56px rgba(0,0,0,0.32)';
  function shadowToSlider(val: string) {
    if (val === shadowMin) return 0;
    if (val === shadowMax) return 1;
    return 0.5;
  }
  function sliderToShadow(t: number) {
    if (t <= 0.01) return shadowMin;
    if (t >= 0.99) return shadowMax;
    // interpolate blur and alpha
    const blur = 8 + (56 - 8) * t;
    const alpha = 0.12 + (0.32 - 0.12) * t;
    const yOffset = 40 * t
    return `0 ${yOffset}px ${blur.toFixed(0)}px rgba(0,0,0,${alpha.toFixed(2)})`;
  }

  const spacingMin = '40px';
  const spacingMax = '560px';
  function spacingToSlider(val: string): number {
    const min = parseInt(spacingMin, 10);
    const max = parseInt(spacingMax, 10);
    const v = parseInt(val, 10);
    if (isNaN(v)) return 0.5; // fallback
    return (v - min) / (max - min);
  }

  function sliderToSpacing(t: number): string {
    const min = parseInt(spacingMin, 10);
    const max = parseInt(spacingMax, 10);
    const px = Math.round(min + (max - min) * t);
    return `${px}px`;
  }

  const handleBackgroundChange = useCallback((t: number) => {
    setAdminTheme({ type: 'Update', payload: { backgroundColor: sliderToBackground(t) } });
  }, [setAdminTheme]);
  const handleShadowChange = useCallback((t: number) => {
    setAdminTheme({ type: 'Update', payload: { phoneShadow: sliderToShadow(t) } });
  }, [setAdminTheme]);
  const handleSpacingChange = useCallback((t: number) => {
    setAdminTheme({ type: 'Update', payload: { layoutSpacing: sliderToSpacing(t) } });
  }, [setAdminTheme]);

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
      className={`${styles.AdminPanel} ${styles.rightSide} ${styles.globalSettings}${isHoveringEdge || isResizing ? ' ' + styles.resizing : ''}`}
      style={{ width: width, borderLeftColor: (isHoveringEdge || isResizing) ? '#00C244' : undefined }}
      initial={{ x: '100%' }}
      animate={{ 
        x: isPropEditorVisible ? -64 : (isPhoneSettingsVisible ? -32 : 0),
        scale: isPropEditorVisible ? 0.9 : (isPhoneSettingsVisible ? 0.97 : 1),
        borderRadius: isPhoneSettingsVisible ? 12 : 0,
        boxShadow: isPhoneSettingsVisible ? '-8px 0 24px -8px rgba(0,0,0,0.12)' : 'none'
      }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      onClick={isPhoneSettingsVisible ? onClosePhoneSettings : undefined}
    >
      {/* Draggable left edge */}
      {resizeHandle}
      <div style={{ height: '100%', position: 'relative' }}>
        <div 
          className={styles.Tools}
          style={{ 
            opacity: isPropEditorVisible ? 0.3 : (isPhoneSettingsVisible ? 0.5 : 1),
            backgroundColor: 'white',
            filter: isPropEditorVisible ? 'grayscale(0.5)' : (isPhoneSettingsVisible ? 'grayscale(0.3)' : 'none')
          }}
        >
          <header className={styles.PanelHeader}>
            <h2>Global Settings</h2>
            <ToolbarButton 
              onClick={onShowJsonPanel} 
              icon={Icons.CategoryTechnology32} 
              title={`${!showJsonPanel ? "Show" : "Hide"} Multi-Layout JSON`} 
              position="left" 
            />
          </header>
          <div className={styles.Controls}>
            <ToolsSection>
              <ThemeSection />
            </ToolsSection>
            <ToolsSection>
              <SliderInput
                label="Background"
                value={backgroundToSlider(adminTheme.backgroundColor)}
                onChange={handleBackgroundChange}
              />
              <SliderInput
                label="Shadows"
                value={shadowToSlider(adminTheme.phoneShadow)}
                onChange={handleShadowChange}
              />
              <SliderInput
                label="Spacing"
                value={spacingToSlider(adminTheme.layoutSpacing)}
                onChange={handleSpacingChange}
              />
            </ToolsSection>
            <ToolsSection>
              <TextButton
                onClick={onOpenClearAllLayoutsModal}
                variant="secondary"
                text="Clear All Layouts"
              />
              <TextButton 
                onClick={onResetWelcomeModal} 
                variant="tertiary" 
                text="Reset Welcome Modal" 
              />
            </ToolsSection>
          </div>
          <Signature
            contact="Contact @peterwright"
            buttonTitle="App preview"
            buttonIcon={Icons.DeviceMobile24}
            buttonIconSize={ICON_24}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default GlobalSettingsPanel;
