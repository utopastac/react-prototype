import React from "react";
import Icon, {ICON_24, ICON_SUBTLE} from "src/components/Icon";
import * as Icons from "src/data/Icons";
import styles from "./index.module.sass";

interface AppletHeaderProps {
  title: string;
  label?: string;
}

const AppletHeader: React.FC<AppletHeaderProps> = ({ title, label }) => {
  return (
    <div className={styles.Main}>
      <h4>{title}</h4>
      <div className={styles.labelPush}>
        <p>{label}</p>
        <Icon icon={Icons.Push} size={ICON_24} color={ICON_SUBTLE} />
      </div>
    </div>
  );
};

export default AppletHeader;
