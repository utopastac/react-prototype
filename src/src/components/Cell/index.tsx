import React from "react";
import { useButtonAction, ButtonAction } from 'src/hooks/useButtonAction';
import styles from "./index.module.sass";
import Avatar, { AVATAR_64, AvatarProps } from "src/components/Avatar";
import AvatarStackedDiagonal, { AVATAR_STACKED_DIAGONAL_64, AvatarStackedDiagonalProps } from "src/components/AvatarStackedDiagonal";
import Icon, { ICON_24, ICON_STANDARD, ICON_DISABLED, ICON_SUBTLE, IconSize, IconColor, IconProps } from "src/components/Icon";
import * as Icons from "src/data/Icons";
import IconBg, { IconBgProps, ICON_BG_64, IconBgTheme } from "src/components/IconBg";
import Button, { ButtonProps } from "src/components/Buttons/Button";
import { BUTTON_COMPACT_SIZE } from "src/components/Buttons/Button";
import Radio, { RadioProps } from "src/components/Radio";
import Checkbox, { CheckboxProps } from "src/components/Checkbox";
import Toggle, { ToggleProps } from "src/components/Toggle";
import { AvatarPropMeta } from "src/components/Avatar";
import { AvatarStackedDiagonalPropMeta } from "src/components/AvatarStackedDiagonal";
import { IconPropMeta } from "src/components/Icon";
import { IconBgPropMeta } from "src/components/IconBg";
//
// Omit 'size' from AvatarPropMeta for use in cell fields
const { size: _avatarSize, ...AvatarPropMetaNoSize } = AvatarPropMeta;
//
export const CELL_AVATAR = "CELL_AVATAR";
export const CELL_AVATAR_STACKED = "CELL_AVATAR_STACKED";
export const CELL_ICON = "CELL_ICON";
export const CELL_ICON_BG = "CELL_ICON_BG";
export const CELL_NONE = "CELL_NONE";
//
export const CELL_PUSH = "CELL_PUSH";
export const CELL_RADIO = "CELL_RADIO";
export const CELL_CHECKBOX = "CELL_CHECKBOX";
export const CELL_BUTTON = "CELL_BUTTON";
export const CELL_TOGGLE = "CELL_TOGGLE";
export const CELL_LABEL_PUSH = "CELL_LABEL_PUSH";
//
// Base cell interface
interface BaseCell {
  type: string;
  search?: boolean;
  disabled?: boolean;
}

// Left cell interfaces
interface AvatarCell extends BaseCell, AvatarProps {
  type: typeof CELL_AVATAR;
}

interface AvatarStackedCell extends BaseCell, AvatarStackedDiagonalProps {
  type: typeof CELL_AVATAR_STACKED;
}

interface IconCell extends BaseCell, IconProps {
  type: typeof CELL_ICON;
}

interface IconBgCell extends BaseCell, IconBgProps {
  type: typeof CELL_ICON_BG;
}

interface NoneCell extends BaseCell {
  type: typeof CELL_NONE;
}

// Right cell interfaces
interface PushCell extends BaseCell {
  type: typeof CELL_PUSH;
}

interface ButtonCell extends BaseCell {
  type: typeof CELL_BUTTON;
  title: string;
  props?: Omit<ButtonProps, 'title'>;
}

interface RadioCell extends BaseCell, RadioProps {
  type: typeof CELL_RADIO;
}

interface CheckboxCell extends BaseCell, CheckboxProps {
  type: typeof CELL_CHECKBOX;
  checked: boolean;
}

interface ToggleCell extends BaseCell, ToggleProps {
  type: typeof CELL_TOGGLE;
  checked: boolean;
}

interface LabelPushCell extends BaseCell {
  type: typeof CELL_LABEL_PUSH;
  title: string;
}

// Union types for left and right cells
export type LeftCell = AvatarCell | AvatarStackedCell | IconCell | IconBgCell | NoneCell;
export type RightCell = PushCell | ButtonCell | RadioCell | CheckboxCell | ToggleCell | LabelPushCell | NoneCell;

export interface CellProps {
  title: string;
  body?: string;
  action?: ButtonAction;
  left?: LeftCell;
  right?: RightCell;
  onClick?: () => void;
  search?: boolean;
}

