"use client"

import { useState, useEffect } from 'react'
import MusicPlayer from '../MusicPlayer'
import { useLocale } from '../../contexts/LocaleContext'
import { AudioTrack } from '../../data/mediaContent'
import { calculateAllDurations } from '../../utils/durationCalculator'

interface MusicCategoryProps {
  onBack: () => void
}

export default function MusicCategory({ onBack }: MusicCategoryProps) {
  const { t, locale } = useLocale()
  const [musicTracks, setMusicTracks] = useState<AudioTrack[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null)
  const [musicData, setMusicData] = useState<any>(null)

  // Load music data from API
  useEffect(() => {
    const loadMusic = async () => {
      try {
        const response = await fetch(`/api/media?type=music&locale=${locale}`)
        if (response.ok) {
          const result = await response.json()
          const data = result.data
          setMusicData(data)
          let tracks = data?.tracks || []
          
          // Calculate missing durations
          if (tracks.length > 0) {
            try {
              tracks = await calculateAllDurations(tracks, locale)
              setMusicTracks(tracks)
            } catch (error) {
              console.error('Error calculating durations:', error)
              setMusicTracks(tracks)
            }
          } else {
            setMusicTracks(tracks)
          }
          
          if (tracks.length > 0) {
            setCurrentTrack(tracks[0])
          }
        }
      } catch (error) {
        console.error('Failed to load music:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadMusic()
  }, [locale])

  const handleTrackSelect = (track: AudioTrack) => {
    setCurrentTrack(track)
  }

  // Transform tracks for MusicPlayer based on locale
  const transformedTracks = musicTracks.map(track => ({
    id: track.id,
    title: locale === 'en' ? (track.titleEn || track.title) : track.title,
    composer: locale === 'en' ? (track.composerEn || track.composer) : track.composer,
    duration: track.duration || '--:--',
    src: track.src
  }))

  const transformedCurrentTrack = currentTrack ? {
    id: currentTrack.id,
    title: locale === 'en' ? (currentTrack.titleEn || currentTrack.title) : currentTrack.title,
    composer: locale === 'en' ? (currentTrack.composerEn || currentTrack.composer) : currentTrack.composer,
    duration: currentTrack.duration || '--:--',
    src: currentTrack.src
  } : null

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
        {t.media.categories.music}
      </h1>
      
      {/* Subtitle */}
      <p 
        className="text-lg opacity-80 mb-8"
        style={{ 
          fontFamily: 'var(--font-merriweather), serif',
          fontSize: 'clamp(16px, 1.4cqw, 22px)'
        }}
      >
        {t.media.musicDescription}
      </p>
      
      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {locale === 'ru' ? 'Загрузка музыки...' : 'Loading music...'}
          </p>
        </div>
      ) : musicTracks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {locale === 'ru' ? 'Музыкальные треки пока недоступны.' : 'No music tracks available yet.'}
          </p>
        </div>
      ) : (
        /* Combined Music Player & Track List Form */
        <div 
          className="consistent-bg space-y-6"
          style={{
            width: '100%',
            padding: '1.5rem',
            borderRadius: '12px',
            marginTop: '2rem'
          }}
        >
          {/* Music Player Section */}
          {currentTrack && (
            <div className="space-y-4">
              <div className="w-full">
                <MusicPlayer 
                  tracks={transformedTracks} 
                  selectedTrack={transformedCurrentTrack}
                  onTrackChange={(transformedTrack) => {
                    // Find original track by ID and call handleTrackSelect
                    const originalTrack = musicTracks.find(t => t.id === transformedTrack.id)
                    if (originalTrack) handleTrackSelect(originalTrack)
                  }}
                  width="100%"
                  className=""
                />
              </div>
            </div>
          )}

          {/* Track List Section */}
          <div className="space-y-4 pt-2">
            <div className="border-t border-current/10 pt-6">
              <h3 
                className="text-xl font-medium mb-4"
                style={{ fontFamily: 'var(--font-vollkorn), serif' }}
              >
                {musicData?.listTitle || (locale === 'ru' ? 'Список произведений' : 'List of Works')}
              </h3>
              <div className="space-y-2">
                {musicTracks.map((track, index) => (
                  <div 
                    key={track.id}
                    onClick={() => handleTrackSelect(track)}
                    className={`flex justify-between items-center py-3 px-4 border rounded-lg cursor-pointer transition-all ${
                      currentTrack?.id === track.id 
                        ? 'border-current/80 border-2 bg-current/8' 
                        : 'border-current/20 input-bg hover:border-current/40'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div 
                        className={`font-medium flex items-center gap-2 ${
                          currentTrack?.id === track.id ? 'opacity-100' : 'opacity-80'
                        }`}
                        style={{ fontFamily: 'var(--font-merriweather), serif' }}
                      >
                        <span className="opacity-60 text-sm w-6 text-right">{index + 1}.</span>
                        <span className="truncate">
                          {locale === 'en' ? (track.titleEn || track.title) : track.title}
                        </span>
                      </div>
                      <div 
                        className="text-sm opacity-60 ml-8 truncate"
                        style={{ fontFamily: 'var(--font-merriweather), serif' }}
                      >
                        {locale === 'en' ? (track.composerEn || track.composer) : track.composer}
                      </div>
                    </div>
                    <div 
                      className="text-sm opacity-60 ml-4 whitespace-nowrap"
                      style={{ fontFamily: 'var(--font-merriweather), serif' }}
                    >
                      {track.duration || '--:--'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
