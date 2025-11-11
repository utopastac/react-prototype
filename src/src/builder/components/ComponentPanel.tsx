import React from 'react';
import { motion } from 'framer-motion';
import styles from 'src/builder/index.module.sass';
import layoutsStyles from 'src/builder/layouts.module.sass';
import { useLayoutData } from 'src/builder/hooks/useLayoutData';
import { useAdminLayoutContext } from 'src/builder/AdminLayoutContext';
import { formatComponentName } from 'src/builder/formatComponentName';
import EditableLabel from './EditableLabel';
import { usePanelResize } from '../hooks/usePanelResize';

/**
 * Props interface for the ComponentPanel component
 * Defines all the callbacks and state needed for the admin panel functionality
 */
interface ComponentPanelProps {
  showAdminPanel: boolean;
  adminPanelWidth: number;
  setAdminPanelWidth: (w: number) => void;
  onDroppedComponentClick?: (layoutIdx: number, droppedIdx: number) => void;
  selected?: { layoutIdx: number, droppedIdx: number } | null;
}

const ComponentPanel: React.FC<ComponentPanelProps> = ({
  showAdminPanel,
  adminPanelWidth,
  setAdminPanelWidth,
  onDroppedComponentClick,
  selected
}) => {
  const { layoutNames, activeLayoutIndex } = useLayoutData();
  const [layoutState, dispatch] = useAdminLayoutContext();

  // Handler for renaming a layout
  const handleRenameLayout = (idx: number, newName: string) => {
    dispatch({ type: 'RENAME_LAYOUT', index: idx, name: newName });
  };

  // --- Resizing logic (now via hook) ---
  const [width, resizeHandle, isResizing, , isHoveringEdge] = usePanelResize({
    initialWidth: 320,
    minWidth: 220,
    maxWidth: 480,
    edge: 'right',
    width: adminPanelWidth,
    setWidth: setAdminPanelWidth,
  });
  // --- End resizing logic ---

  return (
    <motion.div
      className={
        styles.AdminPanel +
        (isHoveringEdge || isResizing ? ' ' + styles.resizing : '')
      }
      style={{ width: adminPanelWidth, borderRightColor: (isHoveringEdge || isResizing) ? '#00C244' : undefined }}
      initial={{ width: 0, opacity: 0 }}
      animate={{ width, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      key="admin-panel"
    >
      {/* Draggable right edge */}
      {resizeHandle}
      {/* Panel content */}
      <div style={{ height: '100%', position: 'relative' }}>
        <div className={styles.Tools}>
          {/* Layout List */}
          <div className={layoutsStyles.LayoutList}>
            {layoutNames.map((name, idx) => {
              const isActive = idx === activeLayoutIndex;
              const components = layoutState.layouts[idx]?.components || [];
                const selectedComponentIdx = selected && selected.layoutIdx === idx ? selected.droppedIdx : null;
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
                      {components.map((item, cidx) => (
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
        </div>
      </div>
    </motion.div>
  );
};

export default ComponentPanel; 