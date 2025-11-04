import React from "react";
import Icon, { IconPropMeta } from "src/components/Icon";
import styles from "./index.module.sass";
import { useButtonAction, ButtonAction } from 'src/hooks/useButtonAction';
//

export interface ButtonProps {
  title: string;
  onClick?: () => void;
  action?: ButtonAction;
  type?: 'standard' | 'prominent' | 'destructive' | 'subtle' | 'inverse' | 'brand';
  size?: 'compact' | 'default' | 'cta';
  icon?: {
    type: string;
    size: '32' | '24' | '16';
    color: 'brand' | 'prominent' | 'standard' | 'subtle' | 'extraSubtle' | 'disabled' | 'inverse' | 'white' | 'success' | 'failure' | 'admin';
  };
  disabled?: boolean;
}

export default function Button({ title, type='standard', size, onClick, action, icon, disabled }: ButtonProps) {

  const buttonActionHandler = useButtonAction({ action, onClick });

  const clickHandler = () => {
    if (disabled) return;
    buttonActionHandler();
  };

  const styleClass = () =>{
    switch(type){
      case 'standard':
        return styles.standard;
      case 'prominent':
        return styles.prominent;
      case 'destructive':
        return styles.destructive;
      case 'subtle':
        return styles.subtle;
      case 'inverse':
        return styles.inverse;
      case 'brand':
        return styles.brand;
      default:
        return styles.standard;
    }
  } 

  const sizeClass = () => {
    switch(size){
      case 'compact':
        return styles.compact;
      case 'default':
        return styles.default;
      case 'cta':
        return styles.cta;
      default:
        return styles.default;
    }
  }

  return (
    <div className={`${styles.Main} ${styleClass()} ${sizeClass()} ${disabled ? styles.disabled : ''}`} onClick={clickHandler}>
      <span>{title}</span>
      {icon &&
        <Icon icon={icon.type} size={icon.size} color={icon.color} />
      }
    </div>
  );
}

export const ButtonPropMeta = {
  title: { type: 'string', label: 'Title' },
  onClick: { type: 'function', label: 'onClick (not editable)' },
  action: { type: 'string', label: 'Action' },
  type: {
    type: 'select',
    label: 'Type',
    options: [
      'prominent',
      'standard',
      'destructive',
      'subtle',
      'brand',
    ],
  },
  size: {
    type: 'select',
    label: 'Size',
    options: [
      'compact',
      'cta',
      'default',
    ],
  },
  disabled: { type: 'boolean', label: 'Disabled' },
  icon: {
    type: 'object',
    label: 'Icon',
    options: [
      {
        type: 'none',
        label: 'No Icon',
        fields: {}
      },
      {
        type: 'withIcon',
        label: 'With Icon',
        fields: IconPropMeta
      }
    ]
  },
};


