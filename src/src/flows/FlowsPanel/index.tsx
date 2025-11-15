import React from "react";
import DevToolsLink, { DevToolsLinkProps } from "src/admin/DevTools/DevToolsLink";
import ThemeSection from "src/admin/DevTools/ThemeSection";
import styles from "src/flows/FlowsPanel/index.module.sass";

/**
 * FlowsPanel Component
 * 
 * A panel that displays navigation links to different app flows and theme settings.
 * Lives on the left side of the flows view.
 */
const FlowsPanel: React.FC = () => {
  // Navigation routes data for the Flows section
  const routeData: DevToolsLinkProps[] = [
    {title:"Components", path:"/flows/components", description:"All UI components"},
    {title:"App", path:"/flows/discover", description:"Main app interface"},
    {title:"Account", path:"/flows/account", description:"User profile settings"},
    {title:"Reporting", path:"/flows/report", description:"User reporting flow"},
    {title:"Chavez", path:"/flows/chavez", description:"Special features demo"},
    {title:"Parallax", path:"/flows/parallax", description:"Animation showcase"}
  ];

  // Generate navigation links from route data
  const routeLinks = routeData.map((route: DevToolsLinkProps, index: number) => {
    return (
      <DevToolsLink {...route} key={`route${index}`} />
    );
  });

  return (
    <div className={styles.Main}>
      {/* Flows List - Scrollable, takes remaining space */}
      <div className={styles.flowsContent}>
        <div className={styles.routeLinks}>
          {routeLinks}
        </div>
      </div>
      
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

