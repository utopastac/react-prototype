# SASS Architecture & Module Structure

This document outlines how SASS is used and organized in the Interventions Hub React project.

## Overview

The project uses **CSS Modules with SASS** for styling, providing scoped styles and a modular architecture. SASS files use the `.sass` extension (indented syntax) and are imported as CSS modules in React components.

## Build Configuration

- **Build Tool**: Vite with `@vitejs/plugin-react`
- **SASS Version**: 1.78.0
- **SASS Syntax**: Indented syntax (`.sass` files)
- **CSS Modules**: Enabled by default in Vite
- **File Extension**: `.module.sass` for component styles

## Project Structure

### Global SASS Files (`src/styles/`)

```
src/styles/
├── _site.sass              # Main entry point - imports all global styles
├── _variables.sass         # CSS custom properties and variables
├── _colors.sass            # Color system and theme definitions
├── _mixins.sass            # Utility mixins and functions
├── _typography.sass        # Typography system and font styles
├── _layout.sass            # Layout utilities and patterns
├── _theme.sass             # Theme-specific styles
├── _utilz.sass             # Utility classes and helpers
└── variables.css           # CSS custom properties (alternative)
```

### Component SASS Files

Each component has its own SASS module file following this pattern:
```
src/components/ComponentName/
├── index.tsx               # React component
└── index.module.sass       # Component styles
```

## Import Patterns

### 1. Global Styles Import

All component SASS files import the global styles at the top:

```sass
@import 'src/styles/site.sass'
```

This provides access to:
- Variables (`$radius-s`, `$space-m`, etc.)
- Mixins (`@mixin animate()`, `@function size()`)
- Placeholder selectors (`%component-button`, `%heading-xl`)
- Color variables (`var(--text-standard)`, `var(--semantic-background-app)`)

### 2. Component Style Import

React components import their styles as CSS modules:

```tsx
import styles from "./index.module.sass";

const MyComponent = () => {
  return <div className={styles.Main}>Content</div>;
};
```

## Core Systems

### 1. Color System (`_colors.sass`)

Uses CSS custom properties for theming:

```sass
:root
  --text-standard: var(--base-grey-10)
  --semantic-background-app: var(--base-constant-white)
  --semantic-border-standard: var(--base-grey-60)

[data-theme="THEME_DARK"]
  --text-standard: var(--base-constant-white)
  --semantic-background-app: var(--base-constant-black)
```

**Theme Support:**
- `THEME_LIGHT` (default)
- `THEME_DARK`

### 2. Typography System (`_typography.sass`)

Comprehensive typography scale with placeholder selectors:

```sass
%display-hero
  @extend %heading
  @include fontSize(40, 44, -0.002em)

%component-button
  @extend %paragraph
  @extend %medium
  @include fontSize(16, 24, 0.002em)
```

**Typography Categories:**
- **Display**: Hero, large labels, headers
- **Title**: Tab titles, section titles, page titles
- **Base**: Labels, body text, inputs, buttons
- **Detail**: Help text, disclaimers, meta text

### 3. Spacing System (`_mixins.sass`)

Consistent spacing using the `size()` function:

```sass
@function size($size)
  @return #{(calc($size / 10))}rem

// Usage
padding: size(16)  // 1.6rem
margin: size(8)    // 0.8rem
```

### 4. Utility Functions (`_mixins.sass`)

Common utility functions and mixins:

```sass
@function units($num)
  @return #{calc(($num * $units) / 10)}rem

@mixin icon($icon, $color: black, $size: contain)
  background: $color
  mask-image: $icon
  mask-size: $size

@mixin cover-background($image)
  background-size: cover
  background-repeat: no-repeat
  background-image: $image
```

## Component Styling Patterns

### 1. Main Container Pattern

Most components use a `.Main` class as the root:

```sass
.Main
  display: flex
  align-items: center
  padding: size(16)
  
  &.variant
    background: var(--semantic-background-prominent)
```

### 2. Modifier Classes

Components use modifier classes for different states/variants:

```sass
.Main
  &.prominent
    background: var(--component-button-background-prominent)
    color: var(--component-button-text-prominent)
  
  &.compact
    height: size(32)
    @extend %component-button-compact
```

### 3. Size Variants

Many components support size variants:

