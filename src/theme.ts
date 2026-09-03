// src/theme.ts
// Centralized design tokens — dark mode color palette, fonts, spacing.

export const COLORS = {
  /** Page/screen background */
  bg: '#0a0a0a',
  /** Card / surface background */
  surface: '#141414',
  /** Elevated card */
  surfaceElevated: '#1c1c1e',
  /** Border / dividers */
  border: '#2a2a2a',
  /** Primary accent — electric blue */
  accent: '#3b82f6',
  /** Danger / high severity */
  danger: '#ef4444',
  /** Warning / medium severity */
  warning: '#f59e0b',
  /** Success / online indicator */
  success: '#22c55e',
  /** Primary text */
  textPrimary: '#f9fafb',
  /** Secondary text */
  textSecondary: '#9ca3af',
  /** Muted / disabled text */
  textMuted: '#6b7280',
} as const;

export const FONTS = {
  regular: 'System',
  semiBold: 'System',
  bold: 'System',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
} as const;
