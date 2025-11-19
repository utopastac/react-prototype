import React from "react";
import InterventionScreen, { InterventionScreenData } from 'src/containers/InterventionScreen';
import BottomSheet from 'src/components/BottomSheet';
//
interface InterventionScreenBottomSheetProps {
  data: InterventionScreenData;
}

const InterventionScreenBottomSheet: React.FC<InterventionScreenBottomSheetProps> = ({ data }) => {

  return (
    <BottomSheet>
      <InterventionScreen data={data} />
    </BottomSheet>
  );
};

export default InterventionScreenBottomSheet;
