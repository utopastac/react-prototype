import React from "react";
import styles from "./index.module.sass";
import * as Icons from "src/data/Icons";
import BottomSheet from 'src/components/BottomSheet';
//

const AddAccountBottomSheet = () => {

  return (
    <BottomSheet>
      <div className={styles.content}>
        <h1>Add an account</h1>
      </div>
    </BottomSheet>
  );
};

export default AddAccountBottomSheet;
