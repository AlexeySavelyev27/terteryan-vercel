import type { Metadata } from "next";
import { Inter, Vollkorn, Merriweather, Playfair_Display, Crimson_Text, Lora, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import PageLayout from "../components/PageLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const vollkorn = Vollkorn({
  variable: "--font-vollkorn",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
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
});

const crimson = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin", "cyrillic"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Михаил Бабкенович Тертерян | Композитор",
  description: "Официальный сайт выдающегося армянского композитора Михаила Бабкеновича Тертеряна. Биография, произведения, аудиозаписи.",
  keywords: "Тертерян, композитор, армянская музыка, классическая музыка",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${inter.variable} ${vollkorn.variable} ${merriweather.variable} ${playfair.variable} ${crimson.variable} ${lora.variable} ${sourceSerif.variable} antialiased font-sans`}
      >
        <PageLayout>
          {children}
        </PageLayout>
      </body>
    </html>
  );
}
