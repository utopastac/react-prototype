import React, { type ReactNode } from "react";
import styles from "./index.module.sass";

export interface PageWrapperProps {
  children: ReactNode;
  background?: boolean;
}

const PageWrapper = ({ children, background }: PageWrapperProps): JSX.Element => {
  return (
    <div className={`${styles.Main} ${background ? styles.background : ""}`}>
      {children}
    </div>
  );
};

export default PageWrapper;
