import React from "react";
import styles from "./index.module.sass";
//
export const DIVIDER_WITHIN_SECTION_SMALL = "DIVIDER_WITHIN_SECTION_SMALL";
export const DIVIDER_WITHIN_SECTION_MEDIUM = "DIVIDER_WITHIN_SECTION_MEDIUM";
export const DIVIDER_BETWEEN_SECTION_LARGE = "DIVIDER_BETWEEN_SECTION_LARGE";
export const DIVIDER_BETWEEN_SECTION_EXTRA_LARGE = "DIVIDER_BETWEEN_SECTION_EXTRA_LARGE";
export const DIVIDER_BETWEEN_SECTION_EXTRA_LARGE_CELL = "DIVIDER_BETWEEN_SECTION_EXTRA_LARGE_CELL";
//
export type DividerSize = 
  | typeof DIVIDER_WITHIN_SECTION_SMALL
  | typeof DIVIDER_WITHIN_SECTION_MEDIUM
  | typeof DIVIDER_BETWEEN_SECTION_LARGE
  | typeof DIVIDER_BETWEEN_SECTION_EXTRA_LARGE
  | typeof DIVIDER_BETWEEN_SECTION_EXTRA_LARGE_CELL;

export interface DividerProps {
  size: DividerSize;
  onBackground?: boolean;
}

const Divider: React.FC<DividerProps> = ({ size, onBackground }) => {
  const styleClass = (): string => {
    switch(size) {
      case DIVIDER_WITHIN_SECTION_SMALL:
        return styles.small;
      case DIVIDER_WITHIN_SECTION_MEDIUM:
        return styles.medium;
      case DIVIDER_BETWEEN_SECTION_LARGE:
        return styles.large;
      case DIVIDER_BETWEEN_SECTION_EXTRA_LARGE:
        return styles.extraLarge;
      case DIVIDER_BETWEEN_SECTION_EXTRA_LARGE_CELL:
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
      DIVIDER_BETWEEN_SECTION_EXTRA_LARGE_CELL,
      DIVIDER_BETWEEN_SECTION_EXTRA_LARGE,
      DIVIDER_BETWEEN_SECTION_LARGE,
      DIVIDER_WITHIN_SECTION_MEDIUM,
      DIVIDER_WITHIN_SECTION_SMALL,
    ],
  },
  onBackground: { type: 'boolean', label: 'On Background' },
};
