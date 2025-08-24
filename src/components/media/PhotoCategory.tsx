"use client"

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLocale } from '../../contexts/LocaleContext'
import { mediaData } from '../../data/mediaContent'

interface PhotoCategoryProps {
  onBack: () => void
}

export default function PhotoCategory({ onBack }: PhotoCategoryProps) {
  const { t, locale } = useLocale()
  const photoContent = mediaData[locale].photos
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)

  const openPhoto = (index: number) => {
    setSelectedPhoto(index)
  }

  const closePhoto = () => {
    setSelectedPhoto(null)
  }

  const nextPhoto = () => {
    if (selectedPhoto !== null) {
      setSelectedPhoto((selectedPhoto + 1) % photoContent.items.length)
    }
  }

  const prevPhoto = () => {
    if (selectedPhoto !== null) {
      setSelectedPhoto(selectedPhoto === 0 ? photoContent.items.length - 1 : selectedPhoto - 1)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closePhoto()
    if (e.key === 'ArrowLeft') prevPhoto()
    if (e.key === 'ArrowRight') nextPhoto()
  }

  return (
    <div className="w-full h-full">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 text-lg opacity-70 hover:opacity-100 transition-opacity"
        style={{ fontFamily: 'var(--font-merriweather), serif' }}
      >
        {t.media.backToCategories}
      </button>

      {/* Title */}
      <h1 
        className="text-4xl font-bold mb-2"
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

      {/* Photo Collage Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photoContent.items.map((photo, index) => (
          <div
            key={photo.id}
            className="group cursor-pointer relative overflow-hidden rounded-lg unified-button-bg"
            style={{
              aspectRatio: index % 3 === 0 ? '4/5' : index % 5 === 0 ? '5/4' : '1/1', // Varied aspect ratios for interesting layout
            }}
            onClick={() => openPhoto(index)}
          >
            {/* Photo */}
            <div
              className="w-full h-full bg-gray-300 dark:bg-gray-700 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
              style={{
                backgroundImage: `url(${photo.src})`,
              }}
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end">
              <div className="p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h4 className="font-semibold text-sm mb-1">{photo.title}</h4>
                <p className="text-xs opacity-80">{photo.year}</p>
              </div>
            </div>

            {/* Year Badge */}
            <div 
              className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white'
              }}
            >
              {photo.year}
            </div>
          </div>
        ))}
      </div>

      {/* Photo Modal */}
      {selectedPhoto !== null && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closePhoto}
          onKeyDown={handleKeyPress}
          tabIndex={0}
          style={{ outline: 'none' }}
        >
          {/* Close Button */}
          <button
            onClick={closePhoto}
            className="absolute top-4 right-4 text-white hover:opacity-70 transition-opacity z-10"
          >
            <X size={32} />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:opacity-70 transition-opacity z-10"
          >
            <ChevronLeft size={40} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:opacity-70 transition-opacity z-10"
          >
            <ChevronRight size={40} />
          </button>

          {/* Photo Content */}
          <div 
            className="max-w-4xl max-h-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Photo */}
            <img
              src={photoContent.items[selectedPhoto].src}
              alt={photoContent.items[selectedPhoto].title}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />

            {/* Photo Info */}
            <div className="mt-4 text-white text-center max-w-2xl">
              <h3 
                className="text-xl font-semibold mb-2"
                style={{ fontFamily: 'var(--font-vollkorn), serif' }}
              >
                {photoContent.items[selectedPhoto].title}
              </h3>
              <p 
                className="opacity-80 mb-1"
                style={{ fontFamily: 'var(--font-merriweather), serif' }}
              >
                {photoContent.items[selectedPhoto].description}
              </p>
              <p 
                className="text-sm opacity-60"
                style={{ fontFamily: 'var(--font-merriweather), serif' }}
              >
                {photoContent.items[selectedPhoto].year}
              </p>
            </div>

            {/* Photo Counter */}
            <div className="mt-4 text-white text-sm opacity-60">
              {selectedPhoto + 1} / {photoContent.items.length}
            </div>
          </div>
        </div>
      )}

      {/* Note about photos */}
      <div 
        className="mt-8 p-4 rounded-lg border border-current/20 frosted-glass"
      >
        <p 
          className="text-sm opacity-70 text-center"
          style={{ fontFamily: 'var(--font-merriweather), serif' }}
        >
          {photoContent.sourceNote}
        </p>
      </div>
    </div>
  )
}
