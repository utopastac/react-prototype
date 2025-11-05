import React from "react";
import { useTransitionNavigate, transitions } from 'src/hooks/useTransitionNavigate';
import styles from "./index.module.sass";
import Avatar, { AvatarProps, IconSize, IconColor, IconPropMeta } from "src/components/Avatar";
import Icon, { IconPropMeta as IconPropMetaImport } from "src/components/Icon";
import { useUser } from 'src/containers/UserContext';

export interface TitleBarProps {
  title?: string;
  icon?: string;
  right?: AvatarProps;
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
        <Avatar image={avatar} size="32" {...right} />
      </div>
    </div>
  );
};

export default TitleBar;

export const TitleBarPropMeta = {
  title: { type: 'string', label: 'Title' },
  icon: IconPropMetaImport.icon,
  right: { type: 'object', label: 'Right Avatar', fields: {
    image: { type: 'string', label: 'Image URL' },
    initial: { type: 'string', label: 'Initial' },
    size: {
      type: 'select',
      options: ['64', '48', '32', '28', '24'],
    },
    border: { type: 'boolean', label: 'Border' },
  }},
  inverse: { type: 'boolean', label: 'Inverse' },
};
