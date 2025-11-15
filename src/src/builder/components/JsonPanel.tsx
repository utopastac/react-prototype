import React from 'react';
import Modal from 'src/admin/Modal';
import ToolbarButton from 'src/admin/components/ToolbarButton';
import * as Icons from 'src/data/Icons';
import styles from 'src/builder/index.module.sass';
import { downloadAsFile } from 'src/helpers/Utils';

interface JsonPanelProps {
  visible: boolean;
  onClose: () => void;
  getLayoutData: () => any;
  showToast?: (message: string) => void;
}

const JsonPanel: React.FC<JsonPanelProps> = ({ visible, onClose, getLayoutData, showToast }) => {
  const handleDownloadJson = () => {
    const json = JSON.stringify(getLayoutData(), null, 2);
    downloadAsFile(json, 'layout.json', 'application/json');
  };
  const handleCopyJson = () => {
    const json = JSON.stringify(getLayoutData(), null, 2);
    navigator.clipboard.writeText(json).then(() => {
      showToast?.('Copied JSON to clipboard');
    });
  };
  
  if (!visible) return null;
  
  return (
    <Modal
      title="JSON (all screens)"
      showBackground={true}
      close={onClose}
      className={styles.JsonModal}
    >
      <div className={styles.JsonModalContent}>
        <div className={styles.JsonModalActions}>
          <ToolbarButton 
            onClick={handleDownloadJson} 
            icon={Icons.Download16} 
            title="Download JSON" 
            position="left" 
          />
          <ToolbarButton 
            onClick={handleCopyJson} 
            icon={Icons.Copy16} 
            title="Copy JSON" 
            position="left" 
          />
        </div>
        <div className={styles.JsonModalScroll}>
          <pre>{JSON.stringify(getLayoutData(), null, 2)}</pre>
        </div>
      </div>
    </Modal>
  );
};

export default JsonPanel; 