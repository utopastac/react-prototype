import { lerpColor, hexToRgb } from 'src/helpers/Utils';

// Background mapping
const BG_MIN = '#1A1A1A';
const BG_MAX = '#F4F4F4';
const BG_MIN_RGB = hexToRgb(BG_MIN);
const BG_MAX_RGB = hexToRgb(BG_MAX);

export function backgroundToSlider(val: string): number {
  const v = val.toLowerCase();
  if (v === BG_MIN.toLowerCase() || v === BG_MIN_RGB.toLowerCase()) return 0;
  if (v === BG_MAX.toLowerCase() || v === BG_MAX_RGB.toLowerCase()) return 1;
  return 0.5;
}

export function sliderToBackground(t: number): string {
  return lerpColor(BG_MIN_RGB, BG_MAX_RGB, t);
}

// Shadow mapping
const SHADOW_MIN = 'none';
const SHADOW_MAX = '0 40px 56px rgba(0,0,0,0.32)';

export function shadowToSlider(val: string): number {
  if (val === SHADOW_MIN) return 0;
  if (val === SHADOW_MAX) return 1;
  return 0.5;
}

export function sliderToShadow(t: number): string {
  if (t <= 0.01) return SHADOW_MIN;
  if (t >= 0.99) return SHADOW_MAX;
  const blur = 8 + (56 - 8) * t;
  const alpha = 0.12 + (0.32 - 0.12) * t;
  const yOffset = 40 * t;
  return `0 ${yOffset}px ${blur.toFixed(0)}px rgba(0,0,0,${alpha.toFixed(2)})`;
}

// Spacing mapping
const SPACING_MIN = '40px';
const SPACING_MAX = '560px';

export function spacingToSlider(val: string): number {
  const min = parseInt(SPACING_MIN, 10);
  const max = parseInt(SPACING_MAX, 10);
  const v = parseInt(val, 10);
  if (isNaN(v)) return 0.5;
  return (v - min) / (max - min);
}

export function sliderToSpacing(t: number): string {
  const min = parseInt(SPACING_MIN, 10);
  const max = parseInt(SPACING_MAX, 10);
  const px = Math.round(min + (max - min) * t);
  return `${px}px`;
}

// Outline mapping
const OUTLINE_MIN = '0px';
const OUTLINE_MAX = '12px';

export function outlineToSlider(val: string): number {
  const min = parseInt(OUTLINE_MIN, 10);
  const max = parseInt(OUTLINE_MAX, 10);
  const v = parseInt(val, 10);
  if (isNaN(v)) return 0;
  return (v - min) / (max - min);
}

export function sliderToOutline(t: number): string {
  const min = parseInt(OUTLINE_MIN, 10);
  const max = parseInt(OUTLINE_MAX, 10);
  const px = Math.round(min + (max - min) * t);
  return `${px}px`;
}

export default {
  backgroundToSlider,
  sliderToBackground,
  shadowToSlider,
  sliderToShadow,
  spacingToSlider,
  sliderToSpacing,
  outlineToSlider,
  sliderToOutline,
};

