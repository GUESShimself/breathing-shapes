import React from 'react';
import { BreathingType } from '../types/breathing';
import { PHASE_LABELS } from '../constants/breathing';
import '../styles/PhaseIndicator.css';

interface PhaseIndicatorProps {
  breathingType: BreathingType;
  currentPhase: number;
  isActive: boolean;
}

export const PhaseIndicator: React.FC<PhaseIndicatorProps> = ({ breathingType, currentPhase, isActive }) => {
  return (
    <div className={`phase-indicator ${isActive ? 'phase-indicator--visible' : 'phase-indicator--hidden'}`}>
      <p className="phase-text">{PHASE_LABELS[breathingType][currentPhase]}</p>
    </div>
  );
};
