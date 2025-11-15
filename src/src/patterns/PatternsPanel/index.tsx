import React from "react";
import { AdminTemplates } from "src/builder/Templates";
import Link from "src/admin/components/Link";
import Header from "src/admin/components/Header";
import styles from "./index.module.sass";

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
      <Header title="Patterns" />
      
      {/* Templates List - Scrollable, takes remaining space */}
      <div className={styles.patternsContent}>
        {Object.entries(groupedTemplates).map(([group, templates]) => (
          <div key={group} className={styles.group}>
            <Header title={group} size="section" />
            <div className={styles.patternLinks}>
              {templates.map((template) => (
                <Link
                  key={template.name}
                  title={template.name}
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

