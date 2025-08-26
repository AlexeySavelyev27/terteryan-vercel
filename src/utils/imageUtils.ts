// Utility functions for image optimization and preloading

/**
 * Generate responsive image URLs for different sizes
 * This would typically be used with an image optimization service
 */
export function generateImageSizes(originalUrl: string) {
  const baseUrl = originalUrl.replace(/\.[^/.]+$/, '') // Remove extension
  const extension = originalUrl.match(/\.[^/.]+$/)?.[0] || '.jpg'
  
  return {
    thumbnail: `${baseUrl}_thumb${extension}`, // 150x150
    medium: `${baseUrl}_medium${extension}`,   // 400-600px wide
    large: `${baseUrl}_large${extension}`,     // 1200px+ wide
    original: originalUrl
  }
}

/**
 * Calculate optimal image size based on container and device
 */
export function getOptimalImageSize(
  containerWidth: number, 
  devicePixelRatio: number = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1
) {
  const targetWidth = containerWidth * devicePixelRatio
  
  if (targetWidth <= 200) return 'thumbnail'
  if (targetWidth <= 600) return 'medium' 
  if (targetWidth <= 1200) return 'large'
  return 'original'
}

/**
 * Check if image is cached in browser - SSR safe
 */
export function isImageCached(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Check if running on client side
    if (typeof window === 'undefined' || typeof Image === 'undefined') {
      resolve(false) // Assume not cached on server side
      return
    }
    
    const img = new Image()
    
    // If image loads immediately, it's likely cached
    const timeout = setTimeout(() => {
      resolve(false) // Assume not cached if takes too long
    }, 100)
    
    img.onload = () => {
      clearTimeout(timeout)
      resolve(img.complete && img.naturalWidth > 0)
    }
    
    img.onerror = () => {
      clearTimeout(timeout)
      resolve(false)
    }
    
    img.src = url
  })
}

/**
 * Preload image with progress tracking
 */
export function preloadImageWithProgress(
  url: string, 
  onProgress?: (progress: number) => void
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || typeof Image === 'undefined') {
      reject(new Error('Image loading not supported in server environment'))
      return
    }
    
    const img = new Image()
    
    img.onload = () => {
      onProgress?.(100)
      resolve(img)
    }
    
    img.onerror = (error) => {
      reject(new Error(`Failed to load image: ${url}`))
    }
    
    // Simulate progress for very large images
    if (onProgress) {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 20
        if (progress >= 90) {
          clearInterval(interval)
        } else {
          onProgress(Math.min(progress, 90))
        }
      }, 100)
      
      img.onload = () => {
        clearInterval(interval)
        onProgress(100)
        resolve(img)
      }
    }
    
    img.src = url
  })
}

/**
 * Batch preload multiple images with concurrency control
 */
export async function batchPreloadImages(
  urls: string[],
  concurrency: number = 3,
  onProgress?: (completed: number, total: number) => void
): Promise<(HTMLImageElement | Error)[]> {
  if (typeof window === 'undefined') {
    return urls.map(() => new Error('Image loading not supported in server environment'))
  }
  
  const results: (HTMLImageElement | Error)[] = []
  let completed = 0
  
  const executeTask = async (url: string, index: number): Promise<void> => {
    try {
      const img = await preloadImageWithProgress(url)
      results[index] = img
    } catch (error) {
      results[index] = error as Error
    } finally {
      completed++
      onProgress?.(completed, urls.length)
    }
  }
  
  // Create batches based on concurrency
  const batches: Promise<void>[][] = []
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls
      .slice(i, i + concurrency)
      .map((url, batchIndex) => executeTask(url, i + batchIndex))
    batches.push(batch)
  }
  
  // Execute batches sequentially
  for (const batch of batches) {
    await Promise.all(batch)
  }
  
  return results
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(baseUrl: string, sizes: number[] = [150, 400, 800, 1200]): string {
  return sizes
    .map(size => {
      const url = baseUrl.replace(/\.[^/.]+$/, `_${size}w$&`)
      return `${url} ${size}w`
    })
    .join(', ')
}

/**
 * Get appropriate image format based on browser support - SSR safe
 */
export function getSupportedImageFormat(): 'webp' | 'avif' | 'jpg' {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return 'jpg' // Default to JPG on server
  }
  
  // Check for AVIF support
  const avifCanvas = document.createElement('canvas')
  if (avifCanvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
    return 'avif'
  }
  
  // Check for WebP support
  const webpCanvas = document.createElement('canvas')
  if (webpCanvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
    return 'webp'
  }
  
  return 'jpg'
}

/**
 * Convert file size to human readable format
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
