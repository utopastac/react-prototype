import React from "react";
import { Avatars } from "src/data/Avatars";
import * as Icons from "src/data/Icons";
import { useLayersDispatch, CHANGE_LAYER } from 'src/containers/LayersContext';
import { useUser } from 'src/containers/UserContext';
import AddAccountBottomSheet from "src/views/bottomsheets/AddAccountBottomSheet";
import BottomSheet from 'src/components/BottomSheet';
//

const AccountSwitcherBottomSheet = () => {

  const layersDispatch = useLayersDispatch();

  const userObject = useUser();
  const { name, headline, avatar } = userObject;

  function changeLayer(){
    if (layersDispatch) {
      layersDispatch({
        type: CHANGE_LAYER,
        component: AddAccountBottomSheet,
        props: {}
      });
    }
  }

  return (
    <BottomSheet>
    </BottomSheet>
  );
};

export default AccountSwitcherBottomSheet;
