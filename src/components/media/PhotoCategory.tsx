"use client"

import { useState, useEffect, useCallback } from 'react'
import { useLocale } from '../../contexts/LocaleContext'
import { PhotoItem } from '../../data/mediaContent'
import MediaViewer from './viewer/MediaViewer'

interface PhotoCategoryProps {
  onBack: () => void
}

export default function PhotoCategory({ onBack }: PhotoCategoryProps) {
  const { t, locale } = useLocale()
  const [photoItems, setPhotoItems] = useState<PhotoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)

  // Load photo data from API
  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const response = await fetch(`/api/media?type=photos&locale=${locale}`)
        if (response.ok) {
          const result = await response.json()
          setPhotoItems(result.data?.items || [])
        }
      } catch (error) {
        console.error('Failed to load photos:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadPhotos()
  }, [locale])

  const openPhoto = (index: number) => {
    setSelectedPhoto(index)
  }

  const closePhoto = () => {
    setSelectedPhoto(null)
  }

  // Convert photo data to MediaViewer format - use best available quality
  const viewerItems = photoItems.map(photo => ({
    id: photo.id,
    type: 'photo' as const,
    src: photo.largeUrl || photo.src, // Use large version for viewer, fallback to src
    thumbnail: photo.thumbnailUrl || photo.mediumUrl || photo.src, // Thumbnail for quick loading
    title: locale === 'en' ? (photo.titleEn || photo.title) : photo.title,
    description: locale === 'en' ? (photo.descriptionEn || photo.description) : photo.description,
    year: String(photo.year), // Convert to string to match MediaItem interface
  }))

  return (
    <div className="w-full h-full">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 text-lg opacity-70 hover:opacity-100 transition-all px-4 py-2 rounded-lg unified-button-bg"
        style={{ fontFamily: 'var(--font-merriweather), serif', cursor: 'pointer' }}
      >
        {t.media.backToCategories}
      </button>

      {/* Title */}
      <h1 
        className="text-4xl font-regular mb-2"
        style={{ 
          fontFamily: 'var(--font-vollkorn), serif',
          fontSize: 'clamp(40px, 6cqw, 64px)'
        }}
      >
        {t.media.categories.photo}
      </h1>
      
      {/* Subtitle */}
      <p 
        className="text-lg opacity-80 mb-8"
        style={{ 
          fontFamily: 'var(--font-merriweather), serif',
          fontSize: 'clamp(16px, 1.4cqw, 22px)'
        }}
      >
        {t.media.photoDescription}
      </p>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {locale === 'ru' ? 'Загрузка фотографий...' : 'Loading photos...'}
          </p>
        </div>
      ) : photoItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {locale === 'ru' ? 'Фотографии пока недоступны.' : 'No photos available yet.'}
          </p>
        </div>
      ) : (
        <div className="photo-masonry-grid">
          {photoItems.map((photo, index) => (
            <div
              key={photo.id}
              className="photo-masonry-item group cursor-pointer relative rounded-lg unified-button-bg"
              onClick={() => openPhoto(index)}
            >
              <div className="relative w-full">
                <SimpleImage 
                  photo={photo}
                  locale={locale}
                />

                {/* Hover Overlay - only show text area at bottom */}
                <div className="absolute inset-0 pointer-events-none group-hover:bg-gradient-to-t group-hover:from-black/60 group-hover:to-transparent transition-all duration-300 flex items-end">
                  <div className="p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="font-semibold text-sm mb-1 line-clamp-2">
                      {locale === 'en' ? (photo.titleEn || photo.title) : photo.title}
                    </h4>
                    <p className="text-xs opacity-90 line-clamp-2">
                      {locale === 'en' ? (photo.descriptionEn || photo.description) : photo.description}
                    </p>
                  </div>
                </div>

                {/* Year Badge */}
                <div 
                  className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white'
                  }}
                >
                  {photo.year}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Media Viewer */}
      <MediaViewer
        items={viewerItems}
        initialIndex={selectedPhoto || 0}
        isOpen={selectedPhoto !== null}
        onClose={closePhoto}
      />
    </div>
  )
}

// Photo component with loading states and error handling
interface SimpleImageProps {
  photo: PhotoItem
  locale: string
}

function SimpleImage({ photo, locale }: SimpleImageProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    setHasError(false)
  }, [])

  const handleError = useCallback(() => {
    setHasError(true)
    setIsLoaded(false)
  }, [])

  // Reset states when photo changes
  useEffect(() => {
    setIsLoaded(false)
    setHasError(false)
  }, [photo.src])

  const imageSrc = photo.thumbnailUrl || photo.mediumUrl || photo.src || '/placeholder.jpg'

  return (
    <div className="relative w-full bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
      {/* Error placeholder - only show if image actually failed */}
      {hasError && (
        <div className="w-full h-48 bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
          <span className="text-xs text-gray-500">Image unavailable</span>
        </div>
      )}
      
      {/* Image - show immediately, fade in when loaded */}
      {!hasError && (
        <img
          src={imageSrc}
          alt={locale === 'en' ? (photo.titleEn || photo.title) : photo.title}
          className={`w-full h-auto object-cover transition-all duration-300 group-hover:scale-105 rounded ${
            isLoaded ? 'opacity-100' : 'opacity-75'
          }`}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          style={{ 
            minHeight: '100px',
            backgroundColor: 'transparent',
            // Optimize image rendering
            imageRendering: 'auto',
            // Prevent layout shift
            aspectRatio: 'auto',
          }}
          // Responsive image sizes for better performance
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
        />
      )}
    </div>
  )
}
