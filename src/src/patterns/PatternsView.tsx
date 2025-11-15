import React, { useState } from 'react';
import PatternsPanel from './PatternsPanel';
import TemplatePreview from './TemplatePreview';
import { AdminTemplates } from 'src/builder/Templates';
import styles from './patterns.module.sass';

const PatternsView: React.FC = () => {
  const [selectedTemplateName, setSelectedTemplateName] = useState<string | null>(null);

  const selectedTemplate = selectedTemplateName
    ? AdminTemplates.find(t => t.name === selectedTemplateName) || null
    : null;

  return (
    <div className={styles.container}>
      <PatternsPanel
        selectedTemplate={selectedTemplateName}
        onTemplateSelect={setSelectedTemplateName}
      />
      <div className={styles.previewArea}>
        <TemplatePreview template={selectedTemplate} />
      </div>
    </div>
  );
};

export default PatternsView;

