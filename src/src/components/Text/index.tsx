import React from "react";
import styles from "./index.module.sass";

export interface TextProps {
  text: string;
  size?: 'hero' | 'header' | 'sectionTitle' | 'body' | 'description';
  color?: 'prominent' | 'standard' | 'subtle';
}

const Text: React.FC<TextProps> = ({ text, size, color }) => {
  const textElement = () => {
    switch(size) {
      case 'hero':
        return <h1>{text}</h1>;
      case 'header':
        return <h2>{text}</h2>;
      case 'sectionTitle':
        return <h4>{text}</h4>;
      case 'body':
        return <p>{text}</p>;
      case 'description':
        return <p>{text}</p>;
      default:
        return <p>{text}</p>;
    }
  };

  const textClassName = () => {
    switch(color) {
      case 'prominent':
        return styles.prominent;
      case 'standard':
        return styles.standard;
      case 'subtle':
        return styles.subtle;
      default:
        return '';
    }
  };

  return (
    <div className={`${styles.Main} ${textClassName()}`}>
      {textElement()}
    </div>
  );
};

export default Text;


export const TextPropMeta = {
  text: { type: 'textarea', label: 'Text' },
  size: {
    type: 'select',
    label: 'Size',
    options: ['hero', 'header', 'sectionTitle', 'body', 'description'],
  },
  color: {
    type: 'select',
    label: 'Color',
    options: ['prominent', 'standard', 'subtle'],
  },
};
