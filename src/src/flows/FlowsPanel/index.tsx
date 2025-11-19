import React from "react";
import { LinkProps } from "src/admin/components/Link";
import LinkList from "src/admin/components/LinkList";
import ThemeSection from "src/admin/components/ThemeSection";
import styles from "src/flows/FlowsPanel/index.module.sass";

/**
 * FlowsPanel Component
 * 
 * A panel that displays navigation links to different app flows and theme settings.
 * Lives on the left side of the flows view.
 */
const FlowsPanel: React.FC = () => {
  // Navigation routes data for the Flows section
  const routeData: LinkProps[] = [
    {title:"Components", path:"/flows/components", description:"All UI components"},
    {title:"App", path:"/flows/discover", description:"Main app interface"},
    {title:"Account", path:"/flows/account", description:"User profile settings"},
    {title:"Reporting", path:"/flows/report", description:"User reporting flow"},
    {title:"Animation Showcase", path:"/flows/animation-showcase", description:"Special features demo"},
    {title:"Parallax", path:"/flows/parallax", description:"Animation showcase"}
  ];

  return (
    <div className={styles.Main}>
      <LinkList links={routeData} />
      
      {/* Theme Settings Section - Always open, at bottom */}
      <div className={styles.themeSection}>
        <div className={styles.themeContent}>
          <ThemeSection />
        </div>
      </div>
    </div>
  );
};

export default FlowsPanel;

