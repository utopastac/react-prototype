import React from "react";
import styles from "./index.module.sass";

export interface SegmentData {
  title: string;
  active: boolean;
}

export interface SegmentedControlProps {
  left: SegmentData;
  right: SegmentData;
  onClick: (segment: SegmentData) => void;
}

export interface SegmentProps {
  title: string;
  active: boolean;
  onClick: (segment: SegmentData) => void;
  icon?: boolean;
}

const Segment: React.FC<SegmentProps> = ({ title, active, onClick }) => {
  return (
    <div 
      className={`${styles.Segment} ${active ? styles.active : ""}`} 
      onClick={() => onClick({ title, active })}
    >
      {title}
    </div>
  );
};

const SegmentedControl: React.FC<SegmentedControlProps> = ({ left, right, onClick }) => {
  return (
    <div className={styles.Main}>
      <Segment title={left.title} active={left.active} onClick={onClick} />
      <Segment title={right.title} active={right.active} onClick={onClick} />
    </div>
  );
};

export default SegmentedControl;

export const SegmentedControlPropMeta = {
  left: { type: 'object', label: 'Left Segment', fields: {
    title: { type: 'string', label: 'Title' },
    active: { type: 'boolean', label: 'Active' },
  }},
  right: { type: 'object', label: 'Right Segment', fields: {
    title: { type: 'string', label: 'Title' },
    active: { type: 'boolean', label: 'Active' },
  }},
  onClick: { type: 'function', label: 'onClick (not editable)' },
};
