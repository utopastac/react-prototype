import React from "react";
import styles from "./index.module.sass";
import * as Icons from "src/data/Icons";

export type IconSize = typeof ICON_32 | typeof ICON_24 | typeof ICON_16;
export type IconColor = 
  | typeof ICON_BRAND 
  | typeof ICON_PROMINENT 
  | typeof ICON_STANDARD 
  | typeof ICON_SUBTLE 
  | typeof ICON_EXTRA_SUBTLE
  | typeof ICON_DISABLED 
  | typeof ICON_INVERSE 
  | typeof ICON_WHITE 
  | typeof ICON_SUCCESS 
  | typeof ICON_FAILURE
  | typeof ICON_ADMIN;

export const ICON_32 = "ICON_32";
export const ICON_24 = "ICON_24";
export const ICON_16 = "ICON_16";

export const ICON_BRAND = "ICON_BRAND";
export const ICON_PROMINENT = "ICON_PROMINENT";
export const ICON_STANDARD = "ICON_STANDARD";
export const ICON_SUBTLE = "ICON_SUBTLE";
export const ICON_EXTRA_SUBTLE = "ICON_EXTRA_SUBTLE";
export const ICON_DISABLED = "ICON_DISABLED";
export const ICON_INVERSE = "ICON_INVERSE";
export const ICON_WHITE = "ICON_WHITE";
export const ICON_SUCCESS = "ICON_SUCCESS";
export const ICON_FAILURE = "ICON_FAILURE";
export const ICON_ADMIN = "ICON_ADMIN";

export interface IconProps {
  icon: string | (typeof Icons)[keyof typeof Icons];
  size: IconSize;
  color: IconColor;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ icon, size, color, className }) => {

  const styleClass = () =>{
    switch(size){
      case ICON_32:
        return styles.i_32;
      case ICON_24:
        return styles.i_24;
      case ICON_16:
        return styles.i_16;
      default:
        return styles.i_24;
    }
  } 

  const colorClass = () =>{
    switch(color){
      case ICON_BRAND:
        return styles.brand;
      case ICON_PROMINENT:
        return styles.prominent;
      case ICON_SUBTLE:
        return styles.subtle;
      case ICON_EXTRA_SUBTLE:
        return styles.extraSubtle;
      case ICON_INVERSE:
        return styles.inverse;
      case ICON_DISABLED:
        return styles.disabled;
      case ICON_WHITE:
        return styles.white;
      case ICON_SUCCESS:
        return styles.success;
      case ICON_FAILURE:
        return styles.failure;
      case ICON_ADMIN:
        return styles.admin;
      default:
        return styles.default;
    }
  } 

  // Ensure the icon URL is properly formatted for mask images
  const getIconUrl = () => {
    if (!icon) return '';
    // If it's already a full URL, use it as is
    if (icon.startsWith('http') || icon.startsWith('data:')) {
      return icon;
    }
    // If it's a relative path, ensure it starts with /
    if (icon.startsWith('/')) {
      return icon;
    }
    // Otherwise, assume it's a Vite-processed URL
    return icon;
  };

  return (
    <div
      className={[
        styles.Main,
        styleClass(),
        colorClass()
      ].filter(Boolean).join(' ')}
    >
      <div 
        className={[styles.icon, className].filter(Boolean).join(' ')} 
        style={{
          maskImage: `url("${getIconUrl()}")`,
          WebkitMaskImage: `url("${getIconUrl()}")`
        }} 
      />
    </div>
  );
};

export default Icon;

export const IconPropMeta = {
  icon: {
    type: 'select',
    label: 'Icon',
    options: Object.values(Icons)
  },
  size: {
    type: 'select',
    label: 'Size',
    options: [ICON_16, ICON_24, ICON_32]
  },
  color: {
    type: 'select',
    label: 'Color',
    options: [
      ICON_BRAND, ICON_PROMINENT, ICON_STANDARD, ICON_SUBTLE, ICON_EXTRA_SUBTLE,
      ICON_DISABLED, ICON_INVERSE, ICON_WHITE, ICON_SUCCESS, ICON_FAILURE
    ]
  },
  className: { type: 'string', label: 'CSS Class' }
};
