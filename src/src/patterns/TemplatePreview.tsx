import React from 'react';
import { AdminTemplate } from 'src/builder/Templates';
import PhonePreviewContent from 'src/builder/PhonePreviewContent';
import TopBar from 'src/components/TopBar';
import ButtonGroup from 'src/components/ButtonGroup';
import Toast from 'src/components/Toast';
import IOSStatusBar from 'src/components/IOSStatusBar';
import IOSHomeIndicator from 'src/components/IOSHomeIndicator';
import Markdown from 'src/admin/components/Markdown';
import builderStyles from 'src/builder/index.module.sass';
import styles from './patterns.module.sass';

interface TemplatePreviewProps {
  template: AdminTemplate | null;
}

/**
 * TemplatePreview Component
 * 
 * Renders a template in a phone preview format.
 * Used in the patterns view to display selected templates.
 */
const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template }) => {
  if (!template) {
    return (
      <div className={styles.emptyState}>
        <p>Select a pattern from the left panel to preview it here.</p>
      </div>
    );
  }

  const showTopBar = !!template.topBarProps;
  const showBottomButtons = !!template.bottomButtonsProps;
  const showToast = !!template.toastProps;
  const showStatusBar = !!template.statusBarProps;

  return (
    <div className={styles.previewContainer}>
      <div className={builderStyles.PhonePreview}>
        <PhonePreviewContent
          components={template.components}
          selectedIdx={null}
          setSelectedIdx={() => {}}
          showTopBar={showTopBar}
          topBarProps={template.topBarProps || {}}
          setSelectedSpecial={() => {}}
          showBottomButtons={showBottomButtons}
          bottomButtonsProps={template.bottomButtonsProps || {}}
          setComponents={() => {}}
          styles={builderStyles}
          zoomLevel={1}
          isZoomedOut={false}
          TopBar={TopBar}
          ButtonGroup={ButtonGroup}
          IOSStatusBar={IOSStatusBar}
          showNotch={false}
          IOSHomeIndicator={IOSHomeIndicator}
          showComponentNames={false}
          selectedSpecial={null}
          showToast={showToast}
          toastProps={template.toastProps || {}}
          Toast={Toast}
          showStatusBar={showStatusBar}
          statusBarProps={template.statusBarProps || {}}
        />
      </div>
      {template.description && (
        <div className={styles.description}>
          <Markdown copy={template.description} />
        </div>
      )}
    </div>
  );
};

export default TemplatePreview;

