import React from "react";
import styles from "./index.module.sass";
import { ImagesArray } from "src/data/Images";
//
export interface UpsellCardProps {
  title: string;
  body: string;
  size?: 'small' | 'large';
  image?: string;
  button?: string;
}

const UpsellCard: React.FC<UpsellCardProps> = ({ 
  title, 
  body, 
  size = 'small', 
  image, 
  button 
}) => {

  return (
    <div className={`${styles.Main} ${size === 'large' ? styles.large : styles.small}`}>
      <header>
        <h5>{title}</h5>
        <p>{body}</p>
        { button && <a>{button}</a> }
      </header>
      {image && (
        <img src={image} className={styles.image} />
      )}
    </div>
  );
};

export default UpsellCard;

export const UpsellCardPropMeta = {
  title: { type: 'string', label: 'Title' },
  body: { type: 'string', label: 'Body' },
  size: { type: 'select', label: 'Size', options: ['small', 'large'] },
  image: { type: 'select', label: 'Image', options: ImagesArray },
  button: { type: 'string', label: 'Button Text' },
};
