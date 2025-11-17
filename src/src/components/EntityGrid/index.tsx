import React from "react";
import styles from "./index.module.sass";
import { AvatarsArray } from "src/data/Avatars";
import Entity, { EntityProps } from "src/components/Entity";

export type EntityGridLayout = 'diagonal' | 'triangular' | 'grid' | 'diagonalWithBadge';

// EntityData is EntityProps with size made optional (since EntityGrid auto-determines size)
export type EntityData = Omit<EntityProps, 'size'> & { size?: EntityProps['size'] };

export interface EntityGridProps {
  entities: EntityData[];
}

const EntityGrid: React.FC<EntityGridProps> = ({ 
  entities
}) => {
  // Auto-determine layout based on number of entities
  const getLayout = (): EntityGridLayout => {
    const count = entities.length;
    if (count <= 2) return 'diagonal';
    if (count === 3) return 'triangular';
    if (count === 4) return 'grid';
    return 'diagonalWithBadge'; // >4 entities
  };

  // Auto-determine size based on number of entities
  // 2 entities = size 32, more than 2 = size 24 (closest to 20)
  const getSize = (): '32' | '24' => {
    return entities.length <= 2 ? '32' : '24';
  };

  const layout = getLayout();
  const size = getSize();
  
  const styleClass = () => {
    switch(size) {
      case '32':
        return styles.a_32;
      case '24':
        return styles.a_24;
      default:
        return styles.a_32;
    }
  };

  const renderEntity = (entity: EntityData, index: number) => {
    // Use entity's size if specified, otherwise use calculated size
    const entitySize = entity.size || size;
    
    // Determine if this entity should have an outline
    // entity_0 never has outline, entity_1+ have outline in most layouts
    const shouldHaveOutline = index > 0;
    const outlineProp = entity.outline !== undefined 
      ? entity.outline 
      : shouldHaveOutline;
    
    return (
      <div 
        key={index} 
        className={`${styles.entity} ${styles[`entity_${index}`]}`}
      >
        <Entity 
          image={entity.image} 
          size={entitySize} 
          border={entity.border}
          company={entity.company}
          outline={outlineProp}
        />
      </div>
    );
  };

  const renderBadge = () => {
    if (layout !== 'diagonalWithBadge') return null;
    
    const remainingCount = entities.length - 2;
    if (remainingCount <= 0) return null;
    
    const badgeText = remainingCount > 99 ? '99+' : `${remainingCount}`;
    
    return (
      <div className={styles.badge}>
        {badgeText}
      </div>
    );
  };

  const getLayoutClass = () => {
    switch(layout) {
      case 'diagonal':
        return styles.layout_diagonal;
      case 'triangular':
        return styles.layout_triangular;
      case 'grid':
        return styles.layout_grid;
      case 'diagonalWithBadge':
        return styles.layout_diagonalWithBadge;
      default:
        return styles.layout_diagonal;
    }
  };

  // Limit entities based on layout
  const displayEntities = () => {
    switch(layout) {
      case 'diagonal':
      case 'diagonalWithBadge':
        return entities.slice(0, 2);
      case 'triangular':
        return entities.slice(0, 3);
      case 'grid':
        return entities.slice(0, 4);
      default:
        return entities.slice(0, 2);
    }
  };

  return (
    <div className={`${styles.Main} ${styleClass()} ${getLayoutClass()}`}>
      {displayEntities().map((entity, index) => renderEntity(entity, index))}
      {renderBadge()}
    </div>
  );
};

export default EntityGrid;

export const EntityGridPropMeta = {
  entities: { 
    type: 'array', 
    label: 'Entities', 
    itemFields: {
      image: { type: 'select', label: 'Image', options: [null, ...AvatarsArray] },
      size: {
        type: 'select',
        label: 'Size',
        options: ['16', '24', '32', '40', '48', '64', '80', '96', '128', '160'],
      },
      border: { type: 'boolean', label: 'Border' },
      company: { type: 'boolean', label: 'Company' },
      outline: { type: 'boolean', label: 'Outline' },
    }
  },
};

