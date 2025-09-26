import { Theme } from '@/types';

/**
 * Get system theme preference
 * @returns System theme preference or 'light' as default
 */
export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Get stored theme preference from localStorage
 * @returns Stored theme or system preference
 */
export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const stored = localStorage.getItem('theme');
  return (stored as Theme) || getSystemTheme();
}

/**
 * Store theme preference in localStorage
 * @param theme - Theme to store
 */
export function storeTheme(theme: Theme): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem('theme', theme);
}

/**
 * Apply theme to document
 * @param theme - Theme to apply
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

/**
 * Initialize theme on app load
 * @returns Initial theme
 */
export function initializeTheme(): Theme {
  const theme = getStoredTheme();
  applyTheme(theme);
  return theme;
}
