import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolbarButton from 'src/admin/components/ToolbarButton';
import { ICON_INVERSE } from 'src/components/Icon';
import * as Icons from 'src/data/Icons';
import styles from '../index.module.sass';
import { downloadAsFile } from 'src/helpers/Utils';

/**
 * Props interface for the JsonPanel component
 * @interface JsonPanelProps
 * @property {boolean} visible - Controls whether the panel is shown or hidden
 * @property {() => void} onClose - Callback function to close the panel
 * @property {() => any} getLayoutData - Function that returns the current layout data to be displayed as JSON
 * @property {(message: string) => void} [showToast] - Optional callback to display toast notifications
 */
interface JsonPanelProps {
  visible: boolean;
  onClose: () => void;
  getLayoutData: () => any;
  showToast?: (message: string) => void
}

/**
 * JsonPanel Component
 * 
 * A sliding panel that displays the current layout configuration as formatted JSON.
 * Provides functionality to download the JSON as a file or copy it to clipboard.
 * Uses Framer Motion for smooth slide-in/out animations.
 * 
 * @param {JsonPanelProps} props - Component props
 * @returns {JSX.Element} The rendered JsonPanel component
 */
const JsonPanel: React.FC<JsonPanelProps> = ({ visible, onClose, getLayoutData, showToast }) => {

  /**
   * Downloads the current layout data as a JSON file
   * Uses the downloadAsFile utility to create and trigger a file download
   */
  const handleDownloadJson = () => {
    const json = JSON.stringify(getLayoutData(), null, 2);
    downloadAsFile(json, 'layout.json', 'application/json');
  };

  /**
   * Copies the current layout data as JSON to the clipboard
   * Shows a toast notification on successful copy
   */
  const handleCopyJson = () => {
    const json = JSON.stringify(getLayoutData(), null, 2);
    navigator.clipboard.writeText(json).then(() => {
      showToast?.('Copied JSON to clipboard');
    });
  };

  return (
    <>
      {/* AnimatePresence handles the mounting/unmounting animations */}
      <AnimatePresence>
        {visible && (
          <motion.div
            className={`${styles.AdminPanel} ${styles.JsonPanel} ${styles.rightSide}`}
            initial={{ x: '100%', width: 0 }}      // Start position: off-screen to the right
            animate={{ x: 0, width: 280 }}         // Animate to: visible position with 280px width
            exit={{ x: '100%', width: 0 }}         // Exit position: slide back off-screen
            transition={{ type: 'spring', stiffness: 400, damping: 40 }} // Spring animation for smooth movement
          >
            {/* Panel header with title and action buttons */}
            <header className={styles.PanelHeader}>
              <div>
                <h2>Layout JSON</h2>
                {/* Action buttons container */}
                <div className={styles.actions}>
                  {/* Download button - saves JSON as file */}
                  <ToolbarButton 
                    onClick={handleDownloadJson} 
                    icon={Icons.Download16} 
                    title="Download JSON" 
                    iconColor={ICON_INVERSE} 
                    position="bottom" 
                  />
                  {/* Copy button - copies JSON to clipboard */}
                  <ToolbarButton 
                    onClick={handleCopyJson} 
                    icon={Icons.Copy16} 
                    title="Copy JSON" 
                    iconColor={ICON_INVERSE} 
                    position="bottom" 
                  />
                  {/* Close button - dismisses the panel */}
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
            
            {/* JSON content display area */}
            <div className={styles.layoutJson}>
              <pre>
                {/* Display formatted JSON with 2-space indentation */}
                {JSON.stringify(getLayoutData(), null, 2)}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default JsonPanel; 