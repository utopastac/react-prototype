import React, { ReactNode, UIEvent, useRef, useEffect } from 'react';
import styles from './index.module.sass';
import ModalBacker from 'src/components/ModalBacker';
import { useLayersDispatch, REMOVE_LAYER } from 'src/containers/LayersContext';

interface BottomSheetProps {
  children: ReactNode;
}

const BottomSheet = ({ children }: BottomSheetProps) => {
  const bottomSheet = useRef<HTMLDivElement>(null);
  const layersDispatch = useLayersDispatch();

  useEffect(() => {
    if (bottomSheet.current) {
      bottomSheet.current.scrollIntoView({
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
      <div className={styles.bottomSheet} ref={bottomSheet}>
        {children}
      </div>
    </div>
  );
};

export default BottomSheet; 