import React from "react";
import styles from "./index.module.sass";
import Icon from "src/components/Icon";
import Entity, { EntityProps } from "src/components/Entity";
import * as Icons from "src/data/Icons";

export type PillType = 'toggle' | 'choice' | 'action' | 'input' | 'select';

export interface PillProps {
  title: string;
  checked: boolean;
  type: PillType;
  entity?: EntityProps;
}

const Pill: React.FC<PillProps> = ({ title, checked, type, entity }) => {
  const renderIcon = () => {
    switch (type) {
      case 'toggle':
        return checked ? (
          <Icon icon={Icons.ContactCheck} size="16" color="inverse" />
        ) : (
          <Icon icon={Icons.Add16} size="16" color="standard" />
        );
      case 'input':
        return checked ? (
          <Icon icon={Icons.Close16} size="16" color="inverse" />
        ) : (
          <Icon icon={Icons.Add16} size="16" color="standard" />
        );
      case 'select':
        return <Icon icon={Icons.Expand16} size="16" color={checked ? "inverse" : "standard"} />;
      case 'action':
      case 'choice':
      default:
        return null;
    }
  };

  return (
    <div className={`${styles.Pill} ${checked ? styles.checked : ""}`}>
      {type === 'action' && entity && (
        <Entity {...entity} size="16" />
      )}
      {title}
      {renderIcon()}
    </div>
  );
};

export default Pill;

