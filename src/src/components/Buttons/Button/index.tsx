import React from "react";
import Icon, { IconSize, IconColor, ICON_16, ICON_24, ICON_32, ICON_BRAND, ICON_PROMINENT, ICON_STANDARD, ICON_SUBTLE, ICON_DISABLED, ICON_INVERSE, ICON_WHITE, ICON_SUCCESS, ICON_FAILURE, IconPropMeta } from "src/components/Icon";
import styles from "./index.module.sass";
import { useButtonAction, ButtonAction } from 'src/hooks/useButtonAction';
//
export const BUTTON_STANDARD = "BUTTON_STANDARD";
export const BUTTON_PROMINENT = "BUTTON_PROMINENT";
export const BUTTON_DESTRUCTIVE = "BUTTON_DESTRUCTIVE";
export const BUTTON_SUBTLE = "BUTTON_SUBTLE";
export const BUTTON_INVERSE = "BUTTON_INVERSE";
export const BUTTON_BRAND = "BUTTON_BRAND";
//
export const BUTTON_COMPACT_SIZE = "BUTTON_COMPACT_SIZE";
export const BUTTON_DEFAULT_SIZE = "BUTTON_DEFAULT_SIZE";
export const BUTTON_CTA_SIZE = "BUTTON_CTA_SIZE";
//

export interface ButtonProps {
  title: string;
  onClick?: () => void;
  action?: ButtonAction;
  type?: string;
  size?: string;
  icon?: {
    type: string;
    size: IconSize;
    color: IconColor;
  };
  disabled?: boolean;
}

export default function Button({ title, type=BUTTON_STANDARD, size, onClick, action, icon, disabled }: ButtonProps) {

  const buttonActionHandler = useButtonAction({ action, onClick });

  const clickHandler = () => {
    if (disabled) return;
    buttonActionHandler();
  };

  const styleClass = () =>{
    switch(type){
      case BUTTON_STANDARD:
        return styles.standard;
      case BUTTON_PROMINENT:
        return styles.prominent;
      case BUTTON_DESTRUCTIVE:
        return styles.destructive;
      case BUTTON_SUBTLE:
        return styles.subtle;
      case BUTTON_INVERSE:
        return styles.inverse;
      case BUTTON_BRAND:
        return styles.brand;
      default:
        return styles.standard;
    }
  } 

  const sizeClass = () => {
    switch(size){
      case BUTTON_COMPACT_SIZE:
        return styles.compact;
      case BUTTON_DEFAULT_SIZE:
        return styles.default;
      case BUTTON_CTA_SIZE:
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
      BUTTON_PROMINENT,
      BUTTON_STANDARD,
      BUTTON_DESTRUCTIVE,
      BUTTON_SUBTLE,
      BUTTON_BRAND,
    ],
  },
  size: {
    type: 'select',
    label: 'Size',
    options: [
      BUTTON_COMPACT_SIZE,
      BUTTON_CTA_SIZE,
      BUTTON_DEFAULT_SIZE,
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


