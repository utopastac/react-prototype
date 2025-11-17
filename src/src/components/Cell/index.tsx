import React from "react";
import { useButtonAction, ButtonAction } from 'src/hooks/useButtonAction';
import styles from "./index.module.sass";
import Entity, { EntityProps } from "src/components/Entity";
import EntityGrid, { EntityGridProps } from "src/components/EntityGrid";
import Icon, { IconProps } from "src/components/Icon";
import * as Icons from "src/data/Icons";
import IconBg, { IconBgProps } from "src/components/IconBg";
import Button, { ButtonProps } from "src/components/Buttons/Button";
import Radio, { RadioProps } from "src/components/Radio";
import Checkbox, { CheckboxProps } from "src/components/Checkbox";
import Toggle, { ToggleProps } from "src/components/Toggle";
import { EntityPropMeta } from "src/components/Entity";
import { EntityGridPropMeta } from "src/components/EntityGrid";
import { IconPropMeta } from "src/components/Icon";
import { IconBgPropMeta } from "src/components/IconBg";
//
// Omit 'size' from EntityPropMeta for use in cell fields
const { size: _entitySize, ...EntityPropMetaNoSize } = EntityPropMeta;
//
// Base cell interface
interface BaseCell {
  type: string;
  search?: boolean;
  disabled?: boolean;
}

// Left cell interfaces
interface EntityCell extends BaseCell, EntityProps {
  type: 'entity';
}

interface EntityGridCell extends BaseCell, EntityGridProps {
  type: 'entityGrid';
}

interface IconCell extends BaseCell, IconProps {
  type: 'icon';
}

interface IconBgCell extends BaseCell, IconBgProps {
  type: 'iconBg';
}

interface NoneCell extends BaseCell {
  type: 'none';
}

// Right cell interfaces
interface PushCell extends BaseCell {
  type: 'push';
}

interface ButtonCell extends BaseCell {
  type: 'button';
  title: string;
  props?: Omit<ButtonProps, 'title'>;
}

interface RadioCell extends BaseCell, RadioProps {
  type: 'radio';
}

interface CheckboxCell extends BaseCell, CheckboxProps {
  type: 'checkbox';
  checked: boolean;
}

interface ToggleCell extends BaseCell, ToggleProps {
  type: 'toggle';
  checked: boolean;
}

interface LabelPushCell extends BaseCell {
  type: 'labelPush';
  title: string;
}

// Union types for left and right cells
export type LeftCell = EntityCell | EntityGridCell | IconCell | IconBgCell | NoneCell;
export type RightCell = PushCell | ButtonCell | RadioCell | CheckboxCell | ToggleCell | LabelPushCell | NoneCell;

export interface CellProps {
  title: string;
  body?: string;
  action?: ButtonAction;
  left?: LeftCell;
  right?: RightCell;
  onClick?: () => void;
  search?: boolean;
  disabled?: boolean;
}

const Cell: React.FC<CellProps> = ({ title, body, action, left, right, onClick, search, disabled }) => {

  const clickHandler = useButtonAction({ action, onClick });

  const leftElement = () => {
    if (!left) return null;
    
    switch (left.type) {
      case 'entity':
        return <Entity {...(left as EntityCell)} size="64" />;
      case 'entityGrid':
        return <EntityGrid {...(left as EntityGridCell)} size={(left as EntityGridCell).size || "64"} />;
      case 'icon':
        const iconCell = left as IconCell;
        return <Icon icon={iconCell.icon} size={iconCell.size} color={disabled ? 'disabled' : iconCell.color || 'standard'} />;
      case 'iconBg':
        const iconBgCell = left as IconBgCell;
        return <IconBg icon={iconBgCell.icon} theme={iconBgCell.theme} customColor={iconBgCell.customColor} iconSize={iconBgCell.iconSize} size={iconBgCell.size || '64'} />;
      case 'none':
        return null;
      default:
        return null;
    }
  };

  const rightElement = () => {
    if (!right) return null;
    
    switch (right.type) {
      case 'push':
        return (
          <div className={styles.push}>
            <Icon icon={Icons.Push} size="24" color="standard" />
          </div>
        );
      case 'button':
        const buttonCell = right as ButtonCell;
        return <Button title={buttonCell.title} size="small" {...buttonCell.props} />;
      case 'radio':
        const radioCell = right as RadioCell;
        return <Radio checked={radioCell.checked} />;
      case 'checkbox':
        const checkboxCell = right as CheckboxCell;
        return <Checkbox checked={checkboxCell.checked} />;
      case 'toggle':
        const toggleCell = right as ToggleCell;
        return <Toggle checked={toggleCell.checked} />;
      case 'labelPush':
        const labelPushCell = right as LabelPushCell;
        return (
          <div className={styles.labelPush}>
            <p>{labelPushCell.title}</p>
            <Icon icon={Icons.Push} size="24" color="standard" />
          </div>
        );
      case 'none':
        return null;
      default:
        return null;
    }
  };

  const centerAlign = left && left.type === 'iconBg' && !body;

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
      { label: 'None', value: 'none', type: 'none' },
      { label: 'Entity', value: 'entity', type: 'entity', fields: EntityPropMetaNoSize },
      { label: 'Entity Grid', value: 'entityGrid', type: 'entityGrid', fields: EntityGridPropMeta },
      { label: 'Icon', value: 'icon', type: 'icon', fields: IconPropMeta },
      { label: 'Icon with Background', value: 'iconBg', type: 'iconBg', fields: IconBgPropMeta },
    ],
  },
  right: {
    type: 'object',
    label: 'Right',
    options: [
      { label: 'None', value: 'none', type: 'none' },
      { label: 'Push', value: 'push', type: 'push' },
      { label: 'Button', value: 'button', type: 'button', fields: { title: { type: 'string', label: 'Title' } } },
      { label: 'Radio', value: 'radio', type: 'radio', fields: { checked: { type: 'boolean', label: 'Checked' } } },
      { label: 'Checkbox', value: 'checkbox', type: 'checkbox', fields: { checked: { type: 'boolean', label: 'Checked' } } },
      { label: 'Toggle', value: 'toggle', type: 'toggle', fields: { checked: { type: 'boolean', label: 'Checked' } } },
      { label: 'Label Push', value: 'labelPush', type: 'labelPush', fields: { title: { type: 'string', label: 'Title' } } },
    ],
  },
  onClick: { type: 'function', label: 'onClick (not editable)' },
  search: { type: 'boolean', label: 'Search' },
  disabled: { type: 'boolean', label: 'Disabled' },
};
