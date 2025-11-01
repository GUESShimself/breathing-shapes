# Breathing Shapes - TODO

## Current Status
✅ Project structure created and refactored  
✅ All components separated and optimized  
✅ Custom CSS implemented (Tailwind removed)  
✅ Performance improvements with useReducer and useMemo  

## Project Setup
- [ ] Run `npm install` to install dependencies
- [ ] Run `npm run dev` to test the application
- [ ] Verify all features work correctly

## Future Enhancements

### Features
- [ ] Add more breathing patterns (Box breathing variations, 4-7-8 breathing)
- [ ] Add sound/audio cues for phase changes
- [ ] Add haptic feedback for mobile devices
- [ ] Implement dark/light theme toggle
- [ ] Add customizable timing for each phase
- [ ] Save user preferences to localStorage
- [ ] Add breathing session history/statistics
- [ ] Create guided breathing sessions with multiple cycles

### UI/UX Improvements
- [ ] Add smooth transitions between breathing type changes
- [ ] Improve mobile responsiveness
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
