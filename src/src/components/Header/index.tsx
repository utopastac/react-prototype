import React from "react";
import Avatar, { AvatarProps, AvatarPropMeta } from "src/components/Avatar";
import AvatarStackedDiagonal, { AvatarStackedDiagonalProps, AvatarStackedDiagonalPropMeta } from "src/components/AvatarStackedDiagonal";
import IconBg, { IconBgProps } from "src/components/IconBg";
import Icon, { IconPropMeta } from "src/components/Icon";
import { Images, ImagesArray } from "src/data/Images";
import styles from "./index.module.sass";
import * as Icons from "src/data/icons";

export interface HeaderAccessory {
  type: 'avatar' | 'avatarStackedDiagonal' | 'icon' | 'image' | 'showMore';
}

export interface HeaderAvatarAccessory extends HeaderAccessory {
  type: 'avatar';
  image?: string;
  initial?: string;
  size: AvatarProps['size'];
  border?: boolean;
}

export interface HeaderAvatarStackedDiagonalAccessory extends HeaderAccessory {
  type: 'avatarStackedDiagonal';
  image1?: string;
  image2?: string;
  initial1?: string;
  initial2?: string;
  size: AvatarStackedDiagonalProps['size'];
}

export interface HeaderIconAccessory extends HeaderAccessory {
  type: 'icon';
  icon: string;
  theme: IconBgProps['theme'];
  customColor?: string;
  iconSize?: IconBgProps['iconSize'];
}

export interface HeaderImageAccessory extends HeaderAccessory {
  type: 'image';
  image: string;
  alt?: string;
  offset?: boolean
}

export interface HeaderShowMoreAccessory extends HeaderAccessory {
  type: 'showMore';
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
  size: 'hero' | 'page' | 'profile' | 'section';
  accessory?: HeaderAccessoryProps;
}

const Header: React.FC<HeaderProps> = ({ title, body, size, accessory }) => {
  const headerElement = () => {
    switch(size) {
      case 'hero':
        return <h1>{title}</h1>;
      case 'page':
        return <h2>{title}</h2>;
      case 'profile':
        return <h2>{title}</h2>;
      case 'section':
        return (
          <div className={styles.headerSection}>
            <h3>{title}</h3>
            { accessory && (
              <div className={styles.showMore}>
                <p>{accessory.text ? accessory.text : 'Show more'}</p>
                <Icon icon={Icons.Push16} size="16" color="standard" />
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
      case 'hero':
        return styles.hero;
      case 'page':
        return styles.page;
      case 'profile':
        return styles.profile;
      case 'section':
        return styles.section;
      default:
        return '';
    }
  };

  const accessoryElement = () => {
    if (!accessory) return null;
    
    switch(accessory.type) {
      case 'avatar':
        return <Avatar {...accessory} size="64" />;
      case 'avatarStackedDiagonal':
        return <AvatarStackedDiagonal {...accessory} size="64" />;
      case 'icon':
        return <IconBg {...accessory} iconSize="32" size="64" />;
      case 'image':
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
    options: ['hero', 'page', 'profile', 'section'],
  },
  accessory: {
    type: 'object',
    label: 'Accessory',
    options: [
      { type: null, label: 'None' },
      {
        type: 'avatar',
        label: 'Avatar',
        fields: AvatarPropMetaNoSize,
      },
      {
        type: 'avatarStackedDiagonal',
        label: 'Avatar Stacked Diagonal',
        fields: AvatarStackedDiagonalPropMetaNoSize,
      },
      {
        type: 'icon',
        label: 'Icon',
        fields: {
          icon: IconPropMeta.icon,
          theme: {
            type: 'select',
            label: 'Theme',
            options: ['grey', 'brand', 'custom'],
          },
          customColor: { type: 'string', label: 'Custom Color' },
        },
      },
      {
        type: 'image',
        label: 'Image',
        fields: {
          image: { label: 'Image', type: 'select', options: ImagesArray },
          alt: { label: 'alt', type: 'string' },
          offset: { label: 'Offset Image', type: 'boolean' }
        },
      },
      {
        type: 'showMore',
        label: 'Show More',
        fields: {
          text: { label: 'Text', type: 'string' },
        },
      },
    ],
  },
};