```sass
.Main
  &.a_64
    width: size(64)
    height: size(64)
  
  &.a_48
    width: size(48)
    height: size(48)
```

## Admin Panel Styles (`src/builder/_admin.sass`)

Separate styling system for the development/admin panel:

```sass
@import 'src/styles/site.sass'

$dev-tools-width: size(320)
$dev-tools-padding: size(16)

%button-primary
  @extend %button-base
  color: white
  background: black
```

## Best Practices

### 1. File Organization
- One SASS module per component
- Global styles in `src/styles/`
- Component-specific styles in component directories

### 2. Naming Conventions
- Use `.Main` for the root component class
- Use kebab-case for modifier classes (`.button-primary`)
- Use descriptive class names that match component props

### 3. CSS Custom Properties
- Use CSS custom properties for themeable values
- Define base colors in `_colors.sass`
- Use semantic names (`--text-standard`, `--semantic-background-app`)

### 4. Responsive Design
- Use mixins for responsive breakpoints
- Define breakpoints in `_mixins.sass`
- Use `@include min($screen-l)` and `@include max($screen-l)`

### 5. Typography
- Extend typography placeholders (`%component-button`, `%heading-xl`)
- Use the `fontSize()` mixin for consistent sizing
- Maintain the established typography scale

## Example Component

```sass
// src/components/MyComponent/index.module.sass
@import 'src/styles/site.sass'

.Main
  display: flex
  align-items: center
  padding: size(16)
  border-radius: $radius-s
  background: var(--semantic-background-app)
  
  &.variant
    background: var(--semantic-background-prominent)
  
  .icon
    width: size(20)
    height: size(20)
    @extend %icon-standard
```

```tsx
// src/components/MyComponent/index.tsx
import styles from "./index.module.sass";

interface MyComponentProps {
  variant?: boolean;
}

const MyComponent = ({ variant }: MyComponentProps) => {
  return (
    <div className={`${styles.Main} ${variant ? styles.variant : ''}`}>
      <div className={styles.icon} />
    </div>
  );
};
```

## Development Workflow

1. **Create Component**: Add `index.tsx` and `index.module.sass` files
2. **Import Global Styles**: Add `@import 'src/styles/site.sass'` to SASS file
3. **Define Styles**: Use the established patterns and systems
4. **Import in Component**: Import styles as CSS module
5. **Apply Classes**: Use `styles.className` syntax

This architecture provides a scalable, maintainable styling system that supports theming, responsive design, and component isolation.

## Build Output & Bundling

When the app is built using `npm run build`, Vite processes all SASS files and bundles them into a single CSS file:

### Build Output Location
- **CSS Bundle**: `dist/assets/index-[hash].css` (e.g., `index-BzonDxWk.css`)
- **HTML Reference**: The CSS is automatically linked in `dist/index.html`
- **Bundle Size**: ~110KB (18KB gzipped)

### Bundling Process

1. **SASS Compilation**: All `.sass` files are compiled to CSS
2. **CSS Modules**: Component styles are scoped with unique class names (e.g., `_Main_k0gd8_165`)
3. **Global Styles**: Global SASS files are processed and included
4. **CSS Custom Properties**: All CSS variables are preserved and available at runtime
5. **Minification**: CSS is minified for production

### Bundle Contents

The final CSS bundle includes:
- **Global CSS Variables**: All theme variables and design tokens
- **Component Styles**: All scoped component styles with CSS modules
- **Typography System**: Complete typography scale and font definitions
- **Theme Support**: Theme variations (Light, Dark)
- **Utility Classes**: Global utility classes and mixins
- **Admin Panel Styles**: Development/admin interface styles

### CSS Module Naming

Component styles are automatically scoped with unique identifiers:
```css
/* Original SASS */
.Main
  background: var(--semantic-background-app)

/* Compiled CSS */
._Main_k0gd8_165 {
  background: var(--semantic-background-app);
}
```

### Runtime Theme Switching

The bundled CSS supports dynamic theme switching through CSS custom properties:
```css
:root {
  --text-standard: var(--base-grey-10);
  --semantic-background-app: var(--base-constant-white);
}

[data-theme="THEME_DARK"] {
  --text-standard: var(--base-constant-white);
  --semantic-background-app: var(--base-constant-black);
}
```

This approach ensures that all styles are available at runtime and can be dynamically changed without rebuilding the application. 