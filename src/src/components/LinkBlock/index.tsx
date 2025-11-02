import React from "react";
import styles from "./index.module.sass";
import Icon, {ICON_24, ICON_PROMINENT} from "src/components/Icon";
import * as Icons from "src/data/Icons";

export interface LinkBlockProps {
  title: string;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  first?: boolean;
}

const LinkBlock: React.FC<LinkBlockProps> = ({ title, onClick, first }) => {
  return (
    <div className={`${styles.Main} ${first ? styles.first : ""}`} onClick={onClick}>
      <h3>{title}</h3>
      <Icon icon={Icons.ArrowLink} size={ICON_24} color={ICON_PROMINENT} />
    </div>
  );
};

export default LinkBlock;
