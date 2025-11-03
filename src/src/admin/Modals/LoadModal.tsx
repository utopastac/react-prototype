import React from 'react';
import Modal from '../DevTools/Modal';
import ToolbarButton from '../components/ToolbarButton';
import * as Icons from 'src/data/Icons';
import styles from './index.module.sass';

interface LoadModalProps {
  loadList: string[];
  loadError: string;
  onLoad: (name: string) => void;
  onDeleteSave: (name: string) => void;
  x?: number;
  y?: number;
  onClose: () => void;
}

const LoadModal: React.FC<LoadModalProps> = ({ loadList, loadError, onLoad, onDeleteSave, x, y, onClose }) => {
  return (
    <Modal
      title="Load Layout"
      x={x}
      y={y}
      close={onClose}
    >
      <div className={styles.LoadModal}>
        {loadList.length === 0 ? (
          <p>No saved layouts found.</p>
        ) : (
          <ul>
            {loadList.map(name => (
              <li key={name}>
                <h4 onClick={() => onLoad(name)}>{name}</h4>
                <ToolbarButton onClick={() => onDeleteSave(name)} title="Delete" icon={Icons.Clear16} position="left" />
              </li>
            ))}
          </ul>
        )}
        {loadError && <p>{loadError}</p>}
      </div>
    </Modal>
  );
};

export default LoadModal; 