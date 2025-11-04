import React, { useState } from "react";
import styles from "./index.module.sass";
import { AvatarsArray } from "src/data/Avatars";
//
export const BG_COLORS = ["#3399FF", "#FB60C4", "#FADA3D", "#", "#41EBC1", "#00D4FF", "#F46E38", "#3399FF"];

export interface AvatarProps {
  image?: string,
  initial?: string,
  size: '96' | '64' | '48' | '32' | '28' | '24',
  border?: boolean
}

const Avatar = (({ image, initial, size, border }: AvatarProps) => {
  const styleClass = (): string => {
    switch(size){
      case '96':
        return styles.a_96;
      case '64':
        return styles.a_64;
      case '48':
        return styles.a_48;
      case '32':
        return styles.a_32;
      case '28':
        return styles.a_28;
      case '24':
        return styles.a_24;
      default:
        return styles.a_24;
    }
  }

  const [color] = useState(() => 
    initial ? BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)] : "#DEDEDE"
  );

  return (
    <div className={`${styles.Main} ${styleClass()} ${border ? styles.border : ""}`} style={{backgroundColor: color}}>
      {image ? <img src={image} alt={initial || "Avatar"} /> : <div>{initial}</div>}
    </div>
  );
});

export default Avatar;

export const AvatarPropMeta = {
  image: { type: 'select', label: 'Image', options: [null, ...AvatarsArray] },
  initial: { type: 'string', label: 'Initial' },
  size: {
    type: 'select',
    options: ['96', '64', '48', '32', '28', '24'],
  },
  // border: { type: 'boolean', label: 'Border' },
};
