import React from 'react';
import styles from './PatternDescription.module.sass';

export interface PatternDescription {
  title: string;
  overview: string;
  features?: string[];
  useCases?: string[];
}

interface PatternDescriptionProps {
  description: PatternDescription;
}

/**
 * PatternDescription Component
 * 
 * Displays structured pattern description data using admin styles.
 * Shows title, overview, features, and use cases in a clean, organized layout.
 */
const PatternDescription: React.FC<PatternDescriptionProps> = ({ description }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{description.title}</h2>
      
      <p className={styles.overview}>{description.overview}</p>
      
      {description.features && description.features.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Features</h3>
          <ul className={styles.list}>
            {description.features.map((feature, index) => (
              <li key={index} className={styles.listItem}>{feature}</li>
            ))}
          </ul>
        </div>
      )}
      
      {description.useCases && description.useCases.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Use Cases</h3>
          <ul className={styles.list}>
            {description.useCases.map((useCase, index) => (
              <li key={index} className={styles.listItem}>{useCase}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PatternDescription;

