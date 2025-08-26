"use client"

import { useState, useEffect } from 'react'
import { Play } from 'lucide-react'
import { useLocale } from '../../contexts/LocaleContext'
import { VideoItem } from '../../data/mediaContent'
import MediaViewer from './viewer/MediaViewer'

interface VideoCategoryProps {
  onBack: () => void
}

export default function VideoCategory({ onBack }: VideoCategoryProps) {
  const { t, locale } = useLocale()
  const [videoItems, setVideoItems] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null)
  const [videoData, setVideoData] = useState<any>(null)

  // Load video data from API
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const response = await fetch(`/api/media?type=video&locale=${locale}`)
        if (response.ok) {
          const result = await response.json()
          const data = result.data
          setVideoData(data)
          setVideoItems(data?.items || [])
        }
      } catch (error) {
        console.error('Failed to load videos:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadVideos()
  }, [locale])

  const openVideo = (index: number) => {
    setSelectedVideo(index)
  }

  const closeVideo = () => {
    setSelectedVideo(null)
  }

  // Convert video data to MediaViewer format
  const viewerItems = videoItems.map(video => ({
    id: video.id,
    type: 'video' as const,
    src: video.videoUrl,
    thumbnail: video.thumbnail,
    title: locale === 'en' ? (video.titleEn || video.title) : video.title,
    description: locale === 'en' ? (video.descriptionEn || video.description) : video.description,
    year: video.year,
    duration: video.duration,
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

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {locale === 'ru' ? 'Загрузка видео...' : 'Loading videos...'}
          </p>
        </div>
      ) : videoItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {locale === 'ru' ? 'Видео пока недоступны.' : 'No videos available yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videoItems.map((video, index) => (
            <div
              key={video.id}
              className="group cursor-pointer"
              onClick={() => openVideo(index)}
            >
              <div
                className="unified-button-bg transition-all duration-300 hover:shadow-lg"
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
              >
                {/* Video Thumbnail */}
                <div 
                  className="relative aspect-video bg-gray-300 dark:bg-gray-700 flex items-center justify-center"
                  style={{
                    backgroundImage: video.thumbnail ? `url(${video.thumbnail})` : undefined,
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
                  {video.duration && (
                    <div 
                      className="absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color: 'white'
                      }}
                    >
                      {video.duration}
                    </div>
                  )}

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
                    {locale === 'en' ? (video.titleEn || video.title) : video.title}
                  </h3>
                  <p 
                    className="text-sm opacity-70 leading-relaxed"
                    style={{ fontFamily: 'var(--font-merriweather), serif' }}
                  >
                    {locale === 'en' ? (video.descriptionEn || video.description) : video.description}
                  </p>
                  
                  {/* Watch Video Text */}
                  <div className="flex items-center mt-3 text-sm opacity-60 group-hover:opacity-80 transition-opacity">
                    <Play size={14} className="mr-1" />
                    <span style={{ fontFamily: 'var(--font-merriweather), serif' }}>
                      {videoData?.watchVideo || (locale === 'ru' ? 'Смотреть видео' : 'Watch Video')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Media Viewer */}
      <MediaViewer
        items={viewerItems}
        initialIndex={selectedVideo || 0}
        isOpen={selectedVideo !== null}
        onClose={closeVideo}
      />
    </div>
  )
}
