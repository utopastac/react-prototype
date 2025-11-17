import React, { ReactNode } from "react";
import Divider from "src/components/Divider";
import styles from "./index.module.sass";

export interface ScrollContainerProps {
  children: ReactNode;
  className?: string;
}

const ScrollContainer: React.FC<ScrollContainerProps> = ({ children, className }) => {
  return (
    <div className={styles.Main}>
      <Divider size="medium" />
      <div className={className}>{children}</div>
    </div>
  );
};

export default ScrollContainer;
