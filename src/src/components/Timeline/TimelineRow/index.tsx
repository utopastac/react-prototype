import React from "react";
import styles from "./index.module.sass";
//

export interface TimelineRowProps {
  label: string;
  body?: string;
  value?: string;
  valueDescriptor?: string;
  state: 'notStarted' | 'inProgress' | 'pending' | 'done' | 'skipped' | 'collapsed';
  placing: 'beginning' | 'middle' | 'end';
}

const TimelineRow: React.FC<TimelineRowProps> = ({ label, body, value, valueDescriptor, state, placing }) => {

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

  const stateClass = () => {
    switch (state) {
      case 'notStarted':
        return styles.notStarted;
      case 'inProgress':
        return styles.inProgress;
      case 'pending':
        return styles.pending;
      case 'done':
        return styles.done;
      case 'skipped':
        return styles.skipped;
      case 'collapsed':
        return styles.collapsed;
      default:
        return null;
    }
  };

  return (
    <div className={`${styles.Main} ${placingClass()} ${stateClass()}`}>
      <div className={styles.indicator}>
        <TimelineRowIndicator className={`${placingClass()} ${stateClass()}`} />
      </div>
      <div className={styles.content}>
        <div>
          <h5 className={styles.label}>{label}</h5>
          { body && <p className={styles.body}>{body}</p> }
        </div>
        <div>
          { value && <h5 className={styles.value}>{value}</h5> }
          { valueDescriptor && <p className={styles.valueDescriptor}>{valueDescriptor}</p> }
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
      <div className={styles.initialLine}></div>
      <div className={styles.dot}></div>
      <div className={styles.collapsedDots}>
        <span />
        <span />
        <span />
      </div>
      <div className={styles.endLine}></div>
    </div>
  );
};

export const TimelineRowPropMeta = {
  label: { type: 'string', label: 'Label' },
  body: { type: 'string', label: 'Body' },
  value: { type: 'string', label: 'Value' },
  valueDescriptor: { type: 'string', label: 'Value Descriptor' },
  state: {
    type: 'select',
    label: 'Sequence',
    options: [
      'notStarted',
      'inProgress',
      'pending',
      'done',
      'skipped',
      'collapsed',
    ],
  },
  placing: {
    type: 'select',
    label: 'State',
    options: [
      'beginning',
      'middle',
      'end',
    ],
  },
};

export default TimelineRow;
