export function formatMoney(total: number): string {
  return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export function getRandomColor(asHex: boolean = false): RGB | string {
  const rgb = {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256)
  };
  
  if (asHex) {
    return rgbToHex(rgb);
  }
  
  return rgb;
}

// Helper function to convert RGB to HEX
function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

export function getContrastingColor(color: RGB): RGB {
  // Calculate relative luminance using the formula from WCAG 2.0
  const luminance = (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255;
  
  // Return white for dark colors and black for light colors
  return luminance > 0.5 
    ? { r: 0, g: 0, b: 0 }       // black
    : { r: 255, g: 255, b: 255 }; // white
}

export function getComplementaryColor(color: RGB): RGB {
  // Return the color on the opposite side of the color wheel
  return {
    r: 255 - color.r,
    g: 255 - color.g,
    b: 255 - color.b
  };
}

export function getBrightColor(asHex: boolean = false): RGB | string {
  // Generate a random hue (0-360)
  const hue = Math.random() * 360;
  
  // Use high saturation (85-100%) and value (85-100%) for bright, vivid colors
  const saturation = 85 + (Math.random() * 15);
  const value = 85 + (Math.random() * 15);
  
  // Convert HSV to RGB
  const c = (value / 100) * (saturation / 100);
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = (value / 100) - c;

  let r = 0, g = 0, b = 0;
  
  if (hue < 60) {
    r = c; g = x; b = 0;
  } else if (hue < 120) {
    r = x; g = c; b = 0;
  } else if (hue < 180) {
    r = 0; g = c; b = x;
  } else if (hue < 240) {
    r = 0; g = x; b = c;
  } else if (hue < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  // Convert to RGB color space and ensure integers
  const rgb = {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };

  if (asHex) {
    return `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`;
  }

  return rgb;
}

export function getDeepColor(asHex: boolean = false): RGB | string {
  // Generate a random hue (0-360)
  const hue = Math.random() * 360;
  
  // Use high saturation (80-100%) but lower value (40-70%) for deep, rich colors
  const saturation = 80 + (Math.random() * 20);
  const value = 40 + (Math.random() * 30);
  
  // Convert HSV to RGB
  const c = (value / 100) * (saturation / 100);
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = (value / 100) - c;

  let r = 0, g = 0, b = 0;
  
  if (hue < 60) {
    r = c; g = x; b = 0;
  } else if (hue < 120) {
    r = x; g = c; b = 0;
  } else if (hue < 180) {
    r = 0; g = c; b = x;
  } else if (hue < 240) {
    r = 0; g = x; b = c;
  } else if (hue < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  // Convert to RGB color space and ensure integers
  const rgb = {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };

  if (asHex) {
    return rgbToHex(rgb);
  }

  return rgb;
}

/**
 * Formats a select option string to be more readable:
 * - Removes a prefix if provided and present
 * - Replaces underscores and dashes with spaces
 * - Converts to sentence case (first letter capitalized, rest lowercase)
 * @param option The original option string
 * @param prefix Optional prefix to remove (e.g., 'BUTTON_', 'TIMELINE_ROW_')
 */
export function formatSelectOptionLabel(option: string, prefix?: string): string {
  if (typeof option !== 'string' || !option) return '';
  let label = option;
  // If the option looks like a URL, only show the last segment after the last slash
  if (label.includes('/')) {
    label = label.substring(label.lastIndexOf('/') + 1);
    // Remove file extension if present
    const dotIdx = label.lastIndexOf('.');
    if (dotIdx > 0) {
      label = label.substring(0, dotIdx);
    }
  }
  if (prefix && label.startsWith(prefix)) {
    label = label.slice(prefix.length);
  }
  // Remove any additional prefix up to the first underscore (e.g., TIMELINE_ROW_STATE_)
  if (!prefix && label.includes('_')) {
    const firstUnderscore = label.indexOf('_');
    // If the part before the first underscore is all uppercase, treat as prefix
    if (/^[A-Z]+$/.test(label.slice(0, firstUnderscore))) {
      label = label.slice(firstUnderscore + 1);
    }
  }
  label = label.replace(/_/g, ' ');
  label = label.replace(/-/g, ' ');
  label = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  return label;
}

/**
 * Canvas2D Utility Functions
 * Common functions for canvas operations
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface Circle {
  x: number;
  y: number;
  radius: number;
  scale?: number;
  opacity?: number;
  color?: string;
}

export interface CanvasSetupOptions {
  canvas: HTMLCanvasElement;
  dpr?: number;
  width?: number;
  height?: number;
  scale?: boolean;
}

/**
 * Sets up a canvas with proper device pixel ratio scaling
 */
export function setupCanvas({ 
  canvas, 
  dpr = window.devicePixelRatio || 1, 
  width = window.innerWidth, 
  height = window.innerHeight,
  scale = true 
}: CanvasSetupOptions): CanvasRenderingContext2D | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  
  // Ensure the canvas is displayed at the correct size
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  
  if (scale) {
    ctx.scale(dpr, dpr);
  }
  
  return ctx;
}

/**
 * Calculates the distance between two points
 */
export function getDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Gets mouse position relative to canvas
 */
export function getMousePosition(e: MouseEvent | React.MouseEvent, canvas: HTMLCanvasElement): Point2D {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

/**
 * Creates a grid of points with specified spacing
 */
export function createGrid(
  width: number, 
  height: number, 
  spacing: number, 
  offsetX: number = 0, 
  offsetY: number = 0
): Point2D[] {
  const cols = Math.floor(width / spacing);
  const rows = Math.floor(height / spacing);
  const xOffset = (width - (cols * spacing)) / 2 + offsetX;
  const yOffset = (height - (rows * spacing)) / 2 + offsetY;
  
  const points: Point2D[] = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      points.push({
        x: xOffset + (j * spacing) + spacing/2,
        y: yOffset + (i * spacing) + spacing/2
      });
    }
  }
  return points;
}

/**
 * Draws a circle on the canvas context
 */
export function drawCircle(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  radius: number, 
  color: string = '#FFFFFF',
  opacity: number = 1
): void {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawCircleOutline(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  radius: number, 
  color: string = '#FFFFFF',
  lineWidth: number = 1,
  opacity: number = 1
): void {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/**
 * Creates a radial gradient for circular effects
 */
export function createRadialGradient(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  opacity: number = 1
): CanvasGradient {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);
  return gradient;
}

/**
 * Extracts RGB values from rgba color string
 */
export function extractRGBFromRGBA(colorString: string): { r: number, g: number, b: number } | null {
  const rgbMatch = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3])
    };
  }
  return null;
}

