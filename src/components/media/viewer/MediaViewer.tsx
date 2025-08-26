"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react'
import { useTheme } from 'next-themes'

interface MediaItem {
  id: string;
  type: 'photo' | 'video';
  src: string;
  thumbnail?: string;
  title: string;
  description: string;
  year: string;
  duration?: string;
}

interface MediaViewerProps {
  items: MediaItem[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function MediaViewer({ items, initialIndex, isOpen, onClose }: MediaViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const { theme, systemTheme } = useTheme();
  
  // Enhanced theme detection with DOM fallback
  const currentTheme = (() => {
    // Primary: Use useTheme hook
    if (theme === 'system') {
      const resolved = systemTheme || 'light';
      if (resolved !== 'light' && resolved !== 'dark') {
        // Fallback: Check DOM directly
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      }
      return resolved;
    }
    if (theme && (theme === 'light' || theme === 'dark')) {
      return theme;
    }
    // Ultimate fallback: Check DOM directly
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  })();
  
  const currentItem = items[currentIndex];

  // Handle mounting for portal
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle fade in/out transitions
  useEffect(() => {
    if (isOpen) {
      // Trigger fade in after component mounts
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50); // Slightly longer delay to ensure DOM is ready
      return () => clearTimeout(timer);
    } else {
      // Immediate fade out when closing
      setIsVisible(false);
    }
  }, [isOpen]);

  // Enhanced close handler with transition
  const handleClose = useCallback(() => {
    setIsVisible(false);
    // Wait for fade out transition to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          handleClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case ' ':
          e.preventDefault();
          if (currentItem.type === 'video') {
            togglePlay();
          }
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          if (currentItem.type === 'video') {
            toggleFullscreen();
          }
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          if (currentItem.type === 'video') {
            toggleMute();
          }
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
      // Prevent background scrolling when fullscreen viewer is open
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      // Restore scrolling when viewer is closed
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen, currentIndex, isPlaying]);

  // Update current index when initialIndex changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, isOpen]);

  // Reset video state when switching items
  useEffect(() => {
    if (currentItem?.type === 'video') {
      setIsPlaying(false);
      setVideoProgress(0);
      setVideoDuration(0);
    }
  }, [currentIndex]);

  // Auto-hide controls for videos
  useEffect(() => {
    if (currentItem?.type === 'video' && showControls) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, currentItem?.type]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => prev === 0 ? items.length - 1 : prev - 1);
  }, [items.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % items.length);
  }, [items.length]);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleVideoTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(progress);
    }
  }, []);

  const handleVideoLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  }, []);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * videoDuration;
      videoRef.current.currentTime = newTime;
    }
  }, [videoDuration]);

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !currentItem || !isMounted) return null;

  // Fixed theme-aware transparent background with inline styles
  const getBackgroundColor = () => {
    if (!isVisible) return 'transparent';
    
    // Debug logging
    console.log('Theme debug:', { theme, systemTheme, currentTheme, isVisible });
    
    if (currentTheme === 'dark') {
      return 'rgba(0, 0, 0, 0.7)';
    } else {
      return 'rgba(255, 255, 255, 0.6)';
    }
  };

  const mediaViewerContent = (
    <div 
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ 
        zIndex: 9999,
        backgroundColor: getBackgroundColor(),
        backdropFilter: isVisible ? 'blur(4px)' : 'blur(0px)',
        transition: 'background-color 300ms ease-in-out, backdrop-filter 300ms ease-in-out',
      }}
      onClick={handleClose}
      onMouseMove={showControlsTemporarily}
    >
      {/* Navigation Buttons */}
      <button
        onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
        className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full transition-all duration-300 ${
          currentTheme === 'dark' 
            ? 'text-white bg-black bg-opacity-50 hover:bg-opacity-75' 
            : 'text-black bg-white bg-opacity-50 hover:bg-opacity-75'
        } ${showControls && isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
        disabled={items.length <= 1}
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); goToNext(); }}
        className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full transition-all duration-300 ${
          currentTheme === 'dark' 
            ? 'text-white bg-black bg-opacity-50 hover:bg-opacity-75' 
            : 'text-black bg-white bg-opacity-50 hover:bg-opacity-75'
        } ${showControls && isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
        disabled={items.length <= 1}
      >
        <ChevronRight size={24} />
      </button>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className={`absolute top-4 right-4 z-10 p-3 rounded-full transition-all duration-300 ${
          currentTheme === 'dark' 
            ? 'text-white bg-black bg-opacity-50 hover:bg-opacity-75' 
            : 'text-black bg-white bg-opacity-50 hover:bg-opacity-75'
        } ${
          showControls && isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        <X size={24} />
      </button>

      {/* Media Content - Separated Layout */}
      <div 
        className={`w-full h-full flex flex-col transition-all duration-300 transform ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Photo Display Zone - Fixed Height Area */}
        <div className="flex-1 flex items-center justify-center p-4 min-h-0">
          <div className="relative w-full h-full max-w-7xl flex items-center justify-center">
            {currentItem.type === 'photo' ? (
              <img
                src={currentItem.src}
                alt={currentItem.title}
                className="max-w-full max-h-full min-w-0 min-h-0 object-contain rounded-lg shadow-2xl"
                style={{
                  // Ensure image uses available space efficiently while maintaining aspect ratio
                  width: 'auto',
                  height: 'auto',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  minWidth: '300px', // Minimum size for small images
                  minHeight: '200px', // Minimum size for small images
                }}
                draggable={false}
              />
            ) : (
              <div className="relative max-w-full max-h-full">
                <video
                  ref={videoRef}
                  src={currentItem.src}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  style={{
                    minWidth: '300px',
                    minHeight: '200px',
                  }}
                  onTimeUpdate={handleVideoTimeUpdate}
                  onLoadedMetadata={handleVideoLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  controls={false}
                  poster={currentItem.thumbnail}
                />
                
                {/* Video Controls */}
                <div 
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                    showControls ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {/* Play/Pause Button */}
                  <button
                    onClick={togglePlay}
                    className={`p-4 rounded-full transition-all ${
                      currentTheme === 'dark' 
                        ? 'text-white bg-black bg-opacity-60 hover:bg-opacity-80' 
                        : 'text-white bg-black bg-opacity-60 hover:bg-opacity-80'
                    }`}
                  >
                    {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                  </button>
                </div>

                {/* Video Progress Bar */}
                <div 
                  className={`absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300 ${
                    showControls ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Time Display */}
                    <span className={`text-sm font-mono ${
                      currentTheme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                      {formatTime(videoDuration * (videoProgress / 100))} / {formatTime(videoDuration)}
                    </span>

                    {/* Progress Bar */}
                    <div 
                      className={`flex-1 h-2 rounded-full cursor-pointer ${
                        currentTheme === 'dark' ? 'bg-white bg-opacity-30' : 'bg-black bg-opacity-30'
                      }`}
                      onClick={handleProgressClick}
                    >
                      <div
                        className={`h-full rounded-full transition-all ${
                          currentTheme === 'dark' ? 'bg-white' : 'bg-black'
                        }`}
                        style={{ width: `${videoProgress}%` }}
                      />
                    </div>

                    {/* Volume Control */}
                    <button
                      onClick={toggleMute}
                      className={`p-2 rounded transition-all ${
                        currentTheme === 'dark' 
                          ? 'text-white hover:bg-white hover:bg-opacity-20' 
                          : 'text-black hover:bg-black hover:bg-opacity-20'
                      }`}
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>

                    {/* Fullscreen Control */}
                    <button
                      onClick={toggleFullscreen}
                      className={`p-2 rounded transition-all ${
                        currentTheme === 'dark' 
                          ? 'text-white hover:bg-white hover:bg-opacity-20' 
                          : 'text-black hover:bg-black hover:bg-opacity-20'
                      }`}
                    >
                      {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metadata Zone - Transparent Area */}
        <div 
          className={`flex-shrink-0 p-6 transition-all duration-300 transform ${
            isVisible && (showControls || currentItem.type !== 'video') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{
            minHeight: '120px', // Ensure consistent metadata area height
          }}
        >
          <div className="text-center max-w-2xl mx-auto">
            {/* Title */}
            <h3 
              className={`text-xl font-semibold mb-2 ${
                currentTheme === 'dark' ? 'text-white' : 'text-black'
              }`}
              style={{ fontFamily: 'var(--font-vollkorn), serif' }}
            >
              {currentItem.title}
            </h3>
            
            {/* Description */}
            <p 
              className={`opacity-80 mb-3 leading-relaxed ${
                currentTheme === 'dark' ? 'text-white' : 'text-black'
              }`}
              style={{ fontFamily: 'var(--font-merriweather), serif' }}
            >
              {currentItem.description}
            </p>
            
            {/* Metadata Row */}
            <div className="flex items-center justify-center gap-4 text-sm">
              <span 
                className={`opacity-60 ${
                  currentTheme === 'dark' ? 'text-white' : 'text-black'
                }`}
                style={{ fontFamily: 'var(--font-merriweather), serif' }}
              >
                {currentItem.year}
                {currentItem.duration && ` • ${currentItem.duration}`}
              </span>
              
              <span 
                className={`opacity-60 ${
                  currentTheme === 'dark' ? 'text-white' : 'text-black'
                }`}
              >
                {currentIndex + 1} / {items.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Touch Swipe Areas for Mobile */}
      <div 
        className="absolute left-0 top-0 w-1/3 h-full z-0"
        onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
      />
      <div 
        className="absolute right-0 top-0 w-1/3 h-full z-0"
        onClick={(e) => { e.stopPropagation(); goToNext(); }}
      />
    </div>
  );

  // Render using portal to ensure fullscreen positioning outside of any parent containers
  return createPortal(mediaViewerContent, document.body);
}
