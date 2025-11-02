import React from "react";
import Avatar, { AvatarProps, AVATAR_64, AVATAR_48, AVATAR_32, AVATAR_28, AVATAR_24, AvatarPropMeta } from "src/components/Avatar";
import AvatarStackedDiagonal, { AvatarStackedDiagonalProps, AVATAR_STACKED_DIAGONAL_64, AVATAR_STACKED_DIAGONAL_48, AVATAR_STACKED_DIAGONAL_32, AVATAR_STACKED_DIAGONAL_24, AvatarStackedDiagonalPropMeta } from "src/components/AvatarStackedDiagonal";
import IconBg, { IconBgProps, ICON_BG_GRAY, ICON_BG_BRAND, ICON_BG_CUSTOM, ICON_BG_64 } from "src/components/IconBg";
import Icon, { ICON_32, ICON_24, ICON_16, ICON_STANDARD, IconPropMeta } from "src/components/Icon";
import { Images, ImagesArray } from "src/data/Images";
import styles from "./index.module.sass";
import * as Icons from "src/data/icons";

// Header size constants
export const HEADER_HERO = "HEADER_HERO";
export const HEADER_PAGE = "HEADER_PAGE";
export const HEADER_SECTION = "HEADER_SECTION";
export const HEADER_PROFILE = "HEADER_PROFILE";

// Header accessory types
export const HEADER_AVATAR = "HEADER_AVATAR";
export const HEADER_AVATAR_STACKED_DIAGONAL = "HEADER_AVATAR_STACKED_DIAGONAL";
export const HEADER_ICON = "HEADER_ICON";
export const HEADER_IMAGE = "HEADER_IMAGE";
export const HEADER_SHOW_MORE = "HEADER_SHOW_MORE";

export type HeaderSize = typeof HEADER_HERO | typeof HEADER_PAGE | typeof HEADER_PROFILE | typeof HEADER_SECTION;
export type HeaderAccessoryType = typeof HEADER_AVATAR | typeof HEADER_AVATAR_STACKED_DIAGONAL | typeof HEADER_ICON | typeof HEADER_IMAGE | typeof HEADER_SHOW_MORE;

export interface HeaderAccessory {
  type: HeaderAccessoryType;
}

export interface HeaderAvatarAccessory extends HeaderAccessory {
  type: typeof HEADER_AVATAR;
  image?: string;
  initial?: string;
  size: AvatarProps['size'];
  border?: boolean;
}

export interface HeaderAvatarStackedDiagonalAccessory extends HeaderAccessory {
  type: typeof HEADER_AVATAR_STACKED_DIAGONAL;
  image1?: string;
  image2?: string;
  initial1?: string;
  initial2?: string;
  size: AvatarStackedDiagonalProps['size'];
}

export interface HeaderIconAccessory extends HeaderAccessory {
  type: typeof HEADER_ICON;
  icon: string;
  theme: IconBgProps['theme'];
  customColor?: string;
  iconSize?: IconBgProps['iconSize'];
}

export interface HeaderImageAccessory extends HeaderAccessory {
  type: typeof HEADER_IMAGE;
  image: string;
  alt?: string;
  offset?: boolean
}

export interface HeaderShowMoreAccessory extends HeaderAccessory {
  type: typeof HEADER_SHOW_MORE;
  text?: string;
}

export type HeaderAccessoryProps = 
  | HeaderAvatarAccessory 
  | HeaderAvatarStackedDiagonalAccessory 
  | HeaderIconAccessory
  | HeaderImageAccessory
  | HeaderShowMoreAccessory;

export interface HeaderProps {
  title: string;
  body?: string;
  size: HeaderSize;
  accessory?: HeaderAccessoryProps;
}

const Header: React.FC<HeaderProps> = ({ title, body, size, accessory }) => {
  const headerElement = () => {
    switch(size) {
      case HEADER_HERO:
        return <h1>{title}</h1>;
      case HEADER_PAGE:
        return <h2>{title}</h2>;
      case HEADER_PROFILE:
        return <h2>{title}</h2>;
      case HEADER_SECTION:
        return (
          <div className={styles.headerSection}>
            <h3>{title}</h3>
            { accessory && (
              <div className={styles.showMore}>
                <p>{accessory.text ? accessory.text : 'Show more'}</p>
                <Icon icon={Icons.SubtlePush16} size={ICON_16} color={ICON_STANDARD} />
              </div>
            )}
          </div>
        );
      default:
        return <h3>{title}</h3>;
    }
  };

  const headerClassName = () => {
    switch(size) {
      case HEADER_HERO:
        return styles.hero;
      case HEADER_PAGE:
        return styles.page;
      case HEADER_PROFILE:
        return styles.profile;
      case HEADER_SECTION:
        return styles.section;
      default:
        return '';
    }
  };

  const accessoryElement = () => {
    if (!accessory) return null;
    
    switch(accessory.type) {
      case HEADER_AVATAR:
        return <Avatar {...accessory} size={AVATAR_64} />;
      case HEADER_AVATAR_STACKED_DIAGONAL:
        return <AvatarStackedDiagonal {...accessory} size={AVATAR_STACKED_DIAGONAL_64} />;
      case HEADER_ICON:
        return <IconBg {...accessory} iconSize={ICON_32} size={ICON_BG_64} />;
      case HEADER_IMAGE:
        return <img src={accessory.image} alt={accessory.alt} className={`${styles.image} ${accessory.offset && styles.offset}`} />;
      default:
        return null;
    }
  };

  return (
    <div className={`${styles.Main} ${headerClassName()}`}>
      {accessoryElement()}
      <header>
        {headerElement()}
        {body && <p>{body}</p>}
      </header>
    </div>
  );
};

export default Header;

// Omit 'size' from AvatarPropMeta and AvatarStackedDiagonalPropMeta for use in HeaderPropMeta
const { size: _avatarSize, ...AvatarPropMetaNoSize } = AvatarPropMeta;
const { size: _stackedSize, ...AvatarStackedDiagonalPropMetaNoSize } = AvatarStackedDiagonalPropMeta;

export const HeaderPropMeta = {
  title: { type: 'string', label: 'Title' },
  body: { type: 'string', label: 'Body' },
  size: {
    type: 'select',
    label: 'Size',
    options: [HEADER_HERO, HEADER_PAGE, HEADER_PROFILE, HEADER_SECTION],
  },
  accessory: {
    type: 'object',
    label: 'Accessory',
    options: [
      { type: null, label: 'None' },
      {
        type: HEADER_AVATAR,
        label: 'Avatar',
        fields: AvatarPropMetaNoSize,
      },
      {
        type: HEADER_AVATAR_STACKED_DIAGONAL,
        label: 'Avatar Stacked Diagonal',
        fields: AvatarStackedDiagonalPropMetaNoSize,
      },
      {
        type: HEADER_ICON,
        label: 'Icon',
        fields: {
          icon: IconPropMeta.icon,
          theme: {
            type: 'select',
            label: 'Theme',
            options: [ICON_BG_GRAY, ICON_BG_BRAND, ICON_BG_CUSTOM],
          },
          customColor: { type: 'string', label: 'Custom Color' },
        },
      },
      {
        type: HEADER_IMAGE,
        label: 'Image',
        fields: {
          image: { label: 'Image', type: 'select', options: ImagesArray },
          alt: { label: 'alt', type: 'string' },
          offset: { label: 'Offset Image', type: 'boolean' }
        },
      },
      {
        type: HEADER_SHOW_MORE,
        label: 'Show More',
        fields: {
          text: { label: 'Text', type: 'string' },
        },
      },
    ],
  },
};
