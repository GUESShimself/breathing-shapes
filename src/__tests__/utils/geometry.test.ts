/**
 * Tests for geometry utility functions
 *
 * These tests verify the mathematical calculations for positioning the circle
 * along the triangle and square paths. The geometry functions are pure
 * and deterministic, making them ideal for unit testing.
 */

import { describe, it, expect } from 'vitest';
import {
  getTrianglePoints,
  getCirclePosition,
  getShapePath
} from '@utils/geometry';
import {
  TRIANGLE_CENTER_X,
  TRIANGLE_CENTER_Y,
  TRIANGLE_RADIUS,
  SQUARE_POINTS
} from '@constants/breathing';

describe('getTrianglePoints', () => {
  it('should return exactly 3 points', () => {
    const points = getTrianglePoints();
    expect(points).toHaveLength(3);
  });

  it('should return points with x and y coordinates', () => {
    const points = getTrianglePoints();
    points.forEach(point => {
      expect(point).toHaveProperty('x');
      expect(point).toHaveProperty('y');
      expect(typeof point.x).toBe('number');
      expect(typeof point.y).toBe('number');
    });
  });

  it('should calculate points at correct radius from center', () => {
    const points = getTrianglePoints();
    points.forEach(point => {
      const dx = point.x - TRIANGLE_CENTER_X;
      const dy = point.y - TRIANGLE_CENTER_Y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Should be at TRIANGLE_RADIUS distance from center
      expect(distance).toBeCloseTo(TRIANGLE_RADIUS, 2);
    });
  });

  it('should position points at 0°, 120°, and 240° angles', () => {
    const points = getTrianglePoints();

    // First point at 0° (right of center)
    expect(points[0].x).toBeCloseTo(TRIANGLE_CENTER_X + TRIANGLE_RADIUS, 2);
    expect(points[0].y).toBeCloseTo(TRIANGLE_CENTER_Y, 2);

    // Second point at 120° (bottom-left)
    const angle120Rad = (120 * Math.PI) / 180;
    expect(points[1].x).toBeCloseTo(TRIANGLE_CENTER_X + TRIANGLE_RADIUS * Math.cos(angle120Rad), 2);
    expect(points[1].y).toBeCloseTo(TRIANGLE_CENTER_Y + TRIANGLE_RADIUS * Math.sin(angle120Rad), 2);

    // Third point at 240° (bottom-right)
    const angle240Rad = (240 * Math.PI) / 180;
    expect(points[2].x).toBeCloseTo(TRIANGLE_CENTER_X + TRIANGLE_RADIUS * Math.cos(angle240Rad), 2);
    expect(points[2].y).toBeCloseTo(TRIANGLE_CENTER_Y + TRIANGLE_RADIUS * Math.sin(angle240Rad), 2);
  });

  it('should return consistent points across multiple calls', () => {
    const points1 = getTrianglePoints();
    const points2 = getTrianglePoints();

    expect(points1).toEqual(points2);
  });
});

