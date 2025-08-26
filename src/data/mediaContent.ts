// Simple media data interfaces to avoid import issues
export interface SimpleMediaItem {
  id: string;
  title: string;
  titleEn?: string;
  year: string | number;
}

export interface AudioTrack extends SimpleMediaItem {
  composer: string;
  composerEn?: string;
  duration: string;
  src: string;
  description?: string;
  descriptionEn?: string;
  album?: string;
  albumEn?: string;
  genre?: string;
}

export interface VideoItem extends SimpleMediaItem {
  description: string;
  descriptionEn?: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  location?: string;
  locationEn?: string;
  performers?: string;
  performersEn?: string;
}

export interface PhotoItem extends SimpleMediaItem {
  src: string;
  description: string;
  descriptionEn?: string;
  location?: string;
  locationEn?: string;
  photographer?: string;
  event?: string;
  eventEn?: string;
  thumbnailUrl?: string;
  mediumUrl?: string;
  largeUrl?: string;
}

export interface PublicationItem extends SimpleMediaItem {
  description: string;
  descriptionEn?: string;
  type: string;
  typeEn?: string;
  author: string;
  authorEn?: string;
  pages: number;
  size: string;
  fileUrl: string;
  language: string;
  previewUrl?: string;
  isbn?: string;
  publisher?: string;
  publisherEn?: string;
}

export interface MediaData {
  ru: {
    music: {
      tracks: AudioTrack[];
      listTitle: string;
    };
    video: {
      items: VideoItem[];
      watchVideo: string;
      sourceNote: string;
    };
    photos: {
      items: PhotoItem[];
      sourceNote: string;
    };
    publications: {
      items: PublicationItem[];
      downloadPdf: string;
      pages: string;
      sourceNote: string;
    };
  };
  en: {
    music: {
      tracks: AudioTrack[];
      listTitle: string;
    };
    video: {
      items: VideoItem[];
      watchVideo: string;
      sourceNote: string;
    };
    photos: {
      items: PhotoItem[];
      sourceNote: string;
    };
    publications: {
      items: PublicationItem[];
      downloadPdf: string;
      pages: string;
      sourceNote: string;
    };
  };
}

// Default data structure
export const defaultMediaData: MediaData = {
  ru: {
    music: {
      tracks: [
        {
          id: "1",
          title: "Симфония № 1",
          titleEn: "Symphony No. 1",
          composer: "М. Б. Тертерян",
          composerEn: "M. B. Terteryan",
          duration: "4:32",
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/files-blob/public/audio/symphony1-lAWpgeCJ0M1P4pTHwv2fRPTuxFvwe0.mp3",
          year: 1976,
          description: "Первая симфония композитора",
          descriptionEn: "The composer's first symphony"
        }
      ],
      listTitle: "Список произведений"
    },
    video: {
      items: [],
      watchVideo: "Смотреть видео",
      sourceNote: "Видеоматериалы предоставлены из архивов."
    },
    photos: {
      items: [
        {
          id: "1",
          src: "/photos/1.jpg",
          title: "В музыкальном колледже",
          titleEn: "At the Music College",
          description: "Михаил Бабкенович за роялем в аудитории колледжа",
          descriptionEn: "Mikhail Babkenovich at the piano in a college auditorium",
          year: "1985",
          location: "Московский музыкальный колледж",
          locationEn: "Moscow Music College"
        }
      ],
      sourceNote: "Фотографии из семейного архива и коллекции Московского музыкального колледжа."
    },
    publications: {
      items: [],
      downloadPdf: "Скачать PDF",
      pages: "стр.",
      sourceNote: "Все материалы предоставлены с разрешения правообладателей."
    }
  },
  en: {
    music: {
      tracks: [
        {
          id: "1",
          title: "Symphony No. 1",
          titleEn: "Symphony No. 1",
          composer: "M. B. Terteryan",
          composerEn: "M. B. Terteryan",
          duration: "4:32",
          src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/files-blob/public/audio/symphony1-lAWpgeCJ0M1P4pTHwv2fRPTuxFvwe0.mp3",
          year: 1976,
          description: "The composer's first symphony",
          descriptionEn: "The composer's first symphony"
        }
      ],
      listTitle: "List of Works"
    },
    video: {
      items: [],
      watchVideo: "Watch Video",
      sourceNote: "Video materials provided from archives."
    },
    photos: {
      items: [
        {
          id: "1",
          src: "/photos/1.jpg",
          title: "At the Music College",
          titleEn: "At the Music College", 
          description: "Mikhail Babkenovich at the piano in a college auditorium",
          descriptionEn: "Mikhail Babkenovich at the piano in a college auditorium",
          year: "1985",
          location: "Moscow Music College",
          locationEn: "Moscow Music College"
        }
      ],
      sourceNote: "Photographs from family archives and the Moscow Music College collection."
    },
    publications: {
      items: [],
      downloadPdf: "Download PDF",
      pages: "pages",
      sourceNote: "All materials are provided with permission from copyright holders."
    }
  }
};

// Export current media data - starts with defaults, will be loaded dynamically
export const mediaData: MediaData = defaultMediaData;
