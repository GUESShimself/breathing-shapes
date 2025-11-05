import { useReducer, useEffect, useRef } from 'react';
import { AnimationState, AnimationAction } from '../types/breathing';
import { PULSE_INTERVAL, PULSE_DURATION } from '../constants/breathing';

/**
 * Calculate scale based on phase and progress
 * Inhale (0): 0.95 → 1.1
 * Hold Full (1): 1.1 (maintain)
 * Exhale (2): 1.1 → 0.95
 * Hold Empty (3): 0.95 (maintain)
 */
const calculateScale = (phase: number, progress: number, totalPhases: number): number => {
  if (totalPhases === 3) {
    // Triangle: Inhale, Hold, Exhale
    if (phase === 0) return 0.95 + (progress * 0.15); // Inhale
    if (phase === 1) return 1.1; // Hold
    return 1.1 - (progress * 0.15); // Exhale
  } else {
    // Square: Inhale, Hold, Exhale, Hold
    if (phase === 0) return 0.95 + (progress * 0.15); // Inhale
    if (phase === 1) return 1.1; // Hold Full
    if (phase === 2) return 1.1 - (progress * 0.15); // Exhale
    return 0.95; // Hold Empty
  }
};

/**
 * Calculate glow intensity based on phase and progress
 * Inhale (0): 0 → 1.0
 * Hold Full (1): 1.0 (bright)
 * Exhale (2): 1.0 → 0.3 (maintain then dim)
 * Hold Empty (3): 0.3 (dim)
 */
const calculateGlowIntensity = (phase: number, progress: number, totalPhases: number): number => {
  if (totalPhases === 3) {
    // Triangle: Inhale, Hold, Exhale
    if (phase === 0) return progress * 1.0; // Inhale: 0 → 1.0
    if (phase === 1) return 1.0; // Hold: bright
    return 1.0 - (progress * 0.7); // Exhale: 1.0 → 0.3
  } else {
    // Square: Inhale, Hold, Exhale, Hold
    if (phase === 0) return progress * 1.0; // Inhale: 0 → 1.0
    if (phase === 1) return 1.0; // Hold Full: bright
    if (phase === 2) return 1.0 - (progress * 0.7); // Exhale: 1.0 → 0.3
    return 0.3; // Hold Empty: dim
  }
};

/**
 * Reducer for managing animation state
 */
const animationReducer = (state: AnimationState, action: AnimationAction): AnimationState => {
  switch (action.type) {
    case 'UPDATE_ANIMATION': {
      const { delta, phaseDuration, phases, degreesPerMs } = action;

      const newRotation = (state.rotation - (delta * degreesPerMs)) % 360;
      const newProgress = state.phaseProgress + (delta / phaseDuration);
      const progressDelta = delta / phaseDuration;
      const newCumulativeProgress = state.cumulativeProgress + progressDelta;

      if (newProgress >= 1) {
        const newPhase = (state.currentPhase + 1) % phases;
        return {
          ...state,
          rotation: newRotation,
          phaseProgress: 0,
          currentPhase: newPhase,
          scale: calculateScale(newPhase, 0, phases),
          glowIntensity: calculateGlowIntensity(newPhase, 0, phases),
          cumulativeProgress: newCumulativeProgress
        };
      }

      return {
        ...state,
        rotation: newRotation,
        phaseProgress: newProgress,
        scale: calculateScale(state.currentPhase, newProgress, phases),
        glowIntensity: calculateGlowIntensity(state.currentPhase, newProgress, phases),
        cumulativeProgress: newCumulativeProgress
      };
    }
    case 'TRIGGER_PULSE':
      return { ...state, shouldPulse: true };
    case 'END_PULSE':
      return { ...state, shouldPulse: false };
    case 'RESET':
      return {
        currentPhase: 0,
        phaseProgress: 0,
        rotation: 0,
        shouldPulse: false,
        scale: 0.95,
        glowIntensity: 0,
        cumulativeProgress: 0
      };
    default:
      return state;
  }
};

const initialState: AnimationState = {
  currentPhase: 0,
  phaseProgress: 0,
  rotation: 0,
  shouldPulse: false,
  scale: 0.95,
  glowIntensity: 0,
  cumulativeProgress: 0
};

/**
 * Custom hook for managing breathing animation state and loop
 */
export const useBreathingAnimation = (
  isActive: boolean,
  phaseDuration: number,
  phases: number,
  degreesPerMs: number
) => {
  const [state, dispatch] = useReducer(animationReducer, initialState);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const lastPulseTimeRef = useRef<number>(0);

  // Main animation loop
  useEffect(() => {
    if (isActive) {
      lastTimeRef.current = Date.now();
      lastPulseTimeRef.current = Date.now();

      const animate = () => {
        const now = Date.now();
        const delta = now - (lastTimeRef.current || now);
        lastTimeRef.current = now;

        dispatch({
          type: 'UPDATE_ANIMATION',
          delta,
          phaseDuration,
          phases,
          degreesPerMs
        });

        // Trigger pulse every second
        const timeSinceLastPulse = now - lastPulseTimeRef.current;
        if (timeSinceLastPulse >= PULSE_INTERVAL) {
          dispatch({ type: 'TRIGGER_PULSE' });
          lastPulseTimeRef.current = now;
          setTimeout(() => dispatch({ type: 'END_PULSE' }), PULSE_DURATION);
        }

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      dispatch({ type: 'END_PULSE' });
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, phaseDuration, phases, degreesPerMs]);

  const reset = () => dispatch({ type: 'RESET' });

  return { state, reset };
};
