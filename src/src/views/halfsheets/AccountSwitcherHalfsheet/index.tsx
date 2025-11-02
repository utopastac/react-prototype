import React from "react";
import { Avatars } from "src/data/Avatars";
import * as Icons from "src/data/Icons";
import { useLayersDispatch, CHANGE_LAYER } from 'src/containers/LayersContext';
import { useUser } from 'src/containers/UserContext';
import Cell, { 
  CELL_AVATAR, 
  CELL_ICON_BG, 
  CELL_RADIO, 
  CELL_PUSH
} from 'src/components/Cell';
import { ICON_BG_GRAY } from 'src/components/IconBg';
import AddAccountHalfsheet from "src/views/halfsheets/AddAccountHalfsheet";
import HalfSheet from 'src/components/HalfSheet';
import { AVATAR_48 } from 'src/components/Avatar';
//

const AccountSwitcherHalfsheet = () => {

  const layersDispatch = useLayersDispatch();

  const userObject = useUser();
  const { name, cashtag, avatar } = userObject;

  function changeLayer(){
    if (layersDispatch) {
      layersDispatch({
        type: CHANGE_LAYER,
        component: AddAccountHalfsheet,
        props: {}
      });
    }
  }

  return (
    <HalfSheet>
      <Cell
        title={name}
        body={cashtag}
        left={{
          type: CELL_AVATAR,
          image: avatar,
          size: AVATAR_48
        }}
        right={{
          type: CELL_RADIO,
          checked: true
        }}
        onClick={()=>{}}
      />
      <Cell
        title="Diego Martinez"
        body="$dmartinez"
        left={{
          type: CELL_AVATAR,
          image: Avatars.Paul,
          size: AVATAR_48
        }}
        right={{
          type: CELL_RADIO,
          checked: false
        }}
        onClick={()=>{}}
      />
      <Cell
        title="Add account"
        left={{
          type: CELL_ICON_BG,
          icon: Icons.Add24,
          theme: ICON_BG_GRAY
        }}
        right={{
          type: CELL_PUSH
        }}
        onClick={()=>{
          changeLayer();
        }}
      />
    </HalfSheet>
  );
};

export default AccountSwitcherHalfsheet;
