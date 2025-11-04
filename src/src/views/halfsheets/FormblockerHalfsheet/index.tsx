import React from "react";
import InterventionScreen, { InterventionScreenData } from 'src/containers/InterventionScreen';
import HalfSheet from 'src/components/HalfSheet';
//
interface FormblockerHalfsheetProps {
  data: InterventionScreenData;
}

const FormblockerHalfsheet: React.FC<FormblockerHalfsheetProps> = ({ data }) => {

  return (
    <HalfSheet>
      <InterventionScreen data={data} />
    </HalfSheet>
  );
};

export default FormblockerHalfsheet;
