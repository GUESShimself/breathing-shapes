import { PATH_LENGTHS, TRAIL_LENGTH_RATIO } from '../constants/breathing';
import { BreathingType } from '../types/breathing';

/**
 * Calculates the stroke-dasharray for the trail effect
 * Uses cumulative progress to ensure trail never resets between cycles
 */
export const calculateTrailDashArray = (
  breathingType: BreathingType,
  currentPhase: number,
  phaseProgress: number,
  phases: number,
  cumulativeProgress: number
): string => {
  const pathLength = PATH_LENGTHS[breathingType];
  const normalizedProgress = cumulativeProgress / phases;
  const maxTrailLength = pathLength * TRAIL_LENGTH_RATIO;
  const totalDistance = normalizedProgress * pathLength;
  const actualTrailLength = Math.min(totalDistance, maxTrailLength);

  // Use dasharray to create the trail: show trail, then hide the rest
  // Gap should be pathLength - actualTrailLength so the pattern wraps correctly
  const gap = pathLength - actualTrailLength;
  return `${actualTrailLength} ${gap}`;
};

/**
 * Calculates the stroke-dashoffset to position the trail behind the circle
 */
export const calculateTrailDashOffset = (
  breathingType: BreathingType,
  phases: number,
  cumulativeProgress: number
): number => {
  const pathLength = PATH_LENGTHS[breathingType];
  const normalizedProgress = cumulativeProgress / phases;
  const maxTrailLength = pathLength * TRAIL_LENGTH_RATIO;
  const totalDistance = normalizedProgress * pathLength;
  const actualTrailLength = Math.min(totalDistance, maxTrailLength);

  // We want the END of the visible trail dash to align with the circle position
  // Use the full position (not modulo) so the offset naturally wraps around
  // strokeDashoffset shifts the dash pattern along the path
  // Negative offset moves pattern forward; add trail length to position trail behind circle
  return -(normalizedProgress * pathLength) + actualTrailLength;
};

/**
 * Calculates degrees per millisecond for rotation
 */
export const calculateDegreesPerMs = (phaseDuration: number, phases: number): number => {
  const totalCycleDuration = phaseDuration * phases;
  return 360 / totalCycleDuration;
};
