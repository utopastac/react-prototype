// CSS variable-backed semantic color tokens (see `src/src/styles/globals.css`)
// Names mirror globals.css tokens using ALL_CAPS with underscores.

export const COLOR_BORDER_SUBTLE = "var(--color-border-subtle)";
export const COLOR_LOGO_BRAND   = "var(--color-logo-brand)";

// Keep API compatibility: return provided CSS variable string.
export const GetColor = (color: string) => color;