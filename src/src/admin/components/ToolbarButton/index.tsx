import React from 'react';
import styles from './index.module.sass';
import Icon, { ICON_24, ICON_STANDARD, ICON_INVERSE, IconSize, IconColor } from 'src/components/Icon';

interface ToolbarButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
  title?: string;
  className?: string;
  position?: string
  icon: any; // Accepts an icon definition (e.g. Icons.Download16)
  disabled?: boolean;
  iconSize?: IconSize;
  iconColor?: IconColor;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ onClick, onMouseDown, title, className, icon, position='right', disabled, iconSize = ICON_24, iconColor = ICON_STANDARD }) => {
  return (
    <button
      className={[styles.ToolbarButton, className, iconColor===ICON_INVERSE ? styles.inverse : ''].filter(Boolean).join(' ')}
      onClick={onClick}
      onMouseDown={onMouseDown}
      title={title}
      data-label={title}
      data-position={position}
      type="button"
      disabled={disabled}
    >
      <Icon icon={icon} size={iconSize} color={iconColor} />
    </button>
  );
};

export default ToolbarButton; 