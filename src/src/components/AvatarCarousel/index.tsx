import React from "react";
import styles from "./index.module.sass";
import Avatar, { AvatarProps, AvatarPropMeta } from "src/components/Avatar";

export interface AvatarData {
  avatar: AvatarProps;
  title: string;
}

export interface AvatarCarouselProps {
  avatars: AvatarData[];
}

const AvatarCarousel: React.FC<AvatarCarouselProps> = ({ avatars }) => {
  const chips = avatars.map((avatar, index) => {
    return (
      <AvatarInstance avatar={avatar.avatar} title={avatar.title} key={`AvatarInstance${index}`} />
    );
  });

  return (
    <div className={styles.Main}>
      {chips}
    </div>
  );
};

interface AvatarInstanceProps {
  avatar: AvatarProps;
  title: string;
}

const AvatarInstance: React.FC<AvatarInstanceProps> = ({ avatar, title }) => {
  return (
    <div className={styles.AvatarInstance}>
      <Avatar {...avatar} size='64' />
      {title}
    </div>
  );
};

export default AvatarCarousel;

export const AvatarCarouselPropMeta = {
  avatars: {
    type: 'array',
    label: 'Avatars',
    itemFields: {
      avatar: {
        type: 'object',
        label: 'Avatar',
        fields: {
          image: AvatarPropMeta.image,
          initial: AvatarPropMeta.initial,
          size: AvatarPropMeta.size,
          // border: AvatarPropMeta.border, // Uncomment if you want to include border
        },
      },
      title: { type: 'string', label: 'Title' },
    },
  },
};
