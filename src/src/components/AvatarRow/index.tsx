import React from "react";
import styles from "./index.module.sass";
import Avatar, { AvatarProps, AVATAR_64, AVATAR_48, AVATAR_32, AVATAR_28, AVATAR_24 } from "src/components/Avatar";

export interface AvatarData {
  avatar: AvatarProps;
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
  avatar: AvatarProps;
}

const AvatarInstance: React.FC<AvatarInstanceProps> = ({ avatar }) => {
  return (
    <div className={styles.AvatarInstance}>
      <Avatar {...avatar} />
    </div>
  );
};

export const AvatarRowPropMeta = {
  avatars: { type: 'array', label: 'Avatars', itemFields: {
    image: { type: 'string', label: 'Image URL' },
    initial: { type: 'string', label: 'Initial' },
    size: {
      type: 'select',
      options: [AVATAR_64, AVATAR_48, AVATAR_32, AVATAR_28, AVATAR_24],
    },
    border: { type: 'boolean', label: 'Border' },
  }},
};

export default AvatarRow;
