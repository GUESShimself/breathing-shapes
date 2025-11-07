import React, { useMemo } from 'react';
import { BreathingType, Position } from '../types/breathing';
import { getCirclePosition, getShapePath } from '../utils/geometry';
import { calculateTrailDashArray, calculateTrailDashOffset } from '../utils/animation';
import { PATH_LENGTHS, CIRCLE_RADIUS_NORMAL, CIRCLE_RADIUS_PULSE } from '../constants/breathing';
import '../styles/BreathingVisualization.css';

interface BreathingVisualizationProps {
  breathingType: BreathingType;
  currentPhase: number;
  phaseProgress: number;
  rotation: number;
  shouldPulse: boolean;
  isActive: boolean;
  phases: number;
  scale: number;
  glowIntensity: number;
  cumulativeProgress: number;
}

// Helper to calculate ripple scales and visibility based on current phase
const getRippleScales = (currentPhase: number, phases: number, breathingType: BreathingType) => {
  // Determine if current phase is a hold phase
  const isHold = phases === 3 ? currentPhase === 1 : (currentPhase === 1 || currentPhase === 3);
  // Phase 2 is always exhale
  const isExhale = currentPhase === 2;

  // Different scale values for triangle (larger spacing) vs square
  const scales = breathingType === 'triangle'
    ? { outward: [1.12, 1.24, 1.36], inward: [0.88, 0.76, 0.64] }
    : { outward: [1.08, 1.16, 1.24], inward: [0.92, 0.84, 0.76] };

  if (isHold) {
    // Hold phases: fade ripples to invisible
    return { scale1: scales.outward[0], scale2: scales.outward[1], scale3: scales.outward[2], visibilityFactor: 0 };
  } else if (isExhale) {
    // Exhale: ripples scale INWARD (smaller than base shape)
    return { scale1: scales.inward[0], scale2: scales.inward[1], scale3: scales.inward[2], visibilityFactor: 1 };
  } else {
    // Inhale: ripples scale OUTWARD (larger than base shape)
    return { scale1: scales.outward[0], scale2: scales.outward[1], scale3: scales.outward[2], visibilityFactor: 1 };
  }
};