/**
 * Creates a wave motion value using sine/cosine
 */
export function createWaveMotion(
  time: number,
  speed: number,
  amplitude: number,
  frequency: number = 1,
  phase: number = 0
): number {
  return Math.sin(time * speed + frequency + phase) * amplitude;
}

/**
 * Smoothly interpolates between two values
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

/**
 * Clamps a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Maps a value from one range to another
 */
export function map(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Generates a random number between min and max
 */
export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generates a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Creates a reusable animation frame handler
 */
export function createAnimationLoop(
  callback: (timestamp: number) => void,
  cleanup?: () => void
): () => void {
  let animationId: number;
  
  const animate = (timestamp: number) => {
    callback(timestamp);
    animationId = requestAnimationFrame(animate);
  };
  
  const start = () => {
    animationId = requestAnimationFrame(animate);
  };
  
  const stop = () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    if (cleanup) {
      cleanup();
    }
  };
  
  start();
  return stop;
}

/**
 * Creates a resize handler for canvas elements
 */
export function createCanvasResizeHandler(
  canvas: HTMLCanvasElement,
  onResize?: (width: number, height: number) => void
): () => void {
  const handleResize = () => {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
    
    if (onResize) {
      onResize(rect.width, rect.height);
    }
  };
  
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}

/**
 * Gradient configuration for canvas backgrounds
 */
export interface GradientConfig {
  type: 'linear' | 'radial';
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  colors: Array<{ stop: number; color: string }>;
}

/**
 * Clears and fills the canvas with a background color or gradient
 * Common utility for canvas rendering
 */
export function clearAndFillCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  backgroundColor: string | RGB | GradientConfig,
  clearFirst: boolean = true
): void {
  if (clearFirst) {
    ctx.clearRect(0, 0, width, height);
  }
  
  // Handle gradient configuration
  if (typeof backgroundColor === 'object' && 'type' in backgroundColor) {
    const gradientConfig = backgroundColor as GradientConfig;
    
    let gradient: CanvasGradient;
    
    if (gradientConfig.type === 'linear') {
      const direction = gradientConfig.direction || 'vertical';
      
      switch (direction) {
        case 'horizontal':
          gradient = ctx.createLinearGradient(0, 0, width, 0);
          break;
        case 'diagonal':
          gradient = ctx.createLinearGradient(0, 0, width, height);
          break;
        default: // vertical
          gradient = ctx.createLinearGradient(0, 0, 0, height);
          break;
      }
    } else {
      // radial gradient
      gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 2);
    }
    
    // Add color stops
    gradientConfig.colors.forEach(({ stop, color }) => {
      gradient.addColorStop(stop, color);
    });
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    return;
  }
  
  // Handle solid color (existing functionality)
  const fillColor = typeof backgroundColor === 'string' 
    ? backgroundColor 
    : `rgb(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b})`;
  
  ctx.fillStyle = fillColor;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Linearly interpolates between two rgb color strings.
 * @param colorA rgb(r, g, b)
 * @param colorB rgb(r, g, b)
 * @param t 0-1
 * @returns rgb(r, g, b)
 */
export function lerpColor(colorA: string, colorB: string, t: number): string {
  const parse = (c: string) => c.match(/\d+/g)?.map(Number) || [0,0,0];
  const [r1, g1, b1] = parse(colorA);
  const [r2, g2, b2] = parse(colorB);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Converts a hex color string (e.g. '#F4F4F4' or '#fff') to an 'rgb(r, g, b)' string.
 */
export function hexToRgb(hex: string): string {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Returns the phone UI width and height (in px) from CSS variables, with fallback to 375x812.
 */
export function getPhoneSize(): { width: number; height: number } {
  const root = document.documentElement;
  const width = parseFloat(getComputedStyle(root).getPropertyValue('--view-width')) || 375;
  const height = parseFloat(getComputedStyle(root).getPropertyValue('--view-height')) || 812;
  return { width, height };
}

/**
 * downloadAsFile
 *
 * Utility to trigger a download of a string as a file in the browser.
 * @param data - The string data to download
 * @param filename - The filename for the downloaded file
 * @param mimeType - The MIME type (default: 'application/octet-stream')
 */
export function downloadAsFile(data: string, filename: string, mimeType: string = 'application/octet-stream') {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Helper to convert rgb/rgba to rgba with alpha 0
export function colorToTransparent(color: string): string {
  const rgbMatch = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  const rgbaMatch = color.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/);
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, 0)`;
  } else if (rgbaMatch) {
    return `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, 0)`;
  }
  return color; // fallback
}

/**
 * Returns true if the currently focused element is an input, textarea, or contentEditable.
 */
export function isEditingField(): boolean {
  const el = document.activeElement;
  return !!el && (
    el.tagName === 'INPUT' ||
    el.tagName === 'TEXTAREA' ||
    (el as HTMLElement).isContentEditable
  );
}

export function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}