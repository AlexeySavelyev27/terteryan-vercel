"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { Sun, Moon } from "lucide-react"
import TransitionLink from "./TransitionLink"

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
  const [showScrollbar, setShowScrollbar] = useState(false)
  const [transitionState, setTransitionState] = useState<'idle' | 'exiting' | 'entering'>('idle')
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right'>('right')
  const menuRef = useRef<HTMLDivElement>(null)
  const contentZoneRef = useRef<HTMLDivElement>(null)
  const customScrollbarRef = useRef<HTMLDivElement>(null)
  const scrollThumbRef = useRef<HTMLDivElement>(null)

  // Initialize theme and mounting
  useEffect(() => {
    // Check if dark class exists on document
    const darkModeEnabled = document.documentElement.classList.contains("dark")
    setIsDark(darkModeEnabled)

    // Set mounted state
    setIsMounted(true)
  }, [])

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

    // Prevent default scroll behavior on the document body
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("wheel", handleGlobalScroll)
      document.removeEventListener("keydown", handleGlobalKeyScroll)
      document.body.style.overflow = "auto" // Restore default overflow
    }
  }, [])

  // Measure menu width with debounced resize listener for performance
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    const updateMenuWidth = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        if (menuRef.current) {
          const width = menuRef.current.offsetWidth
          setMenuWidth(width)
        }
      }, 16) // ~60fps debounce
    }

    updateMenuWidth()

    // Debounced resize listener
    window.addEventListener("resize", updateMenuWidth, { passive: true })
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("resize", updateMenuWidth)
    }
  }, [])

  // Custom scrollbar functionality - Optimized for performance
  useEffect(() => {
    const contentZone = contentZoneRef.current
    const scrollThumb = scrollThumbRef.current

    if (!contentZone || !scrollThumb) return

    let ticking = false
    let resizeTimeout: NodeJS.Timeout

    const updateScrollbar = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
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
          ticking = false
        })
        ticking = true
      }
    }

    const debouncedUpdateScrollbar = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(updateScrollbar, 16)
    }

    // Initial update
    updateScrollbar()

    // Optimized event listeners
    contentZone.addEventListener("scroll", updateScrollbar, { passive: true })
    window.addEventListener("resize", debouncedUpdateScrollbar, { passive: true })

    // Single ResizeObserver with throttling
    const resizeObserver = new ResizeObserver(debouncedUpdateScrollbar)
    resizeObserver.observe(contentZone)

    return () => {
      clearTimeout(resizeTimeout)
      contentZone.removeEventListener("scroll", updateScrollbar)
      window.removeEventListener("resize", debouncedUpdateScrollbar)
      resizeObserver.disconnect()
    }
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

  // Page transition handler
  useEffect(() => {
    const handlePageTransition = (e: CustomEvent) => {
      const targetHref = e.detail.href
      const currentIndex = PAGES.indexOf(pathname)
      const targetIndex = PAGES.indexOf(targetHref)
      
      // Determine animation direction based on page order
      const direction = targetIndex > currentIndex ? 'right' : 'left'
      setTransitionDirection(direction)
      
      // Start the exit animation
      setTransitionState('exiting')
      
      // The rest of the transitions will be handled by the pathname change useEffect
    }
    
    window.addEventListener('startPageTransition', handlePageTransition as EventListener)
    
    return () => {
      window.removeEventListener('startPageTransition', handlePageTransition as EventListener)
    }
  }, [pathname])
  
  // Reset transition state when pathname changes (new page loaded)
  useEffect(() => {
    if (transitionState === 'exiting') {
      // Set entering state with a delay to ensure the new content is ready
      setTimeout(() => {
        setTransitionState('entering')
      }, 50) // Small delay to ensure new content is ready
      
      // After the complete animation sequence, reset to idle
      setTimeout(() => {
        setTransitionState('idle')
      }, 600) // Total animation duration (exit: 300ms + delay: 300ms)
    }
  }, [pathname, transitionState])

  // Trigger photo fade-in when component mounts
  useEffect(() => {
    setPhotoLoaded(true)
  }, [])

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "dark" : ""}`}>
      {/* Fixed Background Image - Optimized for performance */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-300"
        style={{
          backgroundImage: `url('/bg.png')`,
          filter: isDark ? "invert(1)" : "none",
          zIndex: 1,
          willChange: "filter",
          transform: "translateZ(0)", // GPU acceleration
        }}
      />

      {/* Portrait photo - using 1.jpg for all pages for now */}
      <div
        className="fixed bg-cover bg-center transition-opacity duration-1000 ease-out"
        style={{
          backgroundImage: `url('/photos/1.jpg')`,
          filter: "none",
          width: "50%",
          height: "100%",
          right: "-14%",
          top: "38%",
          transform: "translateY(-50%) scale(1.47) translateZ(0)", // GPU acceleration
          transformOrigin: "center",
          mask: "linear-gradient(to right, transparent 0%, rgba(0,0,0,1) 38%)",
          WebkitMask: "linear-gradient(to right, transparent 0%, rgba(0,0,0,1) 38%)",
          opacity: photoLoaded ? 1 : 0,
          zIndex: 1,
          overflow: "hidden",
          willChange: "opacity", // Only animate opacity
          backfaceVisibility: "hidden",
        }}
      />

      {/* Custom Scrollbar at Screen Edge - Only show when content is scrollable */}
      <div
        ref={customScrollbarRef}
        className={`fixed z-4 transition-opacity duration-300 ${
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

      {/* Fixed Theme Switcher Container - Above menu, right aligned with menu */}
      <div
        className="fixed z-4 flex justify-start"
        style={{
          top: "60px", // Above the menu
          left: "6vw", // Same alignment as menu
          right: "6vw", // Constrain to match Main Screen Section padding
          width: menuWidth > 0 ? `${menuWidth}px` : "auto", // Exact match to menu width
          maxWidth: "100%", // Respect the container constraints
          // TEMPORARY BORDER - Theme Button Container
          //border: "3px solid orange",
          //boxSizing: "border-box",
          padding: "8px", // Some padding inside the container
		  paddingLeft: "1.5vw"
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
        className="fixed z-3"
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
              //border: "3px solid blue",
              //boxSizing: "border-box",
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
                willChange: "background",
                transform: "translateZ(0)",
              }}
            />

            {/* Menu items */}
            <ul
              className="flex relative font-light transition-colors duration-300"
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
                zIndex: 3,
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
                willChange: "background",
                transform: "translateZ(0)",
              }}
            />
          </div>
        </div>
      </nav>

      {/* Main Screen Section - Fixed height with 6% bottom margin */}
      <section
        className="fixed z-2 w-full flex flex-col"
        style={{
          top: "100px",
          bottom: "6vh", // 6% bottom margin
		  //paddingLeft: "7vw",
          //left: "7.8vw",
          //right: "6vw",
          // TEMPORARY BORDER - Main Screen Section
          //border: "3px solid red",
          //boxSizing: "border-box",
        }}
      >
        {/* Spacer for fixed menu + bottom margin */}
        <div
          style={{
            height:
              "calc(clamp(2px, 0.5vw, 4.5px) + clamp(6px, 1.5vw, 22px) + clamp(12px, 3vw, 44px) + clamp(6px, 1.5vw, 22px) + clamp(2px, 0.5vw, 4.5px) + clamp(1rem, 3vw, 3rem))",
            width: "100%",
            flexShrink: 0,
          }}
        />

        {/* Content Zone - Fixed height with scrolling and gradient fades */}
        <main
          className="flex-1 w-full flex justify-start items-start relative"
          style={{
            margin: "0",
            padding: "0",
            overflow: "hidden", // Hide overflow to contain gradients
          }}
        >
          {/* Content container - FIXED width matching menu with scrolling */}
          <div
            className={`transition-opacity duration-300 relative ${
              transitionState === 'exiting'
                ? transitionDirection === 'right'
                  ? 'content-area-slide-out-left'
                  : 'content-area-slide-out-right'
                : transitionState === 'entering'
                ? transitionDirection === 'right'
                  ? 'content-area-slide-in-right'
                  : 'content-area-slide-in-left'
                : ''
            }`}
            style={{
              // Fixed width matching the menu
              width: menuWidth > 0 ? `calc(${menuWidth}px - 3vw)` : "fit-content",
              maxWidth: "100%",
              minWidth: "0",
              height: "100%",
              padding: "0",
              marginLeft: "7.5vw",
              // Start with opacity 0 when in entering state to prevent flash
              opacity: transitionState === 'entering' && !document.querySelector('.content-area-slide-in-right, .content-area-slide-in-left') ? 0 : 1,
              // TEMPORARY BORDER - Content Zone
              //border: "3px solid green",
              //boxSizing: "border-box",
            }}
          >
            {/* Scrollable content area with mask for fade effect - HIDDEN SCROLLBAR */}
            <div
              ref={contentZoneRef}
              className="w-full h-full overflow-y-auto overflow-x-hidden"
              style={{
                padding: "clamp(2rem, 5vw, 3rem) 0 clamp(1rem, 3vw, 2rem) 0", // More top padding, less bottom
                margin: "0",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                // HIDE DEFAULT SCROLLBAR
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE/Edge
                // Mask to fade content at top and bottom edges
                //mask: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) clamp(1rem, 4vw, 2.5rem), rgba(0,0,0,1) calc(100% - clamp(1rem, 4vw, 2.5rem)), transparent 100%)",
                //WebkitMask:
                //  "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) clamp(1rem, 4vw, 2.5rem), rgba(0,0,0,1) calc(100% - clamp(1rem, 4vw, 2.5rem)), transparent 100%)",
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
                }}
              >
                {children}
              </div>
            </div>
          </div>
        </main>
      </section>

      {/* Hide scrollbar for webkit browsers */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
