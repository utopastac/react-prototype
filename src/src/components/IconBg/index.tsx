import React from "react";
import styles from "./index.module.sass";
import Icon, { ICON_PROMINENT, ICON_SUBTLE, ICON_24, ICON_INVERSE, ICON_32, ICON_16, IconPropMeta } from "src/components/Icon";
import type { IconColor, IconSize } from "src/components/Icon";

export const ICON_BG_GRAY = "ICON_BG_GREY";
export const ICON_BG_BRAND = "ICON_BG_BRAND";
export const ICON_BG_ERROR = "ICON_BG_ERROR";
export const ICON_BG_CUSTOM = "ICON_BG_CUSTOM";
//
export const ICON_BG_64 = "ICON_BG_64";
export const ICON_BG_48 = "ICON_BG_48";

export type IconBgTheme = typeof ICON_BG_GRAY | typeof ICON_BG_BRAND | typeof ICON_BG_ERROR | typeof ICON_BG_CUSTOM;
export type IconBgSize = typeof ICON_BG_64 | typeof ICON_BG_48;

export interface IconBgProps {
  icon: string;
  theme: IconBgTheme;
  customColor?: string;
  iconSize?: IconSize;
  size?: IconBgSize;
}

const IconBg: React.FC<IconBgProps> = ({ icon, theme, customColor, iconSize, size }) => {
  let iconColor: IconColor = ICON_SUBTLE;

  const sizeClass = (): string => {
    switch(size){
      case ICON_BG_64:
        return styles.i_64;
      case ICON_BG_48:
        return styles.i_48;
      default:
        return styles.defaultSize;
    }
  }

  const styleClass = (): string => {
    switch(theme) {
      case ICON_BG_GRAY:
        return styles.default;
      case ICON_BG_BRAND:
        iconColor = ICON_INVERSE;
        return styles.branded;
      case ICON_BG_ERROR:
        iconColor = ICON_INVERSE;
        return styles.error;
      case ICON_BG_CUSTOM:
        iconColor = ICON_INVERSE;
        return styles.custom;
      default:
        return styles.default;
    }
  };

  return (
    <div 
      className={`${styles.Main} ${styleClass()} ${sizeClass()}`} 
      style={customColor ? { backgroundColor: customColor } : undefined}
    >
      <Icon icon={icon} color={iconColor} size={iconSize ?? ICON_24} />
    </div>
  );
};

export default IconBg;

export const IconBgPropMeta = {
  icon: IconPropMeta.icon,
  theme: {
    type: 'select',
    label: 'Theme',
    options: [ICON_BG_BRAND, ICON_BG_GRAY, ICON_BG_CUSTOM],
  },
  customColor: { type: 'string', label: 'Custom Color' },
  iconSize: IconPropMeta.size,
};
