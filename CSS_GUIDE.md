# CSS Architecture Guide

## Overview

The CSS is now organized in a maintainable, scalable structure with CSS custom properties (variables) for easy theming and consistency.

## File Structure

```
src/styles/
├── main.css                    # Main entry point (imports all base styles)
├── normalize.css               # Browser reset/normalize
├── variables.css               # CSS custom properties
├── base.css                    # Base HTML element styles
├── BreathingApp.css           # App container styles
├── BreathingVisualization.css # SVG animation styles
├── BreathingTypeSelector.css  # Type selector button styles
├── PhaseIndicator.css         # Phase label styles
└── ControlButtons.css         # Control button styles
```

## How It Works

### 1. Import Order (main.css)
```css
@import './normalize.css';    /* Browser consistency */
@import './variables.css';    /* CSS variables */
@import './base.css';         /* Base element styles */
/* Components import their own CSS */
```

### 2. Entry Point (main.tsx)
```typescript
import './styles/main.css';  // Imported ONCE at app entry
```

### 3. Component CSS
Each component imports its own stylesheet:
```typescript
import '../styles/BreathingApp.css';
```

## CSS Custom Properties (Variables)

All design tokens are defined in [variables.css](src/styles/variables.css:1). Use these instead of hard-coded values!

### Colors
```css
var(--color-primary)         /* #22d3ee - Cyan */
var(--color-primary-dark)    /* #06b6d4 - Dark cyan */
var(--color-primary-light)   /* #67e8f9 - Light cyan */
var(--color-bg-dark)         /* #0f172a - Dark slate */
var(--color-bg-medium)       /* #1e293b - Medium slate */
var(--color-bg-light)        /* #334155 - Light slate */
```

### Spacing
```css
var(--spacing-xs)    /* 0.25rem */
var(--spacing-sm)    /* 0.5rem */
var(--spacing-md)    /* 1rem */
var(--spacing-lg)    /* 1.5rem */
var(--spacing-xl)    /* 2rem */
var(--spacing-2xl)   /* 3rem */
```

### Typography
```css
var(--font-size-base)         /* 1rem */
var(--font-size-2xl)          /* 1.5rem */
var(--font-weight-medium)     /* 500 */
var(--font-weight-semibold)   /* 600 */
```

### Shadows
```css
var(--shadow-lg)             /* Standard shadow */
var(--shadow-primary-lg)     /* Cyan glowing shadow */
var(--shadow-primary-xl)     /* Larger cyan glow */
```

### Transitions
```css
var(--transition-fast)    /* 150ms ease */
var(--transition-base)    /* 300ms ease */
var(--transition-slow)    /* 500ms ease */
```

### Border Radius
```css
var(--radius-sm)      /* 0.25rem */
var(--radius-md)      /* 0.5rem */
var(--radius-lg)      /* 1rem */
var(--radius-full)    /* 9999px - pill shape */
```

## Example Usage

### Before (hard-coded values)
```css
.button {
  padding: 0.5rem 1.5rem;
  background-color: #22d3ee;
  border-radius: 9999px;
  transition: all 0.3s ease;
}
```

### After (using variables)
```css
.button {
  padding: var(--spacing-sm) var(--spacing-lg);
  background-color: var(--color-primary);
  border-radius: var(--radius-full);
  transition: all var(--transition-base);
}
```

## Benefits

1. **Single Source of Truth**: Change a color once, updates everywhere
2. **Easy Theming**: Swap themes by changing CSS variables
3. **Consistency**: Design tokens ensure visual consistency
4. **Maintainability**: Semantic names make code self-documenting
5. **Browser Consistency**: normalize.css handles cross-browser differences
6. **Accessibility**: Includes reduced-motion support in base.css

## Creating a Theme

To create a new theme, you can override CSS variables:

```css
/* Light theme example */
[data-theme="light"] {
  --color-primary: #0891b2;
  --color-bg-dark: #ffffff;
  --color-bg-medium: #f1f5f9;
  --color-text-primary: #0f172a;
}
```

Then toggle with:
```typescript
document.documentElement.setAttribute('data-theme', 'light');
```

## Accessibility Features

The CSS includes:

- **Focus indicators**: Visible outlines on keyboard navigation
- **Reduced motion**: Respects `prefers-reduced-motion` setting
- **Screen reader utilities**: `.sr-only` class for accessible text
- **Semantic colors**: Variables use semantic names, not just color names

## Performance

- **No runtime cost**: CSS variables are native browser features
- **One bundle**: Vite bundles all CSS into a single optimized file
- **No duplication**: Variables eliminate repeated values
