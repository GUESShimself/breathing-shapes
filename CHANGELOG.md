# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### TODO
- Support variable phase durations in animation
- Add preset editor (Phase 2)
- Add history and statistics tracking
- Implement bottom navigation

## [0.2.0] - 2025-01-01

### Added
- **Preset System Foundation**
  - TypeScript type definitions for breathing patterns and presets
  - LocalStorage persistence layer for preset CRUD operations
  - `usePresets` hook for state management
  - Default presets: Triangle Breathing, Box Breathing, Quick Focus, Deep Relaxation
- **UI Components**
  - `PresetCard` component with shape icons, metadata, and favorite indicator
  - `PresetCarousel` component for horizontal scrolling preset selection
  - Custom CSS styling for preset cards and carousel
  - Loading state while presets initialize
- **GitHub Pages Deployment**
  - Vite configuration for GitHub Pages
  - Deployment script (`npm run deploy`)
  - Deployment documentation

### Changed
- Replaced `BreathingTypeSelector` buttons with `PresetCarousel`
- Breathing animation now driven by selected preset data
- Updated `BreathingApp` to integrate with preset system

### Removed
- Hardcoded breathing type selection
- Direct use of `BreathingTypeSelector` component (still exists in codebase)

## [0.1.0] - 2024-12-XX

### Added
- **Project Structure**
  - Modular component architecture
  - Separated components: `BreathingApp`, `BreathingVisualization`, `PhaseIndicator`, `ControlButtons`, `BreathingTypeSelector`
  - Type definitions for breathing patterns
  - Constants file for configuration values
- **Animation System**
  - `useBreathingAnimation` hook with `useReducer` for complex state
  - `useMemo` for expensive calculations (circle position, trail effects)
  - Rotation and phase-based animation
  - Pulsing ripple effects
- **Utilities**
  - Geometry calculations for triangle and square shapes
  - Animation helpers for trail effects
  - SVG path generation
- **Styling**
  - Custom CSS system (no Tailwind)
  - CSS custom properties (variables) for theming
  - Normalize.css for browser consistency
  - Separate stylesheets for each component
- **Documentation**
  - README with project structure
  - CSS architecture guide
  - TODO tracking
  - Deployment guide

### Technical Improvements
- TypeScript throughout
- Performance optimizations with useReducer and useMemo
- All magic numbers extracted to constants
- Accessible focus states and reduced motion support

---

## Version History

- **0.2.0** - Preset system foundation
- **0.1.0** - Initial refactored architecture
