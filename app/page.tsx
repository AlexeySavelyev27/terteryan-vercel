"use client"

import Link from "next/link"

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col justify-center transition-colors duration-300">
      {/* Name Block - same width constraints as menu, no padding */}
      <div
        style={{
          width: "fit-content",
          maxWidth: "100%",
          minWidth: "0",
          flexShrink: 0,
          overflow: "hidden",
		  marginLeft: "-5px",
          marginBottom: "clamp(-1px, -0.8vw, -8px)",
		  marginTop: "clamp(25px, 0.5vw, 20px)",
        }}
      >
        {/* First Names */}
        <h1
          className="font-normal"
          style={{
            fontFamily: "var(--font-vollkorn), serif",
            fontSize: "clamp(6px, 6vw, 104px)",
            letterSpacing: "clamp(0em, 0.1em, 0.14em)",
            marginBottom: "clamp(-1px, -0.8vw, -8px)",
            whiteSpace: "nowrap",
            textAlign: "left",
            lineHeight: "1",
          }}
        >
          МИХАИЛ БАБКЕНОВИЧ
        </h1>

        {/* Last Name */}
        <h2
          className="font-normal leading-none"
          style={{
            fontFamily: "var(--font-vollkorn), serif",
            fontSize: "clamp(15px, 15vw, 280px)",
            letterSpacing: "0em",
            whiteSpace: "nowrap",
            textAlign: "left",
            lineHeight: "1",
          }}
        >
          ТЕРТЕРЯН
        </h2>
      </div>

      {/* Text Block - constrained to wrap within content zone */}
      <div
        style={{
          textAlign: "left",
          marginBottom: "clamp(1rem, 4vw, 4rem)",
          marginTop: "clamp(0.5rem, 2vw, 2rem)",
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
            fontSize: "clamp(12px, 3.1vw, 31px)",
            opacity: 1,
            lineHeight: "clamp(1.4, 0.2vw + 1.3, 1.6)",
            width: "100%",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          <h6>
            Армянский пианист, композитор и педагог, посвятивший более 40 лет обучению в Московском музыкальном
            колледже, где воспитал множество музыкантов.
          </h6>
          <h6>
            Его многогранный талант проявился в исполнительстве, сочинении и глубокой преданности искусству — от
            романтической классики до авторской музыки с восточным колоритом.
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
          gap: "clamp(8px, 2.1vw, 21px)",
          width: "100%",
          maxWidth: "100%",
          minWidth: "0",
          flexShrink: 0,
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/media"
          className="primary-button rounded-full"
          style={{
            padding: "clamp(6px, 1.2vw, 12px) clamp(16px, 3.2vw, 32px)",
            fontSize: "clamp(12px, 1.6vw, 16px)",
          }}
        >
          Слушать музыку
        </Link>
        <Link
          href="/biography"
          className="secondary-button rounded-full"
          style={{
            padding: "clamp(6px, 1.2vw, 12px) clamp(16px, 3.2vw, 32px)",
            fontSize: "clamp(12px, 1.6vw, 16px)",
          }}
        >
          Узнать больше
        </Link>
      </div>
    </div>
  )
}
