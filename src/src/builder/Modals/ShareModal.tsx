import React, { useRef } from 'react';
import Modal from 'src/admin/DevTools/Modal';
import ToolbarButton from 'src/admin/components/ToolbarButton';
import * as Icons from 'src/data/Icons';
import styles from 'src/builder/Modals/index.module.sass';
import { downloadAsFile } from 'src/helpers/Utils';
import { LayoutData } from 'src/builder/LayoutContext';
import { LayoutsData } from 'src/builder/hooks/useLayoutData';

interface ShareModalProps {
  shareUrl: string;
  layoutData: LayoutData | LayoutsData;
  onClose: () => void;
  showToast?: (message: string) => void;
  x?: number;
  y?: number;
}

const ShareModal: React.FC<ShareModalProps> = ({ shareUrl, layoutData, onClose, showToast, x = 650, y = 40 }) => {
  const shareInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadJson = () => {
    const json = JSON.stringify(layoutData, null, 2);
    downloadAsFile(json, 'intervention-layout.json', 'application/json');
  };

  return (
    <Modal
      title="Share Layout"
      x={x}
      y={y}
      close={onClose}
    >
      <div className={styles.ShareModal}>
        <div>
          <input
            type="text"
            value={shareUrl}
            readOnly
            ref={shareInputRef}
            style={{ width: '100%', fontSize: 14, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            onFocus={e => e.target.select()}
          />
          <ToolbarButton
            onClick={() => {navigator.clipboard.writeText(shareUrl).then(() => {showToast?.("Copied to clipboard")})}}
            title="Copy"
            icon={Icons.Copy16 || Icons.Download16}
            position="left"
          />
          <ToolbarButton
            onClick={handleDownloadJson}
            title="Download JSON"
            icon={Icons.CategoryTechnology32 || Icons.Download16}
            position="left"
          />
        </div>
        <p style={{ fontSize: 12, marginTop: 8 }}>Anyone with this link can load your layout. No data is sent to a server.</p>
      </div>
    </Modal>
  );
};

export default ShareModal; 