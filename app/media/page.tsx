'use client';

import { useState, useEffect } from 'react';
import { Music, Video, Image, FileText } from 'lucide-react';
import { useLocale } from '../../src/contexts/LocaleContext';
import MusicCategory from '../../src/components/media/MusicCategory';
import VideoCategory from '../../src/components/media/VideoCategory';
import PhotoCategory from '../../src/components/media/PhotoCategory';
import PublicationsCategory from '../../src/components/media/PublicationsCategory';

type MediaCategory = 'home' | 'music' | 'video' | 'photo' | 'publications';

// Define the order for transitions: home ↔ music ↔ video ↔ photo ↔ publications
const MEDIA_SECTIONS = ['home', 'music', 'video', 'photo', 'publications'] as const;

const categoryIcons = {
  music: Music,
  video: Video,
  photo: Image,
  publications: FileText
};

export default function Media() {
  const { t, locale } = useLocale();
  const [activeCategory, setActiveCategory] = useState<MediaCategory>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionClass, setTransitionClass] = useState('');

  const handleCategorySelect = (category: MediaCategory) => {
    if (isTransitioning || activeCategory === category) return;
    
    const currentIndex = MEDIA_SECTIONS.indexOf(activeCategory);
    const targetIndex = MEDIA_SECTIONS.indexOf(category);
    
    // Determine animation direction based on section order
    const goingRight = targetIndex > currentIndex;
    const exitClass = goingRight ? 'media-section-exit-left' : 'media-section-exit-right';
    
    // Start exit animation
    setIsTransitioning(true);
    setTransitionClass(exitClass);
    
    // Wait for exit animation to complete, then change section and start enter animation
    setTimeout(() => {
      setActiveCategory(category);
      
      // Determine enter animation direction
      const enterClass = goingRight ? 'media-section-enter-from-right' : 'media-section-enter-from-left';
      setTransitionClass(enterClass);
      
      // Clear everything after enter animation completes
      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionClass('');
      }, 400); // Match animation duration
      
    }, 400); // Wait for exit animation to complete
  };

  const handleBackToCategories = () => {
    handleCategorySelect('home');
  };

  // Render specific category component
  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'music':
        return <MusicCategory onBack={handleBackToCategories} />;
      case 'video':
        return <VideoCategory onBack={handleBackToCategories} />;
      case 'photo':
        return <PhotoCategory onBack={handleBackToCategories} />;
      case 'publications':
        return <PublicationsCategory onBack={handleBackToCategories} />;
      default:
        // Render main category selection
        return (
          <>
            {/* Title */}
            <h1 
              className="text-4xl font-regular mb-2"
              style={{ 
                fontFamily: 'var(--font-vollkorn), serif',
                fontSize: 'clamp(40px, 6cqw, 64px)'
              }}
            >
              {t.media.title}
            </h1>
            
            {/* Subtitle */}
            <p 
              className="text-lg opacity-80 mb-12"
              style={{ 
                fontFamily: 'var(--font-merriweather), serif',
                fontSize: 'clamp(16px, 1.4cqw, 22px)'
              }}
            >
              {t.media.subtitle}
            </p>
            
            {/* Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Music Category */}
              <div
                onClick={() => handleCategorySelect('music')}
                className="group cursor-pointer"
                style={{
                  pointerEvents: isTransitioning ? 'none' : 'auto'
                }}
              >
                <div
                  className="unified-button-bg transition-all duration-300 hover:shadow-lg"
                  style={{
                    borderRadius: '16px',
                    padding: '2rem'
                  }}
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-full bg-current/10 mr-4">
                      <Music size={32} className="opacity-70" />
                    </div>
                    <h2 
                      className="text-2xl font-regular group-hover:opacity-80 transition-opacity"
                      style={{ fontFamily: 'var(--font-vollkorn), serif' }}
                    >
                      {t.media.categories.music}
                    </h2>
                  </div>
                  <p 
                    className="opacity-70 leading-relaxed"
                    style={{ fontFamily: 'var(--font-merriweather), serif' }}
                  >
                    {t.media.musicDescription}
                  </p>
                </div>
              </div>

              {/* Video Category */}
              <div
                onClick={() => handleCategorySelect('video')}
                className="group cursor-pointer"
                style={{
                  pointerEvents: isTransitioning ? 'none' : 'auto'
                }}
              >
                <div
                  className="border transition-all duration-300 hover:shadow-lg group-hover:border-current/40 frosted-glass hover:frosted-glass-hover"
                  style={{
                    borderRadius: '16px',
                    borderColor: 'rgba(128, 128, 128, 0.2)',
                    padding: '2rem'
                  }}
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-full bg-current/10 mr-4">
                      <Video size={32} className="opacity-70" />
                    </div>
                    <h2 
                      className="text-2xl font-regular group-hover:opacity-80 transition-opacity"
                      style={{ fontFamily: 'var(--font-vollkorn), serif' }}
                    >
                      {t.media.categories.video}
                    </h2>
                  </div>
                  <p 
                    className="opacity-70 leading-relaxed"
                    style={{ fontFamily: 'var(--font-merriweather), serif' }}
                  >
                    {t.media.videoDescription}
                  </p>
                </div>
              </div>

              {/* Photo Category */}
              <div
                onClick={() => handleCategorySelect('photo')}
                className="group cursor-pointer"
                style={{
                  pointerEvents: isTransitioning ? 'none' : 'auto'
                }}
              >
                <div
                  className="border transition-all duration-300 hover:shadow-lg group-hover:border-current/40 frosted-glass hover:frosted-glass-hover"
                  style={{
                    borderRadius: '16px',
                    borderColor: 'rgba(128, 128, 128, 0.2)',
                    padding: '2rem'
                  }}
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-full bg-current/10 mr-4">
                      <Image size={32} className="opacity-70" />
                    </div>
                    <h2 
                      className="text-2xl font-regular group-hover:opacity-80 transition-opacity"
                      style={{ fontFamily: 'var(--font-vollkorn), serif' }}
                    >
                      {t.media.categories.photo}
                    </h2>
                  </div>
                  <p 
                    className="opacity-70 leading-relaxed"
                    style={{ fontFamily: 'var(--font-merriweather), serif' }}
                  >
                    {t.media.photoDescription}
                  </p>
                </div>
              </div>

              {/* Publications Category */}
              <div
                onClick={() => handleCategorySelect('publications')}
                className="group cursor-pointer"
                style={{
                  pointerEvents: isTransitioning ? 'none' : 'auto'
                }}
              >
                <div
                  className="border transition-all duration-300 hover:shadow-lg group-hover:border-current/40 frosted-glass hover:frosted-glass-hover"
                  style={{
                    borderRadius: '16px',
                    borderColor: 'rgba(128, 128, 128, 0.2)',
                    padding: '2rem'
                  }}
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-full bg-current/10 mr-4">
                      <FileText size={32} className="opacity-70" />
                    </div>
                    <h2 
                      className="text-2xl font-regular group-hover:opacity-80 transition-opacity"
                      style={{ fontFamily: 'var(--font-vollkorn), serif' }}
                    >
                      {t.media.categories.publications}
                    </h2>
                  </div>
                  <p 
                    className="opacity-70 leading-relaxed"
                    style={{ fontFamily: 'var(--font-merriweather), serif' }}
                  >
                    {t.media.publicationsDescription}
                  </p>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="w-full h-full">
      {/* Animated content container */}
      <div 
        className={`w-full h-full ${transitionClass}`}
        style={{
          pointerEvents: isTransitioning ? 'none' : 'auto'
        }}
      >
        {renderCategoryContent()}
      </div>
    </div>
  );
}
