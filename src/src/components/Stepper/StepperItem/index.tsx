import React from "react";
import styles from "./index.module.sass";
import { System } from "src/data/AllIcons";
import Icon from "src/components/Icon";

export interface StepperItemProps {
  state: 'checked' | 'current' | 'future';
  size?: 'large' | 'small';
  title?: string;
  children?: React.ReactNode;
}

const StepperItem: React.FC<StepperItemProps> = ({ state, size = 'large', title, children }) => {

  const displayTitle = title || 'Step';

  const stateClass = () => {
    switch (state) {
      case 'checked':
        return styles.checked;
      case 'current':
        return styles.current;
      case 'future':
        return styles.future;
      default:
        return '';
    }
  };

  const sizeClass = () => {
    return size === 'small' ? styles.small : styles.large;
  };

  const renderIcon = () => {
    if (state === 'checked') {
      if (size === 'large') {
        return (
          <div className={styles.iconCircle}>
            <Icon icon={System.SignalSuccessSmall} size="16" color="success" />
          </div>
        );
      } else {
        return <div className={styles.iconDot}></div>;
      }
    } else if (state === 'current') {
      if (size === 'large') {
        return <div className={styles.iconCircleOutline}></div>;
      } else {
        return <div className={styles.iconDotCurrent}></div>;
      }
    } else {
      // future
      if (size === 'large') {
        return <div className={styles.iconCircleOutlineFuture}></div>;
      } else {
        return <div className={styles.iconDotFuture}></div>;
      }
    }
  };

  return (
    <div className={`${styles.Main} ${stateClass()} ${sizeClass()}`}>
      <div className={styles.indicator}>
        <div className={styles.iconContainer}>
          {renderIcon()}
        </div>
        <div className={styles.connector}></div>
      </div>
      <div className={styles.content}>
        <p className={styles.title}>{displayTitle}</p>
        {children || <p className={styles.defaultText}>Add details</p>}
      </div>
    </div>
  );
};

export const StepperItemPropMeta = {
  state: {
    type: 'select',
    label: 'State',
    options: [
      'checked',
      'current',
      'future',
    ],
  },
  size: {
    type: 'select',
    label: 'Size',
    options: [
      'large',
      'small',
    ],
  },
  title: {
    type: 'string',
    label: 'Title'
  },
};

export default StepperItem;

