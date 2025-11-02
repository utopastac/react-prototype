// PhonePreviewContent.tsx
//
// Renders the live phone preview area in the admin interface.
// Handles rendering of components, top bar, bottom buttons,
// drag-and-drop reordering, selection, and component actions.
// Used as the main interactive preview in AdminView.

import React from 'react';
import Divider from 'src/components/Divider';
import Icon, { ICON_24, ICON_16, ICON_STANDARD, ICON_ADMIN } from 'src/components/Icon';
import * as Icons from 'src/data/Icons';
import { initialComponentProps } from 'src/data/Components';
import ToolbarButton from './components/ToolbarButton';

// Update the props interface
type SpecialType = 'topbar' | 'bottombuttons' | 'toast' | 'statusbar';
interface PhonePreviewContentProps {
  components: { name: string; Component: React.ComponentType<any>; props: any }[];
  selectedIdx: number | null;
  setSelectedIdx: (idx: number | null) => void;
  showTopBar: boolean;
  topBarProps: any;
  setSelectedSpecial: (v: null | SpecialType) => void;
  showBottomButtons: boolean;
  bottomButtonsProps: any;
  setComponents: React.Dispatch<React.SetStateAction<{ name: string; Component: React.ComponentType<any>; props: any }[]>>;
  styles: any;
  zoomLevel: number;
  isZoomedOut: boolean;
  TopBar: React.ComponentType<any>;
  ButtonGroup: React.ComponentType<any>;
  IOSStatusBar: React.ComponentType<any>;
  showNotch?: boolean;
  IOSHomeIndicator: React.ComponentType<any>;
  showComponentNames: boolean;
  selectedSpecial: null | SpecialType;
  onOpenInsertModal: (e: React.MouseEvent, idx: number) => void;
  onDuplicate: (idx: number) => void;
  onDelete: (idx: number) => void;
  showToast: boolean;
  toastProps: any;
  Toast: React.ComponentType<any>;
  onDroppedComponentAdd?: (newComponent: { name: string; Component: React.ComponentType<any>; props: any }, idx?: number | null) => void;
  showStatusBar: boolean;
  statusBarProps: any;
}

/**
 * PhonePreviewContent
 *
 * Renders the phone preview area, including:
 * - Dropped components (with selection logic)
 * - Special UI elements (top bar, bottom buttons)
 * - Action buttons for each component (add, duplicate, divider, delete)
 *
 * Props are passed from AdminView and include all state and handlers needed for interaction.
 */
