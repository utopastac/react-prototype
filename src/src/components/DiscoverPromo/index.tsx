import React from "react";
import styles from "./index.module.sass";
//
import PromoBackground from "src/assets/promo-background.png";
import Button, {BUTTON_COMPACT_SIZE, BUTTON_INVERSE} from "src/components/Buttons/Button";
//
export interface DiscoverPromoProps {
  title: string;
  body: string;
  button: string;
}

const DiscoverPromo: React.FC<DiscoverPromoProps> = ({ title, body, button }) => {

  return (
    <div className={styles.Main}>
      <div className={styles.background}><img src={PromoBackground} /></div>
      <header>
        <h5>{title}</h5>
        <p>{body}</p>
        <Button title={button} size={BUTTON_COMPACT_SIZE} type={BUTTON_INVERSE} />
      </header>
    </div>
  );
};

export default DiscoverPromo;

export const DiscoverPromoPropMeta = {};
