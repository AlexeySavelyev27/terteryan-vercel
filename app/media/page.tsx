'use client';

import MusicPlayer from '../../src/components/MusicPlayer';

// Media content - inline to avoid import issues
const mediaContent = {
  title: "МЕДИА",
  subtitle: "Аудиозаписи произведений",
  tracks: [
    {
      id: '1',
      title: 'Симфония № 1',
      composer: 'М. Б. Тертерян',
      duration: '4:32',
      src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/files-blob/public/audio/symphony1-lAWpgeCJ0M1P4pTHwv2fRPTuxFvwe0.mp3'
    },
    {
      id: '2', 
      title: 'Струнный квартет № 2',
      composer: 'М. Б. Тертерян',
      duration: '6:18',
      src: '/audio/quartet2.mp3'
    },
    {
      id: '3',
      title: 'Концерт для фортепиано',
      composer: 'М. Б. Тертерян', 
      duration: '8:45',
      src: '/audio/piano-concerto.mp3'
    }
  ]
};

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
