import { Position, BreathingType } from '../types/breathing';
import {
  TRIANGLE_CENTER_X,
  TRIANGLE_CENTER_Y,
  TRIANGLE_RADIUS,
  TRIANGLE_ANGLES,
  SQUARE_POINTS,
} from '../constants/breathing';

/**
 * Converts degrees to radians
 */
const degreesToRadians = (degrees: number): number => (degrees * Math.PI) / 180;

/**
 * Calculates the vertices of a triangle
 */
export const getTrianglePoints = (): Position[] => {
  return TRIANGLE_ANGLES.map(angle => {
    const radians = degreesToRadians(angle);
    return {
      x: TRIANGLE_CENTER_X + TRIANGLE_RADIUS * Math.cos(radians),
      y: TRIANGLE_CENTER_Y + TRIANGLE_RADIUS * Math.sin(radians),
    };
  });
};

/**
 * Calculates the position along the shape based on current phase and progress
 */
export const getCirclePosition = (
  breathingType: BreathingType,
  currentPhase: number,
  phaseProgress: number
): Position => {
  if (breathingType === 'triangle') {
    const points = getTrianglePoints();
    const start = points[(currentPhase + 2) % 3]; // Start from third point
    const end = points[currentPhase];

    return {
      x: start.x + (end.x - start.x) * phaseProgress,
      y: start.y + (end.y - start.y) * phaseProgress,
    };
  } else {
    const start = SQUARE_POINTS[currentPhase];
    const end = SQUARE_POINTS[(currentPhase + 1) % 4];

    return {
      x: start.x + (end.x - start.x) * phaseProgress,
      y: start.y + (end.y - start.y) * phaseProgress,
    };
  }
};

/**
 * Generates the SVG path string for the breathing shape
 */
export const getShapePath = (breathingType: BreathingType): string => {
  if (breathingType === 'triangle') {
    const points = getTrianglePoints();
    return `M ${points[2].x} ${points[2].y} L ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y} Z`;
  } else {
    return `M ${SQUARE_POINTS[0].x} ${SQUARE_POINTS[0].y} L ${SQUARE_POINTS[1].x} ${SQUARE_POINTS[1].y} L ${SQUARE_POINTS[2].x} ${SQUARE_POINTS[2].y} L ${SQUARE_POINTS[3].x} ${SQUARE_POINTS[3].y} Z`;
  }
};
