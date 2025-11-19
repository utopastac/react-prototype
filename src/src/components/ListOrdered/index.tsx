import React from "react";
import styles from "./index.module.sass";

/**
 * ListOrdered displays a styled ordered list with optional body for each item.
 *
 * @param items - Array of list items, each with a title and optional body.
 */
export interface ListOrderedItem {
  title: string;
  body?: string;
}

export interface ListOrderedProps {
  items: ListOrderedItem[];
  className?: string;
}

const ListOrdered: React.FC<ListOrderedProps> = ({
  items,
  className = "",
}) => {
  return (
    <ul
      className={[
        styles.Main,
        className,
      ].filter(Boolean).join(" ")}
    >
      {items.map((item, idx) => (
        <li className={styles.item} key={idx}>
          <span className={styles.index}>{idx + 1}</span>
          <div className={styles.content}>
            <span className={`${styles.title} ${item.body ? styles.showBody : ''}`}>{item.title}</span>
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
};