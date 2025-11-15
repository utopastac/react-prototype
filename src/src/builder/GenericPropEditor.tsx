// GenericPropEditor.tsx
//
// A dynamic, metadata-driven property editor for admin UI components.
// Renders input fields for any component based on a metadata schema, supporting
// strings, booleans, selects, arrays, objects, and nested/variant types.
// Used throughout the admin system for both regular and special components.

import React from 'react';
import LabeledInput from './LabeledInput';
import ArrayEditor from './ArrayEditor';
import styles from './index.module.sass';
import ToolbarButton from './components/ToolbarButton';
import * as Icons from 'src/data/Icons';

interface GenericPropEditorProps {
  title?: string;
  meta: Record<string, any>; // Metadata describing the shape and types of props
  values: any; // Current values for the props being edited
  onChange: (fullKey: string, value: any) => void; // Called with full property path and new value
  parentKey?: string; // Used for nested/recursive editing
  onDismiss?: () => void; // Optional callback to close the editor
}

/**
 * GenericPropEditor
 *
 * Renders a dynamic form for editing component props based on a metadata schema.
 * Supports nested objects, arrays, enums, and variant types.
 *
 * - meta: describes the fields, types, and options for each prop
 * - values: the current prop values
 * - onChange: called with (fullKey, value) for any change
 * - parentKey: used for recursion/nesting
 * - onDismiss: optional close handler
 */
const GenericPropEditor: React.FC<GenericPropEditorProps> = ({
  title,
  meta,
  values,
  onChange,
  parentKey = '',
  onDismiss,
}) => {
  /**
   * Recursively renders input fields for each property described in fieldsMeta.
   * Handles all supported types: string, boolean, select, object, array, and variant object.
   *
   * @param fieldsMeta - metadata for the current level
   * @param values - current values at this level
   * @param parentKey - property path prefix for nested fields
   */
  const renderFields = (fieldsMeta: any, values: any, parentKey = ''): JSX.Element[] =>
    Object.entries(fieldsMeta).map(([key, configRaw]) => {
      const config = configRaw as any;
      const value = values?.[key];
      // fullKey is the dot/bracket path to this property (e.g. 'foo.bar[2].baz')
      const fullKey = parentKey ? `${parentKey}.${key}` : key;

      // Handle primitive types and selects
      if (["string", "boolean", "select", "textarea"].includes(config.type)) {
        let inputConfig = config;
        // For select fields, build options array with a placeholder
        if (config.type === 'select' && config.options) {
          inputConfig = {
            ...config,
            options: [
              { value: '', label: `Select a ${config.label?.toLowerCase() || key}` },
              ...config.options.map((opt: any) =>
                typeof opt === 'string' ? { value: opt, label: opt } : opt
              )
            ]
          };
        }
        // Render a labeled input (text, checkbox, or select)
        return (
          <LabeledInput
            key={fullKey}
            config={inputConfig}
            value={value === undefined ? '' : value}
            onChange={val => onChange(fullKey, val === '' ? undefined : val)}
          />
        );
      }

      // Handle nested objects (fixed shape)
      if (config.type === 'object' && config.fields) {
        // Recursively render subfields
        return (
          <div key={fullKey}>
            {renderFields(config.fields, value || {}, fullKey)}
          </div>
        );
      }

      // Handle variant objects (object with a 'type' field and options)
      if (config.type === 'object' && config.options) {
        let selectedType = value?.type ?? '';
        // Build options array including placeholder
        const selectOptions = [
          { value: '', label: `Select a ${config.label?.toLowerCase() || key}` },
          ...((config.options as any[])
            .filter((opt: any) => !!opt && opt.type !== null)
            .map((opt: any) => ({
              value: opt.type,
              label: opt.label || String(opt.type)
            })))
        ];
        // Do NOT auto-initialize value or subfields here
        // Find the selected option's config
        const selectedOption = (config.options as any[]).find((opt: any) => opt && opt.type === selectedType) || config.options[0];
        // Render a select for the variant type, then subfields for the selected type
        return (
          <div key={fullKey} className={styles.PanelBox}>
            <LabeledInput
              config={{
                type: 'select',
                label: config.label || key,
                options: selectOptions
              }}
              value={selectedType}
              onChange={val => {
                const type = val === '' ? undefined : val;
                if (type === undefined) onChange(fullKey, undefined);
                else onChange(fullKey, { ...value, type });
              }}
            />
            {selectedOption && selectedOption.fields && renderFields(selectedOption.fields, value, fullKey)}
          </div>
        );
      }

      // Handle arrays of items (each item can be a primitive or object)
      if (config.type === 'array') {
        const arrayValue = Array.isArray(value) ? value : [];
        // Render an ArrayEditor, passing down itemFields and renderFields for recursion
        return (
          <ArrayEditor
            key={fullKey}
            label={config.label || key}
            value={arrayValue}
            onChange={newArr => onChange(fullKey, newArr)}
            itemFields={config.itemFields}
            renderFields={renderFields}
            parentKey={fullKey}
          />
        );
      }

      // If the type is not recognized, render nothing (could add error/warning here)
      return null;
    }).filter(Boolean) as JSX.Element[];

  return (
    <div className={styles.PropEditor}>
      <header className={styles.PanelHeader}>
        <div>
          {title && <h2>{title}</h2>}
          {/* Dismiss/close button, if provided */}
          {onDismiss && <ToolbarButton onClick={onDismiss} icon={Icons.Close16} title="Dismiss" position="left" />}
        </div>
      </header>
      <div className={styles.Fields}>
        {/* Render all fields for the current meta/values */}
        {renderFields(meta, values, parentKey)}
      </div>
    </div>
  );
};

export default GenericPropEditor; 