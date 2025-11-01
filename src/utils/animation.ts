import { PATH_LENGTHS, TRAIL_LENGTH_RATIO } from '../constants/breathing';
import { BreathingType } from '../types/breathing';

/**
 * Calculates the stroke-dasharray for the trail effect
 */
export const calculateTrailDashArray = (
  breathingType: BreathingType,
  currentPhase: number,
  phaseProgress: number,
  phases: number
): string => {
  const pathLength = PATH_LENGTHS[breathingType];
  const overallProgress = (currentPhase + phaseProgress) / phases;
  const maxTrailLength = pathLength * TRAIL_LENGTH_RATIO;
  const currentPosition = overallProgress * pathLength;

  // Trail grows from 0 to maxTrailLength, then maintains length
  const actualTrailLength = Math.min(currentPosition, maxTrailLength);
  const gapBeforeTrail = Math.max(0, currentPosition - actualTrailLength);

  return `0 ${gapBeforeTrail} ${actualTrailLength} ${pathLength}`;
};

/**
 * Calculates degrees per millisecond for rotation
 */
export const calculateDegreesPerMs = (phaseDuration: number, phases: number): number => {
  const totalCycleDuration = phaseDuration * phases;
  return 360 / totalCycleDuration;
};
