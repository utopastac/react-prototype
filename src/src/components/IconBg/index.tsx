import React from "react";
import styles from "./index.module.sass";
import Icon, { IconPropMeta } from "src/components/Icon";

export interface IconBgProps {
  icon: string;
  theme: 'grey' | 'brand' | 'error' | 'custom';
  customColor?: string;
  iconSize?: '32' | '24' | '16';
  size?: '64' | '48';
}

const IconBg: React.FC<IconBgProps> = ({ icon, theme, customColor, iconSize, size }) => {
  let iconColor: 'brand' | 'prominent' | 'standard' | 'subtle' | 'extraSubtle' | 'disabled' | 'inverse' | 'white' | 'success' | 'failure' | 'admin' = 'subtle';

  const sizeClass = (): string => {
    switch(size){
      case '64':
        return styles.i_64;
      case '48':
        return styles.i_48;
      default:
        return styles.defaultSize;
    }
  }

  const styleClass = (): string => {
    switch(theme) {
      case 'grey':
        return styles.default;
      case 'brand':
        iconColor = 'inverse';
        return styles.branded;
      case 'error':
        iconColor = 'inverse';
        return styles.error;
      case 'custom':
        iconColor = 'inverse';
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
      <Icon icon={icon} color={iconColor} size={iconSize ?? '24'} />
    </div>
  );
};

export default IconBg;

export const IconBgPropMeta = {
  icon: IconPropMeta.icon,
  theme: {
    type: 'select',
    label: 'Theme',
    options: ['brand', 'grey', 'custom'],
  },
  customColor: { type: 'string', label: 'Custom Color' },
  iconSize: IconPropMeta.size,
};
