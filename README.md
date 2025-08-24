# Terteryan Website - Enhanced Version

An enhanced Next.js website dedicated to Armenian composer Mikhail Babkenovich Terteryan, featuring IP-based localization and comprehensive media sections.

## Features

### 🌍 IP-Based Localization
- Automatically detects visitor location using IP geolocation
- Russian version for Russia and post-Soviet countries
- English version for all other countries
- Manual language switcher for user preference override

### 🎵 Enhanced Media Section
The media section is now divided into four comprehensive categories:

1. **Music** - Audio recordings with integrated music player
2. **Video** - Performance recordings and interviews
3. **Photos** - Photo gallery with lightbox functionality
4. **Publications** - PDF documents, articles, and research materials

### 🎨 Design Features
- Responsive design that works on all devices
- Light and dark theme support
- Smooth page transitions
- Custom scrollbar and scroll redirection
- Blurred glass morphism effects
- Optimized performance with GPU acceleration

### 📱 Responsive Design
- Mobile-first approach
- Fluid typography using clamp() functions
- Adaptive layouts for different screen sizes
- Touch-friendly interactions

## Technical Implementation

### Localization System
- `/src/utils/localization.ts` - Core localization logic
- `/src/contexts/LocaleContext.tsx` - React context for language state
- `/app/api/geo/route.ts` - IP geolocation API endpoint
- Automatic detection with browser language fallback

### Media Components
- `/src/components/media/` - Individual category components
- Modular design for easy content management
- Consistent UI patterns across all categories

### Folder Structure
```
src/
├── components/
│   ├── media/          # Media category components
│   ├── PageLayout.tsx  # Main layout component
│   ├── MusicPlayer.tsx # Audio player component
│   └── LanguageSwitcher.tsx
├── contexts/
│   └── LocaleContext.tsx
├── data/
│   └── biographyContent.ts  # Localized biography content
└── utils/
    └── localization.ts      # Localization utilities

public/
├── photos/             # Photo gallery images
├── audio/              # Music files
├── documents/          # PDF publications
└── bg.png             # Background image
```

### Key Features Implementation

#### IP-Based Language Detection
```typescript
// Detects user country and sets appropriate language
const POST_SOVIET_COUNTRIES = ['RU', 'BY', 'KZ', 'KG', ...];

export async function detectLocale(): Promise<'ru' | 'en'> {
  // Uses Vercel geo headers and fallback services
  // Returns 'ru' for post-Soviet countries, 'en' for others
}
```

#### Responsive Media Categories
Each media category features:
- Responsive grid layouts
- Interactive hover effects
- Keyboard navigation support
- Loading states and error handling

#### Enhanced Music Player
- Custom-styled audio controls
- Playlist management
- Volume control with visual feedback
- Progress tracking with seek functionality
- Responsive design

## Content Management

### Adding Music Tracks
Edit `/src/components/media/MusicCategory.tsx`:
```typescript
const musicTracks = [
  {
    id: '1',
    title: 'Track Name',
    composer: 'M. B. Terteryan',
    duration: '4:32',
    src: '/audio/track.mp3'
  }
];
```

### Adding Photos
Place images in `/public/photos/` and update `/src/components/media/PhotoCategory.tsx`

### Adding Publications
Place PDF files in `/public/documents/` and update `/src/components/media/PublicationsCategory.tsx`

### Adding Translations
Update `/src/utils/localization.ts` with new translation keys

## Deployment

This website is optimized for Vercel deployment with:
- Automatic geo-location headers
- Edge function support for IP detection
- Static asset optimization
- Progressive image loading

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Fallback support for older browsers
- Progressive enhancement approach

## Performance Features

- GPU-accelerated animations
- Optimized image loading
- Code splitting for media components
- Minimal JavaScript bundle size
- CSS optimizations with clamp() functions

---

*This enhanced version maintains the original website's elegant design while adding modern features for better user experience and international accessibility.*
