import React, { useMemo } from 'react';
import { BreathingType, Position } from '../types/breathing';
import { getCirclePosition, getShapePath } from '../utils/geometry';
import { calculateTrailDashArray } from '../utils/animation';
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
}

export const BreathingVisualization: React.FC<BreathingVisualizationProps> = ({
  breathingType,
  currentPhase,
  phaseProgress,
  rotation,
  shouldPulse,
  isActive,
  phases
}) => {
  // Memoize expensive calculations
  const circlePos: Position = useMemo(
    () => getCirclePosition(breathingType, currentPhase, phaseProgress),
    [breathingType, currentPhase, phaseProgress]
  );

  const shapePath = useMemo(
    () => getShapePath(breathingType),
    [breathingType]
  );

  const trailDashArray = useMemo(
    () => calculateTrailDashArray(breathingType, currentPhase, phaseProgress, phases),
    [breathingType, currentPhase, phaseProgress, phases]
  );

  const pathLength = PATH_LENGTHS[breathingType];

  return (
    <div className="visualization-container">
      <svg width="400" height="300" viewBox="0 0 400 300">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <g transform={`rotate(${rotation} 200 150)`}>
          {/* Dim base outline */}
          <path
            d={shapePath}
            className="shape-outline"
          />

          {/* Bright trailing segment */}
          {isActive && (
            <path
              d={shapePath}
              className="shape-trail"
              pathLength={pathLength}
              strokeDasharray={trailDashArray}
              strokeDashoffset={0}
            />
          )}

          {/* Ripple circles */}
          {shouldPulse && (
            <>
              <circle
                cx={circlePos.x}
                cy={circlePos.y}
                r="6"
                className="ripple ripple-1"
              />
              <circle
                cx={circlePos.x}
                cy={circlePos.y}
                r="6"
                className="ripple ripple-2"
              />
            </>
          )}

          {/* Main circle */}
          <circle
            cx={circlePos.x}
            cy={circlePos.y}
            r={shouldPulse ? CIRCLE_RADIUS_PULSE : CIRCLE_RADIUS_NORMAL}
            className="main-circle"
            filter="url(#glow)"
          />
        </g>
      </svg>
    </div>
  );
};
