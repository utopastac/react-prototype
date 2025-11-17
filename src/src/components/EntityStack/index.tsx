import React from "react";
import styles from "./index.module.sass";
import Entity, { EntityProps } from "src/components/Entity";

export interface EntityData {
  avatar: EntityProps;
}

export interface EntityStackProps {
  avatars: EntityData[];
  stacked?: boolean;
}

const EntityStack: React.FC<EntityStackProps> = ({ avatars, stacked = false }) => {
  const shouldShowOverflow = stacked && avatars.length > 3;
  const displayAvatars = shouldShowOverflow ? avatars.slice(0, 3) : avatars;
  const overflowCount = shouldShowOverflow ? avatars.length - 3 : 0;

  const chips = displayAvatars.map((avatar, index) => {
    return (
      <EntityInstance 
        avatar={avatar.avatar} 
        key={`EntityInstance${index}`}
        stacked={stacked}
        zIndex={index + 1}
      />
    );
  });

  return (
    <div className={`${styles.Main} ${stacked ? styles.stacked : ''}`}>
      {chips}
      {shouldShowOverflow && (
        <div className={styles.OverflowIndicator} style={{ zIndex: displayAvatars.length + 1 }}>
          +{overflowCount}
        </div>
      )}
    </div>
  );
};

interface EntityInstanceProps {
  avatar: EntityProps;
  stacked?: boolean;
  zIndex?: number;
}

const EntityInstance: React.FC<EntityInstanceProps> = ({ avatar, stacked = false, zIndex = 1 }) => {
  return (
    <div 
      className={`${styles.AvatarInstance} ${stacked ? styles.stacked : ''}`}
      style={{ zIndex }}
    >
      <Entity {...avatar} />
    </div>
  );
};

export const EntityStackPropMeta = {
  avatars: { type: 'array', label: 'Avatars', itemFields: {
    image: { type: 'string', label: 'Image URL' },
    size: {
      type: 'select',
      options: ['16', '24', '32', '40', '48', '64', '80', '96', '128', '160'],
    },
    border: { type: 'boolean', label: 'Border' },
    company: { type: 'boolean', label: 'Company' },
  }},
  stacked: { type: 'boolean', label: 'Stacked' },
};

export default EntityStack;
