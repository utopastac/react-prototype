import React from "react";
import { Avatars } from "src/data/Avatars";
import * as Icons from "src/data/Icons";
import { useLayersDispatch, CHANGE_LAYER } from 'src/containers/LayersContext';
import { useUser } from 'src/containers/UserContext';
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
    </HalfSheet>
  );
};

export default AccountSwitcherHalfsheet;
