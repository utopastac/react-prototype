import React from "react";
import styles from "./index.module.sass";

export interface TabProps {
  title: string;
  active?: boolean;
  onClick?: () => void;
}

const Tab: React.FC<TabProps> = ({ title, active = false, onClick }) => {
  return (
    <div 
      className={`${styles.Tab} ${active ? styles.active : ""}`}
      onClick={onClick}
    >
      {title}
    </div>
  );
};

export default Tab;

