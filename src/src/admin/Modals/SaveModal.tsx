import React from 'react';
import Modal from '../DevTools/Modal';
import TextButton from '../components/TextButton';
import styles from './index.module.sass';

interface SaveModalProps {
  saveName: string;
  onSaveNameChange: (name: string) => void;
  onSave: () => void;
  x?: number;
  y?: number;
  onClose: () => void;
}

const SaveModal: React.FC<SaveModalProps> = ({ saveName, onSaveNameChange, onSave, x, y, onClose }) => {
  return (
    <Modal
      title="Save Layout"
      x={x}
      y={y}
      close={onClose}
    >
      <div className={styles.SaveModal}>
        <input
          type="text"
          value={saveName}
          placeholder='Name your layout'
          onChange={e => onSaveNameChange(e.target.value)}
          autoFocus
          onKeyDown={e => { if (e.key === 'Enter') onSave(); }}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <TextButton text="Cancel" variant="secondary" onClick={onClose} />
          <TextButton text="Save" variant="primary" onClick={onSave} disabled={!saveName.trim()} />
        </div>
      </div>
    </Modal>
  );
};

export default SaveModal; 