import React from "react";
import styles from "./index.module.sass";
import * as Logos from "src/data/Logos";
import { useTheme } from "src/containers/ThemeContext";
import { LIGHT } from "src/containers/ThemeContext";

export interface LogoProps {
  type: 'In' | 'Logo';
  size: 4 | 5 | 6 | 7 | 8 | 9;
  className?: string;
  forceTheme?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ type, size, className, forceTheme }) => {
  const { theme } = useTheme();
  // Use forceTheme if provided, otherwise use theme from context
  const effectiveTheme = forceTheme || theme;
  const themeKey = effectiveTheme === LIGHT ? 'Light' : 'Dark';
  const sizeKey = `Size${size}` as keyof typeof Logos.In.Light;

  // Validate size for type
  if (type === 'In' && ![4, 5, 6].includes(size)) {
    console.warn(`Invalid size ${size} for type "In". Valid sizes are 4, 5, 6.`);
    return null;
  }
  if (type === 'Logo' && ![7, 8, 9].includes(size)) {
    console.warn(`Invalid size ${size} for type "Logo". Valid sizes are 7, 8, 9.`);
    return null;
  }

  // Get the appropriate logo based on type and theme
  const logoSrc = type === 'In' 
    ? (Logos.In[themeKey] as any)[sizeKey]
    : (Logos.Logo[themeKey] as any)[sizeKey];

  if (!logoSrc) {
    console.warn(`Logo not found for type: ${type}, size: ${size}, theme: ${themeKey}`);
    return null;
  }

  // Convert logo to string if it's an imported SVG module
  const logoUrl = typeof logoSrc === 'string' ? logoSrc : (logoSrc as any)?.default || String(logoSrc);

  return (
    <div className={[styles.Main, className].filter(Boolean).join(' ')}>
      <img 
        src={logoUrl} 
        alt={`${type} logo`}
        className={styles.logo}
      />
    </div>
  );
};

export default Logo;

export const LogoPropMeta = {
  type: {
    type: 'select',
    label: 'Type',
    options: ['In', 'Logo']
  },
  size: {
    type: 'select',
    label: 'Size',
    options: [4, 5, 6, 7, 8, 9]
  },
  forceTheme: {
    type: 'select',
    label: 'Force Theme',
    options: ['light', 'dark']
  },
  className: { type: 'string', label: 'CSS Class' }
};

