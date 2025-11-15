import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import ToolsSection from 'src/builder/components/ToolsSection';
import ToolbarButton from 'src/admin/components/ToolbarButton';
import ThemeSection from 'src/admin/ThemeSection';
import TextButton from 'src/admin/components/TextButton';
import Header from 'src/admin/components/Header';
import * as Icons from 'src/data/Icons';
import styles from 'src/builder/index.module.sass';
import layoutsStyles from 'src/builder/layouts.module.sass';
import SliderInput from 'src/admin/components/LabeledInput/SliderInput';
import { useAdminTheme, useAdminThemeDispatch } from 'src/admin/contexts/AdminThemeContext';
import { lerpColor, hexToRgb } from 'src/helpers/Utils';
import { usePanelResize } from 'src/builder/hooks/usePanelResize';
import { useActiveLayout } from 'src/admin/contexts/AdminLayoutContext';
import { AdminTemplates, AdminTemplate } from 'src/builder/Templates';
import LabeledInput from 'src/admin/components/LabeledInput';
import BooleanInput from 'src/admin/components/LabeledInput/BooleanInput';
import SelectInput from 'src/admin/components/LabeledInput/SelectInput';
import GenericPropEditor from 'src/builder/GenericPropEditor';
import { ComponentPropMeta } from 'src/data/Components';
import { TopBarPropMeta } from 'src/components/TopBar';
import { ButtonGroupPropMeta } from 'src/components/ButtonGroup';
import { ToastPropMeta } from 'src/components/Toast';
import { IOSStatusBarPropMeta } from 'src/components/IOSStatusBar';
import { useLayoutData } from 'src/builder/hooks/useLayoutData';
import { formatComponentName } from 'src/builder/formatComponentName';
import EditableLabel from 'src/admin/components/EditableLabel';

interface GlobalSettingsPanelProps {
  isPropEditorVisible: boolean;
  rightPanelWidth: number;
  setRightPanelWidth: (w: number) => void;
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
  // Layout list props
  onDroppedComponentClick?: (layoutIdx: number, droppedIdx: number) => void;
  selectedLayout?: { layoutIdx: number, droppedIdx: number } | null;
}

