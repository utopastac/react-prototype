import React from "react";
import { Avatars } from "src/data/Avatars";
import * as Icons from "src/data/Icons";
import { useLayersDispatch, CHANGE_LAYER } from 'src/containers/LayersContext';
import { useUser } from 'src/containers/UserContext';
import Cell from 'src/components/Cell';
import AddAccountHalfsheet from "src/views/halfsheets/AddAccountHalfsheet";
import HalfSheet from 'src/components/HalfSheet';
//

const AccountSwitcherHalfsheet = () => {

  const layersDispatch = useLayersDispatch();

  const userObject = useUser();
  const { name, headline, avatar } = userObject;

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
        body={headline}
        left={{
          type: "avatar",
          image: avatar,
          size: "48"
        }}
        right={{
          type: "radio",
          checked: true
        }}
        onClick={()=>{}}
      />
      <Cell
        title="Diego Martinez"
        body="$dmartinez"
        left={{
          type: "avatar",
          image: Avatars.Paul,
          size: "48"
        }}
        right={{
          type: "radio",
          checked: false
        }}
        onClick={()=>{}}
      />
      <Cell
        title="Add account"
        left={{
          type: "iconBg",
          icon: Icons.Add24,
          theme: "grey"
        }}
        right={{
          type: "push"
        }}
        onClick={()=>{
          changeLayer();
        }}
      />
    </HalfSheet>
  );
};

export default AccountSwitcherHalfsheet;
