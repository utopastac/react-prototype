import React, { ReactNode } from "react";
import styles from "./index.module.sass";

interface AppletProps {
  children: ReactNode;
}

const Applet: React.FC<AppletProps> = ({ children }) => {
  return (
    <div className={styles.Main}>
      {children}
    </div>
  );
};

export default Applet;
