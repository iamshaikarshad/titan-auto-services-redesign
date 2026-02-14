// Titan Auto Service - Premium Theme Configuration

// Color Palette
export const colors = {
  // Dark backgrounds (navy/near-black)
  darkBg: '#0a0e1a',
  darkBgSecondary: '#1a1f2e',
  darkBgTertiary: '#242b3d',
  
  // Gold/Champagne accents
  gold: '#d4a574',
  goldLight: '#e8c9a0',
  goldDark: '#c9a961',
  
  // Neutral tones
  white: '#ffffff',
  gray: '#8b92a9',
  grayLight: '#b0b8cb',
  grayDark: '#4a5264',
  
  // Semantic colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

// Typography scales
export const typography = {
  // Headings - Bold, premium
  h1: {
    size: 'text-5xl md:text-6xl',
    weight: 'font-bold',
    lineHeight: 'leading-tight',
  },
  h2: {
    size: 'text-4xl md:text-5xl',
    weight: 'font-bold',
    lineHeight: 'leading-tight',
  },
  h3: {
    size: 'text-2xl md:text-3xl',
    weight: 'font-bold',
    lineHeight: 'leading-snug',
  },
  h4: {
    size: 'text-xl md:text-2xl',
    weight: 'font-semibold',
    lineHeight: 'leading-snug',
  },
  // Body text - Clean, readable
  body: {
    size: 'text-base',
    weight: 'font-normal',
    lineHeight: 'leading-relaxed',
  },
  small: {
    size: 'text-sm',
    weight: 'font-normal',
    lineHeight: 'leading-relaxed',
  },
};

// Gradient utilities
export const gradients = {
  darkOverlay: 'linear-gradient(135deg, rgba(10, 14, 26, 0.8), rgba(26, 31, 46, 0.9))',
  goldAccent: 'linear-gradient(135deg, #d4a574, #c9a961)',
  darkToGold: 'linear-gradient(to right, #1a1f2e, #d4a574)',
};

// Shadow utilities for premium feel
export const shadows = {
  sm: '0 2px 8px rgba(0, 0, 0, 0.4)',
  md: '0 8px 24px rgba(0, 0, 0, 0.6)',
  lg: '0 16px 40px rgba(212, 165, 116, 0.2)',
  glow: '0 0 30px rgba(212, 165, 116, 0.3)',
};
