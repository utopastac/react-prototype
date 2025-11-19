import React from "react";
import styles from "./index.module.sass";
import Entity, { EntityProps } from "src/components/Entity";
import Tag from "src/components/Tag";
import Icon from "src/components/Icon";
import { System } from "src/data/SystemIcons";

export interface EntityLockupProps {
  // Required
  entity: EntityProps;
  title: string;

  // Optional
  badge?: boolean; // LinkedIn badge
  degree?: string; // e.g., "1st", "2nd", "3rd"
  tag?: {
    label: string;
    size?: 'small' | 'large';
    type?: 'default' | 'negative' | 'positive' | 'caution' | 'neutral';
  };
  subtitle?: string;
  metadata?: string;
}

const EntityLockup: React.FC<EntityLockupProps> = ({
  entity,
  title,
  badge,
  degree,
  tag,
  subtitle,
  metadata,
}) => {
  return (
    <div className={styles.Main}>
      <div className={styles.entityWrapper}>
        <Entity {...entity} />
      </div>
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <span className={styles.title}>{title}</span>
          {badge && (
            <div className={styles.badge}>
              <Icon icon={System.LinkedinBugSmall} size="16" color="brand" />
            </div>
          )}
          {degree && (
            <span className={styles.degree}>{degree}</span>
          )}
          {tag && (
            <Tag size={tag.size || 'small'} type={tag.type || 'default'}>
              {tag.label}
            </Tag>
          )}
        </div>
        {subtitle && (
          <div className={styles.subtitle}>{subtitle}</div>
        )}
        {metadata && (
          <div className={styles.metadata}>{metadata}</div>
        )}
      </div>
    </div>
  );
};

export default EntityLockup;

export const EntityLockupPropMeta = {
  entity: { type: 'object', label: 'Entity' },
  title: { type: 'string', label: 'Title' },
  badge: { type: 'boolean', label: 'LinkedIn Badge' },
  degree: { type: 'string', label: 'Degree' },
  tag: { type: 'object', label: 'Tag' },
  subtitle: { type: 'string', label: 'Subtitle' },
  metadata: { type: 'string', label: 'Metadata' },
};