describe('getCirclePosition', () => {
  describe('triangle breathing', () => {
    it('should start at the correct vertex at progress 0', () => {
      // Phase 0, progress 0 - should be at third point (phase + 2) % 3
      const position = getCirclePosition('triangle', 0, 0);
      const points = getTrianglePoints();

      expect(position.x).toBeCloseTo(points[2].x, 2);
      expect(position.y).toBeCloseTo(points[2].y, 2);
    });

    it('should end at the correct vertex at progress 1', () => {
      // Phase 0, progress 1 - should be at first point (phase 0)
      const position = getCirclePosition('triangle', 0, 1);
      const points = getTrianglePoints();

      expect(position.x).toBeCloseTo(points[0].x, 2);
      expect(position.y).toBeCloseTo(points[0].y, 2);
    });

    it('should be halfway between vertices at progress 0.5', () => {
      const position = getCirclePosition('triangle', 0, 0.5);
      const points = getTrianglePoints();
      const start = points[2];
      const end = points[0];

      const expectedX = start.x + (end.x - start.x) * 0.5;
      const expectedY = start.y + (end.y - start.y) * 0.5;

      expect(position.x).toBeCloseTo(expectedX, 2);
      expect(position.y).toBeCloseTo(expectedY, 2);
    });

    it('should interpolate linearly along each edge', () => {
      const progressValues = [0, 0.25, 0.5, 0.75, 1];
      const positions = progressValues.map(progress =>
        getCirclePosition('triangle', 1, progress)
      );

      // Check that positions are in a straight line
      for (let i = 1; i < positions.length - 1; i++) {
        const prev = positions[i - 1];
        const curr = positions[i];
        const next = positions[i + 1];

        // Calculate expected position based on linear interpolation
        const t = 0.5; // midpoint between prev and next
        const expectedX = prev.x + (next.x - prev.x) * t;
        const expectedY = prev.y + (next.y - prev.y) * t;

        expect(curr.x).toBeCloseTo(expectedX, 1);
        expect(curr.y).toBeCloseTo(expectedY, 1);
      }
    });

    it('should handle all three phases correctly', () => {
      const points = getTrianglePoints();

      // Phase 0: moves from point 2 to point 0
      const phase0Start = getCirclePosition('triangle', 0, 0);
      expect(phase0Start.x).toBeCloseTo(points[2].x, 2);

      // Phase 1: moves from point 0 to point 1
      const phase1Start = getCirclePosition('triangle', 1, 0);
      expect(phase1Start.x).toBeCloseTo(points[0].x, 2);

      // Phase 2: moves from point 1 to point 2
      const phase2Start = getCirclePosition('triangle', 2, 0);
      expect(phase2Start.x).toBeCloseTo(points[1].x, 2);
    });
  });

  describe('square breathing', () => {
    it('should start at the correct corner at progress 0', () => {
      // Phase 0, progress 0 - should be at first point
      const position = getCirclePosition('square', 0, 0);

      expect(position.x).toBe(SQUARE_POINTS[0].x);
      expect(position.y).toBe(SQUARE_POINTS[0].y);
    });

    it('should end at the next corner at progress 1', () => {
      // Phase 0, progress 1 - should be at second point
      const position = getCirclePosition('square', 0, 1);

      expect(position.x).toBe(SQUARE_POINTS[1].x);
      expect(position.y).toBe(SQUARE_POINTS[1].y);
    });

    it('should be halfway between corners at progress 0.5', () => {
      const position = getCirclePosition('square', 0, 0.5);
      const start = SQUARE_POINTS[0];
      const end = SQUARE_POINTS[1];

      const expectedX = start.x + (end.x - start.x) * 0.5;
      const expectedY = start.y + (end.y - start.y) * 0.5;

      expect(position.x).toBe(expectedX);
      expect(position.y).toBe(expectedY);
    });

    it('should handle all four phases correctly', () => {
      // Phase 0: moves from point 0 to point 1 (top edge, left to right)
      const phase0Start = getCirclePosition('square', 0, 0);
      expect(phase0Start).toEqual(SQUARE_POINTS[0]);

      // Phase 1: moves from point 1 to point 2 (right edge, top to bottom)
      const phase1Start = getCirclePosition('square', 1, 0);
      expect(phase1Start).toEqual(SQUARE_POINTS[1]);

      // Phase 2: moves from point 2 to point 3 (bottom edge, right to left)
      const phase2Start = getCirclePosition('square', 2, 0);
      expect(phase2Start).toEqual(SQUARE_POINTS[2]);

      // Phase 3: moves from point 3 to point 0 (left edge, bottom to top)
      const phase3Start = getCirclePosition('square', 3, 0);
      expect(phase3Start).toEqual(SQUARE_POINTS[3]);
    });

    it('should wrap around correctly from phase 3 to phase 0', () => {
      // End of phase 3 should connect to start of phase 0
      const phase3End = getCirclePosition('square', 3, 1);
      const phase0Start = getCirclePosition('square', 0, 0);

      expect(phase3End.x).toBeCloseTo(phase0Start.x, 2);
      expect(phase3End.y).toBeCloseTo(phase0Start.y, 2);
    });
  });

  it('should always return valid position objects', () => {
    const testCases = [
      { type: 'triangle' as const, phase: 0, progress: 0 },
      { type: 'triangle' as const, phase: 1, progress: 0.5 },
      { type: 'triangle' as const, phase: 2, progress: 1 },
      { type: 'square' as const, phase: 0, progress: 0 },
      { type: 'square' as const, phase: 2, progress: 0.75 },
      { type: 'square' as const, phase: 3, progress: 1 }
    ];

    testCases.forEach(({ type, phase, progress }) => {
      const position = getCirclePosition(type, phase, progress);

      expect(position).toHaveProperty('x');
      expect(position).toHaveProperty('y');
      expect(typeof position.x).toBe('number');
      expect(typeof position.y).toBe('number');
      expect(Number.isFinite(position.x)).toBe(true);
      expect(Number.isFinite(position.y)).toBe(true);
    });
  });
});

describe('getShapePath', () => {
  it('should generate valid SVG path for triangle', () => {
    const path = getShapePath('triangle');

    // Should start with M (move to), contain L (line to), and end with Z (close path)
    expect(path).toMatch(/^M .+ L .+ L .+ Z$/);

    // Should contain numeric coordinates
    expect(path).toMatch(/\d+(\.\d+)?/);
  });

  it('should generate valid SVG path for square', () => {
    const path = getShapePath('square');

    // Should start with M, contain 3 L commands, and end with Z
    expect(path).toMatch(/^M .+ L .+ L .+ L .+ Z$/);

    // Should use the defined SQUARE_POINTS
    expect(path).toContain(`${SQUARE_POINTS[0].x} ${SQUARE_POINTS[0].y}`);
    expect(path).toContain(`${SQUARE_POINTS[1].x} ${SQUARE_POINTS[1].y}`);
    expect(path).toContain(`${SQUARE_POINTS[2].x} ${SQUARE_POINTS[2].y}`);
    expect(path).toContain(`${SQUARE_POINTS[3].x} ${SQUARE_POINTS[3].y}`);
  });

  it('should start triangle path at third vertex (point 2)', () => {
    const path = getShapePath('triangle');
    const points = getTrianglePoints();

    // Path should start with M followed by coordinates of point 2
    expect(path).toMatch(new RegExp(`^M ${points[2].x.toFixed(2)}`));
  });

  it('should create closed paths (ending with Z)', () => {
    const trianglePath = getShapePath('triangle');
    const squarePath = getShapePath('square');

    expect(trianglePath.endsWith('Z')).toBe(true);
    expect(squarePath.endsWith('Z')).toBe(true);
  });

  it('should generate consistent paths across multiple calls', () => {
    const triangle1 = getShapePath('triangle');
    const triangle2 = getShapePath('triangle');
    const square1 = getShapePath('square');
    const square2 = getShapePath('square');

    expect(triangle1).toBe(triangle2);
    expect(square1).toBe(square2);
  });

  it('should generate different paths for triangle vs square', () => {
    const trianglePath = getShapePath('triangle');
    const squarePath = getShapePath('square');

    expect(trianglePath).not.toBe(squarePath);

    // Triangle should have 2 L commands (3 vertices)
    const triangleLines = (trianglePath.match(/L /g) || []).length;
    expect(triangleLines).toBe(2);

    // Square should have 3 L commands (4 vertices)
    const squareLines = (squarePath.match(/L /g) || []).length;
    expect(squareLines).toBe(3);
  });
});
