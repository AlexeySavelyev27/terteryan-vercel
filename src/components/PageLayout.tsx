"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { Sun, Moon } from "lucide-react"
import Link from "next/link"

// Page order for navigation
const PAGES = ["/", "/biography", "/media", "/contact"]
const PAGE_NAMES = {
  "/": "ГЛАВНАЯ",
  "/biography": "БИОГРАФИЯ",
  "/media": "МЕДИА",
  "/contact": "ОБРАТНАЯ СВЯЗЬ",
}

interface PageLayoutProps {
  children: React.ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  const [isDark, setIsDark] = useState(false)
  const [photoLoaded, setPhotoLoaded] = useState(false)
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [menuWidth, setMenuWidth] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)

  // Initialize theme and mounting
  useEffect(() => {
    // Check if dark class exists on document
    const darkModeEnabled = document.documentElement.classList.contains("dark")
    setIsDark(darkModeEnabled)

    // Set mounted state
    setIsMounted(true)
  }, [])

  // Measure menu width and update content zone
  useEffect(() => {
    const updateMenuWidth = () => {
      if (menuRef.current) {
        const width = menuRef.current.offsetWidth
        setMenuWidth(width)
      }
    }

    updateMenuWidth()

    // Update on resize
    window.addEventListener("resize", updateMenuWidth)
    return () => window.removeEventListener("resize", updateMenuWidth)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)

    if (newIsDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Trigger photo fade-in when component mounts
  useEffect(() => {
    setPhotoLoaded(true)
  }, [])

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "dark" : ""}`}>
      {/* Fixed Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-300"
        style={{
          backgroundImage: `url('/bg.png')`,
          backgroundAttachment: "fixed",
          filter: isDark ? "invert(1)" : "none",
          zIndex: -1,
        }}
      />

      {/* Portrait photo - using 1.jpg for all pages for now */}
      <div
        className="fixed bg-cover bg-center transition-all duration-1000 ease-out"
        style={{
          backgroundImage: `url('/photos/1.jpg')`,
          filter: "none",
          width: "50%",
          height: "100%",
          right: "-14%",
          top: "38%",
          transform: "translateY(-50%) scale(1.47)",
          transformOrigin: "center",
          mask: "linear-gradient(to right, transparent 0%, rgba(0,0,0,1) 38%)",
          WebkitMask: "linear-gradient(to right, transparent 0%, rgba(0,0,0,1) 38%)",
          opacity: photoLoaded ? 1 : 0,
          zIndex: 20,
          overflow: "hidden", // Prevent photo from causing scroll
        }}
      />

      {/* Fixed Theme Switcher Container - Above menu, right aligned with menu */}
      <div
        className="fixed z-30 flex justify-end"
        style={{
          top: "60px", // Above the menu
          left: "6vw", // Same alignment as menu
          right: "6vw", // Constrain to match Main Screen Section padding
          width: menuWidth > 0 ? `${menuWidth}px` : "auto", // Exact match to menu width
          maxWidth: "100%", // Respect the container constraints
          // TEMPORARY BORDER - Theme Button Container
          border: "3px solid orange",
          boxSizing: "border-box",
          padding: "8px", // Some padding inside the container
        }}
      >
        <button
          onClick={toggleTheme}
          className="theme-switcher flex items-center gap-2 px-4 py-2 rounded-full border border-current/20 bg-current/5 backdrop-blur-sm hover:bg-current/10 transition-all text-sm"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
          <span>{isDark ? "Светлая тема" : "Темная тема"}</span>
        </button>
      </div>

      {/* Fixed Navigation - Stays in place when scrolling */}
      <nav
        className="fixed z-30"
        style={{
          top: "128px", // Same as the original paddingTop
          left: "6vw", // Same as the original paddingLeft
          right: "6vw", // Constrain to match Main Screen Section padding
        }}
      >
        <div className="w-full flex justify-start" style={{ margin: "0", padding: "0" }}>
          {/* Menu Block - Responsive scaling, left aligned */}
          <div
            ref={menuRef}
            className="flex flex-col"
            style={{
              margin: "0",
              padding: "0",
              width: "fit-content",
              maxWidth: "100%", // This now respects the nav container's constraints
              minWidth: "0",
              // TEMPORARY BORDER - Menu Object
              border: "3px solid blue",
              boxSizing: "border-box",
            }}
          >
            {/* Top gradient line */}
            <div
              className="transition-all duration-300 relative"
              style={{
                height: "clamp(2px, 0.5vw, 4.5px)",
                marginBottom: "0px",
                width: "100%",
                background: `linear-gradient(to right, transparent 0%, ${
                  isDark ? "rgba(255,255,255,1)" : "rgba(0,0,0,1)"
                } 8%, ${isDark ? "rgba(255,255,255,1)" : "rgba(0,0,0,1)"} 92%, transparent 100%)`,
                zIndex: 10,
              }}
            />

            {/* Menu items */}
            <ul
              className="flex relative font-light transition-all duration-300"
              style={{
                fontFamily: "var(--font-merriweather), serif",
                fontSize: "clamp(12px, 3vw, 44px)",
                gap: "clamp(8px, 4vw, 71px)",
                letterSpacing: "0px",
                paddingLeft: "clamp(12px, 3vw, 48px)",
                paddingRight: "clamp(12px, 3vw, 48px)",
                paddingTop: "clamp(6px, 1.5vw, 22px)",
                paddingBottom: "clamp(6px, 1.5vw, 22px)",
                justifyContent: "center",
                zIndex: 10,
                background: `linear-gradient(to right, transparent 0%, ${
                  isDark ? "rgba(0,0,0,1)" : "rgba(255,255,255,1)"
                } 8%, ${isDark ? "rgba(0,0,0,1)" : "rgba(255,255,255,1)"} 92%, transparent 100%)`,
                backdropFilter: "blur(0px)",
                margin: "0",
                width: "fit-content",
                maxWidth: "100%",
                minWidth: "0",
                whiteSpace: "nowrap",
                flexWrap: "nowrap", // Keep items in one line, scale font instead
              }}
            >
              {PAGES.map((href) => (
                <li
                  key={href}
                  style={{
                    margin: "0",
                    padding: "0",
                    flexShrink: 0,
                    minWidth: "0",
                  }}
                >
                  <Link
                    href={href}
                    className={`nav-button hover:underline underline-offset-4 decoration-2 transition-all ${
                      pathname === href ? "underline" : ""
                    }`}
                    style={{
                      whiteSpace: "nowrap",
                      display: "block",
                    }}
                  >
                    {PAGE_NAMES[href as keyof typeof PAGE_NAMES]}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Bottom gradient line */}
            <div
              className="transition-all duration-300 relative"
              style={{
                height: "clamp(2px, 0.5vw, 4.5px)",
                marginTop: "0px",
                width: "100%",
                background: `linear-gradient(to right, transparent 0%, ${
                  isDark ? "rgba(255,255,255,1)" : "rgba(0,0,0,1)"
                } 8%, ${isDark ? "rgba(255,255,255,1)" : "rgba(0,0,0,1)"} 92%, transparent 100%)`,
                zIndex: 10,
              }}
            />
          </div>
        </div>
      </nav>

      {/* Main Screen Section - Contains content zone with 6% horizontal padding */}
      <section
        className="relative z-10 w-full min-h-screen flex flex-col"
        style={{
          paddingTop: "128px",
          paddingBottom: "40px",
          paddingLeft: "6vw",
          paddingRight: "6vw",
          // TEMPORARY BORDER - Main Screen Section
          border: "3px solid red",
          boxSizing: "border-box",
        }}
      >
        {/* Spacer for fixed menu + bottom margin */}
        <div
          style={{
            height:
              "calc(clamp(2px, 0.5vw, 4.5px) + clamp(6px, 1.5vw, 22px) + clamp(12px, 3vw, 44px) + clamp(6px, 1.5vw, 22px) + clamp(2px, 0.5vw, 4.5px) + clamp(1rem, 3vw, 3rem))",
            width: "100%",
          }}
        />

        {/* Content Zone */}
        <main
          className="flex-1 w-full flex justify-start items-start"
          style={{
            margin: "0",
            padding: "0",
          }}
        >
          {/* Content container - FIXED width matching menu */}
          <div
            className="transition-all duration-300"
            style={{
              // Fixed width matching the menu
              width: menuWidth > 0 ? `${menuWidth}px` : "fit-content",
              maxWidth: "100%",
              minWidth: "0",
              padding: "0",
              margin: "0",
              // TEMPORARY BORDER - Content Zone
              border: "3px solid green",
              boxSizing: "border-box",
              // Prevent content overflow
              overflow: "hidden",
            }}
          >
            <div
              className="w-full h-full"
              style={{
                padding: "0",
                margin: "0",
                overflow: "hidden",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {children}
            </div>
          </div>
        </main>
      </section>
    </div>
  )
}
