import React from "react";
import { AdminTemplates } from "src/builder/Templates";
import LinkList, { LinkListSection } from "src/admin/components/LinkList";
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

  // Convert grouped templates to sections format for LinkList
  const sections: LinkListSection[] = Object.entries(groupedTemplates).map(([group, templates]) => ({
    title: group,
    links: templates.map((template) => ({
      title: template.name,
      onClick: () => onTemplateSelect(template.name),
      isSelected: selectedTemplate === template.name,
    })),
  }));

  return (
    <div className={styles.Main}>
      <LinkList title="Patterns" sections={sections} />
    </div>
  );
};

export default PatternsPanel;

