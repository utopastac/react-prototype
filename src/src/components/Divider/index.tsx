import React from "react";
import styles from "./index.module.sass";
//

export interface DividerProps {
  size: 'small' | 'medium' | 'large' | 'extraLarge';
  showLine?: boolean;
  onBackground?: boolean;
}

const Divider: React.FC<DividerProps> = ({ size, showLine = false, onBackground }) => {
  const styleClass = (): string => {
    switch(size) {
      case 'small':
        return styles.small;
      case 'medium':
        return styles.medium;
      case 'large':
        return styles.large;
      case 'extraLarge':
        return styles.extraLarge;
      default:
        return styles.small;
    }
  };

  return (
    <div className={`${styles.Main} ${styleClass()} ${onBackground ? styles.onBackground : ""} ${!showLine ? styles.noLine : ""}`}>
    </div>
  );
};

export default Divider;

export const DividerPropMeta = {
  size: {
    type: 'select',
    label: 'Size',
    options: [
      'small',
      'medium',
      'large',
      'extraLarge',
    ],
  },
  showLine: { type: 'boolean', label: 'Show Line' },
  onBackground: { type: 'boolean', label: 'On Background' },
};
