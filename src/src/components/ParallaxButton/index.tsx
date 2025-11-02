import React, { useState } from 'react';
import { useTilt } from 'src/containers/TiltContext';
import styles from './index.module.sass';
import Starfield from "src/assets/starfield.png";
import StarfieldLayer from "src/assets/starfield-layer.png";

interface ParallaxButtonProps {
  text: string;
  children?: React.ReactNode;
}

const ParallaxButton: React.FC<ParallaxButtonProps> = ({ text, children }) => {
  const { tilt } = useTilt();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculate parallax effects based on tilt values
  // Using smaller multipliers for more subtle movement
  // Swapped X and Y to fix backward movement
  const textX = tilt.y * 2; // Horizontal movement
  const textY = tilt.x * 1; // Vertical movement
  const starfieldMidX = tilt.y * 3.5; // More movement for background
  const starfieldMidY = tilt.x * 2; // More movement for background
  const starfieldX = tilt.y * 7; // More movement for background
  const starfieldY = tilt.x * 8; // More movement for background

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className={`${styles.button} ${isExpanded ? styles.expanded : ''}`}
      onClick={handleClick}
    >
      <div 
        className={styles.starfield}
        style={{ 
          transform: `translate(${-starfieldX}px, ${starfieldY}px)`,
          backgroundImage: `url(${Starfield})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div 
        className={styles.starfield}
        style={{ 
          transform: `translate(${-starfieldMidX}px, ${starfieldMidY}px) perspective(${200-textX}px)`,
          backgroundImage: `url(${StarfieldLayer})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      {!isExpanded && (
        <div 
          className={styles.buttonText}
          style={{ 
            transform: `translate(${-textX}px, ${textY}px) perspective(${500-textX}px)`
          }}
        >
          {text}
        </div>
      )}
      {isExpanded && children && (
        <div
          className={styles.expandedContent}
          style={{ 
            transform: `translate(${-textX}px, ${textY}px) perspective(${500-textX}px)`
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default ParallaxButton; 