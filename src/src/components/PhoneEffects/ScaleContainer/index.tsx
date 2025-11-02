import React, { useCallback, useEffect, useState } from 'react';
import styles from './styles.module.sass';

interface ScaleContainerProps {
  children: React.ReactNode;
  enabled: boolean;
}

const ScaleContainer = React.memo(({ children, enabled }: ScaleContainerProps) => {
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    if (!enabled) {
      setScale(1);
      return;
    }

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Calculate distance from center (0,0 is center, 1 is edge)
      const x = (e.clientX / width) * 2 - 1;
      const y = (e.clientY / height) * 2 - 1;
      
      const distanceFromCenter = Math.sqrt(x * x + y * y);
      
      // Scale range: 0.8 to 1.2 based on distance from center
      // Closer to center = larger scale, further from center = smaller scale
      const minScale = 0.8;
      const maxScale = 1.2;
      const newScale = maxScale - (distanceFromCenter * (maxScale - minScale));
      
      setScale(Math.max(minScale, Math.min(maxScale, newScale)));
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [enabled]);

  return (
    <div 
      className={styles.scaleContainer}
      style={{
        transform: `scale(${scale})`,
        transition: enabled ? 'transform 0.1s ease-out' : 'transform 0.3s ease-out',
        transformOrigin: 'center center'
      }}
    >
      {children}
    </div>
  );
});

ScaleContainer.displayName = 'ScaleContainer';

export default ScaleContainer; 