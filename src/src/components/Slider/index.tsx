import { useRef, useState } from "react";
import styles from "./index.module.sass";
//
import { Draggable } from 'gsap/Draggable';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Draggable);

export interface SliderProps {
  onDrop: () => void;
  segmented?: number;
  leftLabel?: string;
  rightLabel?: string;
}

const Slider = ({ onDrop, segmented, leftLabel, rightLabel }: SliderProps) => {
  const handleRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  useGSAP(() => {
    if (!handleRef.current || !trackRef.current) return;

    const maxX = 375 - 32 - 12;
    const totalWidth = 375 - 32;
    const handleWidth = 12;
    const handleCenterOffset = handleWidth / 2;
    
    // Calculate snap positions if segmented (positions for handle's left edge)
    const snapPositions = segmented ? Array.from({ length: segmented }, (_, i) => {
      const markerPosition = ((i + 1) / (segmented + 1)) * totalWidth;
      // Position handle's left edge so its center aligns with marker
      const snapPos = markerPosition - handleCenterOffset;
      // Clamp to bounds
      return Math.max(0, Math.min(maxX, snapPos));
    }) : null;

    const draggable = Draggable.create(handleRef.current, {
      type: 'x',
      bounds: {
        minX: 0, maxX: maxX
      },
      onDrag: updateProgress,
      onThrowComplete: () => {
        if (segmented && snapPositions) {
          // Snap to nearest segment position
          const currentX = draggable.x;
          const nearestSnap = snapPositions.reduce((prev, curr) => {
            return Math.abs(curr - currentX) < Math.abs(prev - currentX) ? curr : prev;
          });
          gsap.to(handleRef.current, {
            x: nearestSnap,
            duration: 0.2,
            ease: "power2.out",
            onUpdate: () => {
              if (handleRef.current) {
                const x = gsap.getProperty(handleRef.current, "x") as number;
                updateTrackWidth(x);
              }
            },
            onComplete: () => {
              updateTrackWidth(nearestSnap);
              onDrop();
            }
          });
        } else {
          onDrop();
        }
      }
    })[0];
    
    function updateProgress() {
      if (trackRef.current && handleRef.current) {
        const x = draggable.x;
        updateTrackWidth(x);
      }
    }

    function updateTrackWidth(x: number) {
      if (trackRef.current) {
        gsap.to(trackRef.current, {duration: 0, width: x});
        setTrackWidth(x);
      }
    }

    updateProgress();
  }, [segmented, onDrop]);

  // Generate fixed marker positions across the track
  const totalWidth = 375 - 32;
  const markers = segmented ? Array.from({ length: segmented }, (_, i) => {
    // Evenly distribute markers across the full track width
    const position = ((i + 1) / (segmented + 1)) * totalWidth;
    // Determine if marker is filled based on handle position
    const isFilled = position <= trackWidth;
    return { position, isFilled, index: i };
  }) : [];

  return (
    <div className={styles.Main} data-segmented={segmented !== undefined}>
      <div className={styles.sliderContainer}>
        <div className={styles.trackBackground} />
        <div className={styles.track} ref={trackRef} />
        {markers.map((marker) => (
          <div
            key={marker.index}
            className={styles.marker}
            data-filled={marker.isFilled}
            style={{ left: `${marker.position}px` }}
          />
        ))}
        <div className={styles.handle} ref={handleRef} />
      </div>
      {(leftLabel || rightLabel) && (
        <div className={styles.labels}>
          {leftLabel && <span className={styles.label}>{leftLabel}</span>}
          {rightLabel && <span className={styles.label}>{rightLabel}</span>}
        </div>
      )}
    </div>
  );
};

export default Slider;

export const SliderPropMeta = {
  onDrop: { type: 'function', label: 'onDrop (not editable)' },
  segmented: { type: 'number', label: 'Segmented (number of segments)' },
  leftLabel: { type: 'string', label: 'Left Label' },
  rightLabel: { type: 'string', label: 'Right Label' },
};
