import React from "react";
import { useTransitionNavigate, transitions } from 'src/hooks/useTransitionNavigate';
import styles from "./index.module.sass";
import Entity, { EntityProps } from "src/components/Entity";
import Icon, { IconPropMeta as IconPropMetaImport } from "src/components/Icon";
import { useUser } from 'src/containers/UserContext';

export interface TitleBarProps {
  title?: string;
  icon?: string;
  right?: EntityProps;
  inverse?: boolean;
}

const TitleBar: React.FC<TitleBarProps> = ({ title, icon, right, inverse }) => {

  const transitionNavigate = useTransitionNavigate();

  const userObject = useUser();
  const { avatar } = userObject;

  const element = 
    title ?
      <div className={styles.title}><h4>{title}</h4></div>
    :
      icon ? <Icon icon={icon} size="24" color="prominent" /> : null;

  return (
    <div className={`${styles.Main} ${inverse ? styles.inverse : ""}`}>
      {element}
      <div className={styles.avatar} onClick={()=>{transitionNavigate('account', transitions.slideInOver)}}>
        <Entity image={avatar} size="32" {...right} />
      </div>
    </div>
  );
};

export default TitleBar;

export const TitleBarPropMeta = {
  title: { type: 'string', label: 'Title' },
  icon: IconPropMetaImport.icon,
  right: { type: 'object', label: 'Right Entity', fields: {
    image: { type: 'string', label: 'Image URL' },
    size: {
      type: 'select',
      options: ['16', '24', '32', '40', '48', '64', '80', '96', '128', '160'],
    },
    border: { type: 'boolean', label: 'Border' },
    company: { type: 'boolean', label: 'Company' },
  }},
  inverse: { type: 'boolean', label: 'Inverse' },
};
