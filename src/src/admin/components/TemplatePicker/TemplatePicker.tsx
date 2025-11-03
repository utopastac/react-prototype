import React, { useEffect, useRef, useState } from 'react';
import styles from './TemplatePicker.module.sass';
import SelectInput from '../../LabeledInput/SelectInput';
import { AdminTemplates, AdminTemplate } from '../../Templates';

export interface TemplatePickerState {
  row: number;
  col: number;
  pos: { x: number; y: number };
}

interface TemplatePickerProps {
  picker: TemplatePickerState;
  onClose: () => void;
  onSelectTemplate: (row: number, col: number, template: AdminTemplate) => void;
}

const TemplatePicker: React.FC<TemplatePickerProps> = ({ picker, onClose, onSelectTemplate }) => {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
        setValue('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className={styles.TemplatePicker}
      style={{ left: picker.pos.x, top: picker.pos.y }}
    >
      <SelectInput
        label="Choose a template"
        value={value}
        options={[{ value: '', label: 'Choose a template' }, ...AdminTemplates.map(t => ({ value: t.name, label: t.name }))]}
        onChange={val => {
          setValue(val);
          const t = AdminTemplates.find(t => t.name === val);
          if (t) {
            onSelectTemplate(picker.row, picker.col, t);
          }
        }}
      />
    </div>
  );
};

export default TemplatePicker;

