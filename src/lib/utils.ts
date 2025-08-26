import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function for combining class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for the website

export function toggleTheme(isDark: boolean): void {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', isDark);
  }
}
