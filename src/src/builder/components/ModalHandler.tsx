import React from 'react';
import SaveModal from '../Modals/SaveModal';
import LoadModal from '../Modals/LoadModal';
import ShareModal from '../Modals/ShareModal';
import { ShortcutsModal, FlowLibraryModal, WelcomeModal } from '../Modals';
import ClearModal from '../Modals/ClearModal';
import { AdminTemplate } from '../Templates';
import { LayoutData } from '../LayoutContext';
import { LayoutsData } from '../hooks/useLayoutData';

interface ModalHandlerProps {
  openModal: null | 'save' | 'load' | 'share' | 'clearAll' | 'shortcuts' | 'templates';
  setOpenModal: (modal: null | 'save' | 'load' | 'share' | 'clearAll' | 'shortcuts' | 'templates') => void;
  showWelcomeModal: boolean;
  setShowWelcomeModal: (show: boolean) => void;
  // Save modal props
  saveName: string;
  onSaveNameChange: (name: string) => void;
  onSave: () => void;
  // Load modal props
  loadList: string[];
  loadError: string;
  onLoad: (name: string) => void;
  onDeleteSave: (name: string) => void;
  // Share modal props
  shareUrl: string;
  layoutData: LayoutData | LayoutsData;
  showToast?: (message: string) => void;
  // Flow library modal props
  onLoadComplete: (data: any) => void;
  // Clear modal props
  onClear: () => void;
  // Common modal positioning (most modals use the same coordinates)
  modalX?: number;
  modalY?: number;
}

const DEFAULT_MODAL_X = 650;
const DEFAULT_MODAL_Y = 40;

const ModalHandler: React.FC<ModalHandlerProps> = ({
  openModal,
  setOpenModal,
  showWelcomeModal,
  setShowWelcomeModal,
  saveName,
  onSaveNameChange,
  onSave,
  loadList,
  loadError,
  onLoad,
  onDeleteSave,
  shareUrl,
  layoutData,
  showToast,
  onLoadComplete,
  onClear,
  modalX = DEFAULT_MODAL_X,
  modalY = DEFAULT_MODAL_Y
}) => {
  return (
    <>
      {/* Template Modal */}
      {openModal === 'templates' && (
        <FlowLibraryModal
          onLoadComplete={onLoadComplete}
          onClose={() => setOpenModal(null)}
          x={modalX}
          y={modalY}
        />
      )}

      {/* Keyboard Shortcuts Modal */}
      {openModal === 'shortcuts' && (
        <ShortcutsModal 
          onClose={() => setOpenModal(null)} 
          x={modalX}
          y={modalY}
        />
      )}

      {/* Save Modal */}
      {openModal === 'save' && (
        <SaveModal
          saveName={saveName}
          onSaveNameChange={onSaveNameChange}
          onSave={onSave}
          onClose={() => setOpenModal(null)}
          x={modalX}
          y={modalY}
        />
      )}

      {/* Load Modal */}
      {openModal === 'load' && (
        <LoadModal
          loadList={loadList}
          loadError={loadError}
          onLoad={onLoad}
          onDeleteSave={onDeleteSave}
          onClose={() => setOpenModal(null)}
          x={modalX}
          y={modalY}
        />
      )}

      {/* Share Modal */}
      {openModal === 'share' && (
        <ShareModal
          shareUrl={shareUrl}
          layoutData={layoutData}
          onClose={() => setOpenModal(null)}
          showToast={showToast}
          x={modalX}
          y={modalY}
        />
      )}

      {/* Clear All Layouts Modal */}
      {openModal === 'clearAll' && (
        <ClearModal
          onClear={() => {
            setOpenModal(null);
            onClear();
          }}
          onClose={() => setOpenModal(null)}
        />
      )}

      {/* Welcome Modal (shows on first visit) */}
      {showWelcomeModal && (
        <WelcomeModal 
          onClose={() => {
            window.localStorage.setItem('interventions-hub-welcome-seen', 'true');
            setShowWelcomeModal(false);
          }} 
        />
      )}
    </>
  );
};

export default ModalHandler;

