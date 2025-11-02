import React from "react";
import TimelineRow, { TimelineRowProps, TimelineRowPropMeta } from "./TimelineRow";
import styles from "./index.module.sass";

export interface TimelineProps {
  rowData: TimelineRowProps[];
}

const Timeline: React.FC<TimelineProps> = ({ rowData }) => {

  const rows = rowData.map((row: TimelineRowProps, index:number)=>{
    return (
      <TimelineRow {...row} key={`TimelineRow${index}`} />
    )
  });

  return (
    <div className={styles.Main}>
      { rows }
    </div>
  );
};

export default Timeline;

export const TimelinePropMeta = {
  rowData: {
    type: 'array',
    label: 'Rows',
    itemFields: TimelineRowPropMeta,
  }
};
