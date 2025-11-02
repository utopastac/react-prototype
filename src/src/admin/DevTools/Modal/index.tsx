import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./index.module.sass";
import ToolbarButton from "src/admin/components/ToolbarButton";
import * as Icons from "src/data/Icons";

/**
 * Modal component props interface
 */
interface ModalProps {
  /** The title displayed in the modal header */
  title: string;
  /** Function called when the modal should close */
  close: () => void;
  /** Content to be rendered inside the modal */
  children: React.ReactNode;
  /** Optional X coordinate for positioning (used when showBackground is false) */
  x?: number;
  /** Optional Y coordinate for positioning (used when showBackground is false) */
  y?: number;
  /** Whether to show a background overlay and center the modal */
  showBackground?: boolean;
  /** Additional CSS classes to apply to the modal */
  className?: string;
}

/**
 * Modal component that can be positioned either at specific coordinates
 * or centered with a background overlay
 */
const Modal = (({ title, close, x, y, children, showBackground = false, className }: ModalProps) => {

  // Refs for DOM elements
  const modalRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  
  // Cache window height to avoid recalculation
  const windowHeight = window.innerHeight

  // GSAP animation hook - handles modal positioning and animations
  useGSAP(() => {
    if (!modalRef.current) return;
    
    const modalHeight = modalRef.current.clientHeight;
    
    if (showBackground) {
      // Mode 1: Centered modal with background overlay
      const modalWidth = modalRef.current.clientWidth;
      const centerX = (window.innerWidth - modalWidth) / 2;
      const centerY = (windowHeight - modalHeight) / 2;
      
      // Position modal at center of viewport
      gsap.set(modalRef.current, {
        top: centerY,
        left: centerX,
      });

      // Animate background fade-in
      gsap.fromTo(backgroundRef.current, 
        {opacity: 0}, 
        {opacity: 1, duration: 0.5, ease: "Power4.easeOut"}
      );
      
      // Animate modal slide-in from top with bounce effect
      gsap.fromTo(modalRef.current, 
        {opacity: 0, y: -70}, 
        {opacity: 1, y: 0, duration: 0.55, ease: "Back.easeOut"}
      );

    } else if (x !== undefined && y !== undefined) {
      // Mode 2: Positioned modal at specific coordinates
      // Ensure modal doesn't go off-screen by clamping to viewport bounds
      gsap.to(modalRef.current, {
        top: Math.min(y - 32, windowHeight - modalHeight - 24),
        left: x - 320, // Offset by modal width (320px) to position relative to cursor
        duration: 0, // Instant positioning
      });
    }
  }, [x, y, showBackground]); // Re-run when positioning props change

  /**
   * Handle background click to close modal
   * Only closes if the click target is the background itself (not modal content)
   */
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  return (
    <>
      {/* Background overlay - only rendered when showBackground is true */}
      {showBackground && (
        <div 
          className={styles.Background} 
          ref={backgroundRef} 
          onClick={handleBackgroundClick} 
        />
      )}
      
      {/* Main modal container */}
      <div 
        className={`${styles.Main} ${className || ''}`} 
        ref={modalRef} 
        data-modal-content
      >
        {/* Modal header with title and close button */}
        <header>
          <h3>{ title }</h3>
          <ToolbarButton
            onClick={close}
            title="Close"
            icon={Icons.Failed16}
            position="left"
          />
        </header>
        
        {/* Modal content */}
        { children }
      </div>
    </>
  );
});

export default Modal;



