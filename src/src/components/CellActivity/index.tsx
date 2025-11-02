import React from "react";
import { useButtonAction, ButtonAction } from 'src/hooks/useButtonAction';
import styles from "./index.module.sass";
import Avatar, { AvatarProps } from "src/components/Avatar";
import { AVATAR_64 } from "src/components/Avatar";
import IconBg, { IconBgProps }  from "src/components/IconBg";
import Button, { ButtonProps } from "src/components/Buttons/Button";
import { BUTTON_COMPACT_SIZE, BUTTON_PROMINENT } from "src/components/Buttons/Button";
import { AvatarPropMeta } from "src/components/Avatar";
import { IconBgPropMeta } from "src/components/IconBg";
import { ButtonPropMeta } from "src/components/Buttons/Button";

// Activity types
export const CELL_ACTIVITY_AVATAR = "CELL_ACTIVITY_AVATAR";
export const CELL_ACTIVITY_ICON_BG = "CELL_ACTIVITY_ICON_BG";
export const CELL_ACTIVITY_INFO = "CELL_ACTIVITY_INFO";
export const CELL_ACTIVITY_BUTTON = "CELL_ACTIVITY_BUTTON";

// Type definitions for the left element
export interface AvatarProps extends AvatarProps {
  type: typeof CELL_ACTIVITY_AVATAR;
}

export interface IconBgProps extends IconBgProps {
  type: typeof CELL_ACTIVITY_ICON_BG;
}

export type LeftElementProps = AvatarProps | IconBgProps;

// Type definitions for the right element
export interface CellButtonProps extends ButtonProps {
  type: typeof CELL_ACTIVITY_BUTTON;
}

export interface InfoProps {
  type: typeof CELL_ACTIVITY_INFO;
  title: string;
}

export type RightElementProps = CellButtonProps | InfoProps;

// Main component props
export interface CellActivityProps {
  title: string;
  body: string;
  action?: ButtonAction;
  date: string;
  left: LeftElementProps;
  right: RightElementProps;
  onClick: () => void;
}

const CellActivity: React.FC<CellActivityProps> = ({ 
  title, 
  body,
  action,
  date, 
  left, 
  right, 
  onClick 
}) => {

  const clickHandler = useButtonAction({ action, onClick });

  const leftElement = () => {
    switch(left.type){
      case CELL_ACTIVITY_AVATAR:
        return (
          <Avatar {...left} size={AVATAR_64} />
        );
      case CELL_ACTIVITY_ICON_BG:
        return (
          <IconBg {...left} />
        );
      default:
        return null;
    }
  }; 

  const rightElement = () => {
    switch(right.type){
      case CELL_ACTIVITY_BUTTON:
        return (
          <div className={styles.button}>
            <Button title={right.title} size={BUTTON_COMPACT_SIZE} type={BUTTON_PROMINENT} />
          </div>
        );
      case CELL_ACTIVITY_INFO:
        return (
          <h5>{right.title}</h5>
        );
      default:
        return null;
    }
  }; 

  return (
    <div className={`${styles.Main}`} onClick={clickHandler}>
      {leftElement()}
      <div className={`${styles.textContent} ${leftElement() ? styles.padding : ""}`}>
        <h5>{title}</h5>
        <p>{body}</p>
        <p>{date}</p>
      </div>
      {rightElement()}
    </div>
  );
};

export default CellActivity;

// Omit 'size' from AvatarPropMeta for use in cell activity fields
const { size: _avatarSize, ...AvatarPropMetaNoSize } = AvatarPropMeta;

export const CellActivityPropMeta = {
  title: { type: 'string', label: 'Title' },
  body: { type: 'string', label: 'Body' },
  action: { type: 'string', label: 'Action' },
  date: { type: 'string', label: 'Date' },
  left: {
    type: 'object',
    label: 'Left',
    options: [
      { label: 'Avatar', value: 'CELL_ACTIVITY_AVATAR', type: 'CELL_ACTIVITY_AVATAR', fields: AvatarPropMetaNoSize },
      { label: 'Icon with Background', value: 'CELL_ACTIVITY_ICON_BG', type: 'CELL_ACTIVITY_ICON_BG', fields: IconBgPropMeta },
    ],
  },
  right: {
    type: 'object',
    label: 'Right',
    options: [
      { label: 'Button', value: 'CELL_ACTIVITY_BUTTON', type: 'CELL_ACTIVITY_BUTTON', fields: ButtonPropMeta },
      { label: 'Info', value: 'CELL_ACTIVITY_INFO', type: 'CELL_ACTIVITY_INFO', fields: { title: { type: 'string', label: 'Title' } } },
    ],
  },
  onClick: { type: 'function', label: 'onClick (not editable)' },
};
