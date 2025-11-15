import React, { useState } from 'react';
import Icon from 'src/components/Icon';
import * as Icons from 'src/data/Icons';
import styles from 'src/builder/index.module.sass';
import ToolbarButton from 'src/admin/components/ToolbarButton';

/**
 * Props interface for the ArrayEditor component
 * This component provides a collapsible interface for editing arrays of objects
 */
interface ArrayEditorProps {
  /** Display label for the array (e.g., "Items", "Properties") */
  label: string;
  /** The array value to edit */
  value: any[];
  /** Callback function called when the array value changes */
  onChange: (newValue: any[]) => void;
  /** Optional field definitions for creating new items with proper defaults */
  itemFields?: Record<string, any>;
  /** Function to render the form fields for each array item */
  renderFields: (fieldsMeta: any, values: any, parentKey: string) => JSX.Element[];
  /** Optional parent key for nested form field naming */
  parentKey?: string;
  /** Custom label for the add button (defaults to "Add Item") */
  addButtonLabel?: string;
}

/**
 * ArrayEditor Component
 * 
 * A collapsible editor for arrays of objects that provides:
 * - Add/remove/duplicate array items
 * - Expandable/collapsible item sections
 * - Dynamic form field rendering for each item
 * - Proper default value handling for new items
 */
const ArrayEditor: React.FC<ArrayEditorProps> = ({
  label,
  value,
  onChange,
  itemFields,
  renderFields,
  parentKey = '',
  addButtonLabel = 'Add Item',
}) => {
  // Ensure we're working with an array, fallback to empty array if not
  const arrayValue = Array.isArray(value) ? value : [];
  
  // Track which array items are expanded/collapsed
  // Uses a Set for efficient lookups and toggling
  const [openIndices, setOpenIndices] = useState<Set<number>>(() => new Set());

  /**
   * Toggle the expanded state of an array item
   * @param idx - The index of the item to toggle
   */
  const toggleIndex = (idx: number) => {
    setOpenIndices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) {
        newSet.delete(idx);
      } else {
        newSet.add(idx);
      }
      return newSet;
    });
  };

  return (
    <div>
      {/* Header section with label and add button */}
      <div className={styles.ArrayOptionsHeader}>
        <h3>{label}</h3>
        <ToolbarButton
          title={`Add ${label.replace(/s$/i, '')}`}
          icon={Icons.Add16}
          onClick={() => {
            // Create a new item with appropriate default values based on field configuration
            const newItem = itemFields
              ? Object.fromEntries(
                  Object.entries(itemFields).map(([k, fieldConfig]: [string, any]) => {
                    // Handle different field types with appropriate defaults
                    if (fieldConfig.type === 'select' && fieldConfig.options && fieldConfig.options.length > 0) {
                      // For select fields, use the first option as default
                      return [k, fieldConfig.options[0]];
                    } else if (fieldConfig.type === 'boolean') {
                      // For boolean fields, default to false
                      return [k, false];
                    } else if (fieldConfig.type === 'object' && fieldConfig.options && fieldConfig.options.length > 0) {
                      // For object fields, create a basic object with the first option type
                      return [k, { type: fieldConfig.options[0].type }];
                    } else {
                      // For other fields, default to empty string
                      return [k, ''];
                    }
                  })
                )
              : {};
            // Add the new item to the end of the array
            onChange([...arrayValue, newItem]);
          }}
          position="left"
        />
      </div>

      {/* Render each array item */}
      {arrayValue.map((item, index) => {
        // Create a safe copy of the item and ensure all required fields exist
        let safeItem = { ...item };
        if (itemFields) {
          Object.entries(itemFields).forEach(([k, fieldConfig]) => {
            // Ensure select fields have a value (default to null if undefined)
            if (fieldConfig.type === 'select' && safeItem[k] === undefined) {
              safeItem[k] = null;
            }
          });
        }
        
        const isOpen = openIndices.has(index);
        
        return (
          <div key={index} className={`${styles.ArrayItemBox} ${isOpen ? styles.Open : ''}`}>
            {/* Collapsible header with item title and action buttons */}
            <header
              style={{ cursor: 'pointer', userSelect: 'none' }}
              onClick={e => {
                // Only toggle if the click is not on a button to prevent conflicts
                if ((e.target as HTMLElement).tagName !== 'BUTTON' && !(e.target as HTMLElement).closest('button')) {
                  toggleIndex(index);
                }
              }}
            >
              <div className={styles.HeaderTitle}>
                {/* Animated chevron icon that rotates when expanded */}
                <Icon
                  icon={Icons.Expand16}
                  size={"16"}
                  color={"standard"}
                  className={`${styles.chevron} ${isOpen ? styles.open : ''}`}
                />
                <h4 style={{ margin: 0 }}>{(label ? label.replace(/s$/i, '') : 'Item')} {index + 1}</h4>
              </div>
              
              {/* Action buttons for duplicate and delete */}
              <div style={{ display: 'flex', gap: 4 }}>
                <ToolbarButton
                  title="Duplicate"
                  icon={Icons.Copy16}
                  onClick={() => {
                    // Insert a copy of the current item after it
                    const newArray = [...arrayValue];
                    newArray.splice(index + 1, 0, { ...item });
                    onChange(newArray);
                  }}
                  position="top"
                />
                <ToolbarButton
                  title="Delete"
                  icon={Icons.Clear16}
                  onClick={() => {
                    // Remove the item at the current index
                    const newArray = arrayValue.filter((_, i) => i !== index);
                    onChange(newArray);
                  }}
                  position="top"
                />
              </div>
            </header>
            
            {/* Collapsible content area with form fields */}
            {isOpen && (
              <div className={styles.content}>
                {/* Render the form fields for this item using the provided renderFields function */}
                {itemFields && renderFields(itemFields, safeItem, `${parentKey}[${index}]`)}
              </div>
            )}
          </div>
        );
      })}
      
      {/* Empty state when no items exist */}
      {arrayValue.length === 0 && (
        <div className={styles.EmptyState}>
          No items. Click "Add Item" to add one.
        </div>
      )}
    </div>
  );
};

export default ArrayEditor; 