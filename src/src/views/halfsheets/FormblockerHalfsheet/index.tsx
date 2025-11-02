import React from "react";
import Formblocker, { FormblockerData } from 'src/containers/Formblocker';
import HalfSheet from 'src/components/HalfSheet';
//
interface FormblockerHalfsheetProps {
  data: FormblockerData;
}

const FormblockerHalfsheet: React.FC<FormblockerHalfsheetProps> = ({ data }) => {

  return (
    <HalfSheet>
      <Formblocker data={data} />
    </HalfSheet>
  );
};

export default FormblockerHalfsheet;
