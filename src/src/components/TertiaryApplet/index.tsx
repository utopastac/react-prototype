import React from "react";
import styles from "./index.module.sass";
import AppletHeader from "src/components/AppletHeader";
import IconBg, {ICON_BG_CUSTOM} from "src/components/IconBg";
import Applet from "src/components/Applet";

export interface TertiaryAppletProps {
  title: string;
  icon: string;
  color: string;
  detail: string;
}

const TertiaryApplet: React.FC<TertiaryAppletProps> = ({ title, icon, color, detail }) => {

  return (
    <div className={styles.Main}>
      <Applet>
        <div className={styles.content}>
          <div>
            <AppletHeader
              title={title}
              label=""
            />
            <IconBg icon={icon} theme={ICON_BG_CUSTOM} customColor={color} />
          </div>
          <p>{detail}</p>
        </div>
      </Applet>
    </div>
  );
};

export default TertiaryApplet;
