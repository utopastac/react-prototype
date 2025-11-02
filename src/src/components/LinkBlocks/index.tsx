import React from "react";
import styles from "./index.module.sass";
import LinkBlock, { LinkBlockProps } from "src/components/LinkBlock";

export interface LinkBlocksProps {
  blocks: Omit<LinkBlockProps, 'first'>[];
}

const LinkBlocks: React.FC<LinkBlocksProps> = ({ blocks }) => {
  const blocksRender = blocks.map((block, index) => {
    const { title, onClick } = block;
    return (
      <LinkBlock 
        title={title} 
        key={`LinkBlock${index}`} 
        onClick={onClick} 
        first={index === 0} 
      />
    );
  });

  return (
    <div className={styles.Main}>
      {blocksRender}
    </div>
  );
};

export default LinkBlocks;