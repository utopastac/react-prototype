import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminLayoutContext, useActiveLayout } from './AdminLayoutContext';
import PhonePreviewContent from './PhonePreviewContent';
import styles from './index.module.sass';
import layoutsStyles from './layouts.module.sass';
import TopBar from 'src/components/TopBar';
import ButtonGroup from 'src/components/ButtonGroup';
import Toast from 'src/components/Toast';
import IOSStatusBar from 'src/components/IOSStatusBar';
import IOSHomeIndicator from 'src/components/IOSHomeIndicator';
import * as Icons from 'src/data/Icons';
import ToolbarButton from './components/ToolbarButton';
import gsap from "gsap";
import { AdminTemplates } from './Templates';
import EditableLabel from './components/EditableLabel';
import { useAdminTheme } from './AdminThemeContext';

/**
 * PhonePreview
 *
 * Renders multiple phone previews in a grid layout, each with independent state.
 * Supports drag-and-drop between phones, individual selection, and prop editing.
 * 
 * Features:
 * - Infinite grid layout with scrolling in both directions
 * - Individual phone selection and editing
 * - Cross-phone drag-and-drop
 * - Visual feedback for active/selected phones
 * - Responsive design
 * - Clickable empty spaces to add new layouts at specific positions
 * - Zoom functionality for overview and detailed views
 */

// Update prop types
type SelectedSpecial = { phoneIndex: number, type: 'topbar' | 'bottombuttons' | 'toast' | 'statusbar' } | null;
interface PhonePreviewProps {
  /** Whether to show phone names/labels */
  showLabels?: boolean;
  /** Callback when a phone is selected */
  onPhoneSelect?: (index: number) => void;
  selected: { phoneIndex: number, componentIndex: number } | null;
  setSelected: (sel: { phoneIndex: number, componentIndex: number } | null) => void;
  setSelectedSpecial: (v: SelectedSpecial) => void;
  selectedSpecial: SelectedSpecial;
  onCanvasClick?: () => void;
  layoutPositions?: Record<number, { row: number, col: number }>;
  gridRows?: number;
  gridCols?: number;
  onAddLayoutAt?: (row: number, col: number, templateName?: string) => void;
  onDuplicateLayoutAt?: (index: number) => void;
  // Zoom props - now required (fully controlled)
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  /** Callback to receive the container ref for fit-to-screen calculations */
  onContainerRef?: (ref: HTMLDivElement | null) => void;
}


