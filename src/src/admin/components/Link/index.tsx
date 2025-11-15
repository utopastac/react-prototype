import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useTransition, defaultTransition } from 'src/containers/TransitionContext';
import styles from "./index.module.sass";

export interface LinkProps {
  title: string;
  path?: string;
  description?: string;
  onClick?: () => void;
  isSelected?: boolean;
  size?: 'default' | 'large';
}

const Link: React.FC<LinkProps> = ({ title, path, description, onClick, isSelected, size = 'default' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setTransition } = useTransition();

  // Auto-detect selected state if path matches current location
  // Handle both regular paths and hash-based routing (HashRouter)
  const isActive = isSelected !== undefined 
    ? isSelected 
    : path ? (
        location.pathname === path || 
        location.hash === `#${path}` ||
        (location.pathname === '/' && location.hash === `#${path}`)
      ) : false;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (path) {
      setTransition(defaultTransition);
      Promise.resolve().then(() => navigate(path));
    }
  };

  return (
    <div className={`${styles.link} ${isActive ? styles.selected : ''} ${size === 'large' ? styles.large : ''}`} onClick={handleClick}>
      <div className={styles.Main}>
        <div className={styles.content}>
          <h4 className={styles.title}>{title}</h4>
          {description && <p className={styles.description}>{description}</p>}
        </div>
      </div>
    </div>
  );
};

export default Link; 