const Cell: React.FC<CellProps> = ({ title, body, action, left, right, onClick, search, disabled }) => {

  const clickHandler = useButtonAction({ action, onClick });

  const leftElement = () => {
    if (!left) return null;
    
    switch (left.type) {
      case CELL_AVATAR:
        return <Avatar {...(left as AvatarCell)} size={AVATAR_64} />;
      case CELL_AVATAR_STACKED:
        return <AvatarStackedDiagonal {...(left as AvatarStackedCell)} size={AVATAR_STACKED_DIAGONAL_64} />;
      case CELL_ICON:
        const iconCell = left as IconCell;
        return <Icon icon={iconCell.icon} size={ICON_24} color={disabled ? ICON_DISABLED : iconCell.color || ICON_STANDARD} />;
      case CELL_ICON_BG:
        const iconBgCell = left as IconBgCell;
        return <IconBg icon={iconBgCell.icon} theme={iconBgCell.theme} customColor={iconBgCell.customColor} iconSize={iconBgCell.iconSize} size={ICON_BG_64} />;
      case CELL_NONE:
        return null;
      default:
        return null;
    }
  };

  const rightElement = () => {
    if (!right) return null;
    
    switch (right.type) {
      case CELL_PUSH:
        return (
          <div className={styles.push}>
            <Icon icon={Icons.Push} size={ICON_24} color={ICON_STANDARD} />
          </div>
        );
      case CELL_BUTTON:
        const buttonCell = right as ButtonCell;
        return <Button title={buttonCell.title} size={BUTTON_COMPACT_SIZE} {...buttonCell.props} />;
      case CELL_RADIO:
        const radioCell = right as RadioCell;
        return <Radio checked={radioCell.checked} />;
      case CELL_CHECKBOX:
        const checkboxCell = right as CheckboxCell;
        return <Checkbox checked={checkboxCell.checked} />;
      case CELL_TOGGLE:
        const toggleCell = right as ToggleCell;
        return <Toggle checked={toggleCell.checked} />;
      case CELL_LABEL_PUSH:
        const labelPushCell = right as LabelPushCell;
        return (
          <div className={styles.labelPush}>
            <p>{labelPushCell.title}</p>
            <Icon icon={Icons.Push} size={ICON_24} color={ICON_STANDARD} />
          </div>
        );
      case CELL_NONE:
        return null;
      default:
        return null;
    }
  };

  const centerAlign = left && left.type === CELL_ICON_BG && !body;

  return (
    <div
      className={`${styles.Main} ${ search ? styles.search : ''} ${ disabled ? styles.disabled : ''} ${ centerAlign ? styles.centerAlign : ''}`}
      onClick={onClick || action ? clickHandler : undefined}
      style={onClick || action ? {cursor: "pointer"} : {}}
    >
      {leftElement()}
      <div className={styles.content}>
        <div className={`${styles.textContent} ${leftElement() ? styles.padding : ""}`}>
          <h5>{title}</h5>
          {body && <p>{body}</p>}
        </div>
        { !disabled && rightElement() }
      </div>
    </div>
  );
};

export default Cell;

export const CellPropMeta = {
  title: { type: 'string', label: 'Title' },
  body: { type: 'string', label: 'Body' },
  action: { type: 'string', label: 'Action' },
  left: {
    type: 'object',
    label: 'Left',
    options: [
      { label: 'None', value: 'CELL_NONE', type: 'CELL_NONE' },
      { label: 'Avatar', value: 'CELL_AVATAR', type: 'CELL_AVATAR', fields: AvatarPropMetaNoSize },
      { label: 'Avatar Stacked', value: 'CELL_AVATAR_STACKED', type: 'CELL_AVATAR_STACKED', fields: AvatarStackedDiagonalPropMeta },
      { label: 'Icon', value: 'CELL_ICON', type: 'CELL_ICON', fields: IconPropMeta },
      { label: 'Icon with Background', value: 'CELL_ICON_BG', type: 'CELL_ICON_BG', fields: IconBgPropMeta },
    ],
  },
  right: {
    type: 'object',
    label: 'Right',
    options: [
      { label: 'None', value: 'CELL_NONE', type: 'CELL_NONE' },
      { label: 'Push', value: 'CELL_PUSH', type: 'CELL_PUSH' },
      { label: 'Button', value: 'CELL_BUTTON', type: 'CELL_BUTTON', fields: { title: { type: 'string', label: 'Title' } } },
      { label: 'Radio', value: 'CELL_RADIO', type: 'CELL_RADIO', fields: { checked: { type: 'boolean', label: 'Checked' } } },
      { label: 'Checkbox', value: 'CELL_CHECKBOX', type: 'CELL_CHECKBOX', fields: { checked: { type: 'boolean', label: 'Checked' } } },
      { label: 'Toggle', value: 'CELL_TOGGLE', type: 'CELL_TOGGLE', fields: { checked: { type: 'boolean', label: 'Checked' } } },
      { label: 'Label Push', value: 'CELL_LABEL_PUSH', type: 'CELL_LABEL_PUSH', fields: { title: { type: 'string', label: 'Title' } } },
    ],
  },
  onClick: { type: 'function', label: 'onClick (not editable)' },
  search: { type: 'boolean', label: 'Search' },
  disabled: { type: 'boolean', label: 'Disabled' },
};
