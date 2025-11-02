import React from 'react';
import Modal from '../DevTools/Modal';
import styles from './index.module.sass';
import { formatTime } from 'src/helpers/Utils';

interface HistoryModalProps {
  history: any; // useHistoryStack object
  onClose: () => void;
  onJumpTo: (idx: number) => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ history, onClose, onJumpTo }) => {
  // Compose a flat list of all history entries with their labels
  const entries = [
    ...history.past.map((h: any, i: number) => ({ ...h, idx: i, type: 'past' })),
    { ...history.present, idx: history.past.length, type: 'present' },
    ...history.future.map((h: any, i: number) => ({ ...h, idx: history.past.length + 1 + i, type: 'future' })),
  ];

  return (
    <Modal title="History" x={650} y={100} close={onClose}>
      <div className={styles.HistoryModal}>
        <ol className={styles.HistoryList}>
          {entries.map((entry, i) => (
            <li
              key={i}
              className={[
                styles.HistoryEntry,
                entry.type === 'present' ? styles.HistoryEntryCurrent : '',
                entry.type === 'future' ? styles.HistoryEntryFuture : '',
              ].filter(Boolean).join(' ')}
              onClick={() => entry.type !== 'present' && onJumpTo(entry.idx)}
              title={entry.label || entry.source || (entry.type === 'present' ? 'Current' : 'Change')}
            >
              <span className={styles.HistoryLabel}>
                {entry.label || entry.source || (entry.type === 'present' ? 'Current' : 'Change')}
                {entry.type === 'present' && ' (current)'}
              </span>
              <span className={styles.HistoryTimestamp}>
                {entry.timestamp ? formatTime(entry.timestamp) : ''}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Modal>
  );
};

export default HistoryModal; 