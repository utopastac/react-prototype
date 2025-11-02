import React from 'react';
import styles from './index.module.sass';

interface BounceEffectProps {
  enabled: boolean;
  children: React.ReactNode;
}

const BounceEffect: React.FC<BounceEffectProps> = ({ enabled, children }) => {
  return (
    <div className={`${styles.bounceContainer} ${enabled ? styles.bouncing : ''}`}>
      {children}
    </div>
  );
};

export default BounceEffect; 