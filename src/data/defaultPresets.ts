import { BreathingPattern } from '../types/preset';

/**
 * Default breathing patterns included with the app
 */
export const defaultPresets: BreathingPattern[] = [
  {
    id: 'triangle-classic',
    name: 'Triangle Breathing',
    description: 'Classic 3-phase breathing for focus and calm',
    shape: 'triangle',
    phases: [
      { type: 'in', duration: 4000 },
      { type: 'hold', duration: 4000 },
      { type: 'out', duration: 4000 },
    ],
    defaultCycles: 5,
    tempo: 1.0,
    metadata: {
      tags: ['focus', 'calm', 'beginner'],
      difficulty: 'beginner',
      totalDuration: 12000,
    },
    preferences: {
      sound: false,
      haptics: false,
      voiceCues: 'off',
    },
    createdAt: Date.now(),
    isCustom: false,
    isFavorite: false,
  },
  {
    id: 'square-box',
    name: 'Square Breathing',
    description: '4-phase breathing for stress relief',
    shape: 'square',
    phases: [
      { type: 'in', duration: 4000 },
      { type: 'hold', duration: 4000 },
      { type: 'out', duration: 4000 },
      { type: 'hold', duration: 4000 },
    ],
    defaultCycles: 4,
    tempo: 1.0,
    metadata: {
      tags: ['stress-relief', 'anxiety', 'beginner'],
      difficulty: 'beginner',
      totalDuration: 16000,
    },
    preferences: {
      sound: false,
      haptics: false,
      voiceCues: 'off',
    },
    createdAt: Date.now(),
    isCustom: false,
    isFavorite: false,
  },
  {
    id: 'triangle-quick',
    name: 'Quick Focus',
    description: 'Fast-paced triangle breathing for quick energy',
    shape: 'triangle',
    phases: [
      { type: 'in', duration: 3000 },
      { type: 'hold', duration: 2000 },
      { type: 'out', duration: 3000 },
    ],
    defaultCycles: 6,
    tempo: 1.0,
    metadata: {
      tags: ['energy', 'focus', 'intermediate'],
      difficulty: 'intermediate',
      totalDuration: 8000,
    },
    preferences: {
      sound: false,
      haptics: false,
      voiceCues: 'off',
    },
    createdAt: Date.now(),
    isCustom: false,
    isFavorite: false,
  },
  {
    id: 'square-deep',
    name: 'Deep Relaxation',
    description: 'Slower square breathing for deep relaxation',
    shape: 'square',
    phases: [
      { type: 'in', duration: 5000 },
      { type: 'hold', duration: 5000 },
      { type: 'out', duration: 6000 },
      { type: 'hold', duration: 4000 },
    ],
    defaultCycles: 3,
    tempo: 1.0,
    metadata: {
      tags: ['sleep', 'relaxation', 'intermediate'],
      difficulty: 'intermediate',
      totalDuration: 20000,
    },
    preferences: {
      sound: false,
      haptics: false,
      voiceCues: 'off',
    },
    createdAt: Date.now(),
    isCustom: false,
    isFavorite: false,
  },
];

/**
 * Get the default preset storage structure
 */
export const getDefaultPresetStorage = () => ({
  presets: defaultPresets,
  selectedPresetId: defaultPresets[0].id,
  lastUpdated: Date.now(),
});
