import React from "react";
import styles from "./index.module.sass";
import Icon, { IconProps } from "src/components/Icon";

export interface MenuItemProps {
  title: string;
  icon?: IconProps;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ title, icon, onClick }) => {
  return (
    <div 
      className={`${styles.Main} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
    >
      {icon && (
        <div className={styles.iconWrapper}>
          <Icon {...icon} />
        </div>
      )}
      <span className={styles.title}>{title}</span>
    </div>
  );
};

export default MenuItem;

export const MenuItemPropMeta = {
  title: { type: 'string', label: 'Title' },
  icon: { type: 'object', label: 'Icon' },
  onClick: { type: 'function', label: 'On Click' },
};

