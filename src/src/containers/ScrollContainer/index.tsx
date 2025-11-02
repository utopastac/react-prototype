import React, { ReactNode } from "react";
import Divider, { DIVIDER_WITHIN_SECTION_MEDIUM } from "src/components/Divider";
import styles from "./index.module.sass";

export interface ScrollContainerProps {
  children: ReactNode;
  className?: string;
}

const ScrollContainer: React.FC<ScrollContainerProps> = ({ children, className }) => {
  return (
    <div className={styles.Main}>
      <Divider size={DIVIDER_WITHIN_SECTION_MEDIUM} />
      <div className={className}>{children}</div>
    </div>
  );
};

export default ScrollContainer;
