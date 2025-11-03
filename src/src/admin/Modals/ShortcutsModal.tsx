import React from 'react';
import Modal from '../DevTools/Modal';
import KeyboardShortcutsPanel from 'src/admin/components/KeyboardShortcutsPanel';

interface ShortcutsModalProps {
  onClose: () => void;
  x?: number;
  y?: number;
}

const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ onClose, x, y }) => {
  return (
    <Modal
      title="Keyboard Shortcuts"
      x={x}
      y={y}
      close={onClose}
    >
      <KeyboardShortcutsPanel />
    </Modal>
  );
};

export default ShortcutsModal; 