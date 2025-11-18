import React from "react";
import { useTransitionNavigate, transitions } from 'src/hooks/useTransitionNavigate';
import styles from "./index.module.sass";
import Entity, { EntityProps } from "src/components/Entity";
import Icon, { IconPropMeta as IconPropMetaImport } from "src/components/Icon";
import { useUser } from 'src/containers/UserContext';
import GlobalSearchInput from "src/components/GlobalSearchInput";
import * as AllIcons from "src/data/AllIcons";
import Badge from "src/components/Badge";

export interface TitleBarProps {
  icon?: string;
  right?: EntityProps;
  inverse?: boolean;
}

const TitleBar: React.FC<TitleBarProps> = ({ icon, right, inverse }) => {

  const transitionNavigate = useTransitionNavigate();

  const userObject = useUser();
  const { avatar } = userObject;

  return (
    <div className={`${styles.Main} ${inverse ? styles.inverse : ""}`}>
      <div className={styles.avatar} onClick={()=>{transitionNavigate('account', transitions.slideInOver)}}>
        <Entity image={avatar} size="32" {...right} />
      </div>
      <GlobalSearchInput placeholder="Search" />
      <div className={styles.right}>
        <Icon icon={AllIcons.Navigation.Messages} size="24" color="prominent" />
        <Badge type="text" className={styles.badge}>4</Badge>
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
