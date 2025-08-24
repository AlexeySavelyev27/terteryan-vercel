"use client"

import { useState } from 'react'
import { Play, ExternalLink } from 'lucide-react'
import { useLocale } from '../../contexts/LocaleContext'
import { mediaData } from '../../data/mediaContent'

interface VideoCategoryProps {
  onBack: () => void
}

export default function VideoCategory({ onBack }: VideoCategoryProps) {
  const { t, locale } = useLocale()
  const videoContent = mediaData[locale].video
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  const handleVideoClick = (videoUrl: string) => {
    // Open video in new tab - in a real implementation this might be a modal
    window.open(videoUrl, '_blank')
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
        {t.media.categories.video}
      </h1>
      
      {/* Subtitle */}
      <p 
        className="text-lg opacity-80 mb-8"
        style={{ 
          fontFamily: 'var(--font-merriweather), serif',
          fontSize: 'clamp(16px, 1.4cqw, 22px)'
        }}
      >
        {t.media.videoDescription}
      </p>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videoContent.items.map((video) => (
          <div
            key={video.id}
            className="group cursor-pointer"
            onClick={() => handleVideoClick(video.videoUrl)}
          >
            <div
              className="border transition-all duration-300 hover:shadow-lg frosted-glass hover:frosted-glass-hover"
              style={{
                borderRadius: '12px',
                borderColor: 'rgba(128, 128, 128, 0.2)',
                overflow: 'hidden'
              }}
            >
              {/* Video Thumbnail */}
              <div 
                className="relative aspect-video bg-gray-300 dark:bg-gray-700 flex items-center justify-center"
                style={{
                  backgroundImage: `url(${video.thumbnail})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                  <div className="bg-white bg-opacity-90 rounded-full p-4 group-hover:bg-opacity-100 group-hover:scale-110 transition-all">
                    <Play size={24} className="text-black ml-1" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div 
                  className="absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: 'white'
                  }}
                >
                  {video.duration}
                </div>

                {/* Year Badge */}
                <div 
                  className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: 'white'
                  }}
                >
                  {video.year}
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 
                  className="font-semibold mb-2 group-hover:opacity-80 transition-opacity"
                  style={{ 
                    fontFamily: 'var(--font-vollkorn), serif',
                    fontSize: 'clamp(16px, 1.2cqw, 20px)'
                  }}
                >
                  {video.title}
                </h3>
                <p 
                  className="text-sm opacity-70 leading-relaxed"
                  style={{ fontFamily: 'var(--font-merriweather), serif' }}
                >
                  {video.description}
                </p>
                
                {/* External Link Icon */}
                <div className="flex items-center mt-3 text-sm opacity-60 group-hover:opacity-80 transition-opacity">
                  <ExternalLink size={14} className="mr-1" />
                  <span style={{ fontFamily: 'var(--font-merriweather), serif' }}>
                    {videoContent.watchVideo}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Note about video sources */}
      <div 
        className="mt-8 p-4 rounded-lg border border-current/20 frosted-glass"
      >
        <p 
          className="text-sm opacity-70 text-center"
          style={{ fontFamily: 'var(--font-merriweather), serif' }}
        >
          {videoContent.sourceNote}
        </p>
      </div>
    </div>
  )
}
