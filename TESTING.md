# Testing Guide

This project uses [Vitest](https://vitest.dev/) for unit testing. Vitest is a fast, modern test runner built specifically for Vite projects.

## Running Tests

```bash
# Run all tests (watch mode)
npm test

# Run tests with UI dashboard
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

Tests are organized in the `src/__tests__` directory, mirroring the source code structure:

```
src/
├── __tests__/
│   ├── utils/
│   │   ├── animation.test.ts     # Tests for animation calculations
│   │   └── geometry.test.ts      # Tests for shape geometry
│   └── hooks/
│       └── useBreathingAnimation.test.ts  # Tests for breathing animation logic
├── utils/
│   ├── animation.ts
│   └── geometry.ts
└── hooks/
    └── useBreathingAnimation.ts
```

## What's Being Tested

### 1. Animation Utilities (`animation.test.ts`)

Tests the critical trail animation calculations:

- **Trail growth**: Verifies the trail starts at zero and grows over time
- **Trail continuity**: Ensures the trail never resets between breathing cycles
- **Trail positioning**: Confirms the trail follows behind the circle (not in front)
- **Boundary wrapping**: Tests correct behavior when wrapping around shape edges
- **Rotation speed**: Validates degrees-per-millisecond calculations

**Key test:**

```typescript
it('should never reset trail between cycles', () => {
  // End of cycle 1: trail has length X
  const endCycle1 = calculateTrailDashArray('triangle', 2, 0.99, 3, 2.99);

  // Start of cycle 2: trail should still have similar length
  const startCycle2 = calculateTrailDashArray('triangle', 0, 0.01, 3, 3.01);

  // Trail maintains length (doesn't drop to zero)
  expect(Math.abs(trailStart2 - trailEnd1)).toBeLessThan(5);
});
```

### 2. Geometry Utilities (`geometry.test.ts`)

Tests shape calculations for triangle and square breathing:

- **Triangle points**: Validates vertices at 0°, 120°, 240° around center
- **Circle positioning**: Tests interpolation along shape edges
- **SVG path generation**: Ensures valid path strings for rendering
- **Phase transitions**: Confirms smooth movement between vertices

**Key test:**

```typescript
it('should interpolate linearly along each edge', () => {
  // Circle should move in a straight line along each edge
  const positions = [0, 0.25, 0.5, 0.75, 1].map(progress =>
    getCirclePosition('triangle', 1, progress)
  );

  // Verify positions are collinear (on a straight line)
  // ... validation logic
});
```

### 3. Animation Hook (`useBreathingAnimation.test.ts`)

Tests the breathing effect calculations:

- **Scale transitions**: Verifies smooth scaling (0.95 ↔ 1.1)
- **Glow intensity**: Tests brightness changes (0 → 1.0 → 0.3)
- **Phase behavior**: Confirms correct values during inhale/hold/exhale
- **Breathing rhythm**: Validates the grow→hold→shrink pattern

**Key test:**

```typescript
it('should demonstrate the breathing rhythm', () => {
  // Inhale: scale increases
  expect(inhaleStart).toBeLessThan(inhaleMid);
  expect(inhaleMid).toBeLessThan(inhaleEnd);

  // Hold: scale stays constant
  expect(holdStart).toBe(holdMid);
  expect(holdMid).toBe(holdEnd);

  // Exhale: scale decreases
  expect(exhaleStart).toBeGreaterThan(exhaleMid);
  expect(exhaleMid).toBeGreaterThan(exhaleEnd);
});
```

## Writing New Tests

### Basic Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { yourFunction } from '@utils/yourFile';

describe('yourFunction', () => {
  it('should do something specific', () => {
    const result = yourFunction(input);
    expect(result).toBe(expectedValue);
  });
});
```

### Common Matchers

```typescript
// Exact equality
expect(value).toBe(5);

// Approximate equality (for floating point)
expect(value).toBeCloseTo(1.1, 2); // Within 2 decimal places

// Greater/Less than
expect(value).toBeGreaterThan(0);
expect(value).toBeLessThanOrEqual(100);

// Type checks
expect(value).toBeTypeOf('number');
expect(value).toHaveProperty('x');

// String/Regex matching
expect(string).toMatch(/^M .+ Z$/);
expect(array).toHaveLength(3);
```

### Testing Tips

1. **Test behavior, not implementation**: Focus on what the function should do, not how it does it
2. **Use descriptive test names**: "should grow trail length as cumulative progress increases"
3. **Test edge cases**: Zero values, maximum values, boundaries
4. **Keep tests independent**: Each test should work in isolation
5. **Use `toBeCloseTo()` for floats**: Avoid precision issues with floating point math

## Debugging Tests

### Run specific test file

```bash
npm test animation.test.ts
```

### Run specific test by name

```bash
npm test -t "should grow trail length"
```

### Use the UI

```bash
npm run test:ui
```

The UI provides:

- Visual test results
- File watching with hot reload
- Detailed error messages
- Code coverage visualization

### Add debug output

```typescript
it('should calculate correctly', () => {
  const result = myFunction(input);
  console.log('Result:', result); // Shows in test output
  expect(result).toBe(expected);
});
```

## Configuration

Testing is configured in two files:

### `vitest.config.ts`

- Test environment: happy-dom (lightweight DOM simulation)
- Path aliases: Same as main app (@utils, @hooks, etc.)
- Setup files: Runs before tests

### `vitest.setup.ts`

- Imports jest-dom matchers (toBeInTheDocument, etc.)
- Cleanup after each test

## Coverage

Generate a coverage report:

```bash
npm run test:coverage
```

This creates a `coverage/` directory with:

- HTML report (open `coverage/index.html` in browser)
- Text summary in terminal
- Line-by-line coverage data

## Next Steps

As you add new features, add corresponding tests:

1. **localStorage/Presets**: Test preset CRUD operations
2. **Components**: Test rendering and user interactions
3. **Integration**: Test how pieces work together
4. **Edge cases**: Test error handling and boundary conditions

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Jest Matchers](https://jestjs.io/docs/expect) (Vitest compatible)
