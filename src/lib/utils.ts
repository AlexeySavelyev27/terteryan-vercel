// Utility functions for the website

export function toggleTheme(isDark: boolean): void {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', isDark);
  }
}
