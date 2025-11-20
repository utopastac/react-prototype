import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.sass";
import Icon, { IconPropMeta } from "src/components/Icon";
import Logo, { LogoPropMeta } from "src/components/Logo";
import * as Icons from "src/data/Icons";
import { useTransition, slideInLeft } from "src/containers/TransitionContext";

export interface TopBarButton {
  onClick?: () => void;
  icon?: string;
}

export interface TopBarLogo {
  type: 'In' | 'Logo';
  size: 4 | 5 | 6 | 7 | 8 | 9;
  forceTheme?: 'light' | 'dark';
}

export interface TopBarProps {
  title?: string;
  left?: TopBarButton;
  leftLogo?: TopBarLogo;
  right?: TopBarButton;
  inverse?: boolean;
  transparent?: boolean;
  isBackNavigation?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ title, left, leftLogo, right, inverse, transparent, isBackNavigation }) => {
  const navigate = useNavigate();
  const { currentTransition, setTransition } = useTransition();

  const handleLeftClick = () => {
    if (isBackNavigation) {
      const previousTransition = currentTransition;
      setTransition(slideInLeft);
      navigate(-1);
      setTimeout(() => {
        setTransition(previousTransition);
      }, 300); // Typical transition duration
    } else if (left?.onClick) {
      left.onClick();
    }
  };

  return (
    <div className={`${styles.Main} ${inverse ? styles.inverse : ""} ${transparent && styles.transparent}`}>
      <div className={styles.left} onClick={handleLeftClick}>
        {leftLogo ? (
          <Logo 
            type={leftLogo.type}
            size={leftLogo.size}
            forceTheme={leftLogo.forceTheme}
          />
        ) : (
          <Icon 
            icon={isBackNavigation ? Icons.Back : (left?.icon || Icons.Back)} 
            size="24"
            color={inverse ? "inverse" : "prominent"}
          />
        )}
      </div>
      {title && <div className={styles.title}><h4>{title}</h4></div> }
      <div className={styles.right}>
        {right?.icon && (
          <Icon 
            icon={right.icon} 
            size="24"
            color="prominent"
          />
        )}
      </div>
    </div>
  );
};

export default TopBar;

// Add prop meta for admin panel editing
export const TopBarPropMeta = {
  title: { type: 'string', label: 'Title' },
  inverse: { type: 'boolean', label: 'Inverse' },
  transparent: { type: 'boolean', label: 'Transparent bg' },
  // isBackNavigation: { type: 'boolean', label: 'Back Navigation' },
  left: {
    type: 'object',
    label: 'Left Button',
    fields: {
      icon: {
        ...IconPropMeta.icon,
        label: 'Left action',
        options: [Icons.Close, Icons.Back]
      }
    }
  },
  leftLogo: {
    type: 'object',
    label: 'Left Logo',
    fields: {
      type: {
        ...LogoPropMeta.type,
        label: 'Logo Type'
      },
      size: {
        ...LogoPropMeta.size,
        label: 'Logo Size'
      },
      forceTheme: {
        ...LogoPropMeta.forceTheme,
        label: 'Force Theme'
      }
    }
  },
  right: {
    type: 'object',
    label: 'Right Button',
    fields: {
      icon: {...IconPropMeta.icon, label: 'Right icon'}
    }
  }
};
