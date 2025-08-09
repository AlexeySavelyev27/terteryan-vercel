import { Inter, Vollkorn, Merriweather } from "next/font/google";

// Optimized font loading - only load fonts that are actually used
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: 'swap', // Better performance
  preload: true,
});

export const vollkorn = Vollkorn({
  variable: "--font-vollkorn",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: 'swap',
  preload: true,
});

export const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "700"],
  display: 'swap',
  preload: true,
});

// Export font variables for easy access
export const fontVariables = `${inter.variable} ${vollkorn.variable} ${merriweather.variable}`;
