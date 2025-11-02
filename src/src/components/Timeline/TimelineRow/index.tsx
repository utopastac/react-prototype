import React from "react";
import styles from "./index.module.sass";
//
export const STATE_NOT_STARTED = "TIMELINE_ROW_STATE_NOT_STARTED";
export const STATE_IN_PROGRESS = "TIMELINE_ROW_STATE_IN_PROGRESS";
export const STATE_PENDING = "TIMELINE_ROW_STATE_PENDING";
export const STATE_DONE = "TIMELINE_ROW_STATE_DONE";
export const STATE_SKIPPED = "TIMELINE_ROW_STATE_SKIPPED";
export const STATE_COLLAPSED = "TIMELINE_ROW_STATE_COLLAPSED";

export const PLACING_BEGINNING = "TIMELINE_ROW_PLACING_BEGINNING";
export const PLACING_MIDDLE = "TIMELINE_ROW_PLACING_MIDDLE";
export const PLACING_END = "TIMELINE_ROW_PLACING_END";

export type State = typeof STATE_NOT_STARTED | typeof STATE_IN_PROGRESS | typeof STATE_PENDING | typeof STATE_DONE | typeof STATE_SKIPPED | typeof STATE_COLLAPSED;
export type Placing = typeof PLACING_BEGINNING | typeof PLACING_MIDDLE | typeof PLACING_END;

export interface TimelineRowProps {
  label: string;
  body?: string;
  value?: string;
  valueDescriptor?: string;
  state: State;
  placing: Placing;
}

const TimelineRow: React.FC<TimelineRowProps> = ({ label, body, value, valueDescriptor, state, placing }) => {

  const placingClass = () => {
    switch (placing) {
      case PLACING_BEGINNING:
        return styles.beginning;
      case PLACING_MIDDLE:
        return styles.middle;
      case PLACING_END:
        return styles.end;
      default:
        return '';
    }
  };

  const stateClass = () => {
    switch (state) {
      case STATE_NOT_STARTED:
        return styles.notStarted;
      case STATE_IN_PROGRESS:
        return styles.inProgress;
      case STATE_PENDING:
        return styles.pending;
      case STATE_DONE:
        return styles.done;
      case STATE_SKIPPED:
        return styles.skipped;
      case STATE_COLLAPSED:
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
      STATE_NOT_STARTED,
      STATE_IN_PROGRESS,
      STATE_PENDING,
      STATE_DONE,
      STATE_SKIPPED,
      STATE_COLLAPSED,
    ],
  },
  placing: {
    type: 'select',
    label: 'State',
    options: [
      PLACING_BEGINNING,
      PLACING_MIDDLE,
      PLACING_END,
    ],
  },
};

export default TimelineRow;
