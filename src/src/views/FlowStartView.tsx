import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './FlowStartView.module.sass';

interface FlowStartViewProps {
  content: string | React.ReactNode;
  startButtonPath: string;
  startButtonText?: string;
}

const FlowStartView: React.FC<FlowStartViewProps> = ({
  content,
  startButtonPath,
  startButtonText = 'Start',
}) => {

  useEffect(()=>{
  }, []);
  
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate(startButtonPath);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {typeof content === 'string' ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          content
        )}
      </div>
      
      <motion.button
        className={styles.startButton}
        onClick={handleStartClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {startButtonText}
      </motion.button>
    </div>
  );
};

export default FlowStartView; 