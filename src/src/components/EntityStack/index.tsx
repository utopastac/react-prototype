import React from "react";
import styles from "./index.module.sass";
import Entity, { EntityProps } from "src/components/Entity";
import { AvatarsArray } from "src/data/Avatars";

export interface EntityData {
  entity: EntityProps;
}

export interface EntityStackProps {
  entities: EntityData[];
  stacked?: boolean;
  size?: EntityProps['size'];
}

const EntityStack: React.FC<EntityStackProps> = ({ entities, stacked = false, size = '24' }) => {
  const shouldShowOverflow = stacked && entities.length > 3 && size !== '16';
  const displayEntities = shouldShowOverflow ? entities.slice(0, 3) : entities;
  const overflowCount = shouldShowOverflow ? entities.length - 3 : 0;

  return (
    <div className={`${styles.Main} ${stacked ? styles.stacked : ''} ${stacked ? styles[`stacked_size_${size}`] : ''}`}>
      {displayEntities.map((entityData, index) => {
        const entityProps: EntityProps = stacked 
          ? { 
              ...entityData.entity, 
              size: size || entityData.entity.size,
              outline: entityData.entity.outline !== undefined 
                ? entityData.entity.outline 
                : true 
            }
          : {
              ...entityData.entity,
              size: size || entityData.entity.size,
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
  entities: { type: 'array', label: 'Entities', itemFields: {
    image: { type: 'select', label: 'Image', options: [null, ...AvatarsArray] },
    size: {
      type: 'select',
      label: 'Size',
      options: ['16', '24', '32', '40', '48', '64', '80', '96', '128', '160'],
    },
    border: { type: 'boolean', label: 'Border' },
    company: { type: 'boolean', label: 'Company' },
    outline: { type: 'boolean', label: 'Outline' },
  }},
  stacked: { type: 'boolean', label: 'Stacked' },
  size: {
    type: 'select',
    options: ['16', '24', '32', '40', '48', '64', '80', '96', '128', '160'],
    label: 'Size',
  },
};

export default EntityStack;
