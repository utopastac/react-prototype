import React from "react";
import styles from "./index.module.sass";
import * as Icons from "src/data/Icons";
import { transitions } from 'src/hooks/useTransitionNavigate';
import { BUTTON_ACTION_PATH } from 'src/hooks/useButtonAction';
import Cell, { 
  CELL_ICON_BG,  
  CELL_PUSH,
} from 'src/components/Cell';
import { ICON_BG_GRAY } from 'src/components/IconBg';
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
            type: CELL_ICON_BG,
            icon: Icons.Avatar24,
            theme: ICON_BG_GRAY
          }}
          right={{
            type: CELL_PUSH
          }}
          onClick={()=>{
            // TODO: Implement personal account creation
          }}
        />
        <Cell
          title="New business account"
          body="Create an account to sell goods and services."
          left={{
            type: CELL_ICON_BG,
            icon: Icons.Business24,
            theme: ICON_BG_GRAY
          }}
          right={{
            type: CELL_PUSH
          }}
          onClick={()=>{
            // TODO: Implement business account creation
          }}
        />
        <Cell
          title="Existing account"
          body="Connect your accounts to switch seamlessly between them."
          left={{
            type: CELL_ICON_BG,
            icon: Icons.BankLinked24,
            theme: ICON_BG_GRAY
          }}
          right={{
            type: CELL_PUSH
          }}
          action = {
            {
              type: BUTTON_ACTION_PATH,
              path: '/account-linking',
              transition: transitions.defaultTransition
            }
          }
        />
      </div>
    </HalfSheet>
  );
};

export default AddAccountHalfsheet;
