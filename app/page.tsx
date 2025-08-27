"use client"

import Link from "next/link"
import { useLocale } from "../src/contexts/LocaleContext"
import { FillWidthText } from "../components/ui/fill-width-text"

export default function Home() {
  const { t } = useLocale()
  
  return (
    <div className="w-full h-full flex flex-col justify-center transition-colors duration-300">
      {/* Name Block - same width constraints as menu, no padding */}
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: "0",
          flexShrink: 0,
          overflow: "hidden",
          marginLeft: "-5px",
          marginBottom: "clamp(-1px, -2.7cqw, -8px)",
          marginTop: "clamp(25px, 1.7cqw, 20px)",
        }}
      >
        {/* Mobile version - simple cards */}
        <div className="flex flex-col items-center gap-1 md:hidden">
          <div className="text-xl font-normal opacity-90" style={{ fontFamily: "var(--font-vollkorn), serif" }}>
            {t.main.title1}
          </div>
          <div className="text-3xl font-semibold tracking-wide" style={{ fontFamily: "var(--font-vollkorn), serif" }}>
            {t.main.title2}
          </div>
        </div>

        {/* Desktop version - original fill width text */}
        <div className="hidden md:block">
          {/* First Names */}
          <FillWidthText
            className="font-normal"
            style={{
              fontFamily: "var(--font-vollkorn), serif",
              letterSpacing: "clamp(0em, 0.1em, 0.14em)",
              marginBottom: "clamp(-1px, -2.7cqw, -8px)",
              textAlign: "left",
              lineHeight: "1",
            }}
            minFontSize={30}
            maxFontSize={200}
          >
            {t.main.title1}
          </FillWidthText>

          {/* Last Name */}
          <FillWidthText
            className="font-normal leading-none"
            style={{
              fontFamily: "var(--font-vollkorn), serif",
              letterSpacing: "0em",
              textAlign: "left",
              lineHeight: "1",
            }}
            minFontSize={50}
            maxFontSize={500}
          >
            {t.main.title2}
          </FillWidthText>
        </div>
      </div>

      {/* Text Block - constrained to wrap within content zone */}
      <div
        className="text-base leading-relaxed max-w-sm text-center md:text-left md:max-w-none"
        style={{
          textAlign: "left",
          marginBottom: "clamp(1rem, 13cqw, 4rem)",
          marginTop: "clamp(0.5rem, 7cqw, 2rem)",
          width: "100%",
          maxWidth: "100%",
          minWidth: "0",
          flexShrink: 0,
        }}
      >
        <div
          className="space-y-4 font-light leading-relaxed"
          style={{
            fontFamily: "var(--font-merriweather), serif",
            fontSize: "clamp(12px, 10cqw, 31px)",
            opacity: 1,
            lineHeight: "clamp(1.4, 0.7cqw + 1.3, 1.6)",
            width: "100%",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          <h6>
            {t.main.subtitle1}
          </h6>
        </div>
      </div>

      {/* Buttons Block - constrained to wrap within content zone */}
      <div
        className="theme-buttons flex flex-wrap justify-center gap-4 md:justify-start"
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginTop: "0px",
          gap: "clamp(8px, 7cqw, 21px)",
          width: "100%",
          maxWidth: "100%",
          minWidth: "0",
          flexShrink: 0,
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/media?category=music"
          className="primary-button rounded-full"
          style={{
            padding: "clamp(6px, 4cqw, 12px) clamp(16px, 11cqw, 32px)",
            fontSize: "clamp(12px, 5.3cqw, 16px)",
          }}
        >
          {t.main.listenMusic}
        </Link>
        <Link
          href="/biography"
          className="secondary-button rounded-full"
          style={{
            padding: "clamp(6px, 4cqw, 12px) clamp(16px, 11cqw, 32px)",
            fontSize: "clamp(12px, 5.3cqw, 16px)",
          }}
        >
          {t.main.learnMore}
        </Link>
      </div>
    </div>
  )
}
