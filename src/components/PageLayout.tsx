"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { Sun, Moon } from "lucide-react"
import TransitionLink from "./TransitionLink"
import { useLocale } from "../contexts/LocaleContext"
import LanguageSwitcher from "./LanguageSwitcher"

// Page order for navigation
const PAGES = ["/", "/biography", "/media", "/contact"]

interface PageLayoutProps {
  children: React.ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  const { t, isLoading } = useLocale()
  const [isDark, setIsDark] = useState(false)
  // Removed photoLoaded state - no longer needed without opacity animation
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [showScrollbar, setShowScrollbar] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionClass, setTransitionClass] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)
  const contentZoneRef = useRef<HTMLDivElement>(null)
  const customScrollbarRef = useRef<HTMLDivElement>(null)
  const scrollThumbRef = useRef<HTMLDivElement>(null)

  // Page names based on current locale
  const PAGE_NAMES = {
    "/": t.nav.main,
    "/biography": t.nav.biography,
    "/media": t.nav.media,
    "/contact": t.nav.contact,
  }

  // Initialize theme and mounting - prevent hydration mismatch
  useEffect(() => {
    // Read the initial theme from the global flag set by the script
    const initialTheme = window.__INITIAL_THEME__ || 'light'
    const darkModeEnabled = initialTheme === 'dark'
    
    // Sync state with the actual DOM
    setIsDark(darkModeEnabled)
    setIsMounted(true)
  }, [])

  // No longer need menu width measurement - using CSS Grid layout

  // Reset scroll position when pathname changes
  useEffect(() => {
    const contentZone = contentZoneRef.current
    if (contentZone) {
      contentZone.scrollTop = 0
    }
  }, [pathname])

  // Global scroll redirection
  useEffect(() => {
    const contentZone = contentZoneRef.current
    if (!contentZone) return

    const handleGlobalScroll = (e: WheelEvent) => {
      // Check if the target or any parent has the data-scroll-exclude attribute
      let target = e.target as Element
      while (target && target !== document.body) {
        if (target.hasAttribute && target.hasAttribute("data-scroll-exclude")) {
          return // Allow normal scrolling for excluded elements
        }
        target = target.parentElement as Element
      }

      // Check if the content zone itself is scrollable
      const hasScrollableContent = contentZone.scrollHeight > contentZone.clientHeight
      if (!hasScrollableContent) {
        return // No scrollable content, don't interfere
      }

      // Prevent default scroll behavior
      e.preventDefault()
      e.stopPropagation()

      // Calculate scroll amount (normalize across different browsers/devices)
      const scrollAmount = e.deltaY
      const scrollSpeed = 1.2 // Adjust this to make scrolling faster/slower

      // Apply scroll to content zone
      contentZone.scrollTop += scrollAmount * scrollSpeed
    }

    const handleGlobalKeyScroll = (e: KeyboardEvent) => {
      // Check if focus is on an input, textarea, or contenteditable element
      const activeElement = document.activeElement
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.hasAttribute("contenteditable"))
      ) {
        return // Allow normal behavior for form elements
      }

      // Check if the active element or any parent has the data-scroll-exclude attribute
      let target = activeElement as Element
      while (target && target !== document.body) {
        if (target.hasAttribute && target.hasAttribute("data-scroll-exclude")) {
          return // Allow normal scrolling for excluded elements
        }
        target = target.parentElement as Element
      }

      const hasScrollableContent = contentZone.scrollHeight > contentZone.clientHeight
      if (!hasScrollableContent) {
        return // No scrollable content, don't interfere
      }

      // Handle keyboard scroll events
      let scrollAmount = 0
      const keyScrollSpeed = 40 // Pixels per key press

      switch (e.key) {
        case "ArrowDown":
          scrollAmount = keyScrollSpeed
          break
        case "ArrowUp":
          scrollAmount = -keyScrollSpeed
          break
        case "PageDown":
          scrollAmount = contentZone.clientHeight * 0.8
          break
        case "PageUp":
          scrollAmount = -contentZone.clientHeight * 0.8
          break
        case "Home":
          if (e.ctrlKey) {
            contentZone.scrollTop = 0
            e.preventDefault()
            return
          }
          break
        case "End":
          if (e.ctrlKey) {
            contentZone.scrollTop = contentZone.scrollHeight
            e.preventDefault()
            return
          }
          break
        case " ": // Spacebar
          scrollAmount = e.shiftKey ? -contentZone.clientHeight * 0.8 : contentZone.clientHeight * 0.8
          break
        default:
          return // Don't handle other keys
      }

      if (scrollAmount !== 0) {
        e.preventDefault()
        e.stopPropagation()

        // Smooth scroll animation
        const startTime = performance.now()
        const startScroll = contentZone.scrollTop
        const duration = 200 // Animation duration in ms

        const animateScroll = (currentTime: number) => {
          const elapsed = currentTime - startTime
          const progress = Math.min(elapsed / duration, 1)

          // Easing function (ease-out)
          const easeOut = 1 - Math.pow(1 - progress, 3)

          contentZone.scrollTop = startScroll + scrollAmount * easeOut

          if (progress < 1) {
            requestAnimationFrame(animateScroll)
          }
        }

        requestAnimationFrame(animateScroll)
      }
    }

    // Add global event listeners
    document.addEventListener("wheel", handleGlobalScroll, { passive: false })
    document.addEventListener("keydown", handleGlobalKeyScroll, { passive: false })

    // Set overflow to auto to allow natural scrolling as fallback
    document.body.style.overflow = "auto"
    document.documentElement.style.overflow = "auto"

    return () => {
      document.removeEventListener("wheel", handleGlobalScroll)
      document.removeEventListener("keydown", handleGlobalKeyScroll)
      // Restore natural scrolling on cleanup
      document.body.style.overflow = "auto"
      document.documentElement.style.overflow = "auto"
    }
  }, [])



  // Custom scrollbar functionality - simple and immediate
  useEffect(() => {
    const contentZone = contentZoneRef.current
    const scrollThumb = scrollThumbRef.current

    if (!contentZone || !scrollThumb) return

    const updateScrollbar = () => {
      const hasScrollableContent = contentZone.scrollHeight > contentZone.clientHeight
      setShowScrollbar(hasScrollableContent)

      if (hasScrollableContent) {
        const scrollPercentage = contentZone.scrollTop / (contentZone.scrollHeight - contentZone.clientHeight)
        const thumbHeight = Math.max(20, (contentZone.clientHeight / contentZone.scrollHeight) * window.innerHeight)
        const availableSpace = window.innerHeight - thumbHeight
        const thumbPosition = scrollPercentage * availableSpace

        scrollThumb.style.height = `${thumbHeight}px`
        scrollThumb.style.transform = `translateY(${thumbPosition}px)`
      }
    }

    // Initial update
    updateScrollbar()

    // Simple event listeners without optimization
    contentZone.addEventListener("scroll", updateScrollbar)
    window.addEventListener("resize", updateScrollbar)

    // Simple ResizeObserver
    const resizeObserver = new ResizeObserver(updateScrollbar)
    resizeObserver.observe(contentZone)

    return () => {
      contentZone.removeEventListener("scroll", updateScrollbar)
      window.removeEventListener("resize", updateScrollbar)
      resizeObserver.disconnect()
    }
  }, [])

  // Remove redundant width update - width is now calculated directly in style

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)

    if (newIsDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem('theme', 'light')
    }
  }

  // Handle page transitions
  useEffect(() => {
    const handlePageTransition = (e: CustomEvent) => {
      const targetHref = e.detail.href
      const currentIndex = PAGES.indexOf(pathname)
      const targetIndex = PAGES.indexOf(targetHref)
      
      // Determine animation direction based on page order
      const goingRight = targetIndex > currentIndex
      const exitClass = goingRight ? 'page-exit-left' : 'page-exit-right'
      
      // Start exit animation
      setIsTransitioning(true)
      setTransitionClass(exitClass)
    }
    
    window.addEventListener('startPageTransition', handlePageTransition as EventListener)
    
    return () => {
      window.removeEventListener('startPageTransition', handlePageTransition as EventListener)
    }
  }, [pathname])
  
  // Handle page change (when pathname updates after navigation)
  useEffect(() => {
    if (isTransitioning) {
      // Wait for exit animation to complete, then start enter animation
      const timer = setTimeout(() => {
        // Figure out which direction we came from by checking the transition class
        const wasExitingLeft = transitionClass === 'page-exit-left'
        const enterClass = wasExitingLeft ? 'page-enter-from-right' : 'page-enter-from-left'
        
        setTransitionClass(enterClass)
        
        // Clear everything after enter animation completes
        setTimeout(() => {
          setIsTransitioning(false)
          setTransitionClass('')
        }, 400) // Match animation duration
        
      }, 400) // Wait for exit animation to complete
      
      return () => clearTimeout(timer)
    }
  }, [pathname, isTransitioning, transitionClass])

  // Removed photo fade-in effect - no longer needed

  // Show loading state with layout-matching background to prevent flash
  if (isLoading || !isMounted) {
    return (
      <div className={`h-screen transition-colors duration-300 ${isDark ? "dark" : ""}`}>
        {/* Match the main layout background during loading */}
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/bg.png')`,
            filter: isDark ? "invert(1)" : "none",
            zIndex: 0,
          }}
        />
        
        {/* Match the portrait photo during loading */}
        <div
          className="fixed bg-cover bg-center"
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
            opacity: 1,
            zIndex: 1,
            overflow: "hidden",
          }}
        />
        
        {/* Centered loading spinner */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div 
            className="animate-spin rounded-full h-8 w-8 border-b-2" 
            style={{ borderColor: isDark ? '#ffffff' : '#000000' }}
          ></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`h-screen overflow-hidden transition-colors duration-300 ${isDark ? "dark" : ""}`}>
      {/* Fixed Background Image - Optimized for performance */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-800"
        style={{
          backgroundImage: `url('/bg.png')`,
          filter: isDark ? "invert(1)" : "none",
          zIndex: 0,
        }}
      />

      {/* Portrait photo - using 1.jpg for all pages for now */}
      <div
        className="fixed bg-cover bg-center"
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
          opacity: 1, // Remove opacity animation to prevent flash
          zIndex: 1,
          overflow: "hidden",
        }}
      />

      {/* Custom Scrollbar at Screen Edge - Only show when content is scrollable */}
      <div
        ref={customScrollbarRef}
        className={`fixed z-20 transition-opacity duration-300 ${
          showScrollbar ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{
          top: "0",
          right: "0",
          width: "8px",
          height: "100vh",
          backgroundColor: "transparent",
          pointerEvents: showScrollbar ? "none" : "none", // Keep as none for now, can be made interactive later
        }}
      >
        <div
          ref={scrollThumbRef}
          className="absolute right-0 transition-all duration-150 ease-out"
          style={{
            width: "6px",
            backgroundColor: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
            borderRadius: "3px",
            minHeight: "20px",
            right: "1px",
          }}
        />
      </div>

      {/* Main Layout Grid - Optimized alignment */}
      <div
        className="fixed z-10"
        style={{
          top: "60px",
          left: "6vw",
          right: "48%", // Stop well before the portrait area
          bottom: "6vh",
          display: "grid",
          gridTemplateColumns: "max-content 1fr", // Menu column auto-sizes, content takes remaining space
          gridTemplateRows: "auto auto 1fr", // Theme row, menu row, content row
          gap: "clamp(1rem, 3vw, 3rem) 0", // Vertical gap between sections
        }}
      >
        {/* Theme Switcher & Language Switcher - Grid item */}
        <div className="flex justify-between items-center" style={{ gridColumn: "1", gridRow: "1" }}>
          {/* Language Switcher on the left */}
          <LanguageSwitcher />
          
          {/* Theme Switcher on the right */}
          <button
            onClick={toggleTheme}
            className="theme-switcher flex items-center gap-2 px-4 py-2 rounded-full unified-button-bg transition-all text-sm"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span>{isDark ? t.theme.light : t.theme.dark}</span>
          </button>
        </div>

        {/* Navigation Menu - Grid item */}
        <nav style={{ gridColumn: "1", gridRow: "2" }}>
          <div
            ref={menuRef}
            className="flex flex-col"
            style={{
              margin: "0",
              padding: "0",
              width: "fit-content",
              minWidth: "0",
              boxSizing: "border-box",
            }}
          >
            {/* Top gradient line */}
            <div
              className="transition-colors duration-300 relative"
              style={{
                height: "clamp(2px, 0.5vw, 4.5px)",
                marginBottom: "0px",
                width: "100%",
                background: `linear-gradient(to right, transparent 0%, ${
                  isDark ? "rgba(255,255,255,1)" : "rgba(0,0,0,1)"
                } 8%, ${isDark ? "rgba(255,255,255,1)" : "rgba(0,0,0,1)"} 92%, transparent 100%)`,
                zIndex: 3,
              }}
            />

            {/* Menu items */}
            <ul
              className="flex relative font-light transition-colors duration-300"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(12px, 3vw, 44px)",
                gap: "clamp(8px, 4vw, 71px)",
                letterSpacing: "0px",
                paddingLeft: "clamp(12px, 3vw, 48px)",
                paddingRight: "clamp(12px, 3vw, 48px)",
                paddingTop: "clamp(6px, 1.5vw, 22px)",
                paddingBottom: "clamp(6px, 1.5vw, 22px)",
                justifyContent: "center",
                zIndex: 3,
                background: `linear-gradient(to right, transparent 0%, ${
                  isDark ? "rgba(0,0,0,1)" : "rgba(255,255,255,1)"
                } 8%, ${isDark ? "rgba(0,0,0,1)" : "rgba(255,255,255,1)"} 92%, transparent 100%)`,
                margin: "0",
                width: "fit-content",
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
                  <TransitionLink
                    href={href}
                    className={`nav-button hover:underline underline-offset-4 decoration-2 transition-all ${
                      pathname === href ? "underline" : ""
                    }`}
                  >
                    <span
                      style={{
                        whiteSpace: "nowrap",
                        display: "block",
                      }}
                    >
                      {PAGE_NAMES[href as keyof typeof PAGE_NAMES]}
                    </span>
                  </TransitionLink>
                </li>
              ))}
            </ul>

            {/* Bottom gradient line */}
            <div
              className="transition-colors duration-300 relative"
              style={{
                height: "clamp(2px, 0.5vw, 4.5px)",
                marginTop: "0px",
                width: "100%",
                background: `linear-gradient(to right, transparent 0%, ${
                  isDark ? "rgba(255,255,255,1)" : "rgba(0,0,0,1)"
                } 8%, ${isDark ? "rgba(255,255,255,1)" : "rgba(0,0,0,1)"} 92%, transparent 100%)`,
                zIndex: 3,
              }}
            />
          </div>
        </nav>

        {/* Content Area - Grid item, naturally aligned with menu */}
        <main
          className={`${transitionClass}`}
          style={{
            gridColumn: "1", // Same column as menu for natural alignment
            gridRow: "3",
            overflow: "hidden",
            position: "relative",
            // Ensure content is clipped during animations
            clipPath: isTransitioning ? "inset(0)" : "none",
			transformStyle: "preserve-3d"
          }}
        >
          {/* Content container with overflow hidden to prevent scroll issues during transitions */}
          <div
            className={`@container relative`}
            style={{
              width: "calc(100% - 1.5vw)",
              height: "100%",
              padding: "0",
              marginLeft: "1.5vw",
              boxSizing: "border-box",
              overflow: "hidden", // Hide overflow during transitions
            }}
          >
            {/* Scrollable content area with hidden scrollbar */}
            <div
              ref={contentZoneRef}
              className="w-full h-full overflow-y-auto overflow-x-hidden"
              style={{
                padding: "0 0 clamp(1rem, 3vw, 2rem) 0",
                margin: "0",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE/Edge
                // Disable scroll during transitions
                pointerEvents: isTransitioning ? 'none' : 'auto',
              }}
            >
              {/* Content wrapper to ensure top-left alignment */}
              <div
                style={{
                  width: "100%",
                  minHeight: "fit-content",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  textAlign: "left",
                  // Prevent content interaction during transitions
                  pointerEvents: isTransitioning ? 'none' : 'auto',
                }}
              >
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Hide scrollbar for webkit browsers */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
