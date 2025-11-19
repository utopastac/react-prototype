import React from "react";
import styles from "./index.module.sass";
import { AvatarsArray } from "src/data/Avatars";
import entityPerson from "src/assets/entity-person.png";
import entityCompany from "src/assets/entity-company.png";

export interface EntityProps {
  image?: string,
  size?: '16' | '24' | '32' | '40' | '48' | '64' | '80' | '96' | '128' | '160',
  border?: boolean,
  company?: boolean,
  outline?: boolean;
  style?: React.CSSProperties;
}

const Entity = (({ image, size = '40', border, company, outline, style }: EntityProps) => {
  const styleClass = (): string => {
    switch(size){
      case '16':
        return styles.e_16;
      case '24':
        return styles.e_24;
      case '32':
        return styles.e_32;
      case '40':
        return styles.e_40;
      case '48':
        return styles.e_48;
      case '64':
        return styles.e_64;
      case '80':
        return styles.e_80;
      case '96':
        return styles.e_96;
      case '128':
        return styles.e_128;
      case '160':
        return styles.e_160;
      default:
        return styles.e_40;
    }
  }

  const defaultImage = company ? entityCompany : entityPerson;

  return (
    <div 
      className={`${styles.Main} ${styleClass()} ${border ? styles.border : ""} ${company ? styles.company : ""} ${outline ? styles.outline : ""}`}
    >
      <img src={image || defaultImage} alt="Entity" />
    </div>
  );
});

export default Entity;

export const EntityPropMeta = {
  image: { type: 'select', label: 'Image', options: [null, ...AvatarsArray] },
  size: {
    type: 'select',
    options: ['16', '24', '32', '40', '48', '64', '80', '96', '128', '160'],
  },
  border: { type: 'boolean', label: 'Border' },
  company: { type: 'boolean', label: 'Company' },
  outline: { type: 'boolean', label: 'Outline' },
};

