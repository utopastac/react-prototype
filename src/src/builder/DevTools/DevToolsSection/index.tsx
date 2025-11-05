import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import styles from "./index.module.sass";
import Icon from "src/components/Icon";
import * as Icons from "src/data/Icons";

type Props = {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
};

const DevToolsSection = ({ title, children, isOpen, onToggle }: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    if (contentRef.current) {
      const content = contentRef.current;
      
      if (isOpen) {
        // Show content
        gsap.to(content, {
          height: "auto",
          duration: 0.3,
          padding: 0,
          ease: "power4.easeInOut"
        });
      } else {
        // Hide content - first ensure it's visible for animation
        gsap.to(content, {
          height: 0,
          duration: 0.2,
          padding: 0,
          ease: "power4.easeIn",
        });
      }
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (arrowRef.current) {
      gsap.to(arrowRef.current, {
        rotation: isOpen ? 0 : -90,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [isOpen]);
  
  return (
    <div className={`${styles.section} ${isOpen ? styles.open : ''}`}>
      <header 
        className={styles.header} 
        onClick={onToggle}
      >
        <h4>{title}</h4>
        <span 
          ref={arrowRef}
          className={styles.arrow}
        >
          <Icon icon={Icons.TickerDown16} size="16" color="prominent" />
        </span>
      </header>
      <div
        ref={contentRef}
        className={styles.content}
      >
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DevToolsSection;