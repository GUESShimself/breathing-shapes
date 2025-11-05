import React from 'react';
import { BreathingType } from '../types/breathing';
import '../styles/BreathingTypeSelector.css';

interface BreathingTypeSelectorProps {
  breathingType: BreathingType;
  onTypeChange: (type: BreathingType) => void;
}

export const BreathingTypeSelector: React.FC<BreathingTypeSelectorProps> = ({
  breathingType,
  onTypeChange,
}) => {
  return (
    <div className="type-selector">
      <button
        onClick={() => onTypeChange('triangle')}
        className={`type-button ${breathingType === 'triangle' ? 'active' : ''}`}
      >
        Triangle Breathing
      </button>
      <button
        onClick={() => onTypeChange('square')}
        className={`type-button ${breathingType === 'square' ? 'active' : ''}`}
      >
        Square Breathing
      </button>
    </div>
  );
};
