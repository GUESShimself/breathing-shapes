export const PHASE_DURATION = 4000; // milliseconds per phase

export const TRIANGLE_RADIUS = 115.47;
export const TRIANGLE_CENTER_X = 200;
export const TRIANGLE_CENTER_Y = 175;
export const TRIANGLE_ANGLES = [0, 120, 240]; // degrees

export const SQUARE_POINTS = [
  { x: 100, y: 75 },
  { x: 300, y: 75 },
  { x: 300, y: 275 },
  { x: 100, y: 275 },
];

export const PATH_LENGTHS = {
  triangle: 600,
  square: 800,
} as const;

export const TRAIL_LENGTH_RATIO = 1 / 6;

export const PHASE_LABELS = {
  triangle: ['Breathe In', 'Hold', 'Breathe Out'],
  square: ['Breathe In', 'Hold', 'Breathe Out', 'Hold'],
} as const;

export const PULSE_INTERVAL = 1000; // milliseconds
export const PULSE_DURATION = 500; // milliseconds

export const CIRCLE_RADIUS_NORMAL = 6;
export const CIRCLE_RADIUS_PULSE = 10;
export const RIPPLE_MAX_RADIUS = 30;
