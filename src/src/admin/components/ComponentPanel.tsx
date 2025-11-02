import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ComponentCard from 'src/admin/components/ComponentCard';
import ToolbarButton from './ToolbarButton';
import { SearchInput } from '../LabeledInput';
import { FormblockerComponents, initialComponentProps } from 'src/data/Components';
import * as Icons from 'src/data/Icons';
import { ICON_24 } from 'src/components/Icon';
import styles from '../index.module.sass';
import SelectInput from '../LabeledInput/SelectInput';
import { AdminTemplates, AdminTemplate } from '../Templates';

/**
 * Props interface for the ComponentPanel component
 * Defines all the callbacks and state needed for the admin panel functionality
 */
interface ComponentPanelProps {
  /** Controls whether the admin panel is visible */
  showAdminPanel: boolean;
  /** Width of the admin panel in pixels */
  adminPanelWidth: number;
  /** Current search query for filtering components */
  search: string;
  /** Callback to update the search query */
  onSearchChange: (value: string) => void;
  /** Callback to hide the admin panel */
  onHideAdminPanel: () => void;
  /** Callback to show keyboard shortcuts panel */
  onShowKeyboardShortcuts: () => void;
  /** Callback to open the save modal */
  onOpenSave: () => void;
  /** Callback to open the load modal */
  onOpenLoad: () => void;
  /** Callback to share the current configuration */
  onShare: () => void;
  /** Callback when dragging a component starts */
  onDragStart: ((e: React.DragEvent, name: string) => void) | ((name: string) => void);
  /** Callback when dragging a component ends */
  onDragEnd: () => void;
  /** Callback when a component is clicked */
  onComponentClick: (name: string, Component: React.ComponentType<any>) => void;
  /** Number of components currently dropped on the canvas */
  droppedLength: number;
  /** Currently selected template */
  selectedTemplate: AdminTemplate | null;
  /** Callback to apply a template */
  onApplyTemplate: (template: AdminTemplate) => void;
  /** Callback to show history modal */
  onShowHistory: () => void;
}

/**
 * ComponentPanel - Main admin panel for the Interventions Hub component builder
 * 
 * This component provides:
 * - A toolbar with various admin actions (save, load, share, etc.)
 * - A searchable grid of available components
 * - Template selection functionality
 * - Drag and drop support for components
 * 
 * The panel animates in/out using Framer Motion and provides a comprehensive
 * interface for managing the component builder workspace.
 */
const ComponentPanel: React.FC<ComponentPanelProps> = ({
  showAdminPanel,
  adminPanelWidth,
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
  selectedTemplate,
  onApplyTemplate,
  onShowHistory
}) => {
  return (
    // Main admin panel container with smooth width/opacity animations
    <motion.div
      className={styles.AdminPanel}
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: adminPanelWidth, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      key="admin-panel"
    >
      <div className={styles.Tools}>
        {/* Top toolbar with admin controls */}
        <div className={styles.ToolBar}>
          {/* Left side - Hide panel button */}
          <div>
            <ToolbarButton
              onClick={onHideAdminPanel}
              title="Hide admin panel (⌘.)"
              icon={Icons.InterventionsHubCustomer16}
              iconSize={ICON_24}
            />
          </div>
          {/* Right side - Action buttons */}
          <div>
            <ToolbarButton onClick={onShowKeyboardShortcuts} title="Keyboard shortcuts" icon={Icons.Keyboard24} position="bottom" />
            <ToolbarButton onClick={onOpenSave} title="Save" icon={Icons.Download16} position="bottom" />
            {/* History button - currently disabled/comment out */}
            {/* <ToolbarButton onClick={onShowHistory} title="History" icon={Icons.Time24} position="bottom" /> */}
            <ToolbarButton onClick={onOpenLoad} title="Load" icon={Icons.Load24} position="bottom" />
            <ToolbarButton onClick={onShare} title="Share" icon={Icons.Hyperlink24 || Icons.Download16} position="bottom" />
          </div>
        </div>
        
        {/* Main content area with search and component grid */}
        <div className={styles.AvailableComponents}>
          {/* Search and template selection section */}
          <div className={styles.SearchTemplate}>
            {/* 
              Using an IIFE to create local state for search focus
              This allows us to conditionally show/hide the template selector
              based on whether the search input is focused
            */}
            {(() => {
              const [searchFocused, setSearchFocused] = useState(false);
              return (
                <>
                  {/* Search input for filtering components */}
                  <SearchInput
                    placeholder="Search components..."
                    value={search}
                    onChange={onSearchChange}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                  {/* 
                    Template selector - only visible when search is not focused
                    This prevents UI clutter when user is actively searching
                  */}
                  {!searchFocused && (
                    <SelectInput
                      label=""
                      value={selectedTemplate?.name || ''}
                      options={[
                        { value: '', label: 'Choose a template' }, 
                        ...AdminTemplates.map(t => ({ value: t.name, label: t.name }))
                      ]}
                      inputStyle={{width: 150}}
                      onChange={val => {
                        const t = AdminTemplates.find(t => t.name === val);
                        if (t) onApplyTemplate(t);
                      }}
                    />
                  )}
                </>
              );
            })()}
          </div>
          
          {/* Component grid container */}
          <div className={styles.ComponentStack}>
            <div className={styles.grid}>
              {/* 
                Render all available components, filtered by search query
                Components are sorted alphabetically for consistent ordering
              */}
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
      </div>
    </motion.div>
  );
};

export default ComponentPanel; 