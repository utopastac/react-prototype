import React from "react";
import styles from "./index.module.sass";
import { AvatarsArray } from "src/data/Avatars";
import Entity, { EntityProps } from "src/components/Entity";

const BG_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9B59B6",
  "#3498DB"
] as const;

export type EntityGridLayout = 'diagonal' | 'triangular' | 'grid' | 'diagonalWithBadge';

export interface EntityData {
  image?: string;
  initial?: string;
  size?: EntityProps['size'];
  border?: boolean;
  company?: boolean;
}

export interface EntityGridProps {
  entities: EntityData[];
  layout: EntityGridLayout;
  size: '64' | '48' | '32' | '24';
  badgeCount?: number; // For diagonalWithBadge layout
}

const EntityGrid: React.FC<EntityGridProps> = ({ 
  entities, 
  layout,
  size,
  badgeCount
}) => {
  const styleClass = () => {
    switch(size) {
      case '64':
        return styles.a_64;
      case '48':
        return styles.a_48;
      case '32':
        return styles.a_32;
      case '24':
        return styles.a_24;
      default:
        return styles.a_24;
    }
  };

  const getEntityColor = (index: number, initial?: string) => {
    if (initial) {
      return BG_COLORS[index % BG_COLORS.length];
    }
    return "#DEDEDE";
  };

  const renderEntity = (entity: EntityData, index: number) => {
    const color = getEntityColor(index, entity.initial);
    const entitySize = entity.size || size;
    
    return (
      <div 
        key={index} 
        className={`${styles.entity} ${styles[`entity_${index}`]}`}
        style={entity.initial ? { backgroundColor: color } : undefined}
      >
        {entity.image ? (
          <Entity 
            image={entity.image} 
            size={entitySize} 
            border={entity.border}
            company={entity.company}
          />
        ) : entity.initial ? (
          <div className={styles.label}>{entity.initial}</div>
        ) : (
          <Entity 
            size={entitySize} 
            border={entity.border}
            company={entity.company}
          />
        )}
      </div>
    );
  };

  const renderBadge = () => {
    if (layout !== 'diagonalWithBadge' || !badgeCount) return null;
    
    const badgeText = badgeCount > 99 ? '99+' : `${badgeCount}`;
    
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
      initial: { type: 'string', label: 'Initial' },
      size: {
        type: 'select',
        label: 'Size',
        options: ['16', '24', '32', '40', '48', '64', '80', '96', '128', '160'],
      },
      border: { type: 'boolean', label: 'Border' },
      company: { type: 'boolean', label: 'Company' },
    }
  },
  layout: {
    type: 'select',
    label: 'Layout',
    options: ['diagonal', 'triangular', 'grid', 'diagonalWithBadge'],
  },
  size: {
    type: 'select',
    label: 'Size',
    options: ['64', '48', '32', '24'],
  },
  badgeCount: { type: 'number', label: 'Badge Count' },
};

