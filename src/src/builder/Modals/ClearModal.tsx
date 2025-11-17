import React from 'react';
import Modal from 'src/admin/Modal';
import TextButton from 'src/admin/components/TextButton';
import styles from 'src/builder/Modals/index.module.sass';

interface ClearModalProps {
  onClear: () => void;
  onClose: () => void;
}

const ClearModal: React.FC<ClearModalProps> = ({ onClear, onClose }) => {
  return (
    <Modal
      title="Clear Layout?"
      showBackground={true}
      close={onClose}
    >
      <div className={styles.ConfirmModal}>
        <p>Are you sure you want to clear your layout? This cannot be undone.</p>
        <div>
          <TextButton text="Cancel" variant="secondary" onClick={onClose} />
          <TextButton text="Clear" variant="primary" onClick={onClear} />
        </div>
      </div>
    </Modal>
  );
};

export default ClearModal; 