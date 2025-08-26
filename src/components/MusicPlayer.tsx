"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { SkipBack, SkipForward, Volume2 } from "lucide-react"

interface Track {
  id: string
  title: string
  composer: string
  duration: string
  src: string
}

interface MusicPlayerProps {
  tracks?: Track[]
  width?: string
  className?: string
  onTrackChange?: (track: Track) => void
  selectedTrack?: Track
}

// Sample tracks - replace with actual data
const defaultTracks: Track[] = [
  {
    id: "1",
    title: "Симфония № 1",
    composer: "М. Б. Тертерян",
    duration: "4:32",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/files-blob/public/audio/symphony1-lAWpgeCJ0M1P4pTHwv2fRPTuxFvwe0.mp3",
  },
  {
    id: "2",
    title: "Струнный квартет № 2",
    composer: "М. Б. Тертерян",
    duration: "6:18",
    src: "/audio/quartet2.mp3",
  },
  {
    id: "3",
    title: "Концерт для фортепиано",
    composer: "М. Б. Тертерян",
    duration: "8:45",
    src: "/audio/piano-concerto.mp3",
  },
]

export default function MusicPlayer({ tracks = defaultTracks, width = "100%", className = "", onTrackChange, selectedTrack }: MusicPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState<Track>(selectedTrack || tracks[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Update current track when tracks or selectedTrack change
  useEffect(() => {
    if (selectedTrack) {
      // Always update when selectedTrack changes (even if same ID but different content)
      setCurrentTrack(selectedTrack)
    } else if (tracks.length > 0 && !tracks.find((t) => t.id === currentTrack?.id)) {
      setCurrentTrack(tracks[0])
    }
  }, [tracks, selectedTrack]) // Removed currentTrack from dependencies

  // Theme detection
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkTheme(document.documentElement.classList.contains("dark"))
    }

    checkTheme()

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration)
      }
    }

    const handleNext = () => {
      const currentIndex = tracks.findIndex((track) => track.id === currentTrack.id)
      const nextIndex = currentIndex < tracks.length - 1 ? currentIndex + 1 : 0
      const newTrack = tracks[nextIndex]
      setCurrentTrack(newTrack)
      setIsPlaying(false)
      onTrackChange?.(newTrack)
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("canplay", updateDuration)
    audio.addEventListener("ended", handleNext)

    // Try to load duration immediately if available
    if (audio.duration && !isNaN(audio.duration)) {
      setDuration(audio.duration)
    }

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("canplay", updateDuration)
      audio.removeEventListener("ended", handleNext)
    }
  }, [currentTrack, tracks])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handlePrevious = () => {
    const currentIndex = tracks.findIndex((track) => track.id === currentTrack.id)
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : tracks.length - 1
    const newTrack = tracks[previousIndex]
    setCurrentTrack(newTrack)
    setIsPlaying(false)
    onTrackChange?.(newTrack)
  }

  const handleNext = () => {
    const currentIndex = tracks.findIndex((track) => track.id === currentTrack.id)
    const nextIndex = currentIndex < tracks.length - 1 ? currentIndex + 1 : 0
    const newTrack = tracks[nextIndex]
    setCurrentTrack(newTrack)
    setIsPlaying(false)
    onTrackChange?.(newTrack)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = Number.parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = Number.parseFloat(e.target.value)
    audio.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      // Unmute: restore previous volume or set to 0.5 if it was 0
      const newVolume = volume === 0 ? 0.5 : volume
      audio.volume = newVolume
      setIsMuted(false)
    } else {
      // Mute: set volume to 0
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Show a message if no tracks are available
  if (!tracks || tracks.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <div className="border border-current/20 rounded-lg input-bg text-center py-6">
          <p className="opacity-60">No tracks available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`}>
      <audio ref={audioRef} src={currentTrack.src} />

      {/* Form-Style Music Player */}
      <div className="border border-current/20 rounded-lg input-bg p-4 space-y-4">
        {/* Track Information */}
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div 
              className="font-medium text-lg truncate"
              style={{ fontFamily: 'var(--font-merriweather), serif' }}
            >
              {currentTrack.title}
            </div>
            <div 
              className="text-sm opacity-70 truncate"
              style={{ fontFamily: 'var(--font-merriweather), serif' }}
            >
              {currentTrack.composer}
            </div>
          </div>
          <div 
            className="text-sm opacity-60 ml-4 whitespace-nowrap"
            style={{ fontFamily: 'var(--font-merriweather), serif' }}
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <div
            className="relative w-full rounded-lg bg-current/20 h-2"
          >
            <div
              className="absolute top-0 left-0 h-full bg-current rounded-lg transition-all duration-100"
              style={{
                width: `${duration ? (currentTime / duration) * 100 : 0}%`,
              }}
            />
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
              style={{
                background: "transparent",
                appearance: "none",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          {/* Left: Playback Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              className="p-2 rounded-lg hover:bg-current/10 transition-colors cursor-pointer"
            >
              <SkipBack size={20} />
            </button>

            <button
              onClick={togglePlay}
              className="p-3 rounded-lg bg-current text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity cursor-pointer"
            >
              {isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ transform: "translateX(1px)" }}
                >
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              )}
            </button>

            <button
              onClick={handleNext}
              className="p-2 rounded-lg hover:bg-current/10 transition-colors cursor-pointer"
            >
              <SkipForward size={20} />
            </button>
          </div>

          {/* Right: Volume Control */}
          <div className="flex items-center gap-3 min-w-0">
            <button 
              onClick={toggleMute}
              className="opacity-60 hover:opacity-80 transition-opacity cursor-pointer flex-shrink-0"
            >
              {isMuted ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              )}
            </button>
            <div className="relative w-20 h-1 bg-current/20 rounded-lg">
              <div
                className="absolute top-0 left-0 h-full bg-current rounded-lg"
                style={{
                  width: `${isMuted ? 0 : volume * 100}%`,
                }}
              />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                style={{
                  background: "transparent",
                  appearance: "none",
                  outline: "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
