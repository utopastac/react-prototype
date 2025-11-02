import React, { ReactNode, UIEvent, useRef, useEffect } from 'react';
import styles from './index.module.sass';
import ModalBacker from 'src/components/ModalBacker';
import { useLayersDispatch, REMOVE_LAYER } from 'src/containers/LayersContext';

interface HalfSheetProps {
  children: ReactNode;
}

const HalfSheet = ({ children }: HalfSheetProps) => {
  const halfSheet = useRef<HTMLDivElement>(null);
  const layersDispatch = useLayersDispatch();

  useEffect(() => {
    if (halfSheet.current) {
      halfSheet.current.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, []);

  const yScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    if (target.scrollTop === 0 && layersDispatch) {
      layersDispatch({ type: REMOVE_LAYER });
    }
  };

  return (
    <div className={styles.Main} onScroll={yScroll}>
      <ModalBacker />
      <div className={styles.halfSheet} ref={halfSheet}>
        {children}
      </div>
    </div>
  );
};

export default HalfSheet; 