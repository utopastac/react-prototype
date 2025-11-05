import React from "react";
import styles from "./index.module.sass";
import * as Icons from "src/data/Icons";

export interface IconProps {
  icon: string | (typeof Icons)[keyof typeof Icons];
  size: '32' | '24' | '16';
  color: 'brand' | 'prominent' | 'standard' | 'subtle' | 'extraSubtle' | 'disabled' | 'inverse' | 'white' | 'success' | 'failure' | 'admin';
  className?: string;
}

const Icon: React.FC<IconProps> = ({ icon, size, color, className }) => {

  const styleClass = () =>{
    switch(size){
      case '32':
        return styles.i_32;
      case '24':
        return styles.i_24;
      case '16':
        return styles.i_16;
      default:
        return styles.i_24;
    }
  } 

  const colorClass = () =>{
    switch(color){
      case 'brand':
        return styles.brand;
      case 'prominent':
        return styles.prominent;
      case 'subtle':
        return styles.subtle;
      case 'extraSubtle':
        return styles.extraSubtle;
      case 'inverse':
        return styles.inverse;
      case 'disabled':
        return styles.disabled;
      case 'white':
        return styles.white;
      case 'success':
        return styles.success;
      case 'failure':
        return styles.failure;
      case 'admin':
        return styles.admin;
      default:
        return styles.default;
    }
  } 

  // Ensure the icon URL is properly formatted for mask images
  const getIconUrl = () => {
    if (!icon) return '';
    
    // Convert icon to string if it's not already (handles imported SVG modules)
    const iconUrl = typeof icon === 'string' ? icon : (icon as any)?.default || String(icon);
    
    // If it's already a full URL, use it as is
    if (iconUrl.startsWith('http') || iconUrl.startsWith('data:')) {
      return iconUrl;
    }
    // If it's a relative path, ensure it starts with /
    if (iconUrl.startsWith('/')) {
      return iconUrl;
    }
    // Otherwise, assume it's a Vite-processed URL
    return iconUrl;
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
    options: ['16', '24', '32']
  },
  color: {
    type: 'select',
    label: 'Color',
    options: [
      'brand', 'prominent', 'standard', 'subtle', 'extraSubtle',
      'disabled', 'inverse', 'white', 'success', 'failure'
    ]
  },
  className: { type: 'string', label: 'CSS Class' }
};
