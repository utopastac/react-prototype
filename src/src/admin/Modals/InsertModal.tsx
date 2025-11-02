import React from 'react';
import { FormblockerComponents } from 'src/data/Components';
import { formatComponentName } from '../formatComponentName';
import Modal from '../DevTools/Modal';
import styles from './index.module.sass';

interface InsertModalProps {
  modalPos: { x: number; y: number };
  onInsertComponent: (name: string) => void;
  onClose: () => void;
}

const InsertModal: React.FC<InsertModalProps> = ({ modalPos, onInsertComponent, onClose }) => {
  return (
    <Modal
      title="Insert Component"
      x={modalPos.x}
      y={modalPos.y}
      close={onClose}
    >
      <div className={styles.InsertModal}>
        {Object.keys(FormblockerComponents)
          .sort((a, b) => a.localeCompare(b))
          .map(name => (
            <div
              key={name}
              className={styles.InsertComponentItem}
              onClick={() => onInsertComponent(name)}
            >
              {formatComponentName(name)}
            </div>
          ))}
      </div>
    </Modal>
  );
};

export default InsertModal; 