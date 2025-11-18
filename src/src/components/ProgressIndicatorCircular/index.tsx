import React from 'react';
import styles from "./index.module.sass";

interface ProgressIndicatorCircularProps {
  width?: number;
  height?: number;
  label?: string;
  className?: string;
  fullHeight?: boolean;
}

const ProgressIndicatorCircular: React.FC<ProgressIndicatorCircularProps> = ({
  width = 56,
  height = 56,
  label,
  className,
  fullHeight
}) => {
  return (
    <div className={`${styles.Main} ${className || ''} ${fullHeight ? styles.fullHeight : ''}`}>
      <div 
        className={styles.spinner}
        style={{ width: `${width}px`, height: `${height}px` }}
      />
      { label && <p>{label}</p>}
    </div>
  );
};

export const ProgressIndicatorCircularPropMeta = {
  width: { type: 'number', label: 'Width', default: 56 },
  height: { type: 'number', label: 'Height', default: 56 },
  fullHeight: { type: 'boolean', label: 'Fill screen' },
  label: { type: 'string', label: 'Label' },
};

export default ProgressIndicatorCircular;

