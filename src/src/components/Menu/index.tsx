import React from "react";
import styles from "./index.module.sass";
import MenuItem, { MenuItemProps } from "src/components/MenuItem";

export interface MenuSection {
  heading?: string;
  items: MenuItemProps[];
}

export interface MenuProps {
  sections: MenuSection[];
}

const Menu: React.FC<MenuProps> = ({ sections }) => {
  return (
    <div className={styles.Main}>
      {sections.map((section, sectionIndex) => (
        <React.Fragment key={sectionIndex}>
          {sectionIndex > 0 && (
            <div className={styles.divider} />
          )}
          <div className={styles.section}>
            {section.heading && (
              <div className={styles.heading}>{section.heading}</div>
            )}
            <div className={styles.items}>
              {section.items.map((item, itemIndex) => (
                <MenuItem
                  key={itemIndex}
                  title={item.title}
                  icon={item.icon}
                  onClick={item.onClick}
                />
              ))}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Menu;

export const MenuPropMeta = {
  sections: {
    type: 'array',
    label: 'Sections',
    itemType: {
      heading: { type: 'string', label: 'Heading' },
      items: {
        type: 'array',
        label: 'Items',
        itemType: {
          title: { type: 'string', label: 'Title' },
          icon: { type: 'object', label: 'Icon' },
          onClick: { type: 'function', label: 'On Click' },
        },
      },
    },
  },
};

