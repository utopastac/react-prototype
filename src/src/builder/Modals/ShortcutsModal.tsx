import React from 'react';
import Modal from '../DevTools/Modal';
import KeyboardShortcutsPanel from 'src/builder/components/KeyboardShortcutsPanel';

interface ShortcutsModalProps {
  onClose: () => void;
}

const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ onClose }) => {
  return (
    <Modal
      title="Keyboard Shortcuts"
      x={650}
      y={40}
      close={onClose}
    >
      <KeyboardShortcutsPanel />
    </Modal>
  );
};

export default ShortcutsModal; 