import React from "react";
import { Images, ImagesArray } from "src/data/Images";
import styles from "./index.module.sass";
//
import Button, { BUTTON_COMPACT_SIZE, BUTTON_INVERSE } from "src/components/Buttons/Button";
//
export interface UpsellCardProps {
  title: string;
  body: string;
  image: string;
  button?: string;
}

const MarketingCardLarge: React.FC<UpsellCardProps> = ({ title, body, image, button }) => {

  return (
    <div className={styles.Main}>
      <img src={image} className={styles.image} />
      <div className={styles.gradient} />
      <header>
        <h5>{title}</h5>
        <p>{body}</p>
        { button && <Button title={button} type={BUTTON_INVERSE} size={BUTTON_COMPACT_SIZE} /> }
      </header>
    </div>
  );
};

export default MarketingCardLarge;

export const MarketingCardLargePropMeta = {
  title: { type: 'string', label: 'Title' },
  body: { type: 'string', label: 'Body' },
  image: { type: 'select', label: 'Image', options: ImagesArray },
  button: { type: 'string', label: 'Button Text' },
};
