import React from 'react';
import Modal from '../DevTools/Modal';
import TextButton from '../components/TextButton';
import styles from './index.module.sass';

interface WelcomeModalProps {
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  return (
    <Modal
      title="Getting started"
      showBackground={true}
      close={onClose}
      className={styles.WelcomeModal}
    >
      <div className={styles.WelcomeContent}>
        <div className={styles.WelcomeSection}>
          <h4>🎉 Welcome to the Interventions Hub InterventionScreen Builder</h4>
          <p>
            This is a tool for building and sharing Interventions Hub InterventionScreen interfaces. 
            Here's what you can do:
          </p>
        </div>
        
        <div className={styles.WelcomeSection}>
          <h4>🚀 Getting Started</h4>
          <ul>
            <li><strong>Edit Properties:</strong> Click on any component to edit its properties</li>
            <li><strong>Save & Share:</strong> Save your layouts and share them via URL</li>
          </ul>
        </div>

        <div className={styles.WelcomeSection}>
          <h4>💡 Pro Tips</h4>
          <ul>
            <li>Use templates to quickly start with pre-built layouts</li>
            <li>Check out the keyboard shortcuts to make things faster</li>
            <li>Customize the top bar and bottom buttons for complete layouts</li>
          </ul>
        </div>

        <div className={styles.WelcomeFooter}>
          <TextButton text="Get started" variant="primary" onClick={onClose} />
        </div>
      </div>
    </Modal>
  );
};

export default WelcomeModal; 