import React, { useState, useMemo } from 'react';
import { BreathingType } from '../types/breathing';
import { useBreathingAnimation } from '../hooks/useBreathingAnimation';
import { calculateDegreesPerMs } from '../utils/animation';
import { BreathingVisualization } from './BreathingVisualization';
import { BreathingTypeSelector } from './BreathingTypeSelector';
import { PhaseIndicator } from './PhaseIndicator';
import { ControlButtons } from './ControlButtons';
import { PHASE_DURATION } from '../constants/breathing';
import '../styles/BreathingApp.css';

export const BreathingApp: React.FC = () => {
  const [breathingType, setBreathingType] = useState<BreathingType>('triangle');
  const [isActive, setIsActive] = useState(false);

  const phases = breathingType === 'triangle' ? 3 : 4;
  const degreesPerMs = useMemo(
    () => calculateDegreesPerMs(PHASE_DURATION, phases),
    [phases]
  );

  const { state, reset } = useBreathingAnimation(
    isActive,
    PHASE_DURATION,
    phases,
    degreesPerMs
  );

  const handleStart = () => setIsActive(true);

  const handleStop = () => {
    setIsActive(false);
    reset();
  };

  const handleRestart = () => {
    reset();
    setIsActive(true);
  };

  const handleTypeChange = (type: BreathingType) => {
    setBreathingType(type);
    setIsActive(false);
    reset();
  };

  return (
    <div className="breathing-app">
      <BreathingTypeSelector
        breathingType={breathingType}
        onTypeChange={handleTypeChange}
      />

      <BreathingVisualization
        breathingType={breathingType}
        currentPhase={state.currentPhase}
        phaseProgress={state.phaseProgress}
        rotation={state.rotation}
        shouldPulse={state.shouldPulse}
        isActive={isActive}
        phases={phases}
      />

      <PhaseIndicator
        breathingType={breathingType}
        currentPhase={state.currentPhase}
      />

      <ControlButtons
        isActive={isActive}
        onStart={handleStart}
        onStop={handleStop}
        onRestart={handleRestart}
      />
    </div>
  );
};

export default BreathingApp;
