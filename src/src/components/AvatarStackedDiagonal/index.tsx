import React from "react";
import styles from "./index.module.sass";
import { AvatarsArray } from "src/data/Avatars";

export const AVATAR_STACKED_DIAGONAL_64 = "AVATAR_STACKED_DIAGONAL_64";
export const AVATAR_STACKED_DIAGONAL_48 = "AVATAR_STACKED_DIAGONAL_48";
export const AVATAR_STACKED_DIAGONAL_32 = "AVATAR_STACKED_DIAGONAL_32";
export const AVATAR_STACKED_DIAGONAL_24 = "AVATAR_STACKED_DIAGONAL_24";

export type AvatarSize = 
  | typeof AVATAR_STACKED_DIAGONAL_64
  | typeof AVATAR_STACKED_DIAGONAL_48
  | typeof AVATAR_STACKED_DIAGONAL_32
  | typeof AVATAR_STACKED_DIAGONAL_24;

const BG_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9B59B6",
  "#3498DB"
] as const;

export interface AvatarStackedDiagonalProps {
  image1?: string;
  image2?: string;
  initial1?: string;
  initial2?: string;
  size: AvatarSize;
}

const AvatarStackedDiagonal: React.FC<AvatarStackedDiagonalProps> = ({ 
  image1, 
  image2, 
  initial1, 
  initial2, 
  size 
}) => {
  const styleClass = () => {
    switch(size) {
      case AVATAR_STACKED_DIAGONAL_64:
        return styles.a_64;
      case AVATAR_STACKED_DIAGONAL_48:
        return styles.a_48;
      case AVATAR_STACKED_DIAGONAL_32:
        return styles.a_32;
      case AVATAR_STACKED_DIAGONAL_24:
        return styles.a_24;
      default:
        return styles.a_24;
    }
  };

  const color1 = initial1 ? BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)] : "#DEDEDE";
  const color2 = initial2 ? BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)] : "#DEDEDE";

  return (
    <div className={`${styles.Main} ${styleClass()}`}>
      <div className={styles.image1} style={{backgroundColor: color1}}>
        {image1 ? <img src={image1} alt="Avatar 1" /> : <div className={styles.label}>{initial1}</div>}
      </div>
      <div className={styles.image2} style={{backgroundColor: color2}}>
        {image2 ? <img src={image2} alt="Avatar 2" /> : <div className={styles.label}>{initial2}</div>}
      </div>
    </div>
  );
};

export default AvatarStackedDiagonal;

export const AvatarStackedDiagonalPropMeta = {
  image1: { type: 'select', label: 'Image 1', options: AvatarsArray },
  image2: { type: 'select', label: 'Image 2', options: AvatarsArray },
  initial1: { type: 'string', label: 'Initial 1' },
  initial2: { type: 'string', label: 'Initial 2' },
  size: {
    type: 'select',
    options: [AVATAR_STACKED_DIAGONAL_64, AVATAR_STACKED_DIAGONAL_48, AVATAR_STACKED_DIAGONAL_32, AVATAR_STACKED_DIAGONAL_24],
  },
};