const PhonePreview: React.FC<PhonePreviewProps> = (props) => {
  const {
    showLabels = true,
    onPhoneSelect,
    selected,
    setSelected,
    setSelectedSpecial,
    selectedSpecial,
    zoomLevel,
    onContainerRef
  } = props;
  const [layoutState, dispatch] = useAdminLayoutContext();
  const { index: activeIndex } = useActiveLayout();
  const adminTheme = useAdminTheme();
  
  
  // Grid position mapping - maps layout index to grid position
  // const [layoutPositions, setLayoutPositions] = useState<Map<number, GridPosition>>(new Map());

  // Derived state for zoom UI
  const zoomHideLevel = 0.5;
  // Ensure zoomLevel is valid and calculate isZoomedOut
  const validZoomLevel = isNaN(zoomLevel) || zoomLevel <= 0 ? 0.8 : zoomLevel;
  const isZoomedOut = validZoomLevel < zoomHideLevel;

  // Layout drag-and-drop state
  const [draggedLayoutIndex, setDraggedLayoutIndex] = useState<number | null>(null);
  const [dragOverGridPosition, setDragOverGridPosition] = useState<{ row: number, col: number } | null>(null);

  // Initialize first layout position if none exists
  useEffect(() => {
    if (layoutState.layouts.length > 0 && Object.keys(layoutState.layoutPositions).length === 0) {
      // dispatch({ type: 'SET_LAYOUT_POSITIONS', positions: new Map([[0, { row: 0, col: 0 }]]) });
    }
  }, [layoutState.layouts.length, Object.keys(layoutState.layoutPositions).length]);

  // Effect to auto-size the input width
  useEffect(() => {
    // No longer needed as EditableLabel handles its own sizing
  }, [layoutState.layoutNames.length]);

  // Select all text in rename input when it appears
  useEffect(() => {
    // No longer needed as EditableLabel handles its own selection
  }, []);

  // Keyboard shortcuts for zoom are handled in BuilderView

  // Refs for drag-and-drop
  const phoneRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Ref for the scroll container - use callback ref to expose to parent
  const containerRef = useRef<HTMLDivElement | null>(null);


  // Zoom handlers are now fully controlled by parent (BuilderView)

  /**
   * Handle phone selection
   */
  const handlePhoneSelect = (index: number) => {
    dispatch({ type: 'SET_ACTIVE_LAYOUT', index });
    onPhoneSelect?.(index);
  };



  // Scroll selected or active phone into view when selection changes (with GSAP)
  useEffect(() => {
    const indexToScroll = selected?.phoneIndex ?? activeIndex;
    const node = phoneRefs.current[indexToScroll];
    const container = containerRef.current;
    if (node && container) {
      // Calculate the offset to center the node horizontally and vertically
      const nodeRect = node.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const nodeCenterX = nodeRect.left + nodeRect.width / 2;
      const containerCenterX = containerRect.left + containerRect.width / 2;
      const scrollOffsetX = nodeCenterX - containerCenterX;

      const nodeCenterY = nodeRect.top + nodeRect.height / 2;
      const containerCenterY = containerRect.top + containerRect.height / 2;
      const scrollOffsetY = nodeCenterY - containerCenterY;

      // Animate both scrollLeft and scrollTop
      gsap.to(container, {
        scrollLeft: container.scrollLeft + scrollOffsetX,
        scrollTop: container.scrollTop + scrollOffsetY,
        duration: 0.3,
        ease: "power4.Out"
      });
    }
  }, [selected?.phoneIndex, activeIndex, layoutState.layouts.length]);

  /**
   * Handle clicking on empty grid space to add a new layout at the specific position
   */
  const handleEmptySpaceClick = (
    e: React.MouseEvent,
    gridRow: number,
    gridCol: number,
    templateName?: string
  ) => {
    e.stopPropagation();
    if (props.onAddLayoutAt) {
      props.onAddLayoutAt(gridRow, gridCol, templateName);
    } else {
      // fallback (legacy, should not be used)
      const nextIndex = layoutState.layouts.length;
      dispatch({ type: 'ADD_LAYOUT', name: templateName ?? `Layout ${nextIndex + 1}` });
    }
  };

  /**
   * Handle duplicating a layout - place it to the right
   */
  const handleDuplicateLayout = (index: number) => {
    if (props.onDuplicateLayoutAt) {
      props.onDuplicateLayoutAt(index);
    } else {
      // fallback (legacy, should not be used)
      dispatch({ type: 'DUPLICATE_LAYOUT_AT_POSITION', index, position: index + 1 });
    }
  };

  /**
   * Layout drag-and-drop handlers
   */
  const handleLayoutDragStart = (layoutIndex: number, e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDraggedLayoutIndex(layoutIndex);
    e.dataTransfer.setData('text/plain', layoutIndex.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleLayoutDragEnd = () => {
    setDraggedLayoutIndex(null);
    setDragOverGridPosition(null);
  };

  const handleLayoutDragOver = (e: React.DragEvent, gridRow: number, gridCol: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverGridPosition({ row: gridRow, col: gridCol });
  };

  const handleLayoutDrop = (e: React.DragEvent, gridRow: number, gridCol: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    const layoutIndex = parseInt(e.dataTransfer.getData('text/plain'));
    console.log('[DROP] layoutIndex:', layoutIndex, 'to', gridRow, gridCol); // LOG
    
    if (!isNaN(layoutIndex) && layoutIndex >= 0 && layoutIndex < layoutState.layouts.length) {
      dispatch({ 
        type: 'MOVE_LAYOUT_TO_POSITION', 
        layoutIndex, 
        newPosition: { row: gridRow, col: gridCol } 
      });
    }
    
    setDraggedLayoutIndex(null);
    setDragOverGridPosition(null);
    setHoveredCell(null);
  };

  // Calculate grid dimensions and items with positions
  const { gridItems, gridDimensions } = useMemo(() => {
    const items: Array<{
      type: 'phone' | 'empty';
      index?: number;
      row: number;
      col: number;
      gridIndex: number;
    }> = [];
    
    // Calculate the actual grid bounds based on layout positions
    let minRow = 0, maxRow = 0;
    let minCol = 0, maxCol = 0;
    
    if (Object.keys(layoutState.layoutPositions).length > 0) {
      minRow = Infinity;
      maxRow = -Infinity;
      minCol = Infinity;
      maxCol = -Infinity;
      
      for (const pos of Object.values(layoutState.layoutPositions)) {
        minRow = Math.min(minRow, pos.row);
        maxRow = Math.max(maxRow, pos.row);
        minCol = Math.min(minCol, pos.col);
        maxCol = Math.max(maxCol, pos.col);
      }
    }
    
    // Add one extra row and column for empty spaces
    const gridRows = maxRow + 2; // +1 for current max, +1 for extra
    const gridCols = maxCol + 2; // +1 for current max, +1 for extra
    
    // Ensure minimum grid size of 2x2
    const finalRows = Math.max(gridRows, 2);
    const finalCols = Math.max(gridCols, 2);
    
    // Create the dynamic grid
    for (let row = 0; row < finalRows; row++) {
      for (let col = 0; col < finalCols; col++) {
        // Check if there's a layout at this position
        let layoutIndex = -1;
        for (const [index, pos] of Object.entries(layoutState.layoutPositions)) {
          const idx = parseInt(index, 10);
          if (
            idx >= 0 &&
            idx < layoutState.layouts.length &&
            pos.row === row &&
            pos.col === col
          ) {
            layoutIndex = idx;
            break;
          }
        }
        if (layoutIndex >= 0) {
          // This is a phone layout
          items.push({ 
            type: 'phone', 
            index: layoutIndex, 
            row, 
            col,
            gridIndex: row * finalCols + col 
          });
        } else {
          // This is an empty space
          items.push({ 
            type: 'empty', 
            row, 
            col,
            gridIndex: row * finalCols + col 
          });
        }
      }
    }
    
    return {
      gridItems: items,
      gridDimensions: { rows: finalRows, cols: finalCols }
    };
  }, [layoutState.layouts.length, layoutState.layoutPositions]);

  // Track which empty cell is hovered
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  return (
    <>
      <div
        className={layoutsStyles.PhonePreview}
        ref={(el) => {
          containerRef.current = el;
          onContainerRef?.(el);
        }}
        onClick={e => {
          // Only trigger if the click is on the container itself, not a phone or child
          if (e.target === e.currentTarget && props.onCanvasClick) {
            props.onCanvasClick();
          }
        }}
      >
        <div 
          className={layoutsStyles.GridContent}
          style={{
            transform: `scale(${zoomLevel})`,
            gridTemplateColumns: `repeat(${gridDimensions.cols}, var(--view-width))`,
            gridTemplateRows: `repeat(${gridDimensions.rows}, var(--view-height))`,
            gap: adminTheme.layoutSpacing,
          }}
        >
          <AnimatePresence>
            {gridItems.map((item) => {
            if (item.type === 'phone' && item.index !== undefined) {
              const index = item.index;
              const layout = layoutState.layouts[index];
              const isActive = index === activeIndex;
              
              return (
                <div
                  key={`phone-${index}`}
                  ref={el => phoneRefs.current[index] = el}
                  className={[
                    layoutsStyles.PhoneItem,
                    // Only apply DraggedLayout if a layout is being dragged, not during component drags
                    draggedLayoutIndex === index && draggedLayoutIndex !== null ? layoutsStyles.DraggedLayout : ''
                  ].filter(Boolean).join(' ')}
                  style={{
                    gridRow: item.row + 1,
                    gridColumn: item.col + 1,
                  }}
                  onClick={() => handlePhoneSelect(index)}
                  // draggable removed from here
                  // onDragStart and onDragEnd removed from here
                  onDragOver={e => {
                    if (draggedLayoutIndex !== null) {
                      handleLayoutDragOver(e, item.row, item.col);
                    }
                  }}
                  onDrop={e => {
                    if (draggedLayoutIndex !== null) {
                      handleLayoutDrop(e, item.row, item.col);
                    }
                  }}
                >
                  {/* Phone Label */}
                  {showLabels && !isZoomedOut && (
                    <div
                      className={layoutsStyles.PhoneLabel}
                      style={{
                        transform: `scale(${1 / zoomLevel})`,
                        transformOrigin: 'top left',
                        cursor: 'grab',
                      }}
                      draggable
                      onDragStart={e => handleLayoutDragStart(index, e)}
                      onDragEnd={handleLayoutDragEnd}
                      data-label="Drag to move layout"
                    >
                      <EditableLabel
                        label={layoutState.layoutNames[index]}
                        onRenameFinish={newName => dispatch({ type: 'RENAME_LAYOUT', index, name: newName })}
                        onRenameCancel={() => {}}
                        className={isActive ? layoutsStyles.ActiveLabel : undefined}
                      />
                    </div>
                  )}
                  <div
                    className={[
                      styles.PhonePreview,
                      isActive ? layoutsStyles.ActivePhone : layoutsStyles.InactivePhone
                    ].filter((v): v is string => Boolean(v)).join(' ')}
                    style={{ 
                      boxShadow: adminTheme.phoneShadow,
                      outline: adminTheme.layoutOutline !== '0px' ? `${adminTheme.layoutOutline} solid rgba(0, 0, 0, 0.2)` : 'none'
                    }}
                  >
                    <PhonePreviewContent
                      components={layout.components}
                      selectedIdx={selected && selected.phoneIndex === index ? selected.componentIndex : null}
                      setSelectedIdx={componentIndex => {
                        if (componentIndex === null) {
                          setSelected(null);
                        } else {
                          setSelected({ phoneIndex: index, componentIndex });
                        }
                      }}
                      showTopBar={layout.showTopBar}
                      topBarProps={layout.topBarProps}
                      setSelectedSpecial={v => setSelectedSpecial(v ? { phoneIndex: index, type: v } : null)}
                      showBottomButtons={layout.showBottomButtons}
                      bottomButtonsProps={layout.bottomButtonsProps}
                      setComponents={(updater) => {
                        const newComponents = typeof updater === 'function' 
                          ? updater(layout.components) 
                          : updater;
                        dispatch({
                          type: 'UPDATE_LAYOUT',
                          index,
                          payload: { components: newComponents }
                        });
                      }}
                      styles={styles}
                      zoomLevel={zoomLevel}
                      isZoomedOut={isZoomedOut}
                      TopBar={TopBar}
                      ButtonGroup={ButtonGroup}
                      IOSStatusBar={IOSStatusBar}
                      showNotch={false}
                      IOSHomeIndicator={IOSHomeIndicator}
                      showComponentNames={false}
                      selectedSpecial={selectedSpecial?.phoneIndex === index ? selectedSpecial.type : null}
                      showToast={layout.showToast}
                      toastProps={layout.toastProps}
                      Toast={Toast}
                      showStatusBar={layout.showStatusBar}
                      statusBarProps={layout.statusBarProps}
                    />
                  </div>
                  {/* Phone Actions */}
                  {!isZoomedOut && (
                    <div className={[
                      layoutsStyles.PhoneActions,
                      isActive ? layoutsStyles.active : ''
                    ].filter(Boolean).join(' ')}
                    style={{
                      transform: `scale(${1 / zoomLevel})`,
                      transformOrigin: 'top right',
                    }}>
                        <ToolbarButton
                          key={`duplicate-phone-${index}`}
                          title="Duplicate"
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            handleDuplicateLayout(index);
                          }}
                          icon={Icons.Duplicate16}
                          iconColor={"subtle"}
                          position="bottom"
                        />
                        <ToolbarButton
                          key={`delete-phone-${index}`}
                          title="Delete"
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            dispatch({ type: 'REMOVE_LAYOUT', index });
                          }}
                          icon={Icons.Trash16}
                          iconColor={"subtle"}
                          position="bottom"
                        />
                    </div>
                  )}
                </div>
              );
            } else {
              // Empty grid space
              const isHovered = hoveredCell && hoveredCell.row === item.row && hoveredCell.col === item.col;
              return (
                <motion.div
                  key={`empty-${item.gridIndex}`}
                  className={[
                    layoutsStyles.EmptyGridSpace,
                    draggedLayoutIndex !== null &&
                    dragOverGridPosition &&
                    dragOverGridPosition.row === item.row &&
                    dragOverGridPosition.col === item.col
                      ? layoutsStyles.DropTarget
                      : ''
                  ].filter(Boolean).join(' ')}
                  style={{
                    gridRow: item.row + 1,
                    gridColumn: item.col + 1,
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={() => setHoveredCell({ row: item.row, col: item.col })}
                  onMouseLeave={() => setHoveredCell(null)}
                  onClick={e => handleEmptySpaceClick(e, item.row, item.col)}
                  data-grid-row={item.row}
                  data-grid-col={item.col}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  onDragOver={e => handleLayoutDragOver(e, item.row, item.col)}
                  onDrop={e => {
                    if (draggedLayoutIndex !== null) {
                      handleLayoutDrop(e, item.row, item.col);
                    }
                  }}
                  onDragLeave={() => setDragOverGridPosition(null)}
                >
                  {!isZoomedOut && (
                    <>
                      {/* <div className={layoutsStyles.EmptySpaceIcon}>+</div> */}
                      {/* <div
                        className={layoutsStyles.EmptySpaceText}
                        style={{
                          transform: `scale(${1 / zoomLevel})`,
                          transformOrigin: 'center center',
                        }}
                      >
                        Add layout
                      </div> */}
                      {isHovered && (
                        <div
                          className={layoutsStyles.templatePicker}
                          onClick={e => e.stopPropagation()}
                        >
                          {(() => {
                            // Group templates by 'group', including 'Blank'
                            const grouped = AdminTemplates.reduce((acc, tmpl) => {
                              const group = tmpl.group || 'Other';
                              if (!acc[group]) acc[group] = [];
                              acc[group].push(tmpl);
                              return acc;
                            }, {} as Record<string, typeof AdminTemplates>);
                            return Object.entries(grouped).map(([group, templates]) => (
                              <div key={group}>
                                <h4
                                  className={layoutsStyles.templateGroupHeader}
                                  style={{
                                    transform: `scale(${1 / zoomLevel})`,
                                    marginBottom: 8/zoomLevel,
                                    transformOrigin: 'top left',
                                  }}
                                >
                                  {group}
                                </h4>
                                {templates.map(tmpl => (
                                  <div
                                    key={tmpl.name}
                                    className={layoutsStyles.templateRow}
                                    onClick={e => {
                                      e.stopPropagation();
                                      handleEmptySpaceClick(e, item.row, item.col, tmpl.name);
                                    }}
                                  >
                                    <span
                                      style={{
                                        transform: `scale(${1 / zoomLevel})`,
                                        transformOrigin: 'top left',
                                      }}>
                                      {tmpl.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ));
                          })()}
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              );
            }
          })}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default PhonePreview; 