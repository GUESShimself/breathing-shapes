import React, { useState, useMemo } from 'react';
import { BreathingType } from '../types/breathing';
import { useBreathingAnimation } from '../hooks/useBreathingAnimation';
import { usePresets } from '../hooks/usePresets';
import { calculateDegreesPerMs } from '../utils/animation';
import { BreathingVisualization } from './BreathingVisualization';
import { PhaseIndicator } from './PhaseIndicator';
import { ControlButtons } from './ControlButtons';
import { PresetCarousel } from './PresetCarousel';
import { Footer } from './Footer';
import '../styles/BreathingApp.css';

export const BreathingApp: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const { presets, selectedPreset, selectPreset, isLoading } = usePresets();

  // Get breathing configuration from selected preset
  const breathingType: BreathingType = selectedPreset?.shape || 'triangle';
  const phases = selectedPreset?.phases.length || 3;

  // For now, use the first phase duration as the base duration
  // TODO: Support variable phase durations in animation
  const phaseDuration = selectedPreset?.phases[0]?.duration || 4000;

  const degreesPerMs = useMemo(
    () => calculateDegreesPerMs(phaseDuration, phases),
    [phaseDuration, phases]
  );

  const { state, reset } = useBreathingAnimation(isActive, phaseDuration, phases, degreesPerMs);

  const handleStart = () => setIsActive(true);

  const handleStop = () => {
    setIsActive(false);
    reset();
  };

  const handleRestart = () => {
    reset();
    setIsActive(true);
  };

  const handlePresetChange = (id: string) => {
    selectPreset(id);
    setIsActive(false);
    reset();
  };

  if (isLoading || !selectedPreset) {
    return (
      <div className="breathing-app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="breathing-app">
      <PresetCarousel
        presets={presets}
        selectedPresetId={selectedPreset.id}
        onSelectPreset={handlePresetChange}
        isActive={isActive}
      />

      <BreathingVisualization
        breathingType={breathingType}
        currentPhase={state.currentPhase}
        phaseProgress={state.phaseProgress}
        rotation={state.rotation}
        shouldPulse={state.shouldPulse}
        isActive={isActive}
        phases={phases}
        scale={state.scale}
        glowIntensity={state.glowIntensity}
        cumulativeProgress={state.cumulativeProgress}
      />

      <PhaseIndicator breathingType={breathingType} currentPhase={state.currentPhase} />

      <ControlButtons
        isActive={isActive}
        onStart={handleStart}
        onStop={handleStop}
        onRestart={handleRestart}
      />

      <Footer isActive={isActive} />
    </div>
  );
};

export default BreathingApp;
