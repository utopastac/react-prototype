import React from "react";
import styles from "./index.module.sass";
import Icon, { IconPropMeta } from "src/components/Icon";

/**
 * ListUnordered displays a styled unordered list with optional icons and body for each item.
 *
 * @param items - Array of list items, each with a title, optional body, and icon.
 * @param size - Size of the list: 'small' or 'medium'.
 * @param className - Additional class names for the root element.
 */
export interface ListUnorderedItem {
  title: string;
  body?: string;
  icon?: string; // icon name, not ReactNode
}

export interface ListUnorderedProps {
  items: ListUnorderedItem[];
  size?: "small" | "medium";
  className?: string;
}

const ListUnordered: React.FC<ListUnorderedProps> = ({
  items,
  size = "small",
  className = "",
}) => {
  return (
    <ul
      className={[
        styles.Main,
        styles[size],
        className,
      ].filter(Boolean).join(" ")}
    >
      {items.map((item, idx) => (
        <li className={styles.item} key={idx}>
          {item.icon && (
            <span className={styles.icon}>
              <Icon icon={item.icon} size="24" color="standard" />
            </span>
          )}
          <div className={styles.content}>
            <span className={styles.title}>{item.title}</span>
            {item.body && <span className={styles.body}>{item.body}</span>}
          </div>
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
      icon: IconPropMeta.icon,
    },
  },
  size: {
    type: 'select',
    label: 'Size',
    options: ['small', 'medium'],
  },
};