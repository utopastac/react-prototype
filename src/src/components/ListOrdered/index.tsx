import React from "react";
import styles from "./index.module.sass";

/**
 * ListUnordered displays a styled unordered list with optional icons, body, and value for each item.
 *
 * @param items - Array of list items, each with a title, optional body, value, and icon.
 * @param type - Visual prominence: 'subtle' or 'standard'.
 */
export interface ListOrderedItem {
  title: string;
  body?: string;
}

export interface ListOrderedProps {
  items: ListOrderedItem[];
  type?: "subtle" | "standard";
  className?: string;
}

const ListOrdered: React.FC<ListOrderedProps> = ({
  items,
  type = "standard",
  className = "",
}) => {
  return (
    <ul
      className={[
        styles.Main,
        styles[type],
        className,
      ].filter(Boolean).join(" ")}
    >
      {items.map((item, idx) => (
        <li className={styles.item} key={idx}>
          <span className={styles.index}>{idx + 1}</span>
          <div className={styles.content}>
            <span className={`${styles.title} ${item.body && type === "standard" ? styles.showBody : ''}`}>{item.title}</span>
            {item.body && <span className={styles.body}>{item.body}</span>}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ListOrdered;

export const ListOrderedPropMeta = {
  items: {
    type: 'array',
    label: 'Items',
    itemFields: {
      title: { type: 'string', label: 'Title' },
      body: { type: 'string', label: 'Body' },
    },
  },
  type: {
    type: 'select',
    label: 'Type',
    options: ['subtle', 'standard'],
  }
};