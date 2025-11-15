import React, { useRef, useEffect, useState } from 'react';
import styles from 'src/admin/components/LabeledInput/index.module.sass';
import { Draggable } from 'gsap/Draggable';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(Draggable);

interface SliderInputProps {
  label: string;
  value: number; // between 0 and 1
  onChange: (value: number) => void;
  inputStyle?: React.CSSProperties;
}

const THUMB_SIZE = 16;

const SliderInput: React.FC<SliderInputProps> = ({ label, value, onChange, inputStyle }) => {
  const thumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderWidth, setSliderWidth] = useState(160); // default fallback

  // Dynamically measure the width of the container
  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setSliderWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    // Use ResizeObserver if available
    let observer: ResizeObserver | null = null;
    if (window.ResizeObserver) {
      observer = new ResizeObserver(() => {
        updateWidth();
      });
      observer.observe(containerRef.current);
    } else {
      // Fallback for older browsers
      window.addEventListener('resize', updateWidth);
    }
    return () => {
      if (observer && containerRef.current) observer.unobserve(containerRef.current);
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Update thumb position when value or sliderWidth changes
  useEffect(() => {
    if (thumbRef.current) {
      gsap.set(thumbRef.current, { x: value * (sliderWidth - THUMB_SIZE) });
    }
    if (trackRef.current) {
      gsap.set(trackRef.current, { width: value * (sliderWidth - THUMB_SIZE) + THUMB_SIZE / 2 });
    }
  }, [value, sliderWidth]);

  useGSAP(() => {
    if (!thumbRef.current || !containerRef.current || !trackRef.current) return;
    const maxX = sliderWidth - THUMB_SIZE;
    const draggable = Draggable.create(thumbRef.current, {
      type: 'x',
      bounds: { minX: 0, maxX },
      onDrag: function () {
        const newValue = maxX === 0 ? 0 : this.x / maxX;
        if (trackRef.current) {
          gsap.set(trackRef.current, { width: this.x + THUMB_SIZE / 2 });
        }
        onChange(Math.max(0, Math.min(1, newValue)));
      },
      inertia: false,
    })[0];
    // Clean up
    return () => {
      draggable && draggable.kill();
    };
  }, [onChange, sliderWidth]);

  // Handle click on the slider track
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !thumbRef.current || !trackRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    const maxX = sliderWidth;
    x = Math.max(0, Math.min(maxX, x));
    const t = maxX === 0 ? 0 : x / maxX;
    // Animate thumb and track
    gsap.to(thumbRef.current, { x: t * (sliderWidth - THUMB_SIZE), duration: 0.2, overwrite: 'auto' });
    gsap.to(trackRef.current, { width: t * (sliderWidth - THUMB_SIZE) + THUMB_SIZE / 2, duration: 0.2, overwrite: 'auto' });
    onChange(Math.max(0, Math.min(1, t)));
  };

  return (
    <div className={`${styles.SliderInput} ${styles.Input}`} style={inputStyle}>
      <label>{label}</label>
      <div className={styles.sliderOuter} onClick={handleTrackClick} ref={containerRef}>
        <div className={styles.trackBackground} />
        <div
          className={styles.track}
          ref={trackRef}
          style={{ width: value * (sliderWidth - THUMB_SIZE) + THUMB_SIZE / 2 }}
        />
        <div
          className={styles.thumb}
          ref={thumbRef}
        />
      </div>
    </div>
  );
};

export default React.memo(SliderInput); 