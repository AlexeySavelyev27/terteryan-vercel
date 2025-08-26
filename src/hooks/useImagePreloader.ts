import { useState, useEffect, useCallback } from 'react';

interface PreloadProgress {
  total: number;
  loaded: number;
  failed: number;
  progress: number; // 0-100
  isComplete: boolean;
  isLoading: boolean;
}

interface PreloadedImage {
  url: string;
  loaded: boolean;
  error?: boolean;
}

export function useImagePreloader() {
  const [progress, setProgress] = useState<PreloadProgress>({
    total: 0,
    loaded: 0,
    failed: 0,
    progress: 0,
    isComplete: false,
    isLoading: false
  });

  const [preloadedImages, setPreloadedImages] = useState<Map<string, PreloadedImage>>(new Map());

  // Preload a single image
  const preloadImage = useCallback((url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // Skip if already loaded
      if (preloadedImages.get(url)?.loaded) {
        resolve(true);
        return;
      }

      const img = new Image();
      
      img.onload = () => {
        setPreloadedImages(prev => new Map(prev).set(url, { url, loaded: true }));
        resolve(true);
      };
      
      img.onerror = () => {
        setPreloadedImages(prev => new Map(prev).set(url, { url, loaded: false, error: true }));
        resolve(false);
      };
      
      // Start loading
      img.src = url;
    });
  }, [preloadedImages]);

  // Preload multiple images with progress tracking
  const preloadImages = useCallback(async (urls: string[]) => {
    if (urls.length === 0) return;

    setProgress(prev => ({
      ...prev,
      total: urls.length,
      loaded: 0,
      failed: 0,
      progress: 0,
      isComplete: false,
      isLoading: true
    }));

    let loaded = 0;
    let failed = 0;

    // Load images in batches to avoid overwhelming the browser
    const BATCH_SIZE = 3;
    const batches: string[][] = [];
    
    for (let i = 0; i < urls.length; i += BATCH_SIZE) {
      batches.push(urls.slice(i, i + BATCH_SIZE));
    }

    for (const batch of batches) {
      const promises = batch.map(async (url) => {
        const success = await preloadImage(url);
        if (success) {
          loaded++;
        } else {
          failed++;
        }
        
        // Update progress after each image
        setProgress(prev => {
          const newProgress = Math.round((loaded + failed) / urls.length * 100);
          return {
            ...prev,
            loaded,
            failed,
            progress: newProgress,
            isComplete: loaded + failed === urls.length,
            isLoading: loaded + failed < urls.length
          };
        });
      });

      // Wait for current batch to complete before starting next
      await Promise.all(promises);
      
      // Small delay between batches to prevent browser freeze
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    // Final update
    setProgress(prev => ({
      ...prev,
      isComplete: true,
      isLoading: false
    }));
  }, [preloadImage]);

  // Check if image is preloaded
  const isImagePreloaded = useCallback((url: string) => {
    return preloadedImages.get(url)?.loaded || false;
  }, [preloadedImages]);

  // Get preload status for specific image
  const getImageStatus = useCallback((url: string) => {
    return preloadedImages.get(url) || { url, loaded: false };
  }, [preloadedImages]);

  return {
    progress,
    preloadImages,
    preloadImage,
    isImagePreloaded,
    getImageStatus,
    preloadedImages
  };
}
