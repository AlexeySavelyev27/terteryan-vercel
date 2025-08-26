import type { Metadata } from "next";
// Remove Google Fonts imports - using self-hosted fonts instead
// import { Inter, Vollkorn, Merriweather, Playfair_Display, Crimson_Text, Lora, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import PageLayout from "../src/components/PageLayout";
import { LocaleProvider } from "../src/contexts/LocaleContext";
import { ErrorBoundary, OfflineBanner } from "../src/components/ErrorHandling";

// No longer needed - using self-hosted fonts
/*
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const vollkorn = Vollkorn({
  variable: "--font-vollkorn",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "optional", // Optional for less critical text
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const crimson = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin", "cyrillic"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});
*/

export const metadata: Metadata = {
  title: "Михаил Бабкенович Тертерян | Композитор",
  description: "Официальный сайт выдающегося армянского композитора Михаила Бабкеновича Тертеряна. Биография, произведения, аудиозаписи.",
  keywords: "Тертерян, композитор, армянская музыка, классическая музыка",
    generator: 'v0.dev'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var darkModeEnabled = savedTheme ? savedTheme === 'dark' : systemDark;
                  
                  // Set a flag for the client component to read
                  window.__INITIAL_THEME__ = darkModeEnabled ? 'dark' : 'light';
                  
                  // Apply theme immediately to prevent flash
                  if (darkModeEnabled) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {
                  window.__INITIAL_THEME__ = 'light';
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`antialiased font-sans`}
      >
        <ErrorBoundary>
          <LocaleProvider>
            <OfflineBanner />
            <PageLayout>
              {children}
            </PageLayout>
          </LocaleProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
