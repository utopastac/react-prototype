import React from "react";
import Icon from "src/components/Icon";
import * as Icons from "src/data/Icons";
import styles from "./index.module.sass";

export interface DisclaimerProps {
  className?: string;
}

const Disclaimer: React.FC<DisclaimerProps> = ({ className }) => {
  return (
    <div className={`${styles.Main} ${className || ''}`}>
      <Icon icon={Icons.Push} size="24" color="subtle" />
      <p>Your balance is FDIC-insured through our partner banks, Wells Fargo Bank, N.A. and Sutton Bank, Members FDIC, for up to $250,000 per person. Prepaid debit cards issued by Sutton Bank.<a>Learn more.</a></p>
      <p>Interventions Hub's <a>Privacy Notice</a>, <a>Terms of Service</a>, and <a>Open Source Software</a></p>
      <p>Version 4.47 (4470000)</p>
    </div>
  );
};

export default Disclaimer;

export const DisclaimerPropMeta = {
  className: { type: 'string', label: 'Class Name' },
};
