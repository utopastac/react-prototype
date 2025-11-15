import React from "react";
import styles from "./index.module.sass";
import * as Icons from "src/data/Icons";
import Cell from 'src/components/Cell';
import HalfSheet from 'src/components/HalfSheet';
//

const AddAccountHalfsheet = () => {

  return (
    <HalfSheet>
      <div className={styles.content}>
        <h1>Add an account</h1>
        <Cell
          title="New personal account"
          body="Create an account to send money to friends and family."
          left={{
            type: "iconBg",
            icon: Icons.Avatar24,
            theme: "grey"
          }}
          right={{
            type: "push"
          }}
          onClick={()=>{
            // TODO: Implement personal account creation
          }}
        />
        <Cell
          title="Existing account"
          body="Connect your accounts to switch seamlessly between them."
          left={{
            type: "iconBg",
            icon: Icons.Alert24,
            theme: "grey"
          }}
          right={{
            type: "push"
          }}
          onClick={()=>{
            // TODO: Implement account linking
          }}
        />
      </div>
    </HalfSheet>
  );
};

export default AddAccountHalfsheet;
