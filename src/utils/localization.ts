// IP-based localization utility
export interface Translation {
  // Navigation
  nav: {
    main: string;
    biography: string;
    media: string;
    contact: string;
    settings: string;
    language: string;
  };
  
  // Main page
  main: {
    title1: string;
    title2: string;
    subtitle1: string;
    listenMusic: string;
    learnMore: string;
  };
  
  // Media page
  media: {
    title: string;
    subtitle: string;
    categories: {
      music: string;
      video: string;
      photo: string;
      publications: string;
    };
    musicDescription: string;
    videoDescription: string;
    photoDescription: string;
    publicationsDescription: string;
    backToCategories: string;
    nowPlaying: string;
    playingIndicator: string;
  };
  
  // Biography
  biography: {
    title: string;
  };
  
  // Contact
  contact: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    captcha: string;
    refresh: string;
    submit: string;
    sending: string;
    successTitle: string;
    successMessage: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    subjectPlaceholder: string;
    messagePlaceholder: string;
    captchaPlaceholder: string;
    invalidCaptcha: string;
  };
  
  // Theme
  theme: {
    light: string;
    dark: string;
  };
}

export const translations: Record<'ru' | 'en', Translation> = {
  ru: {
    nav: {
      main: "ГЛАВНАЯ",
      biography: "БИОГРАФИЯ", 
      media: "МЕДИА",
      contact: "ОБРАТНАЯ СВЯЗЬ",
      settings: "Настройки",
      language: "Язык"
    },
    main: {
	  title1: "МИХАИЛ БАБКЕНОВИЧ",
	  title2: "ТЕРТЕРЯН",
      subtitle1: "Советский пианист, педагог и композитор, более сорока лет преподававший в московском Музыкальном училище имени Октябрьской революции (с 1993 г.– Музыкальный колледж МГИМ имени А. Г. Шнитке). Его многогранныйталант проявился также в исполнительстве и сочинении.",
      listenMusic: "Слушать музыку",
      learnMore: "Узнать больше"
    },
    media: {
      title: "МЕДИА",
      subtitle: "Музыкальное наследие композитора",
      categories: {
        music: "Музыка",
        video: "Видео", 
        photo: "Фотографии",
        publications: "Публикации"
      },
      musicDescription: "Аудиозаписи произведений композитора",
      videoDescription: "Видеозаписи выступлений и интервью",
      photoDescription: "Фотографии из жизни и творчества",
      publicationsDescription: "Статьи, интервью и материалы о композиторе",
      backToCategories: "← Вернуться к категориям",
      nowPlaying: "Сейчас играет",
      playingIndicator: "♪ Играет"
    },
    biography: {
      title: "БИОГРАФИЧЕСКИЕ СВЕДЕНИЯ"
    },
    contact: {
      title: "ОБРАТНАЯ СВЯЗЬ",
      subtitle: "Используйте форму ниже, если у Вас есть вопросы по творчеству композитора.",
      name: "Имя",
      email: "Email",
      subject: "Тема",
      message: "Сообщение",
      captcha: "Вопрос безопасности",
      refresh: "Обновить",
      submit: "Отправить сообщение",
      sending: "Отправка...",
      successTitle: "СООБЩЕНИЕ ОТПРАВЛЕНО",
      successMessage: "Спасибо за ваше сообщение. Мы свяжемся с вами в ближайшее время.",
      namePlaceholder: "Ваше имя",
      emailPlaceholder: "your@email.com",
      subjectPlaceholder: "Тема вашего сообщения",
      messagePlaceholder: "Поделитесь своими мыслями, вопросами или предложениями...",
      captchaPlaceholder: "?",
      invalidCaptcha: "Неверный ответ на вопрос безопасности. Пожалуйста, попробуйте снова."
    },
    theme: {
      light: "Светлая тема",
      dark: "Темная тема"
    }
  },
  en: {
    nav: {
      main: "HOME",
      biography: "BIOGRAPHY",
      media: "MEDIA", 
      contact: "CONTACT",
      settings: "Settings",
      language: "Language"
    },
    main: {
	  title1: "MIKHAIL BABKENOVICH",
	  title2: "TERTERYAN",
      subtitle1: "Soveit pianist, teacher and composer, who was teaching for more than 40 years at Moscow Musical College of October Revolution (since 1993 – Musical College named after A. G. Schnitke). His broad talent was also evident in performance and composing.",
      listenMusic: "Listen to Music",
      learnMore: "Learn More"
    },
    media: {
      title: "MEDIA",
      subtitle: "Musical heritage of the composer",
      categories: {
        music: "Music",
        video: "Video",
        photo: "Photos", 
        publications: "Publications"
      },
      musicDescription: "Audio recordings of the composer's works",
      videoDescription: "Video recordings of performances and interviews",
      photoDescription: "Photographs from life and creative work",
      publicationsDescription: "Articles, interviews and materials about the composer",
      backToCategories: "← Back to Categories",
      nowPlaying: "Now Playing",
      playingIndicator: "♪ Playing"
    },
    biography: {
      title: "BIOGRAPHICAL INFORMATION"
    },
    contact: {
      title: "CONTACT",
      subtitle: "Use the form below if you have any questions about the composer's work.",
      name: "Name",
      email: "Email",
      subject: "Subject",
      message: "Message",
      captcha: "Security Question",
      refresh: "Refresh",
      submit: "Send Message",
      sending: "Sending...",
      successTitle: "MESSAGE SENT", 
      successMessage: "Thank you for your message. We will contact you soon.",
      namePlaceholder: "Your name",
      emailPlaceholder: "your@email.com",
      subjectPlaceholder: "Subject of your message",
      messagePlaceholder: "Share your thoughts, questions or suggestions...",
      captchaPlaceholder: "?",
      invalidCaptcha: "Incorrect answer to security question. Please try again."
    },
    theme: {
      light: "Light Theme",
      dark: "Dark Theme"
    }
  }
};

// Post-Soviet countries that should use Russian
const POST_SOVIET_COUNTRIES = [
  'RU', 'BY', 'KZ', 'KG', 'TJ', 'TM', 'UZ', 'AM', 'AZ', 'GE', 'MD', 'UA'
];

export async function detectLocale(): Promise<'ru' | 'en'> {
  // First, quickly check browser locale for immediate response
  let quickDetection: 'ru' | 'en' = 'en';
  
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.substring(0, 2).toLowerCase();
    if (browserLang === 'ru') {
      quickDetection = 'ru';
    }
  }
  
  try {
    // Try to get user's IP and country with a short timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000); // 1 second timeout
    
    const response = await fetch('/api/geo', { 
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      const countryCode = data.country;
      
      // Check if country is Russia or post-Soviet
      if (POST_SOVIET_COUNTRIES.includes(countryCode)) {
        return 'ru';
      }
      return 'en';
    }
  } catch (error) {
    // API failed or timed out, use browser detection
    console.log('Geo detection failed, using browser locale:', quickDetection);
  }
  
  // Return the quick browser-based detection
  return quickDetection;
}

export function useTranslation(locale: 'ru' | 'en') {
  return translations[locale];
}
