import React from "react";
import styles from "./index.module.sass";
import * as Icons from "src/data/Icons";
import HalfSheet from 'src/components/HalfSheet';
//

const AddAccountHalfsheet = () => {

  return (
    <HalfSheet>
      <div className={styles.content}>
        <h1>Add an account</h1>
      </div>
    </HalfSheet>
  );
};

export default AddAccountHalfsheet;
