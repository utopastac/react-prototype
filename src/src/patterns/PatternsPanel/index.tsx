import React from "react";
import { AdminTemplates } from "src/builder/Templates";
import styles from "./index.module.sass";

export interface PatternLinkProps {
  name: string;
  group?: string;
  onClick: () => void;
  isSelected: boolean;
}

const PatternLink: React.FC<PatternLinkProps> = ({ name, onClick, isSelected }) => {
  return (
    <div 
      className={`${styles.link} ${isSelected ? styles.selected : ''}`} 
      onClick={onClick}
    >
      <div className={styles.Main}>
        <div className={styles.content}>
          <h4 className={styles.title}>{name}</h4>
        </div>
      </div>
    </div>
  );
};

/**
 * PatternsPanel Component
 * 
 * A panel that displays all available templates/patterns.
 * Lives on the left side of the patterns view.
 */
interface PatternsPanelProps {
  selectedTemplate: string | null;
  onTemplateSelect: (templateName: string) => void;
}

const PatternsPanel: React.FC<PatternsPanelProps> = ({ selectedTemplate, onTemplateSelect }) => {
  // Group templates by their group property
  const groupedTemplates = AdminTemplates.reduce((acc, template) => {
    const group = template.group || 'Other';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(template);
    return acc;
  }, {} as Record<string, typeof AdminTemplates>);

  return (
    <div className={styles.Main}>
      <div className={styles.header}>
        <h2>Patterns</h2>
      </div>
      
      {/* Templates List - Scrollable, takes remaining space */}
      <div className={styles.patternsContent}>
        {Object.entries(groupedTemplates).map(([group, templates]) => (
          <div key={group} className={styles.group}>
            <h3 className={styles.groupTitle}>{group}</h3>
            <div className={styles.patternLinks}>
              {templates.map((template) => (
                <PatternLink
                  key={template.name}
                  name={template.name}
                  group={template.group}
                  onClick={() => onTemplateSelect(template.name)}
                  isSelected={selectedTemplate === template.name}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatternsPanel;

