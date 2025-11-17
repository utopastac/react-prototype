import React from "react";
import styles from "./index.module.sass";
import Entity, { EntityProps, EntityPropMeta } from "src/components/Entity";

export interface AvatarData {
  avatar: EntityProps;
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
  avatar: EntityProps;
  title: string;
}

const AvatarInstance: React.FC<AvatarInstanceProps> = ({ avatar, title }) => {
  return (
    <div className={styles.AvatarInstance}>
      <Entity {...avatar} size='64' />
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
          image: EntityPropMeta.image,
          size: EntityPropMeta.size,
          border: EntityPropMeta.border,
          company: EntityPropMeta.company,
        },
      },
      title: { type: 'string', label: 'Title' },
    },
  },
};
