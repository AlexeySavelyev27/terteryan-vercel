'use client';

import { mediaContent } from '@/content/media';
import MusicPlayer from '@/components/MusicPlayer';

export default function Media() {
  const { title, subtitle, tracks } = mediaContent;
  
  return (
    <div className="w-full h-full">
      {/* Title */}
      <h1 
        className="text-4xl font-bold mb-2 text-center"
        style={{ fontFamily: 'var(--font-vollkorn), serif' }}
      >
        {title}
      </h1>
      
      {/* Subtitle */}
      <p 
        className="text-lg opacity-80 text-center mb-8"
        style={{ fontFamily: 'var(--font-merriweather), serif' }}
      >
        {subtitle}
      </p>
      
      {/* Music Player */}
      <div style={{ marginTop: '2rem' }}>
        <MusicPlayer tracks={tracks} />
      </div>
    </div>
  );
}
