import React from "react";
import { useButtonAction, ButtonAction } from 'src/hooks/useButtonAction';
import styles from "./index.module.sass";
import Avatar, { AvatarProps } from "src/components/Avatar";
import IconBg, { IconBgProps }  from "src/components/IconBg";
import Button, { ButtonProps } from "src/components/Buttons/Button";
import { AvatarPropMeta } from "src/components/Avatar";
import { IconBgPropMeta } from "src/components/IconBg";
import { ButtonPropMeta } from "src/components/Buttons/Button";

// Type definitions for the left element
export interface CellActivityAvatarProps extends AvatarProps {
  type: 'avatar';
}

export interface CellActivityIconBgProps extends IconBgProps {
  type: 'iconBg';
}

export type LeftElementProps = CellActivityAvatarProps | CellActivityIconBgProps;

// Type definitions for the right element
export interface CellButtonProps extends ButtonProps {
  type: 'button';
}

export interface InfoProps {
  type: 'info';
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
      case 'avatar':
        return (
          <Avatar {...left} size="64" />
        );
      case 'iconBg':
        return (
          <IconBg {...left} />
        );
      default:
        return null;
    }
  }; 

  const rightElement = () => {
    switch(right.type){
      case 'button':
        return (
          <div className={styles.button}>
            <Button title={right.title} size="small" type="primary" />
          </div>
        );
      case 'info':
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
      { label: 'Avatar', value: 'avatar', type: 'avatar', fields: AvatarPropMetaNoSize },
      { label: 'Icon with Background', value: 'iconBg', type: 'iconBg', fields: IconBgPropMeta },
    ],
  },
  right: {
    type: 'object',
    label: 'Right',
    options: [
      { label: 'Button', value: 'button', type: 'button', fields: ButtonPropMeta },
      { label: 'Info', value: 'info', type: 'info', fields: { title: { type: 'string', label: 'Title' } } },
    ],
  },
  onClick: { type: 'function', label: 'onClick (not editable)' },
};
