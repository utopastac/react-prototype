import React from "react";
import styles from "./index.module.sass";
import Tab, { TabProps } from "src/components/Tab";

export interface TabGroupProps {
  tabs: TabProps[];
  activeIndex?: number;
  onTabChange?: (index: number) => void;
}

const TabGroup: React.FC<TabGroupProps> = ({ 
  tabs, 
  activeIndex = 0, 
  onTabChange 
}) => {
  return (
    <div className={styles.TabGroup}>
      <div className={styles.TabsContainer}>
        {tabs.map((tab, index) => (
          <Tab
            key={`tab-${index}`}
            title={tab.title}
            active={index === activeIndex}
            onClick={() => {
              if (onTabChange) {
                onTabChange(index);
              } else if (tab.onClick) {
                tab.onClick();
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TabGroup;

export const TabGroupPropMeta = {
  tabs: {
    type: 'array',
    label: 'Tabs',
    itemFields: {
      title: { type: 'string', label: 'Title' },
      active: { type: 'boolean', label: 'Active' },
      onClick: { type: 'function', label: 'onClick (not editable)' },
    }
  },
  activeIndex: { type: 'number', label: 'Active Index' },
  onTabChange: { type: 'function', label: 'onTabChange (not editable)' },
};

