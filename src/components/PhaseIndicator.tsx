import React from 'react';
import { BreathingType } from '../types/breathing';
import { PHASE_LABELS } from '../constants/breathing';
import '../styles/PhaseIndicator.css';

interface PhaseIndicatorProps {
  breathingType: BreathingType;
  currentPhase: number;
}

export const PhaseIndicator: React.FC<PhaseIndicatorProps> = ({ breathingType, currentPhase }) => {
  return (
    <div className="phase-indicator">
      <p className="phase-text">{PHASE_LABELS[breathingType][currentPhase]}</p>
    </div>
  );
};
