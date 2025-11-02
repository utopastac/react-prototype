import React from "react";
import styles from "./index.module.sass";
import AppletHeader from "src/components/AppletHeader";
import Avatar, {AVATAR_28} from "src/components/Avatar";
import Applet from "src/components/Applet";

export interface SecondaryAppletProps {
  title: string;
  avatar: string;
  total: string;
  detail: string;
}

const SecondaryApplet: React.FC<SecondaryAppletProps> = ({ title, avatar, total, detail }) => {

  return (
    <div className={styles.Main}>
      <Applet>
        <AppletHeader
          title={title}
          label=""
        />
        <div className={styles.details}>
          <Avatar image={avatar} size={AVATAR_28} />
          <p><span>{total}</span> {detail}</p>
        </div>
      </Applet>
    </div>
  );
};

export default SecondaryApplet;
