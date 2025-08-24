"use client"

import type React from "react"

import { useCallback, type MouseEvent } from "react"
import { useRouter, usePathname } from "next/navigation"

interface TransitionLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

// Global state to track if a transition is in progress
// This prevents multiple clicks during animation
let isTransitioning = false

export const startPageTransition = (href: string) => {
  // Dispatch the custom event for page transitions
  const event = new CustomEvent("startPageTransition", {
    detail: { href },
  })
  window.dispatchEvent(event)

  // Return a promise that resolves after the exit animation
  // This delay allows the exit animation to complete before navigation
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, 400) // Match the new animation duration
  })
}

export default function TransitionLink({ href, children, className = "", onClick }: TransitionLinkProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleClick = useCallback(
    async (e: MouseEvent<HTMLAnchorElement>) => {
      // Call the original onClick if provided
      if (onClick) {
        onClick(e)
      }

      // Prevent default link behavior
      e.preventDefault()

      // Skip if we're already transitioning or clicking the current path
      if (isTransitioning || pathname === href) {
        return
      }

      // Set transitioning flag
      isTransitioning = true

      try {
        // 1. Start exit animation and wait for it to complete
        await startPageTransition(href)

        // 2. After exit animation is done, navigate to the new page
        router.push(href)
      } finally {
        // Reset the transitioning flag after a delay that covers the full animation
        setTimeout(() => {
          isTransitioning = false
        }, 800) // Cover both animations (exit: 0.4s + entry: 0.4s)
      }
    },
    [href, router, pathname, onClick],
  )

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
