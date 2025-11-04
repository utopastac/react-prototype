import React from "react";
import styles from "./index.module.sass";
//

export interface DividerProps {
  size: 'withinSectionSmall' | 'withinSectionMedium' | 'betweenSectionLarge' | 'betweenSectionExtraLarge' | 'betweenSectionExtraLargeCell';
  onBackground?: boolean;
}

const Divider: React.FC<DividerProps> = ({ size, onBackground }) => {
  const styleClass = (): string => {
    switch(size) {
      case 'withinSectionSmall':
        return styles.small;
      case 'withinSectionMedium':
        return styles.medium;
      case 'betweenSectionLarge':
        return styles.large;
      case 'betweenSectionExtraLarge':
        return styles.extraLarge;
      case 'betweenSectionExtraLargeCell':
        return styles.extraLargeCell;
      default:
        return styles.small;
    }
  };

  return (
    <div className={`${styles.Main} ${styleClass()} ${onBackground ? styles.onBackground : ""}`}>
    </div>
  );
};

export default Divider;

export const DividerPropMeta = {
  size: {
    type: 'select',
    label: 'Size',
    options: [
      'betweenSectionExtraLargeCell',
      'betweenSectionExtraLarge',
      'betweenSectionLarge',
      'withinSectionMedium',
      'withinSectionSmall',
    ],
  },
  onBackground: { type: 'boolean', label: 'On Background' },
};
