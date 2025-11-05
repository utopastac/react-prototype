// PhonePreviewContent.tsx
//
// Renders the live phone preview area in the admin interface.
// Handles rendering of components, top bar, bottom buttons,
// selection, and prop editing.
// Used as the main interactive preview in AdminView.

import React from 'react';

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
  showToast: boolean;
  toastProps: any;
  Toast: React.ComponentType<any>;
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
  showToast,
  toastProps,
  Toast,
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