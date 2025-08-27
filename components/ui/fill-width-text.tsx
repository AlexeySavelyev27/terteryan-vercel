'use client'

import React, { useRef, useEffect, useState } from 'react'

interface FillWidthTextProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  minFontSize?: number
  maxFontSize?: number
  onFontSizeCalculated?: (fontSize: number) => void
}

export const FillWidthText: React.FC<FillWidthTextProps> = ({
  children,
  className = '',
  style = {},
  minFontSize = 10,
  maxFontSize = 200,
  onFontSizeCalculated
}) => {
  const textRef = useRef<HTMLDivElement>(null)
  const [fontSize, setFontSize] = useState<number>(16)
  const [isCalculating, setIsCalculating] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const calculateOptimalFontSize = React.useCallback(() => {
    if (!textRef.current) return

    const container = textRef.current
    const parent = container.parentElement
    if (!parent) return

    // On mobile, use fixed sizes instead of dynamic calculation
    if (isMobile) {
      const text = typeof children === 'string' ? children : container.textContent || ''
      
      // Different sizes based on content type
      if (text.includes('МИХАИЛ') || text.includes('ТЕРТЕРЯН')) {
        // This is the composer name - use predefined mobile sizes
        if (text === 'МИХАИЛ БАБКЕНОВИЧ') {
          setFontSize(20) // First name smaller
        } else {
          setFontSize(28) // Last name larger
        }
      } else {
        // Other text - use moderate size
        setFontSize(24)
      }
      
      setIsCalculating(false)
      return
    }

    // Desktop calculation - original logic
    const containerWidth = parent.clientWidth - 10
    if (containerWidth <= 0) return
    
    console.log('Container width:', containerWidth, 'Text:', typeof children === 'string' ? children : container.textContent)

    // Binary search for optimal font size
    let low = minFontSize
    let high = maxFontSize
    let bestFontSize = minFontSize

    // Create a temporary span for measuring text width
    const tempSpan = document.createElement('span')
    tempSpan.style.visibility = 'hidden'
    tempSpan.style.position = 'absolute'
    tempSpan.style.top = '-9999px'
    tempSpan.style.fontFamily = getComputedStyle(container).fontFamily
    tempSpan.style.fontWeight = getComputedStyle(container).fontWeight
    tempSpan.style.letterSpacing = getComputedStyle(container).letterSpacing
    tempSpan.style.whiteSpace = 'nowrap'
    tempSpan.textContent = typeof children === 'string' ? children : container.textContent || ''
    
    document.body.appendChild(tempSpan)

    // Binary search for the best font size
    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      tempSpan.style.fontSize = `${mid}px`
      
      const textWidth = tempSpan.getBoundingClientRect().width
      
      if (textWidth <= containerWidth) {
        bestFontSize = mid
        low = mid + 1
      } else {
        high = mid - 1
      }
    }

    document.body.removeChild(tempSpan)

    console.log('Calculated font size:', bestFontSize, 'for width:', containerWidth)
    
    setFontSize(bestFontSize)
    onFontSizeCalculated?.(bestFontSize)
    setIsCalculating(false)
  }, [children, minFontSize, maxFontSize, onFontSizeCalculated, isMobile])

  useEffect(() => {
    setIsCalculating(true)
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      calculateOptimalFontSize()
    }, isMobile ? 50 : 100)

    return () => clearTimeout(timer)
  }, [calculateOptimalFontSize])

  useEffect(() => {
    if (!textRef.current || isMobile) return // Skip resize observer on mobile

    const resizeObserver = new ResizeObserver(() => {
      setIsCalculating(true)
      calculateOptimalFontSize()
    })

    const parent = textRef.current.parentElement
    if (parent) {
      resizeObserver.observe(parent)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [calculateOptimalFontSize, isMobile])

  return (
    <div
      ref={textRef}
      className={className}
      style={{
        ...style,
        fontSize: `${fontSize}px`,
        opacity: isCalculating ? 0 : 1,
        transition: 'opacity 0.2s ease-in-out',
        whiteSpace: isMobile ? 'normal' : 'nowrap', // Allow wrapping on mobile
        overflow: 'visible',
        width: '100%',
        textAlign: isMobile ? 'center' : (style.textAlign || 'left'),
        wordBreak: isMobile ? 'normal' : 'keep-all',
        hyphens: 'none',
        WebkitHyphens: 'none',
        msHyphens: 'none'
      }}
    >
      {children}
    </div>
  )
}
