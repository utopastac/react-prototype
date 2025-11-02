import React from "react";
import styles from "./index.module.sass";
import { ImagesArray } from "src/data/Images";
//
export const UPSELL_SMALL = "UPSELL_SMALL";
export const UPSELL_LARGE = "UPSELL_LARGE";
export type UpsellSize = typeof UPSELL_SMALL | typeof UPSELL_LARGE;
//
export interface UpsellCardProps {
  title: string;
  body: string;
  size?: UpsellSize;
  image?: string;
  button?: string;
}

const UpsellCard: React.FC<UpsellCardProps> = ({ 
  title, 
  body, 
  size = UPSELL_SMALL, 
  image, 
  button 
}) => {

  return (
    <div className={`${styles.Main} ${size === UPSELL_LARGE ? styles.large : styles.small}`}>
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
  size: { type: 'select', label: 'Size', options: [UPSELL_SMALL, UPSELL_LARGE] },
  image: { type: 'select', label: 'Image', options: ImagesArray },
  button: { type: 'string', label: 'Button Text' },
};
