import React from "react";
import styles from "./index.module.sass";
//

export interface TimelineRowProps {
  label: string;
  body?: string;
  metadataTime?: string;
  metadataLocation?: string;
  placing: 'beginning' | 'middle' | 'end';
  children?: React.ReactNode;
}

const TimelineRow: React.FC<TimelineRowProps> = ({ label, body, metadataTime, metadataLocation, placing, children }) => {

  const placingClass = () => {
    switch (placing) {
      case 'beginning':
        return styles.beginning;
      case 'middle':
        return styles.middle;
      case 'end':
        return styles.end;
      default:
        return '';
    }
  };

  return (
    <div className={`${styles.Main} ${placingClass()}`}>
      <div className={styles.indicator}>
        <TimelineRowIndicator className={placingClass()} />
      </div>
      <div className={styles.content}>
        <div>
          <h5 className={styles.label}>{label}</h5>
          { body && <p className={styles.body}>{body}</p> }
          { (metadataTime || metadataLocation) && (
            <div className={styles.metadata}>
              { metadataTime && <span className={styles.metadataTime}>{metadataTime}</span> }
              { metadataLocation && <span className={styles.metadataLocation}>{metadataLocation}</span> }
            </div>
          ) }
          { children && <div className={styles.children}>{children}</div> }
        </div>
      </div>
    </div>
  );
};

export interface TimelineRowIndicatorProps {
  className: string;
}

const TimelineRowIndicator: React.FC<TimelineRowIndicatorProps> = ({ className }) => {

  return (
    <div className={`${styles.RowIndicator} ${className}`}>
      <div className={styles.dot}></div>
      <div className={styles.endLine}></div>
    </div>
  );
};

export const TimelineRowPropMeta = {
  label: { type: 'string', label: 'Label' },
  body: { type: 'string', label: 'Body' },
  metadataTime: { type: 'string', label: 'Metadata Time' },
  metadataLocation: { type: 'string', label: 'Metadata Location' },
  placing: {
    type: 'select',
    label: 'Placing',
    options: [
      'beginning',
      'middle',
      'end',
    ],
  },
};

export default TimelineRow;
