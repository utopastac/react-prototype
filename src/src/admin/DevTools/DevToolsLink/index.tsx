import React from "react";
import { useNavigate } from 'react-router-dom';
import { useTransition, defaultTransition } from 'src/containers/TransitionContext';
import styles from "./index.module.sass";

export interface DevToolsLinkProps {
  title: string;
  path: string;
  description: string;
}

const DevToolsLink: React.FC<DevToolsLinkProps> = ({ title, path, description }) => {
  const navigate = useNavigate();
  const { setTransition } = useTransition();

  const handleNavigation = () => {
    setTransition(defaultTransition);
    Promise.resolve().then(() => navigate(path));
  };

  return (
    <div to={path} className={styles.link} onClick={handleNavigation}>
      <div className={styles.Main}>
        <div className={styles.content}>
          <h4 className={styles.title}>{title}</h4>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default DevToolsLink; 