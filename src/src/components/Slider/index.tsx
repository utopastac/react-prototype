import React, { useRef } from "react";
import styles from "./index.module.sass";
//
import { Draggable } from 'gsap/Draggable';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Draggable);

export interface SliderProps {
  onDrop: () => void;
}

const Slider = ({ onDrop }: SliderProps) => {
  const thumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!thumbRef.current || !trackRef.current) return;

    const draggable = Draggable.create(thumbRef.current, {
      type: 'x',
      bounds: {
        minX: 0, maxX: 375-48-28
      },
      onDrag: updateProgress,
      onThrowComplete: () => {
        onDrop();
      }
    })[0];
    
    function updateProgress() {
      if (trackRef.current) {
        gsap.to(trackRef.current, {duration: 0, width: draggable.x});
      }
    }

    updateProgress();
  }, []);

  return (
    <div className={styles.Main}>
      <div className={styles.trackBackground} />
      <div className={styles.track} ref={trackRef} />
      <div className={styles.thumb} ref={thumbRef} />
    </div>
  );
};

export default Slider;

export const SliderPropMeta = {
  onDrop: { type: 'function', label: 'onDrop (not editable)' },
};
