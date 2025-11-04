import React from "react";
import styles from "./index.module.sass";
import Icon, { IconPropMeta, IconSize, IconColor } from "src/components/Icon";

/**
 * ListUnordered displays a styled unordered list with optional icons, body, and value for each item.
 *
 * @param items - Array of list items, each with a title, optional body, value, and icon.
 * @param prominence - Visual prominence: 'subtle' or 'standard'.
 * @param size - Size of the list: 'compact' or 'large'.
 * @param className - Additional class names for the root element.
 */
export interface ListUnorderedItem {
  title: string;
  body?: string;
  value?: string;
  icon?: string; // icon name, not ReactNode
}

export interface ListUnorderedProps {
  items: ListUnorderedItem[];
  prominence?: "subtle" | "standard";
  size?: "compact" | "large";
  className?: string;
}

const ListUnordered: React.FC<ListUnorderedProps> = ({
  items,
  prominence = "standard",
  size = "compact",
  className = "",
}) => {
  return (
    <ul
      className={[
        styles.Main,
        styles[prominence],
        styles[size],
        className,
      ].filter(Boolean).join(" ")}
    >
      {items.map((item, idx) => (
        <li className={styles.item} key={idx}>
          {item.icon && (
            <span className={styles.icon}>
              <Icon icon={item.icon} size={prominence === "standard" ? "24" : "16"} color="standard" />
            </span>
          )}
          <div className={styles.content}>
            <span className={styles.title}>{item.title}</span>
            {item.body && <span className={styles.body}>{item.body}</span>}
          </div>
          {item.value && <span className={styles.value}>{item.value}</span>}
        </li>
      ))}
    </ul>
  );
};

export default ListUnordered;

export const ListUnorderedPropMeta = {
  items: {
    type: 'array',
    label: 'Items',
    itemFields: {
      title: { type: 'string', label: 'Title' },
      body: { type: 'string', label: 'Body' },
      value: { type: 'string', label: 'Value' },
      icon: IconPropMeta.icon,
    },
  },
  prominence: {
    type: 'select',
    label: 'Prominence',
    options: ['subtle', 'standard'],
  },
  size: {
    type: 'select',
    label: 'Size',
    options: ['compact', 'large'],
  },
};