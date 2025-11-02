import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminLayoutContext } from './AdminLayoutContext';
import styles from './index.module.sass';
import Icon, { ICON_16, ICON_ADMIN } from 'src/components/Icon';
import * as Icons from 'src/data/Icons';
import ToolbarButton from './components/ToolbarButton';

/**
 * LayoutTabs
 *
 * Provides a tabbed interface for switching between different phone layouts.
 * Supports adding, removing, renaming, and reordering layouts.
 * 
 * Features:
 * - Tab navigation between layouts
 * - Add new layout button
 * - Rename layout functionality
 * - Delete layout with confirmation
 * - Drag-and-drop reordering
 * - Visual feedback for active tab
 */

interface LayoutTabsProps {
  /** Whether to show the add layout button */
  showAddButton?: boolean;
  /** Whether to show delete buttons on tabs */
  showDeleteButtons?: boolean;
  /** Whether to allow renaming tabs */
  allowRenaming?: boolean;
  /** Callback when a tab is selected */
  onTabSelect?: (index: number) => void;
  /** Callback when a new layout is added */
  onLayoutAdd?: (name: string) => void;
  /** Callback when a layout is deleted */
  onLayoutDelete?: (index: number) => void;
  /** Callback when a layout is renamed */
  onLayoutRename?: (index: number, name: string) => void;
}

const LayoutTabs: React.FC<LayoutTabsProps> = ({
  showAddButton = true,
  showDeleteButtons = true,
  allowRenaming = true,
  onTabSelect,
  onLayoutAdd,
  onLayoutDelete,
  onLayoutRename
}) => {
  const [layoutState, dispatch] = useAdminLayoutContext();
  const [editingTabIndex, setEditingTabIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [draggedTabIndex, setDraggedTabIndex] = useState<number | null>(null);

  /**
   * Handle tab selection
   */
  const handleTabSelect = (index: number) => {
    dispatch({ type: 'SET_ACTIVE_LAYOUT', index });
    onTabSelect?.(index);
  };

  /**
   * Handle adding a new layout
   */
  const handleAddLayout = () => {
    const newName = `Layout ${layoutState.layouts.length + 1}`;
    dispatch({ type: 'ADD_LAYOUT', name: newName });
    onLayoutAdd?.(newName);
  };

  /**
   * Handle deleting a layout
   */
  const handleDeleteLayout = (index: number) => {
    if (layoutState.layouts.length <= 1) return; // Don't delete last layout
    
    dispatch({ type: 'REMOVE_LAYOUT', index });
    onLayoutDelete?.(index);
  };

  /**
   * Start editing a tab name
   */
  const handleStartEdit = (index: number) => {
    if (!allowRenaming) return;
    
    setEditingTabIndex(index);
    setEditingName(layoutState.layoutNames[index]);
  };

  /**
   * Save the edited name
   */
  const handleSaveEdit = () => {
    if (editingTabIndex === null) return;
    
    const trimmedName = editingName.trim();
    if (trimmedName) {
      dispatch({ type: 'RENAME_LAYOUT', index: editingTabIndex, name: trimmedName });
      onLayoutRename?.(editingTabIndex, trimmedName);
    }
    
    setEditingTabIndex(null);
    setEditingName('');
  };

  /**
   * Cancel editing
   */
  const handleCancelEdit = () => {
    setEditingTabIndex(null);
    setEditingName('');
  };

  /**
   * Handle drag start for tab reordering
   */
  const handleTabDragStart = (e: React.DragEvent, index: number) => {
    setDraggedTabIndex(index);
    e.dataTransfer.setData('text/plain', index.toString());
  };

  /**
   * Handle drag over for tab reordering
   */
  const handleTabDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  /**
   * Handle drop for tab reordering
   */
  const handleTabDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (sourceIndex !== targetIndex) {
      dispatch({ type: 'REORDER_LAYOUTS', fromIndex: sourceIndex, toIndex: targetIndex });
    }
    
    setDraggedTabIndex(null);
  };

  /**
   * Handle drag end
   */
  const handleTabDragEnd = () => {
    setDraggedTabIndex(null);
  };

  return (
    <div className={styles.LayoutTabs}>
      <div className={styles.TabContainer}>
        <AnimatePresence>
          {layoutState.layouts.map((layout, index) => {
            const isActive = index === layoutState.activeLayoutIndex;
            const isEditing = index === editingTabIndex;
            const isDragged = index === draggedTabIndex;
            
            return (
              <motion.div
                key={`tab-${index}`}
                className={[
                  styles.Tab,
                  isActive ? styles.ActiveTab : '',
                  isDragged ? styles.DraggedTab : ''
                ].filter(Boolean).join(' ')}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleTabSelect(index)}
                onDoubleClick={() => handleStartEdit(index)}
                draggable
                onDragStart={(e) => handleTabDragStart(e, index)}
                onDragOver={(e) => handleTabDragOver(e, index)}
                onDrop={(e) => handleTabDrop(e, index)}
                onDragEnd={handleTabDragEnd}
              >
                {/* Tab Content */}
                <div className={styles.TabContent}>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveEdit();
                        } else if (e.key === 'Escape') {
                          handleCancelEdit();
                        }
                      }}
                      className={styles.TabInput}
                      autoFocus
                    />
                  ) : (
                    <span className={styles.TabName}>
                      {layoutState.layoutNames[index]}
                    </span>
                  )}
                  
                  {/* Active indicator */}
                  {isActive && !isEditing && (
                    <div className={styles.ActiveIndicator} />
                  )}
                </div>

                {/* Delete button */}
                {showDeleteButtons && layoutState.layouts.length > 1 && (
                  <ToolbarButton
                    title="Delete layout"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      handleDeleteLayout(index);
                    }}
                    icon={Icons.Clear16}
                    iconColor={ICON_ADMIN}
                    position="top"
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Add layout button */}
        {showAddButton && (
          <motion.div
            className={styles.AddTabButton}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ToolbarButton
              title="Add new layout"
              onClick={handleAddLayout}
              icon={Icons.Add16}
              iconColor={ICON_ADMIN}
              position="top"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LayoutTabs; 