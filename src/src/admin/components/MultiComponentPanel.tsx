import React, { useState, useRef, useState as useReactState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import ComponentCard from 'src/admin/components/ComponentCard';
import ToolbarButton from './ToolbarButton';
import TextButton from './TextButton';
import { SearchInput } from 'src/admin/LabeledInput';
import { FormblockerComponents, initialComponentProps } from 'src/data/Components';
import * as Icons from 'src/data/Icons';
import { ICON_24 } from 'src/components/Icon';
import styles from 'src/admin/index.module.sass';
import multiStyles from 'src/admin/multi.module.sass';
import { useMultiLayoutData } from 'src/admin/hooks/useMultiLayoutData';
import { useMultiLayoutContext } from 'src/admin/MultiLayoutContext';
import { formatComponentName } from 'src/admin/formatComponentName';
import EditableLabel from './EditableLabel';
import { usePanelResize } from '../hooks/usePanelResize';
import Tabs, { TabItem } from './Tabs';

/**
 * Props interface for the MultiComponentPanel component
 * Defines all the callbacks and state needed for the admin panel functionality
 */
interface MultiComponentPanelProps {
  showAdminPanel: boolean;
  adminPanelWidth: number;
  setAdminPanelWidth: (w: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onHideAdminPanel: () => void;
  onShowKeyboardShortcuts: () => void;
  onOpenSave: () => void;
  onOpenLoad: () => void;
  onShare: () => void;
  onDragStart: ((e: React.DragEvent, name: string) => void) | ((name: string) => void);
  onDragEnd: () => void;
  onComponentClick: (name: string, Component: React.ComponentType<any>) => void;
  droppedLength: number;
  onShowHistory: () => void;
  onOpenTemplates: () => void; // NEW PROP
  onDroppedComponentClick?: (layoutIdx: number, droppedIdx: number) => void; // NEW PROP
  selected?: { layoutIdx: number, droppedIdx: number } | null; // NEW PROP
}

const MultiComponentPanel: React.FC<MultiComponentPanelProps> = ({
  showAdminPanel,
  adminPanelWidth,
  setAdminPanelWidth, // NEW PROP
  search,
  onSearchChange,
  onHideAdminPanel,
  onShowKeyboardShortcuts,
  onOpenSave,
  onOpenLoad,
  onShare,
  onDragStart,
  onDragEnd,
  onComponentClick,
  droppedLength,
  onShowHistory,
  onOpenTemplates, // NEW PROP
  onDroppedComponentClick, // NEW PROP
  selected // NEW PROP
}) => {
  // Tab state: 'layouts' or 'components'
  const [activeTab, setActiveTab] = useState<'layouts' | 'components'>('layouts');
  const { layoutNames, activeLayoutIndex } = useMultiLayoutData();
  const [multiLayoutState, dispatch] = useMultiLayoutContext();

  // Tab configuration
  const tabItems: TabItem[] = [
    { id: 'layouts', label: 'Layouts' },
    { id: 'components', label: 'Components' }
  ];

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
          <div className={styles.ToolBar}>
            <div>
              <ToolbarButton
                onClick={onHideAdminPanel}
                title="Hide admin panel (⌘.)"
                icon={Icons.InterventionsHubCustomer16}
                iconSize={ICON_24}
              />
            </div>
            <div>
              <ToolbarButton onClick={onShowKeyboardShortcuts} title="Keyboard shortcuts (⌘k)" icon={Icons.Keyboard24} position="bottom-left" />
              <ToolbarButton onClick={onOpenTemplates} title="Flow library (⌘/)" icon={Icons.DocumentW224} position="bottom" />
              <ToolbarButton onClick={onOpenSave} title="Save (⌘s)" icon={Icons.Download16} position="bottom" />
              {/* <ToolbarButton onClick={onShowHistory} title="History" icon={Icons.Time24} position="bottom" /> */}
              <ToolbarButton onClick={onOpenLoad} title="Load (⌘l)" icon={Icons.Load24} position="bottom" />
              <ToolbarButton onClick={onShare} title="Share (⌘p)" icon={Icons.Hyperlink24 || Icons.Download16} position="bottom-right" />
            </div>
          </div>
          {/* Tabs */}
          <Tabs
            tabs={tabItems}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as 'layouts' | 'components')}
          />
          {/* Layout List */}
          {activeTab === 'layouts' && (
            <div className={multiStyles.LayoutList}>
              {layoutNames.map((name, idx) => {
                const isActive = idx === activeLayoutIndex;
                const dropped = multiLayoutState.layouts[idx]?.dropped || [];
                const selectedComponentIdx = selected && selected.layoutIdx === idx ? selected.droppedIdx : null;
                return (
                  <div
                    key={name + idx}
                    className={`${multiStyles.LayoutListItem} ${isActive ? multiStyles.active : ''}`}
                    onClick={() => dispatch({ type: 'SET_ACTIVE_LAYOUT', index: idx })}
                  >
                    <h4>
                      <EditableLabel
                        label={name}
                        onRenameFinish={newName => handleRenameLayout(idx, newName)}
                        onRenameCancel={() => {}}
                        className={multiStyles.LayoutName}
                        inputClassName={multiStyles.LayoutName}
                      />
                    </h4>
                    {/* Show dropped components if this layout is active */}
                    {isActive && dropped.length > 0 && (
                      <ul>
                        {dropped.map((item, cidx) => (
                          <li
                            key={item.name + cidx}
                            className={selectedComponentIdx === cidx ? multiStyles.active : ''}
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
          )}
          {/* Available Components */}
          {activeTab === 'components' && (
            <div className={styles.AvailableComponents}>
              <div className={styles.SearchTemplate}>
                <SearchInput
                  placeholder="Search components..."
                  value={search}
                  onChange={onSearchChange}
                />
              </div>
              <div className={styles.ComponentStack}>
                <div className={styles.grid}>
                  {Object.entries(FormblockerComponents)
                    .filter(([name]) => name.toLowerCase().includes(search.toLowerCase()))
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([name, Component]) => (
                      <ComponentCard
                        key={name}
                        name={name}
                        Component={Component}
                        componentProps={initialComponentProps}
                        draggable
                        onDragStart={e => {
                          if (onDragStart.length === 2) {
                            (onDragStart as (e: React.DragEvent, name: string) => void)(e, name);
                          } else {
                            (onDragStart as (name: string) => void)(name);
                          }
                        }}
                        onDragEnd={onDragEnd}
                        onClick={() => onComponentClick(name, Component)}
                      />
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MultiComponentPanel; 