export const BreathingVisualization: React.FC<BreathingVisualizationProps> = ({
  breathingType,
  currentPhase,
  phaseProgress,
  rotation,
  shouldPulse,
  isActive,
  phases,
  scale,
  glowIntensity,
  cumulativeProgress,
}) => {
  // Memoize expensive calculations
  const circlePos: Position = useMemo(
    () => getCirclePosition(breathingType, currentPhase, phaseProgress),
    [breathingType, currentPhase, phaseProgress]
  );

  const shapePath = useMemo(() => getShapePath(breathingType), [breathingType]);

  const trailDashArray = useMemo(
    () =>
      calculateTrailDashArray(
        breathingType,
        currentPhase,
        phaseProgress,
        phases,
        cumulativeProgress
      ),
    [breathingType, currentPhase, phaseProgress, phases, cumulativeProgress]
  );

  const trailDashOffset = useMemo(
    () => calculateTrailDashOffset(breathingType, phases, cumulativeProgress),
    [breathingType, phases, cumulativeProgress]
  );

  const pathLength = PATH_LENGTHS[breathingType];

  // Determine if we're in warm (inhale) or cool (exhale) phase
  // Triangle (3 phases): Phase 0 = Inhale (warm), Phase 1 = Hold (warm), Phase 2 = Exhale (cool)
  // Square (4 phases): Phase 0 = Inhale (warm), Phase 1 = Hold Full (warm), Phase 2 = Exhale (cool), Phase 3 = Hold Empty (cool)
  const isWarmPhase = currentPhase === 0 || currentPhase === 1;

  // Calculate glow color based on phase with constant intensity
  const glowColor = isWarmPhase
    ? `rgba(255, 138, 101, 1)` // Warm coral - constant full intensity
    : `rgba(34, 211, 238, 1)`; // Cool cyan - constant full intensity

  // Get ripple scales based on current phase and breathing type
  const rippleScales = getRippleScales(currentPhase, phases, breathingType);

  return (
    <div className="visualization-container">
      <svg width="400" height="350" viewBox="0 0 400 350">
        <defs>
          {/* Warm glow filter for inhale */}
          <filter id="glow-warm" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="12" result="coloredBlur" />
            <feFlood floodColor="#ff8a65" floodOpacity="1" result="warmColor" />
            <feComposite in="warmColor" in2="coloredBlur" operator="in" result="coloredGlow" />
            <feMerge>
              <feMergeNode in="coloredGlow" />
              <feMergeNode in="coloredGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Cool glow filter for exhale */}
          <filter id="glow-cool" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="12" result="coloredBlur" />
            <feFlood floodColor="#22d3ee" floodOpacity="1" result="coolColor" />
            <feComposite in="coolColor" in2="coloredBlur" operator="in" result="coloredGlow" />
            <feMerge>
              <feMergeNode in="coloredGlow" />
              <feMergeNode in="coloredGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Rotation group */}
        <g transform={`rotate(${rotation} 200 175)`}>
          {/* Scale group - centered at 200, 175 */}
          <g transform={`translate(200 175) scale(${scale}) translate(-200 -175)`}>
            {/* Layered breathing ripples - 3 staggered layers */}
            {isActive && glowIntensity > 0.1 && (
              <>
                <path
                  d={shapePath}
                  className={`breathing-ripple breathing-ripple-1 ${
                    currentPhase === 0 ? 'pulse-outward' :
                    currentPhase === 2 ? 'pulse-inward' : ''
                  }`}
                  filter="url(#ripple-wave-1)"
                  style={{
                    stroke: 'var(--color-bg-lighter)',
                    fill: 'none',
                    strokeWidth: 3,
                    opacity: rippleScales.visibilityFactor > 0 ? undefined : 0,
                  }}
                />
                <path
                  d={shapePath}
                  className={`breathing-ripple breathing-ripple-2 ${
                    currentPhase === 0 ? 'pulse-outward' :
                    currentPhase === 2 ? 'pulse-inward' : ''
                  }`}
                  filter="url(#ripple-wave-2)"
                  style={{
                    stroke: 'var(--color-bg-lighter)',
                    fill: 'none',
                    strokeWidth: 2,
                    opacity: rippleScales.visibilityFactor > 0 ? undefined : 0,
                  }}
                />
                <path
                  d={shapePath}
                  className={`breathing-ripple breathing-ripple-3 ${
                    currentPhase === 0 ? 'pulse-outward' :
                    currentPhase === 2 ? 'pulse-inward' : ''
                  }`}
                  filter="url(#ripple-wave-3)"
                  style={{
                    stroke: 'var(--color-bg-lighter)',
                    fill: 'none',
                    strokeWidth: 1,
                    opacity: rippleScales.visibilityFactor > 0 ? undefined : 0,
                  }}
                />
              </>
            )}

            {/* Dim base outline */}
            <path
              d={shapePath}
              className="shape-outline"
              style={{ opacity: 0.3 + glowIntensity * 0.3 }}
            />

            {/* Bright trailing segment */}
            {isActive && (
              <path
                d={shapePath}
                className="shape-trail"
                pathLength={pathLength}
                strokeDasharray={trailDashArray}
                strokeDashoffset={trailDashOffset}
                style={{ stroke: glowColor }}
              />
            )}

            {/* Pulse circles */}
            {shouldPulse && (
              <>
                <circle
                  cx={circlePos.x}
                  cy={circlePos.y}
                  r="6"
                  className="pulse pulse-1"
                  style={{ stroke: glowColor }}
                />
                <circle
                  cx={circlePos.x}
                  cy={circlePos.y}
                  r="6"
                  className="pulse pulse-2"
                  style={{ stroke: glowColor }}
                />
              </>
            )}

            {/* Main circle with colored glow */}
            <circle
              cx={circlePos.x}
              cy={circlePos.y}
              r={shouldPulse ? CIRCLE_RADIUS_PULSE : CIRCLE_RADIUS_NORMAL}
              className="main-circle"
              style={{ fill: glowColor }}
              filter={isWarmPhase ? 'url(#glow-warm)' : 'url(#glow-cool)'}
            />
          </g>
        </g>
      </svg>
    </div>
  );
};
