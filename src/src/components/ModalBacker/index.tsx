import React from "react";
import { useLayersDispatch, REMOVE_LAYER } from 'src/containers/LayersContext';
import styles from "./index.module.sass";
//
const ModalBacker: React.FC = () => {

  const layersDispatch = useLayersDispatch();

  function closeLayers() {
    if (layersDispatch) {
      layersDispatch({
        type: REMOVE_LAYER
      }); 
    }
  }

  return (
    <div className={styles.Main} onClick={closeLayers}>
    </div>
  );
};

export default ModalBacker;
