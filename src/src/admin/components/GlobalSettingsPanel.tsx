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
import {
  backgroundToSlider,
  sliderToBackground,
  shadowToSlider,
  sliderToShadow,
  spacingToSlider,
  sliderToSpacing,
  outlineToSlider,
  sliderToOutline,
} from '../utils/themeSliders';
import { usePanelResize } from '../hooks/usePanelResize';
import { useActiveLayout } from '../AdminLayoutContext';
import { AdminTemplates, AdminTemplate } from '../Templates';
import LabeledInput from '../LabeledInput';
import BooleanInput from '../LabeledInput/BooleanInput';
import SelectInput from '../LabeledInput/SelectInput';
import GenericPropEditor from '../GenericPropEditor';
import { ComponentPropMeta } from 'src/data/Components';
import { TopBarPropMeta } from 'src/components/TopBar';
import { ButtonGroupPropMeta } from 'src/components/ButtonGroup';
import { ToastPropMeta } from 'src/components/Toast';
import { IOSStatusBarPropMeta } from 'src/components/IOSStatusBar';

interface GlobalSettingsPanelProps {
  isPropEditorVisible: boolean;
  rightPanelWidth: number;
  setRightPanelWidth: (w: number) => void;
  onShowJsonPanel: () => void;
  showJsonPanel: boolean;
  onResetWelcomeModal?: () => void;
  onOpenClearAllLayoutsModal?: () => void;
  isPhoneSettingsVisible: boolean;
  onClosePhoneSettings: () => void;
  // Prop editor props
  selected: { phoneIndex: number; componentIndex: number } | null;
  selectedSpecial: { phoneIndex: number; type: 'topbar' | 'bottombuttons' | 'toast' | 'statusbar' } | null;
  layoutState: any;
  dispatch: any;
  onSetSelected: (selected: { phoneIndex: number; componentIndex: number } | null) => void;
  onSetSelectedSpecial: (selected: { phoneIndex: number; type: 'topbar' | 'bottombuttons' | 'toast' | 'statusbar' } | null) => void;
  onSetIsPropEditorVisible: (visible: boolean) => void;
  updateNestedState: <T>(prev: T, fullKey: string, value: any) => T;
  // Phone settings props
  phoneName: string;
  selectedTemplate: AdminTemplate | null;
  onApplyTemplate: (template: AdminTemplate) => void;
  showTopBar: boolean;
  showBottomButtons: boolean;
  showToast: boolean;
  showStatusBar: boolean;
  onShowTopBarChange: () => void;
  onShowBottomButtonsChange: () => void;
  onShowToastChange: () => void;
  onShowStatusBarChange: () => void;
  onClearLayout: () => void;
  onDeselectPhone: () => void;
}

