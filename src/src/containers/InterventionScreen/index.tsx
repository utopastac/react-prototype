/**
 * InterventionScreen Container Component
 * 
 * A flexible, reusable container component that provides a standardized layout structure
 * for form-based flows and multi-step processes in the Interventions Hub interface.
 * 
 * USAGE PATTERNS:
 * - Multi-step form flows (reporting, disputes, verification)
 * - Modal overlays and half-sheets
 * - Loading states with delayed navigation
 * - Admin interface for building and previewing layouts
 * 
 * The component dynamically renders sections of UI components based on configuration data,
 * providing a consistent structure with optional top bar, scrollable content area, and bottom buttons.
 */

import React, { createElement, useEffect } from 'react';
import TopBar from 'src/components/TopBar';
import { PageWrapper, ScrollContainer } from 'src/containers';
import ButtonGroup from 'src/components/ButtonGroup';
import { useTabBackgroundDispatch, TabBackgroundMode } from 'src/containers/TabBackgroundContext';
import styles from './index.module.sass';

/**
 * Defines a single section within the InterventionScreen layout
 * Each section consists of a React component and its props
 */
export interface InterventionScreenSection {
  component: React.ComponentType<any>; // The React component to render
  props: Record<string, any>; // Props to pass to the component
}

/**
 * Configuration data for the entire InterventionScreen layout
 * Contains all the pieces needed to construct a complete form interface
 */
export interface InterventionScreenData {
  children?: React.ReactNode; // Additional React children to render in the scroll area
  buttons?: React.ComponentProps<typeof ButtonGroup>; // Bottom button group configuration
  scrollContainerClassName?: string; // Optional CSS class for the scroll container
  topBar?: React.ComponentProps<typeof TopBar>; // Optional top bar configuration
  sections: InterventionScreenSection[]; // Array of sections to render in order
  tabBackground?: TabBackgroundMode; // Background color for the tab (WHITE, GREY, BRAND, BLACK)
}

/**
 * Props interface for the InterventionScreen component
 */
export interface InterventionScreenProps {
  data: InterventionScreenData; // All configuration data for the layout
}

/**
 * InterventionScreen Container Component
 * 
 * Renders a standardized layout with:
 * - Optional top bar (TopBar)
 * - Scrollable content area containing dynamic sections
 * - Optional bottom button group (ButtonGroup)
 * - Tab background color management
 * 
 * The component uses React.createElement to dynamically render sections,
 * allowing for flexible composition of UI components without hardcoding them.
 */
const InterventionScreen = ({ data }: InterventionScreenProps) => {
  const { children, buttons, scrollContainerClassName, topBar, sections, tabBackground } = data;
  const tabBackgroundDispatch = useTabBackgroundDispatch();

  // Set the tab background color when the component mounts or tabBackground changes
  useEffect(() => {
    if (tabBackground) {
      tabBackgroundDispatch({
        type: tabBackground
      });
    }
  }, [tabBackground, tabBackgroundDispatch]);

  // Dynamically render each section using React.createElement
  // This allows for flexible component composition without hardcoding specific components
  const sectionsRender = sections.map((section, index) => {
    const { component, props } = section;
    return createElement(component, { ...props, key: `InterventionScreenSection${index}` });
  });

  return (
    <PageWrapper>
      {/* Optional top bar - typically used for navigation controls */}
      {topBar && <TopBar {...topBar} />}
      
      {/* Scrollable content area containing dynamic sections and optional children */}
      <ScrollContainer className={scrollContainerClassName ? styles[scrollContainerClassName] : undefined}>
        {sectionsRender}
        {children}
      </ScrollContainer>
      
      {/* Optional bottom button group - typically used for form actions */}
      {buttons && <ButtonGroup {...buttons} />}
    </PageWrapper>
  );
};

export default InterventionScreen;