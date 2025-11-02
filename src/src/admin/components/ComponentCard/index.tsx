import React, { useRef, useLayoutEffect, useState, useMemo } from 'react';
import styles from './index.module.sass';
import { formatComponentName } from 'src/admin/formatComponentName';

/**
 * Props interface for the ComponentCard component
 * This component displays a preview of a React component with its name
 */
interface ComponentCardProps {
  /** The name of the component to display */
  name: string;
  /** The React component to render in the preview */
  Component: React.ComponentType<any>;
  /** Props to pass to the component for rendering */
  componentProps: Record<string, any>;
  /** Whether the card can be dragged */
  draggable?: boolean;
  /** Callback when drag operation starts */
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  /** Callback when drag operation ends */
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
  /** Callback when the card is clicked */
  onClick?: () => void;
}

/**
 * ComponentCard - Displays a preview of a React component with its name
 * 
 * This component creates a scaled preview of a React component by:
 * 1. Measuring the actual height of the component at full size
 * 2. Scaling it down to fit within the preview container
 * 3. Displaying the component name below the preview
 */
const ComponentCard: React.FC<ComponentCardProps> = ({ name, Component, componentProps, draggable, onDragStart, onDragEnd, onClick }) => {
  // Format the component name for display (e.g., "MyComponent" -> "My Component")
  const displayName = formatComponentName(name);

  // Ref to the preview container
  const containerRef = useRef<HTMLDivElement>(null);
  // State to store the preview container's width and height
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 140, height: 90 });

  // Measure the preview container's size
  useLayoutEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerSize({
        width: rect.width,
        height: rect.height,
      });
    }
  }, []);

  return (
    <div
      className={styles.Main}
      style={{ position: 'relative' }}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
    >
      {/* Component Preview Container */}
      <div
        className={styles.ComponentPreview + ' ' + styles.PreviewContainer}
        ref={containerRef}
      >
        {/* Check if props exist for this component */}
        {componentProps[name] !== undefined ? (() => {
          // Preview sizing constants
          // const containerWidth = 375;  // Full width of the component
          // const previewWidth = 140;    // Width of the preview container
          // const previewHeight = 90;   // Height of the preview container

          // State to store the measured height of the component
          const [measuredHeight, setMeasuredHeight] = useState<number>(100);
          // Ref to the hidden measurement div
          const measureRef = useRef<HTMLDivElement>(null);

          // Calculate previewWidth and previewHeight based on container size
          const previewWidth = Math.max(containerSize.width - 12, 0);
          const previewHeight = Math.max(containerSize.height - 12, 0);
          const containerWidth = 375; // Full width of the component

          // Measure the actual height of the component when it renders
          useLayoutEffect(() => {
            if (measureRef.current) {
              setMeasuredHeight(measureRef.current.offsetHeight);
            }
          }, [Component, componentProps, name]);

          // Calculate the scale factor to fit the component within the preview
          // Scale based on both width and height constraints, using the smaller scale
          const scale = Math.min(
            previewWidth / containerWidth,
            previewHeight / measuredHeight
          );

          return (
            <>
              {/* Hidden measurement div - renders the component at full size to measure its height */}
              <div
                ref={measureRef}
                style={{
                  width: containerWidth,
                  position: 'absolute',
                  visibility: 'hidden',
                  pointerEvents: 'none',
                  zIndex: -1,
                  left: 0,
                  top: 0,
                }}
              >
                {React.createElement(Component as React.ComponentType<any>, componentProps[name])}
              </div>
              
              {/* Scaled preview - renders the component at the calculated scale */}
              <div
                className={styles.PreviewInner}
                style={{
                  width: containerWidth,
                  height: measuredHeight,
                  left: '50%',
                  transform: `scale(${scale}) translate(-50%, -50%)`,
                }}
              >
                {React.createElement(Component as React.ComponentType<any>, componentProps[name])}
              </div>
            </>
          );
        })() : (
          // Fallback message when no props are available for the component
          <span style={{ color: '#888' }}>Props required</span>
        )}
      </div>
      
      {/* Component name display */}
      <p className={styles.ComponentName}>{displayName}</p>
    </div>
  );
};

export default ComponentCard; 