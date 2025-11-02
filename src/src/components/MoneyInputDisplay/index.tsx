import React from "react";
import styles from "./index.module.sass";
import * as Utils from "src/helpers/Utils";

export interface MoneyInputDisplayProps {
  total: string;
}

const MoneyInputDisplay: React.FC<MoneyInputDisplayProps> = ({ total }) => {
  let styleClass = styles.large;
  const length = total.length;
  if(length > 4 && length <= 6){
    styleClass = styles.medium;
  } else if(length > 6) {
    styleClass = styles.small;
  }

  const [main, decimal] = total.split(".");

  return (
    <div className={`${styles.Main} ${styleClass}`}>
      <h1>
        ${Utils.formatMoney(parseFloat(main))}
        {decimal && (
          <span>.<span>{decimal}</span></span>
        )}
      </h1>
    </div>
  );
};

export default MoneyInputDisplay;
