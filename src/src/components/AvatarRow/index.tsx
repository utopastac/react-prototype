import React from "react";
import styles from "./index.module.sass";
import Entity, { EntityProps } from "src/components/Entity";

export interface AvatarData {
  avatar: EntityProps;
}

export interface AvatarRowProps {
  avatars: AvatarData[];
}

const AvatarRow: React.FC<AvatarRowProps> = ({ avatars }) => {
  const chips = avatars.map((avatar, index) => {
    return (
      <AvatarInstance avatar={avatar.avatar} key={`AvatarInstance${index}`} />
    );
  });

  return (
    <div className={styles.Main}>
      {chips}
    </div>
  );
};

interface AvatarInstanceProps {
  avatar: EntityProps;
}

const AvatarInstance: React.FC<AvatarInstanceProps> = ({ avatar }) => {
  return (
    <div className={styles.AvatarInstance}>
      <Entity {...avatar} />
    </div>
  );
};

export const AvatarRowPropMeta = {
  avatars: { type: 'array', label: 'Avatars', itemFields: {
    image: { type: 'string', label: 'Image URL' },
    size: {
      type: 'select',
      options: ['16', '24', '32', '40', '48', '64', '80', '96', '128', '160'],
    },
    border: { type: 'boolean', label: 'Border' },
    company: { type: 'boolean', label: 'Company' },
  }},
};

export default AvatarRow;
