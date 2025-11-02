export type PhaseType = 'in' | 'hold' | 'out';
export type ShapeType = 'triangle' | 'square';

export interface Phase {
  type: PhaseType;
  duration: number; // milliseconds
  label?: string; // optional custom label
}

export interface BreathingPattern {
  id: string;
  name: string;
  description?: string;
  shape: ShapeType;
  phases: Phase[];
  defaultCycles: number;
  tempo: number; // master multiplier (1.0 = normal speed)
  metadata: {
    tags: string[]; // e.g., 'focus', 'sleep', 'anxiety', 'beginner'
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    totalDuration: number; // pre-calculated total ms for one cycle
  };
  preferences: {
    sound: boolean;
    haptics: boolean;
    voiceCues: 'off' | 'counts' | 'guidance';
  };
  createdAt: number; // timestamp
  isCustom: boolean; // true if user-created, false if built-in
  isFavorite: boolean;
}

export interface PresetStorage {
  presets: BreathingPattern[];
  selectedPresetId: string | null;
  lastUpdated: number;
}
