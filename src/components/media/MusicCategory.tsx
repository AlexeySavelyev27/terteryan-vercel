"use client"

import { useState } from 'react'
import MusicPlayer from '../MusicPlayer'
import { useLocale } from '../../contexts/LocaleContext'
import { mediaData } from '../../data/mediaContent'

interface MusicCategoryProps {
  onBack: () => void
}

export default function MusicCategory({ onBack }: MusicCategoryProps) {
  const { t, locale } = useLocale()
  const musicData = mediaData[locale].music
  const musicTracks = musicData.tracks
  const [currentTrack, setCurrentTrack] = useState(musicTracks[0])

  const handleTrackSelect = (track: any) => {
    setCurrentTrack(track)
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
      
      {/* Music Player */}
      <div style={{ marginTop: '2rem' }}>
        <MusicPlayer 
          tracks={musicTracks} 
          selectedTrack={currentTrack}
          onTrackChange={handleTrackSelect}
        />
      </div>

      {/* Additional track list for better visibility */}
      <div 
        className="mt-8 frosted-glass"
        style={{ 
          border: '1px solid rgba(128, 128, 128, 0.2)',
          borderRadius: '12px',
          padding: '1.5rem'
        }}
      >
        <h3 
          className="text-xl font-semibold mb-4"
          style={{ fontFamily: 'var(--font-vollkorn), serif' }}
        >
          {musicData.listTitle}
        </h3>
        <div className="space-y-3">
          {musicTracks.map((track, index) => (
            <div 
              key={track.id}
              onClick={() => handleTrackSelect(track)}
              className={`flex justify-between items-center py-2 border-b border-current/10 last:border-b-0 cursor-pointer hover:bg-current/5 transition-colors rounded ${
                currentTrack?.id === track.id ? 'bg-current/10' : ''
              }`}
            >
              <div>
                <div 
                  className={`font-medium ${
                    currentTrack?.id === track.id ? 'opacity-100' : 'opacity-80'
                  }`}
                  style={{ fontFamily: 'var(--font-merriweather), serif' }}
                >
                  {index + 1}. {track.title}
                  {currentTrack?.id === track.id && (
                    <span className="ml-2 text-xs opacity-60">♪ Играет</span>
                  )}
                </div>
                <div 
                  className="text-sm opacity-60"
                  style={{ fontFamily: 'var(--font-merriweather), serif' }}
                >
                  {track.composer}
                </div>
              </div>
              <div 
                className="text-sm opacity-60"
                style={{ fontFamily: 'var(--font-merriweather), serif' }}
              >
                {track.duration}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
