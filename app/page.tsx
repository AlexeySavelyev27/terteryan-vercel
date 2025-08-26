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
          marginTop: "clamp(25px, 1.7cqw, 20px)", // Revert to container query units
        }}
      >
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

      {/* Text Block - constrained to wrap within content zone */}
      <div
        style={{
          textAlign: "left",
          marginBottom: "clamp(1rem, 13cqw, 4rem)", // Revert to container query units
          marginTop: "clamp(0.5rem, 7cqw, 2rem)", // Revert to container query units
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
            fontSize: "clamp(12px, 10cqw, 31px)", // Revert to container query units
            opacity: 1,
            lineHeight: "clamp(1.4, 0.7cqw + 1.3, 1.6)", // Revert to container query units
            width: "100%",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          <h6>
            {t.main.subtitle1}
          </h6>
          <h6>
            {t.main.subtitle2}
          </h6>
        </div>
      </div>

      {/* Buttons Block - constrained to wrap within content zone */}
      <div
        className="theme-buttons"
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginTop: "0px",
          gap: "clamp(8px, 7cqw, 21px)", // Revert to container query units
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
            padding: "clamp(6px, 4cqw, 12px) clamp(16px, 11cqw, 32px)", // Revert to container query units
            fontSize: "clamp(12px, 5.3cqw, 16px)", // Revert to container query units
          }}
        >
          {t.main.listenMusic}
        </Link>
        <Link
          href="/biography"
          className="secondary-button rounded-full"
          style={{
            padding: "clamp(6px, 4cqw, 12px) clamp(16px, 11cqw, 32px)", // Revert to container query units
            fontSize: "clamp(12px, 5.3cqw, 16px)", // Revert to container query units
          }}
        >
          {t.main.learnMore}
        </Link>
      </div>
    </div>
  )
}
