// PhonePreviewContent.tsx
//
// Renders the live phone preview area in the admin interface.
// Handles rendering of dropped components, top bar, bottom buttons,
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
  dropped: { name: string; Component: React.ComponentType<any>; props: any }[];
  selectedIdx: number | null;
  setSelectedIdx: (idx: number | null) => void;
  draggedIdx: number | null;
  setDraggedIdx: (idx: number | null) => void;
  dragOverIdx: number | null;
  setDragOverIdx: (idx: number | null) => void;
  isAltPressed: boolean;
  setIsAltPressed: (v: boolean) => void;
  showTopBar: boolean;
  topBarProps: any;
  setSelectedSpecial: (v: null | SpecialType) => void;
  showBottomButtons: boolean;
  bottomButtonsProps: any;
  setDropped: React.Dispatch<React.SetStateAction<{ name: string; Component: React.ComponentType<any>; props: any }[]>>;
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
  onDragEnd: () => void;
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
 * - Dropped components (with drag-and-drop and selection logic)
 * - Special UI elements (top bar, bottom buttons)
 * - Visual feedback for drag-and-drop
 * - Action buttons for each component (add, duplicate, divider, delete)
 *
 * Props are passed from AdminView and include all state and handlers needed for interaction.
 */
const PhonePreviewContent: React.FC<PhonePreviewContentProps> = ({
  dropped,
  selectedIdx,
  setSelectedIdx,
  draggedIdx,
  setDraggedIdx,
  dragOverIdx,
  setDragOverIdx,
  isAltPressed,
  setIsAltPressed,
  showTopBar,
  topBarProps,
  setSelectedSpecial,
  showBottomButtons,
  bottomButtonsProps,
  setDropped,
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
  onDragEnd,
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
        {/* Render each dropped component with drag-and-drop and action buttons */}
        {dropped.map(({ name, Component, props }, idx) => [
          // Show insert indicator when dragging over this index
          dragOverIdx === idx ? (
            <div key={"insert-indicator-" + idx} className={styles.InsertIndicator} />
          ) : null,
          <div
            key={name + idx}
            data-dropped-component
            onClick={() => {
              setSelectedSpecial(null);
              setSelectedIdx(idx);
            }}
            draggable
            onDragStart={e => {
              setDraggedIdx(idx);
              setIsAltPressed(e.altKey);
            }}
            onDragOver={e => {
              e.preventDefault();
              setDragOverIdx(idx);
              setIsAltPressed(e.altKey);
            }}
            onDragLeave={() => setDragOverIdx(null)}
            onDrop={e => {
              // REMOVE this entire handler. Drop logic is now handled by the parent PhonePreview drop zone using the useDragAndDrop hook.
            }}
            onDragEnd={() => {
              setDraggedIdx(null);
              setDragOverIdx(null);
              setIsAltPressed(false);
              onDragEnd();
            }}
            style={{ 
              position: 'relative'
            }}
            className={[
              styles.DroppedComponent,
              selectedIdx === idx ? styles.Selected : '',
              draggedIdx === idx ? styles.Dragged : '',
              dragOverIdx === idx ? styles.DragOver : styles.DroppedCard,
              showComponentNames ? styles.Highlighted : '',
              (isAltPressed && draggedIdx !== null) ? styles.DuplicateCursor : ''
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
                    setDropped(prev => {
                      const newDropped = [...prev];
                      newDropped.splice(idx + 1, 0, {
                        name: "Divider",
                        Component: Divider,
                        props: initialComponentProps["Divider"]
                      });
                      return newDropped;
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
        ])}
        {/* Show insert indicator at the end when dragging over the end of the list */}
        {dragOverIdx === dropped.length ? (
          <div key="insert-indicator-end" className={styles.InsertIndicator} />
        ) : null}
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