import { useState, useCallback } from 'react';

export interface ImageSrc {
  thumbnail?: string;
  medium?: string;
  large?: string;
  original: string;
}

export const useImageOptimization = () => {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const getOptimizedSrc = useCallback((src: string): ImageSrc => {
    // Extract filename from path like "/photos/original/photo_123_id.jpg"
    const originalMatch = src.match(/\/photos\/original\/(.+)$/);
    if (!originalMatch) {
      return { original: src };
    }

    const filename = originalMatch[1];
    return {
      thumbnail: `/photos/thumbnails/${filename}`,
      medium: `/photos/medium/${filename}`,
      large: `/photos/large/${filename}`,
      original: src
    };
  }, []);

  const getBestAvailableSrc = useCallback((imageSrc: ImageSrc, preferredSize: 'thumbnail' | 'medium' | 'large' | 'original' = 'thumbnail'): string => {
    // For gallery view, we prefer smaller sizes for better performance
    // For full view, we prefer larger sizes for better quality
    
    if (preferredSize === 'thumbnail') {
      // Try thumbnail first, then fall back to original if thumbnails don't exist
      if (!failedImages.has(imageSrc.thumbnail || '') && imageSrc.thumbnail) {
        return imageSrc.thumbnail;
      }
      // Skip medium and large for thumbnails, go straight to original
      return imageSrc.original;
    }
    
    if (preferredSize === 'medium') {
      if (!failedImages.has(imageSrc.medium || '') && imageSrc.medium) {
        return imageSrc.medium;
      }
      if (!failedImages.has(imageSrc.large || '') && imageSrc.large) {
        return imageSrc.large;
      }
      return imageSrc.original;
    }
    
    if (preferredSize === 'large') {
      if (!failedImages.has(imageSrc.large || '') && imageSrc.large) {
        return imageSrc.large;
      }
      return imageSrc.original;
    }
    
    return imageSrc.original;
  }, [failedImages]);

  const handleImageError = useCallback((src: string, fallbackSrc?: string) => {
    setFailedImages(prev => new Set(prev).add(src));
    return fallbackSrc || '/placeholder.jpg';
  }, []);

  const isImageFailed = useCallback((src: string) => {
    return failedImages.has(src);
  }, [failedImages]);

  return {
    getOptimizedSrc,
    getBestAvailableSrc,
    handleImageError,
    isImageFailed
  };
};
