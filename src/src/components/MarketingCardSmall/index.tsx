import React from "react";
import { Images, ImagesArray } from "src/data/Images";
import styles from "./index.module.sass";
//
export interface UpsellCardProps {
  title: string;
  body: string;
  image?: string;
  button?: string;
}

const MarketingCardSmall: React.FC<UpsellCardProps> = ({ title, body, image, button }) => {

  return (
    <div className={styles.Main}>
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

export default MarketingCardSmall;

export const MarketingCardSmallPropMeta = {
  title: { type: 'string', label: 'Title' },
  body: { type: 'string', label: 'Body' },
  image: { type: 'select', label: 'Image', options: ImagesArray },
  button: { type: 'string', label: 'Button Text' },
};
