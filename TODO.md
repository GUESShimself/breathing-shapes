# Breathing Shapes - TODO

## Current Status

✅ Project structure created and refactored
✅ All components separated and optimized
✅ Custom CSS implemented (Tailwind removed)
✅ Performance improvements with useReducer and useMemo
✅ **v0.2.0 Released** - Preset system foundation complete
✅ **v0.2.1 Released** - Carousel fade animation and mobile layout improvements
✅ Git workflow established (main/develop/feature branches)
✅ Versioning and CHANGELOG.md implemented

## Project Setup

- [x] Run `npm install` to install dependencies
- [x] Run `npm run dev` to test the application
- [ ] Verify all features work correctly
- [ ] Deploy v0.2.0 to GitHub Pages for user testing

## Phase 1: Preset System ✅ COMPLETE (v0.2.0)

- [x] Create TypeScript type definitions for presets
- [x] Implement localStorage persistence layer
- [x] Build usePresets hook for state management
- [x] Create default breathing patterns (Triangle, Square, Quick Focus, Deep Relaxation)
- [x] Design and build PresetCard component
- [x] Design and build PresetCarousel component
- [x] Replace BreathingTypeSelector with PresetCarousel
- [x] Integrate preset system with BreathingApp
- [x] Git branching strategy and conventional commits
- [x] Version tagging (v0.2.0)

## Future Enhancements

### Features

- [x] Add more breathing patterns (4 default presets created)
- [x] Save user preferences to localStorage (preset system uses localStorage)
- [x] Add customizable timing for each phase (presets support custom durations per phase)
- [ ] Add sound/audio cues for phase changes
- [ ] Add haptic feedback for mobile devices
- [ ] Implement dark/light theme toggle
- [ ] Add breathing session history/statistics
- [ ] Create guided breathing sessions with multiple cycles

### UI/UX Improvements

- [x] Fade carousel up and away once user starts their breathing session. Fade back in once session is finished (v0.2.1)
- [x] Improve mobile responsiveness - reduced visualization height (v0.2.1)
- [ ] Add fading gradient trail effect (research multi-layer approach vs GSAP vs SVG animate)
- [ ] Add smooth transitions between breathing type changes
- [ ] Add keyboard shortcuts (space to start/stop, etc.)
- [ ] Add accessibility features (screen reader support, reduced motion)
- [ ] Create onboarding/tutorial for first-time users
- [ ] Add animation speed controls

### Technical Improvements

- [ ] Add unit tests for utility functions
- [ ] Add component tests with React Testing Library
- [ ] Set up E2E tests with Playwright/Cypress
- [ ] Add ESLint configuration
- [ ] Add Prettier for code formatting
- [ ] Set up CI/CD pipeline
- [ ] Optimize bundle size
- [ ] Add error boundaries

### Documentation

- [ ] Add JSDoc comments to all functions
- [ ] Create component documentation/storybook
- [ ] Add contributing guidelines
- [ ] Create architecture decision records (ADRs)

## Bugs/Issues

- [ ] None currently identified

## Notes

- Original single-file component successfully refactored into modular architecture
- All magic numbers extracted to constants
- Animation loop optimized with useReducer
- Memoization added for expensive calculations

## Potential UI plan

### Information architecture

1. Bottom nav (3 tabs)
   - Breathe: run a session (your current screen evolves here)
   - Build: create/edit presets (patterns + timings)
   - History: stats, streaks, recent sessions
2. Pattern discovery
   - [x] At the top of **Breathe**, replace two buttons with a **horizontal preset carousel** (animated preview cards: Triangle, Square, 4-7-8, Box variations, etc.).
   - [ ] Include a “+ New” card that sends to **Build**.

### Breathe (in-session) layout

- Header: preset name • cycles remaining • tempo (tap to change).
- Canvas: your animated SVG shape; add subtle segment labels (“In / Hold / Out / Hold”) and a faint progress ring.
- Footer controls: Play/Pause, Skip phase, Restart, Sound/Haptics toggles.
- Swipe-up Bottom Sheet (quick settings while running):
  - Cycle count, total duration
  - Voice cues (off / counts / guidance), background sound
  - Theme (light/dark/high contrast), Reduce Motion respect
- Gestures: tap canvas = pause/resume, long-press = quick restart.

### Build (preset editor)

- **Preset list** (cards with tiny animated thumbnails) + “Create preset”.
- **Editor** (two interchangeable views):
  1. **Radial phase editor**: the current shape becomes an **interactive segmented ring**; **drag segment handles** to change each phase’s length; color-code segments (In/Hold/Out/Hold).
  2. **Timeline editor**: stacked rows for phases with **duration sliders**; optional “**link durations**” to scale all by a master tempo.
- Fields: name, shape (triangle, square, circle), phases (add/remove), per-phase duration, cycle count, sound/haptic style.
- **Preview pane**: live mini simulation.
- **Save as preset** (star = favorite); allow **Share** (JSON or deep link) later.

### History & stats

- **Session summary cards**: date, preset, minutes, cycles.
- **Charts**: time spent by pattern, streaks, average session length.
- **Badges** (gentle): “First week”, “Focused 50”.
- CTA: “Repeat last session”.

### Customization & preferences

- **Global Settings** (from profile icon):
  - Default preset, default cycle count/tempo
  - Theme + **High-contrast** palette, **Reduce Motion **toggle
  - Sound pack/haptics intensity
  - Reminders (daily, wind-down)
- **Per-preset** overrides live in the preset itself.

### Visual system

- **Preset chips/cards**: color as semantic cue (In=cool, Hold=neutral, Out=warm), but always pair with text/icons for accessibility.
- **On-canvas cues**: pulsing dot + ring you already have; add micro tick at each phase transition.
- **Empty states**: “No history yet — try a 1-minute triangle session.”

### Accessibility & calm-tech

- Respect OS **Reduce Motion** (swap to fade/scale instead of rotating).
- **Voice/Count** options, captions for guidance.
- Large tap targets; one-hand reachable controls.
- Colorblind-safe palette; check contrast on dark backgrounds.

### Session types

- **Single session** (current), **Guided** (scripted multi-preset flow), **Loop** (until stopped). Picker sits above the canvas or in the quick settings sheet.

### Componentization (fits your TS + modular goals)

- `PresetCard`, `PresetCarousel`, `BottomSheet`, `PhaseRingEditor`, `TimelineEditor`, `ProgressRing`, `TransportControls`, `QuickSettings`, `StatsChart`.
- Drive UI from a **pattern schema** (`{name, shape, phases:[{type:'in'|'hold'|'out', ms}], cycles, tempo, cues}`) so new patterns drop in without UI rewrites.

### Little delights (optional)

- Haptic beat at phase edges.
- Ambient backgrounds that subtly shift with breathing (tone down under Reduce Motion).
- Lock screen / widget: simple progress ring + play/pause.

This structure keeps the current calm single-screen feel while giving room to grow into presets, editing, guided flows, and stats—without cluttering the breathing space.
