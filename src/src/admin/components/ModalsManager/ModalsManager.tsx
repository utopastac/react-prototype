import React from 'react';
import SaveModal from '../../Modals/SaveModal';
import LoadModal from '../../Modals/LoadModal';
import ShareModal from '../../Modals/ShareModal';
import { WelcomeModal, ShortcutsModal, FlowLibraryModal } from '../../Modals';
import ClearModal from '../../Modals/ClearModal';

interface ModalsManagerProps {
  openModal: null | 'save' | 'load' | 'share' | 'clearAll' | 'shortcuts' | 'templates';
  onClose: () => void;
  adminPanelWidth: number;
  // Save
  saveName: string;
  onSaveNameChange: (v: string) => void;
  onSave: () => void;
  // Load
  loadList: string[];
  loadError: string | null;
  onLoad: (name: string) => void;
  onDeleteSave: (name: string) => void;
  // Share
  shareUrl: string;
  layoutDataForShare: any;
  setToast: (msg: string) => void;
  // Templates
  onTemplatesLoadComplete: (data: any) => void;
  // Shortcuts & Clear
  onClearAllConfirm: () => void;
}

const ModalsManager: React.FC<ModalsManagerProps> = ({
  openModal,
  onClose,
  adminPanelWidth,
  saveName,
  onSaveNameChange,
  onSave,
  loadList,
  loadError,
  onLoad,
  onDeleteSave,
  shareUrl,
  layoutDataForShare,
  setToast,
  onTemplatesLoadComplete,
  onClearAllConfirm,
}) => {
  const modalX = adminPanelWidth + 330;
  const modalY = 40;
  return (
    <>
      {openModal === 'templates' && (
        <FlowLibraryModal
          x={modalX}
          y={modalY}
          onLoadComplete={data => {
            onTemplatesLoadComplete(data);
            setToast('✅ Loaded flow');
          }}
          onClose={onClose}
        />
      )}

      {openModal === 'shortcuts' && (
        <ShortcutsModal onClose={onClose} x={modalX} y={modalY} />
      )}

      {openModal === 'save' && (
        <SaveModal
          saveName={saveName}
          onSaveNameChange={onSaveNameChange}
          onSave={onSave}
          x={modalX}
          y={modalY}
          onClose={onClose}
        />
      )}

      {openModal === 'load' && (
        <LoadModal
          loadList={loadList}
          loadError={loadError}
          onLoad={onLoad}
          onDeleteSave={onDeleteSave}
          x={modalX}
          y={modalY}
          onClose={onClose}
        />
      )}

      {openModal === 'share' && (
        <ShareModal
          shareUrl={shareUrl}
          layoutData={layoutDataForShare}
          x={modalX}
          y={modalY}
          onClose={onClose}
          showToast={setToast}
        />
      )}

      {openModal === 'clearAll' && (
        <ClearModal
          onClear={() => {
            onClose();
            onClearAllConfirm();
          }}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default ModalsManager;

