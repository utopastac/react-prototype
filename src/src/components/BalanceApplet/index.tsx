import React from "react";
import styles from "./index.module.sass";
import AppletHeader from "src/components/AppletHeader";
import Applet from "src/components/Applet";
import ButtonGroup from "src/components/ButtonGroup";
import { useUser } from 'src/containers/UserContext';
import * as Utils from "src/helpers/Utils";

const BalanceApplet: React.FC = () => {
  const userObject = useUser();
  const { balance } = userObject;

  // Convert string balance to number for formatting
  const numericBalance = parseFloat(balance);

  return (
    <div className={styles.Main}>
      <Applet>
        <AppletHeader
          title="Cash"
          label="Account & routing"
        />
        <div className={styles.balance}>
          <h2>{`$${Utils.formatMoney(numericBalance)}`}</h2>
        </div>
        <ButtonGroup
          buttons={[
            {title: "Add money", onClick: ()=>{}},
            {title: "Withdraw", onClick:()=>{}}
          ]}
          horizontal={true}
          inComponent={true}
        />
      </Applet>
    </div>
  );
};

export default BalanceApplet;
