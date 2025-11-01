import { useReducer, useEffect, useRef } from 'react';
import { AnimationState, AnimationAction } from '../types/breathing';
import { PULSE_INTERVAL, PULSE_DURATION } from '../constants/breathing';

/**
 * Reducer for managing animation state
 */
const animationReducer = (state: AnimationState, action: AnimationAction): AnimationState => {
  switch (action.type) {
    case 'UPDATE_ANIMATION': {
      const { delta, phaseDuration, phases, degreesPerMs } = action;

      const newRotation = (state.rotation - (delta * degreesPerMs)) % 360;
      const newProgress = state.phaseProgress + (delta / phaseDuration);

      if (newProgress >= 1) {
        return {
          ...state,
          rotation: newRotation,
          phaseProgress: 0,
          currentPhase: (state.currentPhase + 1) % phases
        };
      }

      return {
        ...state,
        rotation: newRotation,
        phaseProgress: newProgress
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
        shouldPulse: false
      };
    default:
      return state;
  }
};

const initialState: AnimationState = {
  currentPhase: 0,
  phaseProgress: 0,
  rotation: 0,
  shouldPulse: false
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
