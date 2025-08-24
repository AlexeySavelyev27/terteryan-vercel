// Comprehensive media data for both languages
export const mediaData = {
  ru: {
    music: {
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
        },
        {
          id: '4',
          title: 'Вариации на шотландскую тему',
          composer: 'М. Б. Тертерян',
          duration: '7:12',
          src: '/audio/variations.mp3'
        },
        {
          id: '5',
          title: 'Восточные эскизы',
          composer: 'М. Б. Тертерян',
          duration: '5:47',
          src: '/audio/eastern-sketches.mp3'
        },
        {
          id: '6',
          title: 'Прелюдия № 12',
          composer: 'М. Б. Тертерян',
          duration: '3:28',
          src: '/audio/prelude-12.mp3'
        }
      ],
      listTitle: 'Список произведений'
    },
    video: {
      items: [
        {
          id: '1',
          title: 'Концерт в Московской консерватории',
          description: 'Выступление с произведениями Скрябина и Рахманинова',
          duration: '45:32',
          thumbnail: '/placeholder.jpg',
          videoUrl: 'https://example.com/video1',
          year: '1985'
        },
        {
          id: '2',
          title: 'Интервью о творческом пути',
          description: 'Беседа с композитором о его музыкальной философии',
          duration: '18:45',
          thumbnail: '/placeholder.jpg',
          videoUrl: 'https://example.com/video2',
          year: '1992'
        },
        {
          id: '3',
          title: 'Мастер-класс по интерпретации',
          description: 'Работа со студентами музыкального колледжа',
          duration: '32:18',
          thumbnail: '/placeholder.jpg',
          videoUrl: 'https://example.com/video3',
          year: '1998'
        },
        {
          id: '4',
          title: 'Премьера Симфонии № 1',
          description: 'Первое исполнение симфонии в Москве',
          duration: '28:54',
          thumbnail: '/placeholder.jpg',
          videoUrl: 'https://example.com/video4',
          year: '1976'
        }
      ],
      watchVideo: 'Смотреть видео',
      sourceNote: 'Видеоматериалы предоставлены из архивов Московского музыкального колледжа и частных коллекций.'
    },
    photos: {
      items: [
        {
          id: '1',
          src: '/photos/1.jpg',
          title: 'В музыкальном колледже',
          description: 'Михаил Бабкенович за роялем в аудитории колледжа',
          year: '1985'
        },
        {
          id: '2',
          src: '/placeholder.jpg',
          title: 'Семейный портрет',
          description: 'С супругой Татьяной Борисовной',
          year: '1972'
        },
        {
          id: '3', 
          src: '/placeholder.jpg',
          title: 'Концерт в консерватории',
          description: 'Выступление с произведениями Скрябина',
          year: '1983'
        },
        {
          id: '4',
          src: '/placeholder.jpg',
          title: 'С учениками',
          description: 'После мастер-класса в колледже',
          year: '1995'
        },
        {
          id: '5',
          src: '/placeholder.jpg',
          title: 'В рабочем кабинете',
          description: 'За работой над новым произведением',
          year: '1990'
        },
        {
          id: '6',
          src: '/placeholder.jpg',
          title: 'Юность в Баку',
          description: 'Студенческие годы',
          year: '1950'
        },
        {
          id: '7',
          src: '/placeholder.jpg',
          title: 'Концерт в филармонии',
          description: 'Выступление в Калининской филармонии',
          year: '1960'
        },
        {
          id: '8',
          src: '/placeholder.jpg',
          title: 'Семейное торжество',
          description: 'Празднование юбилея',
          year: '2001'
        }
      ],
      sourceNote: 'Фотографии из семейного архива и коллекции Московского музыкального колледжа.'
    },
    publications: {
      items: [
        {
          id: '1',
          title: 'Интервью с композитором М. Б. Тертеряном',
          description: 'Подробная беседа о творческом пути и музыкальной философии композитора',
          type: 'Интервью',
          author: 'Музыкальная жизнь',
          year: '1985',
          pages: 8,
          size: '2.3 MB',
          fileUrl: '/documents/interview-1985.pdf',
          language: 'Русский'
        },
        {
          id: '2',
          title: 'Педагогические принципы М. Б. Тертеряна',
          description: 'Статья о методике преподавания и воспитания музыкантов',
          type: 'Статья',
          author: 'Консерватория',
          year: '1992',
          pages: 12,
          size: '3.1 MB',
          fileUrl: '/documents/pedagogy-1992.pdf',
          language: 'Русский'
        },
        {
          id: '3',
          title: 'Анализ фортепианного творчества',
          description: 'Музыковедческий анализ фортепианных произведений композитора',
          type: 'Исследование',
          author: 'Т. Б. Тертерян',
          year: '2010',
          pages: 24,
          size: '4.7 MB',
          fileUrl: '/documents/piano-analysis-2010.pdf',
          language: 'Русский'
        },
        {
          id: '4',
          title: 'Каталог произведений М. Б. Тертеряна',
          description: 'Полный каталог сочинений композитора с описаниями и датами создания',
          type: 'Каталог',
          author: 'Архив композитора',
          year: '2009',
          pages: 32,
          size: '5.2 MB',
          fileUrl: '/documents/catalog-2009.pdf',
          language: 'Русский'
        },
        {
          id: '5',
          title: 'Воспоминания учеников',
          description: 'Сборник воспоминаний и отзывов учеников о педагоге и композиторе',
          type: 'Сборник',
          author: 'Музыкальный колледж',
          year: '2008',
          pages: 48,
          size: '6.8 MB',
          fileUrl: '/documents/memories-2008.pdf',
          language: 'Русский'
        }
      ],
      downloadPdf: 'Скачать PDF',
      pages: 'стр.',
      sourceNote: 'Все материалы предоставлены с разрешения правообладателей. Для использования в научных целях обращайтесь к администрации сайта.'
    }
  },
  en: {
    music: {
      tracks: [
        {
          id: '1',
          title: 'Symphony No. 1',
          composer: 'M. B. Terteryan',
          duration: '4:32',
          src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/files-blob/public/audio/symphony1-lAWpgeCJ0M1P4pTHwv2fRPTuxFvwe0.mp3'
        },
        {
          id: '2', 
          title: 'String Quartet No. 2',
          composer: 'M. B. Terteryan',
          duration: '6:18',
          src: '/audio/quartet2.mp3'
        },
        {
          id: '3',
          title: 'Piano Concerto',
          composer: 'M. B. Terteryan', 
          duration: '8:45',
          src: '/audio/piano-concerto.mp3'
        },
        {
          id: '4',
          title: 'Variations on a Scottish Theme',
          composer: 'M. B. Terteryan',
          duration: '7:12',
          src: '/audio/variations.mp3'
        },
        {
          id: '5',
          title: 'Eastern Sketches',
          composer: 'M. B. Terteryan',
          duration: '5:47',
          src: '/audio/eastern-sketches.mp3'
        },
        {
          id: '6',
          title: 'Prelude No. 12',
          composer: 'M. B. Terteryan',
          duration: '3:28',
          src: '/audio/prelude-12.mp3'
        }
      ],
      listTitle: 'List of Works'
    },
    video: {
      items: [
        {
          id: '1',
          title: 'Concert at Moscow Conservatory',
          description: 'Performance featuring works by Scriabin and Rachmaninoff',
          duration: '45:32',
          thumbnail: '/placeholder.jpg',
          videoUrl: 'https://example.com/video1',
          year: '1985'
        },
        {
          id: '2',
          title: 'Interview about Creative Journey',
          description: 'Conversation with the composer about his musical philosophy',
          duration: '18:45',
          thumbnail: '/placeholder.jpg',
          videoUrl: 'https://example.com/video2',
          year: '1992'
        },
        {
          id: '3',
          title: 'Interpretation Masterclass',
          description: 'Working with students at the music college',
          duration: '32:18',
          thumbnail: '/placeholder.jpg',
          videoUrl: 'https://example.com/video3',
          year: '1998'
        },
        {
          id: '4',
          title: 'Premiere of Symphony No. 1',
          description: 'First performance of the symphony in Moscow',
          duration: '28:54',
          thumbnail: '/placeholder.jpg',
          videoUrl: 'https://example.com/video4',
          year: '1976'
        }
      ],
      watchVideo: 'Watch Video',
      sourceNote: 'Video materials provided from the archives of Moscow Music College and private collections.'
    },
    photos: {
      items: [
        {
          id: '1',
          src: '/photos/1.jpg',
          title: 'At the Music College',
          description: 'Mikhail Babkenovich at the piano in a college auditorium',
          year: '1985'
        },
        {
          id: '2',
          src: '/placeholder.jpg',
          title: 'Family Portrait',
          description: 'With his wife Tatyana Borisovna',
          year: '1972'
        },
        {
          id: '3', 
          src: '/placeholder.jpg',
          title: 'Concert at the Conservatory',
          description: 'Performance featuring works by Scriabin',
          year: '1983'
        },
        {
          id: '4',
          src: '/placeholder.jpg',
          title: 'With Students',
          description: 'After a masterclass at the college',
          year: '1995'
        },
        {
          id: '5',
          src: '/placeholder.jpg',
          title: 'In the Study',
          description: 'Working on a new composition',
          year: '1990'
        },
        {
          id: '6',
          src: '/placeholder.jpg',
          title: 'Youth in Baku',
          description: 'Student years',
          year: '1950'
        },
        {
          id: '7',
          src: '/placeholder.jpg',
          title: 'Philharmonic Concert',
          description: 'Performance at Kalinin Philharmonic',
          year: '1960'
        },
        {
          id: '8',
          src: '/placeholder.jpg',
          title: 'Family Celebration',
          description: 'Anniversary celebration',
          year: '2001'
        }
      ],
      sourceNote: 'Photographs from family archives and the Moscow Music College collection.'
    },
    publications: {
      items: [
        {
          id: '1',
          title: 'Interview with Composer M. B. Terteryan',
          description: 'Detailed conversation about the creative path and musical philosophy of the composer',
          type: 'Interview',
          author: 'Musical Life',
          year: '1985',
          pages: 8,
          size: '2.3 MB',
          fileUrl: '/documents/interview-1985.pdf',
          language: 'Russian'
        },
        {
          id: '2',
          title: 'Pedagogical Principles of M. B. Terteryan',
          description: 'Article about teaching methodology and musician education',
          type: 'Article',
          author: 'Conservatory',
          year: '1992',
          pages: 12,
          size: '3.1 MB',
          fileUrl: '/documents/pedagogy-1992.pdf',
          language: 'Russian'
        },
        {
          id: '3',
          title: 'Analysis of Piano Works',
          description: 'Musicological analysis of the composer\'s piano compositions',
          type: 'Research',
          author: 'T. B. Terteryan',
          year: '2010',
          pages: 24,
          size: '4.7 MB',
          fileUrl: '/documents/piano-analysis-2010.pdf',
          language: 'Russian'
        },
        {
          id: '4',
          title: 'Armenians in Moscow Musical Life',
          description: 'Article about Armenian musicians\' contribution to Moscow musical culture',
          type: 'Article',
          author: 'Moscow Conservatory',
          year: '1995',
          pages: 16,
          size: '2.8 MB',
          fileUrl: '/documents/armenians-moscow-1995.pdf',
          language: 'English'
        },
        {
          id: '5',
          title: 'Catalog of M. B. Terteryan\'s Works',
          description: 'Complete catalog of the composer\'s works with descriptions and creation dates',
          type: 'Catalog',
          author: 'Composer\'s Archive',
          year: '2009',
          pages: 32,
          size: '5.2 MB',
          fileUrl: '/documents/catalog-2009.pdf',
          language: 'Russian'
        },
        {
          id: '6',
          title: 'Student Memoirs',
          description: 'Collection of memories and testimonials from students about the teacher and composer',
          type: 'Collection',
          author: 'Music College',
          year: '2008',
          pages: 48,
          size: '6.8 MB',
          fileUrl: '/documents/memories-2008.pdf',
          language: 'Russian'
        }
      ],
      downloadPdf: 'Download PDF',
      pages: 'pages',
      sourceNote: 'All materials are provided with permission from copyright holders. For academic use, please contact the site administration.'
    }
  }
};
