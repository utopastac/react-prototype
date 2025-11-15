import React, { useState, useRef, useCallback, useEffect } from 'react';

interface UsePanelResizeOptions {
  initialWidth: number;
  minWidth?: number;
  maxWidth?: number;
  edge?: 'left' | 'right';
  width?: number;
  setWidth?: (w: number) => void;
}

export function usePanelResize({
  initialWidth,
  minWidth = 220,
  maxWidth = 480,
  edge = 'right',
  width: controlledWidth,
  setWidth: controlledSetWidth,
}: UsePanelResizeOptions) {
  const [uncontrolledWidth, setUncontrolledWidth] = useState(initialWidth);
  const width = controlledWidth !== undefined ? controlledWidth : uncontrolledWidth;
  const setWidth = controlledSetWidth || setUncontrolledWidth;

  const [isResizing, setIsResizing] = useState(false);
  const [isHoveringEdge, setIsHoveringEdge] = useState(false);
  const startXRef = useRef<number | null>(null);
  const startWidthRef = useRef<number>(width);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    document.body.style.cursor = 'col-resize';
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || startXRef.current === null) return;
    let delta = e.clientX - startXRef.current;
    if (edge === 'left') delta = -delta;
    let newWidth = startWidthRef.current + delta;
    newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    setWidth(newWidth);
  }, [isResizing, setWidth, minWidth, maxWidth, edge]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const resizeHandle = (
    <div
      style={{
        position: 'absolute',
        top: 0,
        [edge]: 0,
        width: 8,
        height: '100%',
        cursor: 'col-resize',
        zIndex: 10,
        background: isHoveringEdge || isResizing ? 'rgba(0, 3, 192, 0.07)' : 'transparent',
        transition: 'background 0.15s',
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHoveringEdge(true)}
      onMouseLeave={() => setIsHoveringEdge(false)}
      data-testid="resize-handle"
    />
  );

  return [width, resizeHandle, isResizing, setWidth, isHoveringEdge] as const;
} 