const GlobalSettingsPanel: React.FC<GlobalSettingsPanelProps> = ({
  isPropEditorVisible,
  rightPanelWidth,
  setRightPanelWidth,
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
  onDeselectPhone,
  onDroppedComponentClick,
  selectedLayout
}) => {
  const adminTheme = useAdminTheme();
  const setAdminTheme = useAdminThemeDispatch();
  const { layout, index: activeIndex } = useActiveLayout();
  const { layoutNames, activeLayoutIndex } = useLayoutData();

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

  const outlineMin = '0px';
  const outlineMax = '12px';
  function outlineToSlider(val: string): number {
    const min = parseInt(outlineMin, 10);
    const max = parseInt(outlineMax, 10);
    const v = parseInt(val, 10);
    if (isNaN(v)) return 0; // fallback
    return (v - min) / (max - min);
  }

  function sliderToOutline(t: number): string {
    const min = parseInt(outlineMin, 10);
    const max = parseInt(outlineMax, 10);
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
  const handleOutlineChange = useCallback((t: number) => {
    setAdminTheme({ type: 'Update', payload: { layoutOutline: sliderToOutline(t) } });
  }, [setAdminTheme]);

  // Handler for renaming a layout
  const handleRenameLayout = (idx: number, newName: string) => {
    dispatch({ type: 'RENAME_LAYOUT', index: idx, name: newName });
  };

  // --- Resizing logic ---
  const [width, resizeHandle, isResizing, , isHoveringEdge] = usePanelResize({
    initialWidth: 280,
    minWidth: 220,
    maxWidth: 480,
    edge: 'right',
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

  const handleSpecialMetaPropChange = (which: 'topbar' | 'bottombuttons' | 'toast' | 'statusbar', phoneIndex: number) => (fullKey: string, value: any) => {
    const selectedLayout = layoutState.layouts[phoneIndex];
    if (which === 'topbar') {
      dispatch({
        type: 'UPDATE_LAYOUT',
        index: phoneIndex,
        payload: { topBarProps: updateNestedState(selectedLayout.topBarProps, fullKey, value) }
      });
    } else if (which === 'bottombuttons') {
      dispatch({
        type: 'UPDATE_LAYOUT',
        index: phoneIndex,
        payload: { bottomButtonsProps: updateNestedState(selectedLayout.bottomButtonsProps, fullKey, value) }
      });
    } else if (which === 'toast') {
      dispatch({
        type: 'UPDATE_LAYOUT',
        index: phoneIndex,
        payload: { toastProps: updateNestedState(selectedLayout.toastProps, fullKey, value) }
      });
    } else if (which === 'statusbar') {
      dispatch({
        type: 'UPDATE_LAYOUT',
        index: phoneIndex,
        payload: { statusBarProps: updateNestedState(selectedLayout.statusBarProps, fullKey, value) }
      });
    }
  };

  const renderSpecialPropEditor = () => {
    if (!selectedSpecial) return null;
    const selectedLayout = layoutState.layouts[selectedSpecial.phoneIndex];
    if (selectedSpecial.type === 'topbar') {
      return (
        <GenericPropEditor
          title="Top Bar Settings"
          meta={TopBarPropMeta}
          values={selectedLayout.topBarProps || {}}
          onChange={handleSpecialMetaPropChange('topbar', selectedSpecial.phoneIndex)}
          onDismiss={() => {
            onSetSelectedSpecial(null);
            onSetIsPropEditorVisible(false);
          }}
        />
      );
    } else if (selectedSpecial.type === 'bottombuttons') {
      return (
        <GenericPropEditor
          title="Bottom Buttons Settings"
          meta={ButtonGroupPropMeta}
          values={selectedLayout.bottomButtonsProps || {}}
          onChange={handleSpecialMetaPropChange('bottombuttons', selectedSpecial.phoneIndex)}
          onDismiss={() => {
            onSetSelectedSpecial(null);
            onSetIsPropEditorVisible(false);
          }}
        />
      );
    } else if (selectedSpecial.type === 'toast') {
      return (
        <GenericPropEditor
          title="Toast Settings"
          meta={ToastPropMeta}
          values={selectedLayout.toastProps || {}}
          onChange={handleSpecialMetaPropChange('toast', selectedSpecial.phoneIndex)}
          onDismiss={() => {
            onSetSelectedSpecial(null);
            onSetIsPropEditorVisible(false);
          }}
        />
      );
    } else if (selectedSpecial.type === 'statusbar') {
      return (
        <GenericPropEditor
          title="Status Bar Settings"
          meta={IOSStatusBarPropMeta}
          values={selectedLayout.statusBarProps || {}}
          onChange={handleSpecialMetaPropChange('statusbar', selectedSpecial.phoneIndex)}
          onDismiss={() => {
            onSetSelectedSpecial(null);
            onSetIsPropEditorVisible(false);
          }}
        />
      );
    }
    return null;
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
          <Header 
            title={phoneName} 
            onClose={onDeselectPhone} 
          />
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
        </>
      );
    }

    // Default: Global settings
    return (
      <>
        <div className={styles.Controls} style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
          {/* Layout List */}
          <Header title="Screens" />
          <div className={layoutsStyles.LayoutList} style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
            {layoutNames.map((name, idx) => {
              const isActive = idx === activeLayoutIndex;
              const components = layoutState.layouts[idx]?.components || [];
              const selectedComponentIdx = selectedLayout && selectedLayout.layoutIdx === idx ? selectedLayout.droppedIdx : null;
              return (
                <div
                  key={name + idx}
                  className={`${layoutsStyles.LayoutListItem} ${isActive ? layoutsStyles.active : ''}`}
                  onClick={() => dispatch({ type: 'SET_ACTIVE_LAYOUT', index: idx })}
                >
                  <h4>
                    <EditableLabel
                      label={name}
                      onRenameFinish={newName => handleRenameLayout(idx, newName)}
                      onRenameCancel={() => {}}
                      className={layoutsStyles.LayoutName}
                      inputClassName={layoutsStyles.LayoutName}
                    />
                  </h4>
                  {/* Show components if this layout is active */}
                  {isActive && components.length > 0 && (
                    <ul>
                      {components.map((item: any, cidx: number) => (
                        <li
                          key={item.name + cidx}
                          className={selectedComponentIdx === cidx ? layoutsStyles.active : ''}
                          onClick={e => {
                            e.stopPropagation();
                            if (onDroppedComponentClick) {
                              onDroppedComponentClick(idx, cidx);
                            }
                          }}
                        >
                          {formatComponentName(item.name)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ flexShrink: 0 }}>
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
              <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <TextButton
                  onClick={onOpenClearAllLayoutsModal}
                  variant="secondary"
                  text="Clear all"
                />
                <TextButton 
                  onClick={onResetWelcomeModal} 
                  variant="tertiary" 
                  text="Reset intro" 
                />
              </div>
            </ToolsSection>
          </div>
        </div>
      </>
    );
  };

  return (
    <motion.div
      className={`${styles.AdminPanel} ${styles.rightSide} ${styles.globalSettings} ${isHoveringEdge || isResizing ? ' ' + styles.resizing : ''}`}
      style={{ width: width, borderRightColor: (isHoveringEdge || isResizing) ? '#0017e6' : undefined }}
      initial={{ x: '-100%' }}
      animate={{ 
        x: 0,
        scale: 1,
      }}
      exit={{ x: '-100%' }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      onClick={isPhoneSettingsVisible && !isPropEditorVisible ? onClosePhoneSettings : undefined}
    >
      {/* Draggable right edge */}
      {resizeHandle}
      <div style={{ height: '100%', position: 'relative' }}>
        <div 
          className={styles.Tools}
          style={{ 
            opacity: 1,
            backgroundColor: 'white',
          }}
          onClick={(e) => {
            // Stop propagation so clicks on settings don't close the panel
            e.stopPropagation();
          }}
        >
          {renderContent()}
        </div>
      </div>
    </motion.div>
  );
};

export default GlobalSettingsPanel;