const GlobalSettingsPanel: React.FC<GlobalSettingsPanelProps> = ({
  isPropEditorVisible,
  rightPanelWidth,
  setRightPanelWidth,
  onShowJsonPanel,
  showJsonPanel,
  onResetWelcomeModal,
  onOpenClearAllLayoutsModal,
  isPhoneSettingsVisible,
  onClosePhoneSettings,
  selected,
  selectedSpecial,
  layoutState,
  dispatch,
  onSetSelected,
  onSetSelectedSpecial,
  onSetIsPropEditorVisible,
  updateNestedState,
  phoneName,
  selectedTemplate,
  onApplyTemplate,
  showTopBar,
  showBottomButtons,
  showToast,
  showStatusBar,
  onShowTopBarChange,
  onShowBottomButtonsChange,
  onShowToastChange,
  onShowStatusBarChange,
  onClearLayout,
  onDeselectPhone
}) => {
  const adminTheme = useAdminTheme();
  const setAdminTheme = useAdminThemeDispatch();
  const { layout, index: activeIndex } = useActiveLayout();

  // Slider/value mapping now in ../utils/themeSliders

  const handleBackgroundChange = useCallback((t: number) => {
    setAdminTheme({ type: 'Update', payload: { backgroundColor: sliderToBackground(t) } });
  }, [setAdminTheme]);
  const handleShadowChange = useCallback((t: number) => {
    setAdminTheme({ type: 'Update', payload: { phoneShadow: sliderToShadow(t) } });
  }, [setAdminTheme]);
  const handleSpacingChange = useCallback((t: number) => {
    setAdminTheme({ type: 'Update', payload: { layoutSpacing: sliderToSpacing(t) } });
  }, [setAdminTheme]);
  const handleOutlineChange = useCallback((t: number) => {
    setAdminTheme({ type: 'Update', payload: { layoutOutline: sliderToOutline(t) } });
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

  // Prop editor rendering functions
  const renderPropEditor = () => {
    if (!selected || !layoutState.layouts[selected.phoneIndex]) return null;
    const selectedLayout = layoutState.layouts[selected.phoneIndex];
    const components = selectedLayout.components;
    const comp = components[selected.componentIndex];
    if (!comp) return null;
    const meta = ComponentPropMeta[comp.name as keyof typeof ComponentPropMeta] as any;
    return (
      <GenericPropEditor
        title="Component Settings"
        meta={meta}
        values={comp.props}
        onChange={(fullKey, value) => {
          const prevProps = comp.props;
          const newProps = updateNestedState(prevProps, fullKey, value);
          const newComponents = components.map((item: any, idx: number) =>
            idx === selected.componentIndex ? { ...item, props: newProps } : item
          );
          dispatch({
            type: 'UPDATE_LAYOUT',
            index: selected.phoneIndex,
            payload: { components: newComponents }
          });
        }}
        onDismiss={() => {
          onSetSelected(null);
          onSetIsPropEditorVisible(false);
        }}
      />
    );
  };

  const handleSpecialMetaPropChange = (
    which: 'topbar' | 'bottombuttons' | 'toast' | 'statusbar',
    phoneIndex: number
  ) => (fullKey: string, value: any) => {
    const selectedLayout = layoutState.layouts[phoneIndex];
    const propKeyMap: Record<typeof which, keyof typeof selectedLayout> = {
      topbar: 'topBarProps',
      bottombuttons: 'bottomButtonsProps',
      toast: 'toastProps',
      statusbar: 'statusBarProps'
    } as const;

    const propKey = propKeyMap[which];
    const previousProps = selectedLayout[propKey] || {};
    const updatedProps = updateNestedState(previousProps, fullKey, value);

    dispatch({
      type: 'UPDATE_LAYOUT',
      index: phoneIndex,
      payload: { [propKey]: updatedProps }
    });
  };

  const renderSpecialPropEditor = () => {
    if (!selectedSpecial) return null;
    const selectedLayout = layoutState.layouts[selectedSpecial.phoneIndex];

    const configMap: Record<
      'topbar' | 'bottombuttons' | 'toast' | 'statusbar',
      { title: string; meta: any; valuesKey: 'topBarProps' | 'bottomButtonsProps' | 'toastProps' | 'statusBarProps' }
    > = {
      topbar: { title: 'Top Bar Settings', meta: TopBarPropMeta, valuesKey: 'topBarProps' },
      bottombuttons: { title: 'Bottom Buttons Settings', meta: ButtonGroupPropMeta, valuesKey: 'bottomButtonsProps' },
      toast: { title: 'Toast Settings', meta: ToastPropMeta, valuesKey: 'toastProps' },
      statusbar: { title: 'Status Bar Settings', meta: IOSStatusBarPropMeta, valuesKey: 'statusBarProps' }
    };

    const cfg = configMap[selectedSpecial.type];
    return (
      <GenericPropEditor
        title={cfg.title}
        meta={cfg.meta}
        values={selectedLayout[cfg.valuesKey] || {}}
        onChange={handleSpecialMetaPropChange(selectedSpecial.type, selectedSpecial.phoneIndex)}
        onDismiss={() => {
          onSetSelectedSpecial(null);
          onSetIsPropEditorVisible(false);
        }}
      />
    );
  };

  // Determine which content to render
  const renderContent = () => {
    // Prop editor takes priority
    if (isPropEditorVisible) {
      if (selected && layoutState.layouts[selected.phoneIndex] && layoutState.layouts[selected.phoneIndex].components[selected.componentIndex]) {
        return renderPropEditor();
      } else if (selectedSpecial) {
        return renderSpecialPropEditor();
      }
    }
    
    // Phone settings next
    if (isPhoneSettingsVisible) {
      return (
        <>
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
                onChange={val => {
                  if (activeIndex >= 0) {
                    dispatch({ type: 'UPDATE_LAYOUT', index: activeIndex, payload: { description: val } });
                  }
                }}
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
            contact="Contact @peterwright"
            buttonTitle="App preview"
            buttonIcon={Icons.DeviceMobile24}
            buttonIconSize={ICON_24}
          />
        </>
      );
    }

    // Default: Global settings
    return (
      <>
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
            <SliderInput
              label="Outline"
              value={outlineToSlider(adminTheme.layoutOutline)}
              onChange={handleOutlineChange}
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
      </>
    );
  };

  return (
    <motion.div
      className={`${styles.AdminPanel} ${styles.rightSide} ${styles.globalSettings}${isHoveringEdge || isResizing ? ' ' + styles.resizing : ''}`}
      style={{ width: width, borderLeftColor: (isHoveringEdge || isResizing) ? '#00C244' : undefined }}
      initial={{ x: '100%' }}
      animate={{ 
        x: 0,
        scale: 1,
        borderRadius: 0,
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
            opacity: 1,
            backgroundColor: 'white',
          }}
        >
          {renderContent()}
        </div>
      </div>
    </motion.div>
  );
};

export default GlobalSettingsPanel;
