"use client"

import { Download, FileText, Calendar, User } from 'lucide-react'
import { useLocale } from '../../contexts/LocaleContext'
import { mediaData } from '../../data/mediaContent'

interface PublicationsCategoryProps {
  onBack: () => void
}

export default function PublicationsCategory({ onBack }: PublicationsCategoryProps) {
  const { t, locale } = useLocale()
  const publicationsContent = mediaData[locale].publications

  const handleDownload = (fileUrl: string, title: string) => {
    // In a real implementation, this would handle actual file downloads
    window.open(fileUrl, '_blank')
  }

  const getTypeColor = (type: string) => {
    const colors = {
      'Интервью': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Interview': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Статья': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Article': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Исследование': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Research': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Каталог': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Catalog': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Сборник': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Collection': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
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
        {t.media.categories.publications}
      </h1>
      
      {/* Subtitle */}
      <p 
        className="text-lg opacity-80 mb-8"
        style={{ 
          fontFamily: 'var(--font-merriweather), serif',
          fontSize: 'clamp(16px, 1.4cqw, 22px)'
        }}
      >
        {t.media.publicationsDescription}
      </p>

      {/* Publications Grid */}
      <div className="space-y-6">
        {publicationsContent.items.map((publication) => (
          <div
            key={publication.id}
            className="border transition-all duration-300 hover:shadow-lg group frosted-glass hover:frosted-glass-hover"
            style={{
              borderRadius: '12px',
              borderColor: 'rgba(128, 128, 128, 0.2)',
              padding: '1.5rem'
            }}
          >
            <div className="flex flex-col lg:flex-row lg:items-start gap-4">
              {/* Document Icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-current/10 rounded-lg flex items-center justify-center">
                  <FileText size={28} className="opacity-60" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <div className="flex-1">
                    <h3 
                      className="font-semibold mb-1 group-hover:opacity-80 transition-opacity"
                      style={{ 
                        fontFamily: 'var(--font-vollkorn), serif',
                        fontSize: 'clamp(18px, 1.4cqw, 24px)'
                      }}
                    >
                      {publication.title}
                    </h3>
                    
                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-3 text-sm opacity-70 mb-2">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span style={{ fontFamily: 'var(--font-merriweather), serif' }}>
                          {publication.author}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span style={{ fontFamily: 'var(--font-merriweather), serif' }}>
                          {publication.year}
                        </span>
                      </div>
                      <span 
                        className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(publication.type)}`}
                      >
                        {publication.type}
                      </span>
                    </div>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(publication.fileUrl, publication.title)}
                    className="flex items-center gap-2 px-4 py-2 bg-current/10 hover:bg-current/20 rounded-lg transition-all text-sm font-medium whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-merriweather), serif' }}
                  >
                    <Download size={16} />
                    <span>{publicationsContent.downloadPdf}</span>
                  </button>
                </div>

                {/* Description */}
                <p 
                  className="opacity-80 mb-3 leading-relaxed"
                  style={{ 
                    fontFamily: 'var(--font-merriweather), serif',
                    fontSize: 'clamp(14px, 1.1cqw, 16px)'
                  }}
                >
                  {publication.description}
                </p>

                {/* File Details */}
                <div className="flex flex-wrap items-center gap-4 text-sm opacity-60">
                  <span style={{ fontFamily: 'var(--font-merriweather), serif' }}>
                    {publication.pages} {publicationsContent.pages}
                  </span>
                  <span style={{ fontFamily: 'var(--font-merriweather), serif' }}>
                    {publication.size}
                  </span>
                  <span style={{ fontFamily: 'var(--font-merriweather), serif' }}>
                    {publication.language}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Note about publications */}
      <div 
        className="mt-8 p-4 rounded-lg border border-current/20 frosted-glass"
      >
        <p 
          className="text-sm opacity-70 text-center"
          style={{ fontFamily: 'var(--font-merriweather), serif' }}
        >
          {publicationsContent.sourceNote}
        </p>
      </div>
    </div>
  )
}
