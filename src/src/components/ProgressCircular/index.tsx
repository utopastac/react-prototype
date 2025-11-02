import React from 'react';
import Lottie from 'lottie-react';
import loaderAnimationLight from 'src/assets/loading/Loader_lightModeStandard_56px_v03.json';
import loaderAnimationDark from 'src/assets/loading/Loader_darkModeStandard_56px_v03.json';
import { useTheme, LIGHT, DARK } from 'src/containers/ThemeContext';
import styles from "./index.module.sass";

interface ProgressCircularProps {
  width?: number;
  height?: number;
  label?: string;
  className?: string;
  fullHeight?: boolean;
}

const ProgressCircular: React.FC<ProgressCircularProps> = ({
  width = 56,
  height = 56,
  label,
  className,
  fullHeight
}) => {

  const themeObject = useTheme();
  const theme = themeObject.theme;
  const animation = theme === LIGHT ? loaderAnimationLight : loaderAnimationDark;

  return (
    <div className={`${styles.Main} ${className || ''} ${fullHeight ? styles.fullHeight : ''}`}>
      <Lottie
        animationData={animation}
        loop={true}
        style={{ width, height, display: 'block' }}
      />
      { label && <p>{label}</p>}
    </div>
  );
};

export const ProgressCircularPropMeta = {
  width: { type: 'number', label: 'Width', default: 56 },
  height: { type: 'number', label: 'Height', default: 56 },
  fullHeight: { type: 'boolean', label: 'Fill screen' },
  label: { type: 'string', label: 'Label' },
};

export default ProgressCircular;