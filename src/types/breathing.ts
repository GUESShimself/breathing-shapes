export type BreathingType = 'triangle' | 'square';

export interface Position {
  x: number;
  y: number;
}

export interface AnimationState {
  currentPhase: number;
  phaseProgress: number;
  rotation: number;
  shouldPulse: boolean;
}

export type AnimationAction =
  | { type: 'UPDATE_ANIMATION'; delta: number; phaseDuration: number; phases: number; degreesPerMs: number }
  | { type: 'TRIGGER_PULSE' }
  | { type: 'END_PULSE' }
  | { type: 'RESET' };

export interface BreathingConfig {
  breathingType: BreathingType;
  phaseDuration: number;
  phases: number;
}
