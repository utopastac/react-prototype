import React from "react";
import styles from "./index.module.sass";
import Icon from "src/components/Icon";
import * as Icons from "src/data/Icons";
import { Images } from "src/data/Images";

export interface LinkPreviewProps {
  title: string;
  source: string;
  metadata?: string;
  size?: 'compact' | 'expanded';
  imageSrc?: string;
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
}

const LinkPreview = ({
  title,
  source,
  metadata,
  size = 'compact',
  imageSrc = Images.Broadcast,
  onDismiss,
  dismissLabel = 'Dismiss link preview',
  className
}: LinkPreviewProps) => {
  const classes = [styles.Main, styles[size], className].filter(Boolean).join(' ');

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <div className={classes}>
      <button
        type="button"
        className={styles.dismissButton}
        onClick={handleDismiss}
        aria-label={dismissLabel}
      >
        <Icon icon={Icons.Close16} size="16" color="inverse" />
      </button>
      <div className={styles.visual}>
        <img src={imageSrc} alt="" loading="lazy" />
      </div>
      <div className={styles.body}>
        <p className={styles.source}>{source}</p>
        <h4 className={styles.title}>{title}</h4>
        {metadata && <p className={styles.meta}>{metadata}</p>}
      </div>
    </div>
  );
};

export default LinkPreview;

export const LinkPreviewPropMeta = {
  title: { type: 'string', label: 'Title' },
  source: { type: 'string', label: 'Source' },
  metadata: { type: 'string', label: 'Metadata' },
  size: { type: 'select', label: 'Size', options: ['compact', 'expanded'] },
  imageSrc: { type: 'image', label: 'Image' },
  dismissLabel: { type: 'string', label: 'Dismiss label' }
};
