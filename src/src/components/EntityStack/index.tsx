import React from "react";
import styles from "./index.module.sass";
import Entity, { EntityProps } from "src/components/Entity";

export interface EntityData {
  avatar: EntityProps;
}

export interface EntityStackProps {
  avatars: EntityData[];
  stacked?: boolean;
  size?: EntityProps['size'];
}

const EntityStack: React.FC<EntityStackProps> = ({ avatars, stacked = false, size = '24' }) => {
  const shouldShowOverflow = stacked && avatars.length > 3 && size !== '16';
  const displayAvatars = shouldShowOverflow ? avatars.slice(0, 3) : avatars;
  const overflowCount = shouldShowOverflow ? avatars.length - 3 : 0;

  return (
    <div className={`${styles.Main} ${stacked ? styles.stacked : ''} ${stacked ? styles[`stacked_size_${size}`] : ''}`}>
      {displayAvatars.map((avatarData, index) => {
        const entityProps: EntityProps = stacked 
          ? { 
              ...avatarData.avatar, 
              size: size || avatarData.avatar.size,
              outline: avatarData.avatar.outline !== undefined 
                ? avatarData.avatar.outline 
                : true 
            }
          : {
              ...avatarData.avatar,
              size: size || avatarData.avatar.size,
            };
        
        return (
          <Entity 
            key={index}
            {...entityProps}
          />
        );
      })}
      {shouldShowOverflow && (
        <div className={`${styles.OverflowIndicator} ${styles[`size_${size}`]}`}>
          +{overflowCount}
        </div>
      )}
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
  size: {
    type: 'select',
    options: ['16', '24', '32', '40', '48', '64', '80', '96', '128', '160'],
    label: 'Size',
  },
};

export default EntityStack;
