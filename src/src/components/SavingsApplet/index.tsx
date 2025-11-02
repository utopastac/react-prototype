import React from "react";
import styles from "./index.module.sass";
import AppletHeader from "src/components/AppletHeader";
import Applet from "src/components/Applet";
import CircularProgress from "src/components/CircularProgress";
import Umbrella from "src/assets/umbrella.png";
import { useUser } from 'src/containers/UserContext';
import * as Utils from "src/helpers/Utils";

const SavingsApplet: React.FC = () => {
  const userObject = useUser();
  const { savingsBalance, savingsTarget } = userObject;

  // Convert string values to numbers if needed
  const balance: number = typeof savingsBalance === 'string' ? parseFloat(savingsBalance) : savingsBalance;
  const target: number = typeof savingsTarget === 'string' ? parseFloat(savingsTarget) : savingsTarget;
  
  const remaining: number = (target - balance).toFixed(2);
  const completedPercentage: number = target > 0 ? balance / target : 0;

  return (
    <div className={styles.Main}>
      <Applet>
        <AppletHeader
          title="Savings"
          label=""
        />
        <div className={styles.balance}>
          <div>
            <h2>{`$${Utils.formatMoney(balance)}`}</h2>
            <p>{`$${Utils.formatMoney(remaining)} to goal`}</p>
          </div>
          <CircularProgress progress={completedPercentage} image={Umbrella} />
        </div>
      </Applet>
    </div>
  );
};

export default SavingsApplet;
