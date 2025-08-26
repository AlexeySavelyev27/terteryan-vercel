import { useEffect, useState } from 'react';
import { useImagePreloader } from '../hooks/useImagePreloader';
import { useLocale } from '../contexts/LocaleContext';

interface ImagePreloaderProps {
  onComplete?: () => void;
  showProgress?: boolean;
}

export default function ImagePreloader({ onComplete, showProgress = true }: ImagePreloaderProps) {
  const { progress, preloadImages } = useImagePreloader();
  const { locale } = useLocale();
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (hasStarted) return;

    const startPreloading = async () => {
      setHasStarted(true);
      
      try {
        // Load photo thumbnails from API
        const response = await fetch(`/api/media?type=photos&locale=${locale}`);
        if (response.ok) {
          const result = await response.json();
          const photos = result.data?.items || [];
          
          // Extract thumbnail URLs - simplified version without caching check
          const allThumbnailUrls = photos
            .map((photo: any) => photo.thumbnailUrl || photo.mediumUrl || photo.src)
            .filter((url: string) => url && (url.startsWith('/') || url.startsWith('http'))) // Only valid URLs
          
          console.log(`Starting preload of ${allThumbnailUrls.length} photo thumbnails...`)
          
          if (allThumbnailUrls.length > 0) {
            await preloadImages(allThumbnailUrls)
            console.log('Photo preloading completed!')
          } else {
            console.log('No photos found to preload!')
          }
        }
      } catch (error) {
        console.error('Error preloading images:', error);
      }
      
      // Call completion callback
      if (onComplete) {
        onComplete();
      }
    };

    // Start preloading after a short delay to let the page load first
    const timer = setTimeout(() => {
      startPreloading();
    }, 1000);

    return () => clearTimeout(timer);
  }, [hasStarted, locale, preloadImages, onComplete]);

  // Don't show progress if disabled or not started
  if (!showProgress || !hasStarted || progress.total === 0) {
    return null;
  }

  // Don't show if already complete (avoid flash)
  if (progress.isComplete) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          {/* Loading icon */}
          <div className="flex-shrink-0">
            <svg
              className="animate-spin h-5 w-5 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          
          {/* Progress info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {locale === 'ru' ? 'Загрузка фотографий' : 'Loading photos'}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              {/* Progress bar */}
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
              {/* Progress text */}
              <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                {progress.loaded}/{progress.total}
              </span>
            </div>
          </div>
        </div>
        
        {/* Error count if any */}
        {progress.failed > 0 && (
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
            {progress.failed} {locale === 'ru' ? 'не загружены' : 'failed to load'}
          </p>
        )}
      </div>
    </div>
  );
}
