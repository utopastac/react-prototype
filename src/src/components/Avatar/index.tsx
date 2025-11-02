import React, { useState } from "react";
import styles from "./index.module.sass";
import { AvatarsArray } from "src/data/Avatars";
//
export const AVATAR_96 = "AVATAR_96";
export const AVATAR_64 = "AVATAR_64";
export const AVATAR_48 = "AVATAR_48";
export const AVATAR_32 = "AVATAR_32";
export const AVATAR_28 = "AVATAR_28";
export const AVATAR_24 = "AVATAR_24";
//
export const BG_COLORS = ["#3399FF", "#FB60C4", "#FADA3D", "#", "#41EBC1", "#00D4FF", "#F46E38", "#3399FF"];

export type AvatarSize = typeof AVATAR_96 | typeof AVATAR_64 | typeof AVATAR_48 | typeof AVATAR_32 | typeof AVATAR_28 | typeof AVATAR_24;

export interface AvatarProps {
  image?: string,
  initial?: string,
  size: AvatarSize,
  border?: boolean
}

const Avatar = (({ image, initial, size, border }: AvatarProps) => {
  const styleClass = (): string => {
    switch(size){
      case AVATAR_96:
        return styles.a_96;
      case AVATAR_64:
        return styles.a_64;
      case AVATAR_48:
        return styles.a_48;
      case AVATAR_32:
        return styles.a_32;
      case AVATAR_28:
        return styles.a_28;
      case AVATAR_24:
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
    options: [AVATAR_96, AVATAR_64, AVATAR_48, AVATAR_32, AVATAR_28, AVATAR_24],
  },
  // border: { type: 'boolean', label: 'Border' },
};
