import React, { createElement, useRef, FC } from "react";
import styles from "./index.module.sass";
import { useLayers, useLayersDispatch, CLOSE_LAYERS } from 'src/containers/LayersContext';
import { motion, AnimatePresence } from "framer-motion";

const Layers: FC = () => {
  const scrimRef = useRef<HTMLDivElement>(null);

  const layers = useLayers();
  const layersDispatch = useLayersDispatch();

  if (!layers || !layersDispatch) {
    return null;
  }

  const layerElements = layers.map((layer, index) => {
    const { component, props } = layer;
    return createElement(component, { ...props, key: `Layer${index}` });
  });

  function closeLayers() {
    if (layersDispatch) {
      layersDispatch({
        type: CLOSE_LAYERS
      }); 
    }
  }

  return (
    <div className={styles.Main}>
      <AnimatePresence>
        {layers.length > 0 && (
          <motion.div
            className={styles.scrim}
            ref={scrimRef}
            onClick={closeLayers}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>
      {layerElements}
    </div>
  );
};

export default Layers;
