import React from "react";
import Link, { LinkProps } from "src/admin/components/Link";
import Header from "src/admin/components/Header";
import styles from "./index.module.sass";

export interface LinkListSection {
  title: string;
  links: LinkProps[];
}

export interface LinkListProps {
  title?: string;
  links?: LinkProps[];
  sections?: LinkListSection[];
}

/**
 * LinkList Component
 * 
 * A reusable component for displaying lists of links uniformly.
 * Supports optional title header and sectioned grouping (like patterns).
 * 
 * Usage:
 * - Flat list: <LinkList title="My Links" links={[...]} />
 * - Sections: <LinkList title="My Links" sections={[{ title: "Section 1", links: [...] }]} />
 */
const LinkList: React.FC<LinkListProps> = ({ title, links, sections }) => {
  // Validate that either links or sections is provided, but not both
  if (!links && !sections) {
    console.warn("LinkList: Either 'links' or 'sections' prop must be provided");
    return null;
  }

  if (links && sections) {
    console.warn("LinkList: Both 'links' and 'sections' props provided. Using 'sections' and ignoring 'links'");
  }

  const renderLinks = (linkList: LinkProps[]) => {
    return (
      <div className={styles.links}>
        {linkList.map((link, index) => (
          <Link key={link.path || link.title || index} {...link} />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.linkList}>
      {title && <Header title={title} />}
      
      <div className={styles.content}>
        {sections ? (
          // Render sections (like patterns)
          sections.map((section, sectionIndex) => (
            <div key={section.title || sectionIndex} className={styles.section}>
              <Header title={section.title} size="section" />
              {renderLinks(section.links)}
            </div>
          ))
        ) : links ? (
          // Render flat list (like flows)
          renderLinks(links)
        ) : null}
      </div>
    </div>
  );
};

export default LinkList;

