/**
 * Tests for animation utility functions
 *
 * These tests cover the critical trail animation calculations that took multiple
 * iterations to get right. The trail should:
 * 1. Grow from the starting point (not appear fully formed)
 * 2. Never reset between breathing cycles (use cumulative progress)
 * 3. Follow behind the circle (not lead it)
 * 4. Wrap around the shape path correctly at boundaries
 */

import { describe, it, expect } from 'vitest';
import {
  calculateTrailDashArray,
  calculateTrailDashOffset,
  calculateDegreesPerMs,
} from '@utils/animation';
import { PATH_LENGTHS, TRAIL_LENGTH_RATIO } from '@constants/breathing';

describe('calculateTrailDashArray', () => {
  it('should start with zero length trail at the beginning', () => {
    const result = calculateTrailDashArray('triangle', 0, 0, 3, 0);
    const [trailLength] = result.split(' ').map(Number);

    expect(trailLength).toBe(0);
  });

  it('should grow trail length as cumulative progress increases', () => {
    const breathingType = 'triangle';
    const phases = 3;

    // At 25% through first phase (cumulativeProgress = 0.25)
    const result1 = calculateTrailDashArray(breathingType, 0, 0.25, phases, 0.25);
    const [trailLength1] = result1.split(' ').map(Number);

    // At 50% through first phase (cumulativeProgress = 0.5)
    const result2 = calculateTrailDashArray(breathingType, 0, 0.5, phases, 0.5);
    const [trailLength2] = result2.split(' ').map(Number);

    // Trail should be growing
    expect(trailLength2).toBeGreaterThan(trailLength1);
  });

  it('should cap trail length at maximum (TRAIL_LENGTH_RATIO * pathLength)', () => {
    const breathingType = 'square';
    const phases = 4;
    const pathLength = PATH_LENGTHS[breathingType];
    const maxTrailLength = pathLength * TRAIL_LENGTH_RATIO;

    // After many cycles (cumulative progress = 50)
    const result = calculateTrailDashArray(breathingType, 0, 0, phases, 50);
    const [trailLength] = result.split(' ').map(Number);

    expect(trailLength).toBe(maxTrailLength);
  });

  it('should maintain correct gap for wrapping (gap = pathLength - trailLength)', () => {
    const breathingType = 'triangle';
    const phases = 3;
    const pathLength = PATH_LENGTHS[breathingType];

    const result = calculateTrailDashArray(breathingType, 1, 0.5, phases, 1.5);
    const [trailLength, gap] = result.split(' ').map(Number);

    // Gap should equal pathLength - trailLength for proper wrapping
    expect(gap).toBe(pathLength - trailLength);
  });

  it('should handle both triangle and square breathing types', () => {
    // Use cumulative progress of 1.5 for both, which will create different
    // normalized progress values: 1.5/3 = 0.5 for triangle, 1.5/4 = 0.375 for square
    const triangleResult = calculateTrailDashArray('triangle', 0, 0.5, 3, 1.5);
    const squareResult = calculateTrailDashArray('square', 0, 0.5, 4, 1.5);

    // Both should return valid dasharray strings
    expect(triangleResult).toMatch(/^\d+(\.\d+)? \d+(\.\d+)?$/);
    expect(squareResult).toMatch(/^\d+(\.\d+)? \d+(\.\d+)?$/);

    // Trail lengths should differ due to different path lengths and normalized progress
    const [triangleLength] = triangleResult.split(' ').map(Number);
    const [squareLength] = squareResult.split(' ').map(Number);
    expect(triangleLength).not.toBe(squareLength);
  });

  it('should never reset trail between cycles (continuous cumulative progress)', () => {
    const breathingType = 'triangle';
    const phases = 3;

    // End of first cycle
    const endCycle1 = calculateTrailDashArray(breathingType, 2, 0.99, phases, 2.99);
    const [trailEnd1] = endCycle1.split(' ').map(Number);

    // Start of second cycle (cumulative progress continues)
    const startCycle2 = calculateTrailDashArray(breathingType, 0, 0.01, phases, 3.01);
    const [trailStart2] = startCycle2.split(' ').map(Number);

    // Trail should maintain similar length (not drop to zero)
    expect(Math.abs(trailStart2 - trailEnd1)).toBeLessThan(5);
  });
});

