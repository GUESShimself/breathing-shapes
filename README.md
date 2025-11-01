# Breathing Shapes

A meditation app featuring triangle and square breathing patterns with smooth animations and custom styling.

## Features

- **Triangle Breathing**: 3-phase breathing pattern (Breathe In, Hold, Breathe Out)
- **Square Breathing**: 4-phase breathing pattern (Breathe In, Hold, Breathe Out, Hold)
- Smooth SVG animations with rotating shapes
- Pulsing visual indicators
- Custom CSS styling (no Tailwind dependency)
- TypeScript for type safety
- Modular, maintainable architecture

## Project Structure

```
breathing-shapes/
├── src/
│   ├── components/         # React components
│   │   ├── BreathingApp.tsx
│   │   ├── BreathingVisualization.tsx
│   │   ├── BreathingTypeSelector.tsx
│   │   ├── PhaseIndicator.tsx
│   │   └── ControlButtons.tsx
│   ├── hooks/             # Custom React hooks
│   │   └── useBreathingAnimation.ts
│   ├── utils/             # Utility functions
│   │   ├── geometry.ts
│   │   └── animation.ts
│   ├── types/             # TypeScript type definitions
│   │   └── breathing.ts
│   ├── constants/         # App constants
│   │   └── breathing.ts
│   ├── styles/           # CSS stylesheets
│   │   ├── BreathingApp.css
│   │   ├── BreathingVisualization.css
│   │   ├── BreathingTypeSelector.css
│   │   ├── PhaseIndicator.css
│   │   └── ControlButtons.css
│   └── main.tsx          # App entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Lucide React** - Icons
- **Custom CSS** - Styling

## Code Improvements

This refactored version includes several performance and maintainability improvements:

1. **useReducer for complex state** - Animation state managed with a reducer pattern
2. **useMemo for expensive calculations** - Circle position and trail calculations are memoized
3. **Extracted constants** - All magic numbers moved to constants file
4. **Utility functions** - Geometry and animation logic separated into pure functions
5. **Component separation** - Each UI section is its own component
6. **Custom CSS** - No Tailwind dependency, full control over styling
7. **TypeScript types** - Complete type safety throughout the app
