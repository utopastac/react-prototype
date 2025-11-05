import React from 'react';
import StringInput from './StringInput';
import BooleanInput from './BooleanInput';
import SelectInput from './SelectInput';
import SearchInput from './SearchInput';
import AvatarSelectInput from './AvatarSelectInput';
import TextAreaInput from './TextAreaInput'; // Added import for TextAreaInput
import SliderInput from './SliderInput';

/**
 * Configuration interface for different types of labeled inputs
 * Defines the structure and options for each input type
 */
interface LabeledInputConfig {
  type: 'string' | 'boolean' | 'select' | 'avatar-select' | 'textarea' | 'slider'; // Type of input to render
  label?: string; // Optional label text to display
  options?: (string | { value: string; label: string })[]; // Options for select inputs
  placeholder?: string; // Optional placeholder for text/textarea inputs
  // ...other config fields as needed
}

/**
 * Props interface for the LabeledInput component
 * Handles the configuration, current value, change handler, and optional styling
 */
interface LabeledInputProps {
  config: LabeledInputConfig; // Configuration object defining input type and options
  value: any; // Current value of the input
  onChange: (value: any) => void; // Callback function when value changes
  inputStyle?: React.CSSProperties; // Optional CSS styles to apply to the input
}

/**
 * LabeledInput Component
 * 
 * A flexible input component that renders different types of form inputs
 * based on the provided configuration. This component acts as a wrapper
 * that delegates to specific input components based on the 'type' field.
 * 
 * Supported input types:
 * - string: Text input field
 * - boolean: Checkbox or toggle input
 * - select: Dropdown selection with options
 * - avatar-select: Avatar selection interface
 * 
 * @param config - Configuration object defining the input type and properties
 * @param value - Current value of the input
 * @param onChange - Callback function triggered when input value changes
 * @param inputStyle - Optional CSS styles to apply to the input element
 */
const LabeledInput: React.FC<LabeledInputProps> = ({ config, value, onChange, inputStyle }) => {
  const { type, label, options, placeholder } = config;
  
  // Skip rendering if the label is 'Action' (likely a special case)
  if (label === 'Action') return null;
  
  // Render different input components based on the specified type
  switch (type) {
    case 'string':
      // Render a text input field for string values
      return (
        <StringInput
          label={label || ''}
          value={value || ''}
          onChange={onChange}
          inputStyle={inputStyle}
        />
      );
    
    case 'boolean':
      // Render a boolean input (checkbox/toggle) for true/false values
      return (
        <BooleanInput
          label={label || ''}
          value={!!value} // Convert to boolean to ensure proper type
          onChange={onChange}
        />
      );
    
    case 'select':
      // Render a dropdown select input with provided options
      if (!options) return null; // Don't render if no options provided
      return (
        <SelectInput
          label={label || ''}
          value={value || ''}
          options={options}
          onChange={onChange}
          inputStyle={inputStyle}
        />
      );
    
    case 'avatar-select':
      // Render an avatar selection interface
      return (
        <AvatarSelectInput
          label={label || ''}
          value={value || ''}
          onChange={onChange}
          inputStyle={inputStyle}
        />
      );
    
    case 'textarea':
      // Render a textarea input using TextArea
      // Accepts optional placeholder from config
      // Uses value and onChange like the others
      // Note: TextArea expects 'placeholder' prop
      // and manages its own state, so we need to adapt it
      // We'll create a wrapper below to make it controlled
      return (
        <TextAreaInput
          label={label || ''}
          value={value || ''}
          placeholder={placeholder || ''}
          onChange={onChange}
          inputStyle={inputStyle}
        />
      );
    
    case 'slider':
      // Render a slider input for values between 0 and 1
      return (
        <SliderInput
          label={label || ''}
          value={typeof value === 'number' ? value : 0}
          onChange={onChange}
          inputStyle={inputStyle}
        />
      );
    
    default:
      // Return null for unsupported input types
      return null;
  }
};

export default LabeledInput;
export { SearchInput }; // Re-export SearchInput for external use 