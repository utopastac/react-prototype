import React from "react";
import styles from "./index.module.sass";
import Icon from "src/components/Icon";
import * as Icons from "src/data/Icons";

export interface FilterBarProps {
  filterChips: FilterChipProps[];
}

const FilterBar: React.FC<FilterBarProps> = ({ filterChips }) => {
  const chips = filterChips.map((chip, index) => (
    <FilterChip {...chip} key={`FilterChip${index}`} />
  ));

  return (
    <div className={styles.Main}>
      {chips}
    </div>
  );
};

export default FilterBar;

export interface FilterChipProps {
  title: string;
  active: boolean;
  icon?: boolean;
}

const FilterChip: React.FC<FilterChipProps> = ({ title, active, icon }) => {
  return (
    <div className={`${styles.FilterChip} ${active ? styles.active : ""}`}>
      {title}
      {icon ? <Icon icon={Icons.Expand16} size="16" color="standard" /> : null}
    </div>
  );
};

export const FilterBarPropMeta = {
  filterChips: {
    type: 'array',
    label: 'Filter Chips',
    itemFields: {
      title: { type: 'string', label: 'Title' },
      active: { type: 'boolean', label: 'Active' },
      icon: { type: 'boolean', label: 'Icon' },
    }
  }
};
