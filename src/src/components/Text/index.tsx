import React from "react";
import styles from "./index.module.sass";

// Header size constants
export const TEXT_HERO = "TEXT_HERO";
export const TEXT_HEADER = "TEXT_HEADER";
export const TEXT_SECTION_TITLE = "TEXT_SECTION_TITLE";
export const TEXT_BODY = "TEXT_BODY";
export const TEXT_DESCRIPTION = "TEXT_DESCRIPTION";
//
export const TEXT_PROMINENT = "TEXT_PROMINENT";
export const TEXT_STANDARD = "TEXT_STANDARD";
export const TEXT_SUBTLE = "TEXT_SUBTLE";

export type TextSize = typeof TEXT_BODY | typeof TEXT_DESCRIPTION | typeof TEXT_SECTION_TITLE | typeof TEXT_HEADER | typeof TEXT_HERO;
export type TextColor = typeof TEXT_PROMINENT | typeof TEXT_STANDARD | typeof TEXT_SUBTLE;

export interface TextProps {
  text: string;
  size?: TextSize;
  color?: TextColor;
}

const Text: React.FC<TextProps> = ({ text, size, color }) => {
  const textElement = () => {
    switch(size) {
      case TEXT_HERO:
        return <h1>{text}</h1>;
      case TEXT_HEADER:
        return <h2>{text}</h2>;
      case TEXT_SECTION_TITLE:
        return <h4>{text}</h4>;
      case TEXT_BODY:
        return <p>{text}</p>;
      case TEXT_DESCRIPTION:
        return <p>{text}</p>;
      default:
        return <p>{text}</p>;
    }
  };

  const textClassName = () => {
    switch(color) {
      case TEXT_PROMINENT:
        return styles.prominent;
      case TEXT_STANDARD:
        return styles.standard;
      case TEXT_SUBTLE:
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
    options: [TEXT_HERO, TEXT_HEADER, TEXT_SECTION_TITLE, TEXT_BODY, TEXT_DESCRIPTION],
  },
  color: {
    type: 'select',
    label: 'Color',
    options: [TEXT_PROMINENT, TEXT_STANDARD, TEXT_SUBTLE],
  },
};
