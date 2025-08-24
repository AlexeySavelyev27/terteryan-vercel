"use client"

import { useState, useEffect } from "react"
import { useLocale } from "../../src/contexts/LocaleContext"
import { biographyContent } from "../../src/data/biographyContent"

export default function Biography() {
  const { t, locale } = useLocale()
  const [isDark, setIsDark] = useState(false)
  
  // Get localized biography content
  const currentContent = biographyContent[locale]

  // Detect theme changes
  useEffect(() => {
    const checkTheme = () => {
      const darkModeEnabled = document.documentElement.classList.contains("dark")
      setIsDark(darkModeEnabled)
    }

    // Initial check
    checkTheme()

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="w-full h-full">
      <div className="prose prose-lg max-w-none text-theme">
        {/* Title */}
        <h1 className="text-4xl mb-6" style={{ 
			fontFamily: "var(--font-vollkorn), serif",
			fontSize: "clamp(40px, 6cqw, 64px)"
			}}>
          {currentContent.title}
        </h1>

        {/* Sections */}
        {currentContent.sections.map((section, index) => {
          switch (section.type) {
            case "paragraph":
              return (
                <p
                  key={index}
                  className="mb-4"
                  style={{
                    fontFamily: "var(--font-merriweather), serif",
                    fontSize: "clamp(18px, 1.6cqw, 60px)",
                    lineHeight: "1.8",
                  }}
                  dangerouslySetInnerHTML={{ __html: section.content || "" }}
                />
              )

            case "heading":
              const HeadingTag = section.level === 2 ? "h2" : "h3"
              return (
                <div key={index}>
                  {/* Add gradient divider before "Основные сочинения" */}
                  {(section.content === "Основные сочинения" || section.content === "Major Works") && (
                    <div 
                      className="my-8 h-1 mx-auto rounded-sm transition-all duration-300"
                      style={{
						width: "100%",
                        background: isDark 
                          ? "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 20%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.7) 80%, transparent 100%)"
                          : "linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.7) 20%, rgba(0, 0, 0, 0.9) 50%, rgba(0, 0, 0, 0.7) 80%, transparent 100%)"
                      }}
                    />
                  )}
                  <HeadingTag
                    className="text-2xl mt-8 mb-4"
                    style={{ 
					  fontFamily: "var(--font-vollkorn), serif",
					  fontSize: "clamp(36px, 3cqw, 56px)"
					  }}
                  >
                    {section.content}
                  </HeadingTag>
                </div>
              )

            case "works":
              return (
                <div key={index} style={{ marginTop: "2rem" }}>
                  <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "var(--font-vollkorn), serif" }}>
                    {section.title || "Works"}
                  </h3>
                  {(section.items || []).map((item, itemIndex) => (
                    <p
                      key={itemIndex}
                      className="mb-2"
                      style={{
                        fontFamily: "var(--font-merriweather), serif",
                        fontSize: "16px",
                        paddingLeft: "1rem",
                      }}
                    >
                      • {item}
                    </p>
                  ))}
                </div>
              )

            default:
              return null
          }
        })}
      </div>
    </div>
  )
}