const PhonePreviewContent: React.FC<PhonePreviewContentProps> = ({
  components,
  selectedIdx,
  setSelectedIdx,
  showTopBar,
  topBarProps,
  setSelectedSpecial,
  showBottomButtons,
  bottomButtonsProps,
  setComponents,
  styles,
  zoomLevel,
  isZoomedOut,
  TopBar,
  ButtonGroup,
  IOSStatusBar,
  showNotch,
  IOSHomeIndicator,
  showComponentNames,
  selectedSpecial,
  onOpenInsertModal,
  onDuplicate,
  onDelete,
  showToast,
  toastProps,
  Toast,
  onDroppedComponentAdd,
  showStatusBar,
  statusBarProps
}) => {
  return (
    <>
      {/* Render the top bar as a special selectable component */}
      {showTopBar && (
        <div
          data-special-component
          onClick={() => {
            setSelectedIdx(null);
            setSelectedSpecial('topbar');
          }}
          style={{ cursor: 'pointer', position: 'absolute', top: 47, left: 0, right: 0, zIndex: 10000 }}
          className={[
            styles.DroppedComponent,
            styles.DroppedCard,
            (selectedSpecial === 'topbar' ? styles.Selected : '')
          ].filter(Boolean).join(' ')}
        >
          <TopBar {...topBarProps} />
        </div>
      )}
      <div className={`${styles.PagePreview} ${showTopBar && styles.offset}`}>
        {/* Render each component with action buttons */}
        {components.map(({ name, Component, props }, idx) => (
          <div
            key={name + idx}
            data-component
            onClick={() => {
              setSelectedSpecial(null);
              setSelectedIdx(idx);
            }}
            style={{ 
              position: 'relative'
            }}
            className={[
              styles.DroppedComponent,
              selectedIdx === idx ? styles.Selected : '',
              styles.DroppedCard,
              showComponentNames ? styles.Highlighted : ''
            ].filter(Boolean).join(' ')}

          >
            {/* Render the actual component, or a placeholder if props are missing */}
            {props !== undefined ? (
              React.createElement(Component, props)
            ) : (
              <span style={{ color: '#888' }}>Props required</span>
            )}
            {/* Overlay the component name if showComponentNames is enabled */}
            {showComponentNames && (
              <div className={styles.ComponentNameOverlay}>
                {name}
              </div>
            )}

            {/* Action buttons for this component (add, duplicate, divider, delete) */}
            {!isZoomedOut && (
              <div
                className={styles.ComponentButtons}
                style={{
                  transform: `scale(${1 / zoomLevel}) translateX(-${50 * zoomLevel}%)`,
                  transformOrigin: 'center center',
                }}
              >
                <ToolbarButton
                  title="Add component"
                  onClick={e => onOpenInsertModal(e, idx)}
                  icon={Icons.Add24}
                  iconColor={ICON_ADMIN}
                  position="top"
                />
                <ToolbarButton
                  title="Duplicate component"
                  onClick={e => {
                    e.stopPropagation();
                    onDuplicate(idx);
                  }}
                  icon={Icons.Copy16 || Icons.Add24}
                  iconColor={ICON_ADMIN}
                  position="top"
                />
                <ToolbarButton
                  title="Insert divider"
                  onClick={e => {
                    e.stopPropagation();
                      setComponents(prev => {
                        const newComponents = [...prev];
                        newComponents.splice(idx + 1, 0, {
                          name: "Divider",
                          Component: Divider,
                          props: initialComponentProps["Divider"]
                        });
                        return newComponents;
                      });
                    setSelectedIdx(idx + 1);
                  }}
                  icon={Icons.Limits24}
                  iconColor={ICON_ADMIN}
                  position="top"
                />
                <ToolbarButton
                  title="Delete"
                  onClick={e => {
                    e.stopPropagation();
                    onDelete(idx);
                    if (selectedIdx === idx) setSelectedIdx(null);
                  }}
                  icon={Icons.Clear16}
                  iconColor={ICON_ADMIN}
                  position="top"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Render the bottom button group as a special selectable component */}
      {showBottomButtons && (
        <div
          data-special-component
          onClick={() => {
            setSelectedIdx(null);
            setSelectedSpecial('bottombuttons');
          }}
          style={{ cursor: 'pointer' }}
          className={[
            styles.DroppedComponent,
            styles.DroppedCard,
            (selectedSpecial === 'bottombuttons' ? styles.Selected : '')
          ].filter(Boolean).join(' ')}
        >
          <ButtonGroup {...bottomButtonsProps} />
        </div>
      )}
      {/* Render the toast as a special selectable component */}
      {showToast && (
        <div
          data-special-component
          onClick={() => {
            setSelectedIdx(null);
            setSelectedSpecial('toast');
          }}
          style={{ cursor: 'pointer' }}
          className={[
            styles.ToastContainer,
            styles.DroppedComponent,
            styles.DroppedCard,
            (selectedSpecial === 'toast' ? styles.Selected : '')
          ].filter(Boolean).join(' ')}
        >
          <Toast
            headline={toastProps.headline}
            body={toastProps.body}
            button={toastProps.button}
            icon={toastProps.icon}
          />
        </div>
      )}
      {/* Render the status bar as a special selectable component */}
      {showStatusBar && (
        <div
          data-special-component
          onClick={() => {
            setSelectedIdx(null);
            setSelectedSpecial('statusbar');
          }}
          style={{ cursor: 'pointer', position: 'absolute', top: 0, left: 0, right: 0, height: 47, zIndex: 10001 }}
          className={[
            styles.DroppedComponent,
            styles.DroppedCard,
            (selectedSpecial === 'statusbar' ? styles.Selected : '')
          ].filter(Boolean).join(' ')}
        >
          <IOSStatusBar {...statusBarProps} />
        </div>
      )}
      {/* Render iOS home indicator overlays */}
      <IOSHomeIndicator />
    </>
  );
};

export default React.memo(PhonePreviewContent); 