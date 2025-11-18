import React from "react";
import styles from "./index.module.sass";
import Pill, { PillProps } from "src/components/Pill";

export interface PillGroupProps {
  filterChips: PillProps[];
}

const PillGroup: React.FC<PillGroupProps> = ({ filterChips }) => {
  const chips = filterChips.map((chip, index) => (
    <Pill {...chip} key={`Pill${index}`} />
  ));

  return (
    <div className={styles.Main}>
      {chips}
    </div>
  );
};

export default PillGroup;

export const PillGroupPropMeta = {
  filterChips: {
    type: 'array',
    label: 'Filter Chips',
    itemFields: {
      title: { type: 'string', label: 'Title' },
      checked: { type: 'boolean', label: 'Checked' },
      type: { type: 'select', label: 'Type', options: ['toggle', 'choice', 'action', 'input', 'select'] },
      entity: { type: 'object', label: 'Entity (for action type)', optional: true },
    }
  }
};
