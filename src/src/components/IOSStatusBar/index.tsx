import React, { useState, useEffect } from "react";
import styles from "./index.module.sass";
import { useTabBackground } from 'src/containers/TabBackgroundContext';

export interface IOSStatusBarProps {
  showNotch?: boolean;
  transparent?: boolean;
  inverse?: boolean;
}

const IOSStatusBar: React.FC<IOSStatusBarProps> = ({ showNotch = false, transparent, inverse = false }) => {
  const [time, setTime] = useState<string>("");
  const tabBackground = useTabBackground();

  useEffect(() => {
    const updateTime = (): void => {
      const now = new Date();
      const hours: number = now.getHours();
      const minutes: number = now.getMinutes();
      setTime(`${hours}:${minutes.toString().padStart(2, '0')}`);
    };

    updateTime();
    const interval: ReturnType<typeof setInterval> = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${styles.Main} ${transparent && styles.transparent} ${inverse && styles.inverse}`}>
      <div className={styles.statusBar}>
        <div className={styles.leftItems}>
          <div className={styles.time}>{time}</div>
        </div>
        { showNotch && (
          <div className={styles.notch}>
            <div className={styles.notchInner}></div>
          </div>
        )}
        <div className={styles.rightItems}>
          <div className={styles.signalStrength}>
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M19.865 2.03302C19.865 1.39997 19.3875 0.886791 18.7984 0.886791H17.7317C17.1426 0.886791 16.665 1.39997 16.665 2.03302V11.967C16.665 12.6 17.1426 13.1132 17.7317 13.1132H18.7984C19.3875 13.1132 19.865 12.6 19.865 11.967V2.03302ZM12.4309 3.33207H13.4976C14.0867 3.33207 14.5643 3.85757 14.5643 4.50581V11.9395C14.5643 12.5877 14.0867 13.1132 13.4976 13.1132H12.4309C11.8418 13.1132 11.3643 12.5877 11.3643 11.9395V4.50581C11.3643 3.85757 11.8418 3.33207 12.4309 3.33207ZM8.09915 5.98112H7.03249C6.44338 5.98112 5.96582 6.51331 5.96582 7.1698V11.9245C5.96582 12.581 6.44338 13.1132 7.03249 13.1132H8.09915C8.68826 13.1132 9.16582 12.581 9.16582 11.9245V7.1698C9.16582 6.51331 8.68826 5.98112 8.09915 5.98112ZM2.79837 8.42641H1.73171C1.1426 8.42641 0.665039 8.951 0.665039 9.59811V11.9415C0.665039 12.5886 1.1426 13.1132 1.73171 13.1132H2.79837C3.38748 13.1132 3.86504 12.5886 3.86504 11.9415V9.59811C3.86504 8.951 3.38748 8.42641 2.79837 8.42641Z" fill="currentColor"/>
            </svg>
          </div>
          <div className={styles.wifi}>
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M8.50047 2.58753C10.967 2.58764 13.3393 3.55505 15.1269 5.28982C15.2615 5.42375 15.4766 5.42206 15.6092 5.28603L16.896 3.96045C16.9631 3.89146 17.0006 3.798 17 3.70076C16.9994 3.60353 16.9609 3.51052 16.893 3.44234C12.2011 -1.14745 4.79908 -1.14745 0.107163 3.44234C0.0391973 3.51047 0.000634479 3.60345 7.75932e-06 3.70069C-0.00061896 3.79792 0.0367421 3.89141 0.103824 3.96045L1.39096 5.28603C1.52346 5.42226 1.73878 5.42396 1.87331 5.28982C3.66116 3.55494 6.03367 2.58752 8.50047 2.58753ZM8.53591 6.58937C9.89112 6.58929 11.198 7.10346 12.2025 8.03199C12.3384 8.16376 12.5524 8.16091 12.6849 8.02555L13.9702 6.69997C14.0379 6.63044 14.0754 6.53611 14.0744 6.4381C14.0735 6.34008 14.034 6.24656 13.965 6.17844C10.9059 3.27385 6.16853 3.27385 3.10945 6.17844C3.04035 6.24656 3.00092 6.34013 3.00002 6.43817C2.99911 6.53622 3.0368 6.63054 3.10462 6.69997L4.38954 8.02555C4.52199 8.16091 4.73602 8.16376 4.87189 8.03199C5.87578 7.10408 7.18159 6.58995 8.53591 6.58937ZM11.1496 9.17672C11.1515 9.27501 11.1137 9.36977 11.0449 9.43863L8.82165 11.7289C8.75648 11.7962 8.66762 11.834 8.57491 11.834C8.4822 11.834 8.39334 11.7962 8.32817 11.7289L6.10452 9.43863C6.03583 9.36972 5.99804 9.27492 6.00008 9.17663C6.00212 9.07834 6.0438 8.98527 6.11528 8.91938C7.53515 7.69354 9.61467 7.69354 11.0345 8.91938C11.106 8.98532 11.1476 9.07843 11.1496 9.17672Z" fill="currentColor"/>
            </svg>
          </div>
          <div className={styles.battery}>
            <div className={styles.batteryIcon}>
              <div className={styles.batteryLevel}></div>
              <div className={styles.batteryPercentage}>70</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IOSStatusBar;

// Add prop meta for admin panel editing
export const IOSStatusBarPropMeta = {
  showNotch: { type: 'boolean', label: 'Show notch' },
  transparent: { type: 'boolean', label: 'Transparent bg' },
  inverse: { type: 'boolean', label: 'Inverse' }
};

