import React from "react";
import InterventionScreen, { InterventionScreenData } from 'src/containers/InterventionScreen';
import HalfSheet from 'src/components/HalfSheet';
//
interface InterventionScreenHalfsheetProps {
  data: InterventionScreenData;
}

const InterventionScreenHalfsheet: React.FC<InterventionScreenHalfsheetProps> = ({ data }) => {

  return (
    <HalfSheet>
      <InterventionScreen data={data} />
    </HalfSheet>
  );
};

export default InterventionScreenHalfsheet;
