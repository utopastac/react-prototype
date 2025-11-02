import React, { useCallback, useEffect } from 'react';
import styles from './styles.module.sass';
import { useTilt, TiltState } from 'src/containers/TiltContext';

interface TiltContainerProps {
  children: React.ReactNode;
  onTiltChange: (tilt: TiltState) => void;
  tilt: TiltState;
}

const TiltContainer = React.memo(({ children, onTiltChange, tilt }: TiltContainerProps) => {
  const { setTilt: setTiltContext } = useTilt();

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const x = (e.clientX / width) * 2 - 1;
      const y = (e.clientY / height) * 2 - 1;
      
      const distanceFromCenter = Math.min(1, Math.sqrt(x * x + y * y));
      const multiplier = 1 + Math.pow(distanceFromCenter, 2) * 3;
      
      const xTilt = -y * 15 * multiplier * 0.1;
      const yTilt = x * 10 * multiplier;
      const blurAmount = Math.abs(x * 2);
      
      const newTilt: TiltState = { x: xTilt, y: yTilt, blur: blurAmount, z: 0 };
      onTiltChange(newTilt);
      setTiltContext(newTilt);
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [onTiltChange, setTiltContext]);

  return (
    <div 
      className={styles.tiltContainer}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) rotateZ(${tilt.z}deg)`,
        transition: 'transform 0.1s ease-out',
        filter: `blur(${tilt.blur}px)`
      }}
    >
      {children}
    </div>
  );
});

TiltContainer.displayName = 'TiltContainer';

export default TiltContainer;