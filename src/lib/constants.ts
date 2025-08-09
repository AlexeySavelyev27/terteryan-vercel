// Navigation constants for better maintainability
export const PAGES = ['/', '/biography', '/media', '/contact'] as const;

export const PAGE_NAMES = {
  '/': 'ГЛАВНАЯ',
  '/biography': 'БИОГРАФИЯ', 
  '/media': 'МЕДИА',
  '/contact': 'ОБРАТНАЯ СВЯЗЬ'
} as const;

export type PageRoute = typeof PAGES[number];

// Content zone settings
export const CONTENT_ZONE_SETTINGS = {
  leftOffset: 6.5,
  rightOffset: 37,
  topOffset: 18.5,
  bottomOffset: 8,
  padding: 2.5,
} as const;

// Theme constants
export const THEME_CONFIG = {
  transitionDuration: '0.3s',
  backdropBlur: 'blur(10px)',
} as const;
