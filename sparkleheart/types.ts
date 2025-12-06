export interface AppState {
  message: string;
  subMessage: string;
  primaryColor: string; // Hex code
  secondaryColor: string; // Hex code
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  type: 'heart' | 'sparkle';
}

export enum ThemeColor {
  PassionRed = '#ef4444',
  DeepPink = '#ec4899',
  PurpleRain = '#a855f7',
  OceanBlue = '#3b82f6',
  GoldenHour = '#eab308',
}