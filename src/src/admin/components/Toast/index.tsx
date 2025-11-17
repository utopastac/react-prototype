import React, { useEffect, useState } from 'react';
import styles from './index.module.sass';

interface AdminToastProps {
  message: string;
  onDone?: () => void;
}

const AdminToast: React.FC<AdminToastProps> = ({ message, onDone }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const hideTimeout = setTimeout(() => setVisible(false), 3000);
    const doneTimeout = setTimeout(() => onDone && onDone(), 3500);
    return () => {
      clearTimeout(hideTimeout);
      clearTimeout(doneTimeout);
    };
  }, [onDone]);

  return (
    <div className={`${styles.Main} ${visible ? styles.toastVisible : styles.toastHidden}`}>
      {message}
    </div>
  );
};

export default AdminToast; 