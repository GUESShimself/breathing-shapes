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

  // Calculate glow color based on phase and intensity
  const glowColor = isWarmPhase
    ? `rgba(255, 138, 101, ${glowIntensity})` // Warm coral
    : `rgba(34, 211, 238, ${glowIntensity})`; // Cool cyan

  return (
    <div className="visualization-container">
      <svg width="400" height="350" viewBox="0 0 400 350">
        <defs>
          {/* Warm glow filter for inhale */}
          <filter id="glow-warm" x="-50%" y="-50%" width="200%" height="200%">
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
          <filter id="glow-cool" x="-50%" y="-50%" width="200%" height="200%">
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
                  className="breathing-ripple breathing-ripple-1"
                  style={{
                    opacity: glowIntensity * 0.3,
                    stroke: glowColor,
                    fill: 'none',
                    strokeWidth: 3,
                  }}
                />
                <path
                  d={shapePath}
                  className="breathing-ripple breathing-ripple-2"
                  style={{
                    opacity: glowIntensity * 0.2,
                    stroke: glowColor,
                    fill: 'none',
                    strokeWidth: 2,
                  }}
                />
                <path
                  d={shapePath}
                  className="breathing-ripple breathing-ripple-3"
                  style={{
                    opacity: glowIntensity * 0.1,
                    stroke: glowColor,
                    fill: 'none',
                    strokeWidth: 1,
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
