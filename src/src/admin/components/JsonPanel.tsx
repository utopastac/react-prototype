import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolbarButton from 'src/admin/components/ToolbarButton';
import { ICON_INVERSE } from 'src/components/Icon';
import * as Icons from 'src/data/Icons';
import styles from '../index.module.sass';
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
  return (
      <AnimatePresence>
        {visible && (
          <motion.div
            className={`${styles.AdminPanel} ${styles.JsonPanel} ${styles.rightSide}`}
          initial={{ x: '100%', width: 0 }}
          animate={{ x: 0, width: 280 }}
          exit={{ x: '100%', width: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        >
            <header className={styles.PanelHeader}>
              <div>
              <h2>JSON (all screens)</h2>
                <div className={styles.actions}>
                  <ToolbarButton 
                    onClick={handleDownloadJson} 
                    icon={Icons.Download16} 
                    title="Download JSON" 
                    iconColor={ICON_INVERSE} 
                    position="bottom" 
                  />
                  <ToolbarButton 
                    onClick={handleCopyJson} 
                    icon={Icons.Copy16} 
                    title="Copy JSON" 
                    iconColor={ICON_INVERSE} 
                    position="bottom" 
                  />
                  <ToolbarButton 
                    onClick={onClose} 
                    icon={Icons.Failed16} 
                    title="Close" 
                    iconColor={ICON_INVERSE} 
                    position="bottom" 
                  />
                </div>
              </div>
            </header>
            <div className={styles.layoutJson}>
            <pre>{JSON.stringify(getLayoutData(), null, 2)}</pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
  );
};

export default JsonPanel; 