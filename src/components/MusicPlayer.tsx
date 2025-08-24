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
  const [progressHover, setProgressHover] = useState(false)
  const [volumeHover, setVolumeHover] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Update current track when tracks or selectedTrack change
  useEffect(() => {
    if (selectedTrack && selectedTrack.id !== currentTrack?.id) {
      setCurrentTrack(selectedTrack)
    } else if (tracks.length > 0 && !tracks.find((t) => t.id === currentTrack?.id)) {
      setCurrentTrack(tracks[0])
    }
  }, [tracks, currentTrack, selectedTrack])

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
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }



  // Show a message if no tracks are available
  if (!tracks || tracks.length === 0) {
    return (
      <div className={`w-full max-w-4xl mx-auto ${className}`} style={{ width }}>
        <div
          className="border transition-all duration-300 text-center"
          style={{
            padding: "20px",
            borderRadius: "12px",
            backgroundColor: isDarkTheme ? "#000000" : "#ffffff",
            borderColor: isDarkTheme ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
            color: isDarkTheme ? "#ffffff" : "#000000",
          }}
        >
          <p className="opacity-60">No tracks available</p>
        </div>
      </div>
    )
  }

  const buttonHoverStyle = {
    backgroundColor: isDarkTheme ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
  }

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`} style={{ width }}>
      <audio ref={audioRef} src={currentTrack.src} />

      {/* Compact Horizontal Player - Exclude from global scroll */}
      <div
        data-scroll-exclude
        className="border transition-all duration-300"
        style={{
          padding: "10px 13px",
          borderRadius: "12px",
          lineHeight: "1",
          backgroundColor: isDarkTheme ? "#000000" : "#ffffff",
          borderColor: isDarkTheme ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
          color: isDarkTheme ? "#ffffff" : "#000000",
        }}
      >
        <div className="flex items-center" style={{ gap: "20px" }}>
          {/* Left: Controls */}
          <div className="flex items-center" style={{ gap: "4px" }}>
            <button
              onClick={handlePrevious}
              className="rounded-full transition-colors"
              style={{ padding: "3px" }}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <SkipBack size={19} />
            </button>

            <button
              onClick={togglePlay}
              className="rounded-full hover:opacity-80 transition-opacity"
              style={{
                padding: "9px",
                backgroundColor: isDarkTheme ? "#ffffff" : "#000000",
                color: isDarkTheme ? "#000000" : "#ffffff",
              }}
            >
              {isPlaying ? (
                <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg
                  width="19"
                  height="19"
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
              className="rounded-full transition-colors"
              style={{ padding: "3px" }}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <SkipForward size={19} />
            </button>
          </div>

          {/* Center: Track Info & Progress */}
          <div className="flex-1 min-w-0">
            {/* Track Info */}
            <div className="flex items-center" style={{ gap: "15px", marginBottom: "6px" }}>
              <div className="min-w-0 flex-1">
                <div
                  className="font-medium truncate"
                  style={{
                    fontSize: "18px",
                    lineHeight: "1.1",
                  }}
                >
                  {currentTrack.title}
                </div>
                <div
                  className="opacity-60 truncate leading-tight"
                  style={{
                    fontSize: "13px",
                    marginTop: "-2px",
                    lineHeight: "1.1",
                  }}
                >
                  {currentTrack.composer}
                </div>
              </div>
              <div
                className="opacity-60 whitespace-nowrap"
                style={{
                  fontSize: "14px",
                  lineHeight: "1.1",
                }}
              >
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Progress Bar */}
            <div
              className="relative w-full rounded-lg"
              style={{
                height: "3px",
                backgroundColor: isDarkTheme ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
              }}
              onMouseEnter={() => setProgressHover(true)}
              onMouseLeave={() => setProgressHover(false)}
            >
              <div
                className="rounded-lg"
                style={{
                  width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                  height: "100%",
                  pointerEvents: "none",
                  backgroundColor: isDarkTheme ? "#ffffff" : "#000000",
                }}
              />
              <div
                className="absolute rounded-full pointer-events-none transition-opacity duration-200"
                style={{
                  width: "12px",
                  height: "12px",
                  top: "50%",
                  left: `${duration ? (currentTime / duration) * 100 : 0}%`,
                  transform: "translate(-50%, -50%)",
                  opacity: progressHover ? 1 : 0,
                  zIndex: 20,
                  backgroundColor: isDarkTheme ? "#ffffff" : "#000000",
                }}
              />
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full cursor-pointer"
                style={{
                  background: "transparent",
                  appearance: "none",
                  outline: "none",
                  opacity: 0,
                }}
              />
            </div>
          </div>

          {/* Right: Volume Control */}
          <div className="flex items-center min-w-0" style={{ gap: "8px" }}>
            <Volume2 size={25} className="opacity-60" />
            <div
              className="relative rounded-lg"
              style={{
                width: "74px",
                height: "2px",
                backgroundColor: isDarkTheme ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
              }}
              onMouseEnter={() => setVolumeHover(true)}
              onMouseLeave={() => setVolumeHover(false)}
            >
              <div
                className="rounded-lg"
                style={{
                  width: `${volume * 100}%`,
                  height: "100%",
                  pointerEvents: "none",
                  backgroundColor: isDarkTheme ? "#ffffff" : "#000000",
                }}
              />
              <div
                className="absolute rounded-full pointer-events-none transition-opacity duration-200"
                style={{
                  width: "12px",
                  height: "12px",
                  top: "50%",
                  left: `${volume * 100}%`,
                  transform: "translate(-50%, -50%)",
                  opacity: volumeHover ? 1 : 0,
                  zIndex: 20,
                  backgroundColor: isDarkTheme ? "#ffffff" : "#000000",
                }}
              />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="absolute inset-0 w-full h-full cursor-pointer"
                style={{
                  background: "transparent",
                  appearance: "none",
                  outline: "none",
                  opacity: 0,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
