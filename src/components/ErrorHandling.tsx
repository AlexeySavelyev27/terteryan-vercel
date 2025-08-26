"use client"

import React, { ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center p-8">
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'var(--font-vollkorn), serif' }}>
              Что-то пошло не так
            </h2>
            <p className="text-lg opacity-70 mb-6" style={{ fontFamily: 'var(--font-merriweather), serif' }}>
              Произошла ошибка при загрузке страницы. Пожалуйста, обновите страницу или попробуйте позже.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="primary-button px-6 py-3 rounded-full"
              style={{ fontFamily: 'var(--font-merriweather), serif' }}
            >
              Обновить страницу
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Loading component for media content
export function MediaLoading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="loading-spinner w-8 h-8 border-2 border-current border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-sm opacity-70" style={{ fontFamily: 'var(--font-merriweather), serif' }}>
          Загрузка медиаконтента...
        </p>
      </div>
    </div>
  )
}

// Loading component for images
export function ImageLoading() {
  return (
    <div className="w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse flex items-center justify-center">
      <div className="text-gray-400 text-sm">Загрузка...</div>
    </div>
  )
}

// Error component for media content
export function MediaError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="text-center">
        <p className="text-lg opacity-70 mb-4" style={{ fontFamily: 'var(--font-merriweather), serif' }}>
          Ошибка загрузки медиаконтента
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="secondary-button px-4 py-2 rounded-full text-sm"
            style={{ fontFamily: 'var(--font-merriweather), serif' }}
          >
            Попробовать снова
          </button>
        )}
      </div>
    </div>
  )
}

// Network status detector
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = React.useState(true)

  React.useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  return isOnline
}

// Offline banner component
export function OfflineBanner() {
  const isOnline = useNetworkStatus()

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-50">
      <p className="text-sm" style={{ fontFamily: 'var(--font-merriweather), serif' }}>
        Нет подключения к интернету. Некоторые функции могут быть недоступны.
      </p>
    </div>
  )
}