describe('calculateTrailDashOffset', () => {
  it('should position trail behind the circle', () => {
    const breathingType = 'triangle';
    const phases = 3;
    const pathLength = PATH_LENGTHS[breathingType];

    // At some point in the animation
    const cumulativeProgress = 1.5; // Halfway through second phase
    const offset = calculateTrailDashOffset(breathingType, phases, cumulativeProgress);

    // Offset should be negative (moves pattern forward)
    expect(offset).toBeLessThan(0);
  });

  it('should calculate offset that positions trail end at circle position', () => {
    const breathingType = 'square';
    const phases = 4;
    const pathLength = PATH_LENGTHS[breathingType];
    const maxTrailLength = pathLength * TRAIL_LENGTH_RATIO;

    const cumulativeProgress = 10; // After trail reaches max length
    const normalizedProgress = cumulativeProgress / phases;
    const circlePosition = normalizedProgress * pathLength;

    const offset = calculateTrailDashOffset(breathingType, phases, cumulativeProgress);
    const expectedOffset = -circlePosition + maxTrailLength;

    expect(offset).toBeCloseTo(expectedOffset);
  });

  it('should handle wrap-around at path boundaries correctly', () => {
    const breathingType = 'triangle';
    const phases = 3;

    // Test near boundary (end of path)
    const nearBoundary = calculateTrailDashOffset(breathingType, phases, 2.95);

    // Test after wrapping (start of next cycle)
    const afterWrap = calculateTrailDashOffset(breathingType, phases, 3.05);

    // Both should be valid numbers (no NaN or Infinity)
    expect(nearBoundary).toBeTypeOf('number');
    expect(afterWrap).toBeTypeOf('number');
    expect(Number.isFinite(nearBoundary)).toBe(true);
    expect(Number.isFinite(afterWrap)).toBe(true);
  });

  it('should work consistently for both breathing types', () => {
    const triangleOffset = calculateTrailDashOffset('triangle', 3, 1.5);
    const squareOffset = calculateTrailDashOffset('square', 4, 2.0);

    // Both should be negative (pattern moves forward)
    expect(triangleOffset).toBeLessThan(0);
    expect(squareOffset).toBeLessThan(0);
  });
});

describe('calculateDegreesPerMs', () => {
  it('should calculate correct rotation speed for triangle (3 phases)', () => {
    const phaseDuration = 4000; // 4 seconds per phase
    const phases = 3;
    const totalCycleDuration = phaseDuration * phases; // 12 seconds

    const degreesPerMs = calculateDegreesPerMs(phaseDuration, phases);

    // 360 degrees in 12000ms = 0.03 degrees per millisecond
    expect(degreesPerMs).toBe(360 / totalCycleDuration);
    expect(degreesPerMs).toBeCloseTo(0.03);
  });

  it('should calculate correct rotation speed for square (4 phases)', () => {
    const phaseDuration = 4000;
    const phases = 4;
    const totalCycleDuration = phaseDuration * phases; // 16 seconds

    const degreesPerMs = calculateDegreesPerMs(phaseDuration, phases);

    // 360 degrees in 16000ms = 0.0225 degrees per millisecond
    expect(degreesPerMs).toBeCloseTo(0.0225);
  });

  it('should handle different phase durations', () => {
    const shortDuration = calculateDegreesPerMs(2000, 3); // 2s per phase
    const longDuration = calculateDegreesPerMs(6000, 3); // 6s per phase

    // Shorter duration should rotate faster (more degrees per ms)
    expect(shortDuration).toBeGreaterThan(longDuration);
  });

  it('should complete exactly 360 degrees in one full cycle', () => {
    const phaseDuration = 5000;
    const phases = 4;
    const degreesPerMs = calculateDegreesPerMs(phaseDuration, phases);

    const totalCycleDuration = phaseDuration * phases;
    const totalRotation = degreesPerMs * totalCycleDuration;

    expect(totalRotation).toBe(360);
  });
});
