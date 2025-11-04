/**
 * InterventionScreen Container Component
 * 
 * A flexible, reusable container component that provides a standardized layout structure
 * for form-based flows and multi-step processes in the Interventions Hub interface.
 */

import React, { createElement } from 'react';
import TopBar from 'src/components/TopBar';
import { PageWrapper, ScrollContainer } from 'src/containers';
import ButtonGroup from 'src/components/ButtonGroup';
import styles from './index.module.sass';

/**
 * Defines a single section within the InterventionScreen layout
 * Each section consists of a React component and its props
 */
export interface InterventionScreenSection {
  component: React.ComponentType<any>;
  props: Record<string, any>;
}

/**
 * Configuration data for the entire InterventionScreen layout
 */
export interface InterventionScreenData {
  children?: React.ReactNode;
  buttons?: React.ComponentProps<typeof ButtonGroup>;
  scrollContainerClassName?: string;
  topBar?: React.ComponentProps<typeof TopBar>;
  sections: InterventionScreenSection[];
}

/**
 * Props interface for the InterventionScreen component
 */
export interface InterventionScreenProps {
  data: InterventionScreenData;
}

const InterventionScreen = ({ data }: InterventionScreenProps) => {
  const { children, buttons, scrollContainerClassName, topBar, sections } = data;

  const sectionsRender = sections.map((section, index) => {
    const { component, props } = section;
    return createElement(component, { ...props, key: `InterventionScreenSection${index}` });
  });

  return (
    <PageWrapper>
      {topBar && <TopBar {...topBar} />}
      <ScrollContainer className={scrollContainerClassName ? styles[scrollContainerClassName] : undefined}>
        {sectionsRender}
        {children}
      </ScrollContainer>
      {buttons && <ButtonGroup {...buttons} />}
    </PageWrapper>
  );
};

export default InterventionScreen;


