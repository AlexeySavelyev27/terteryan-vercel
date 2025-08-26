// Utility functions for media processing and file handling

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSizeInBytes: number): boolean => {
  return file.size <= maxSizeInBytes;
};

// Image processing utilities
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

// Audio processing utilities
export const getAudioDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
      URL.revokeObjectURL(audio.src);
    };
    audio.onerror = reject;
    audio.src = URL.createObjectURL(file);
  });
};

// Video processing utilities
export const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.onloadedmetadata = () => {
      resolve(video.duration);
      URL.revokeObjectURL(video.src);
    };
    video.onerror = reject;
    video.src = URL.createObjectURL(file);
  });
};

export const getVideoThumbnail = (file: File, time: number = 1): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      video.currentTime = Math.min(time, video.duration * 0.1); // 10% of video duration or specified time
    };

    video.onseeked = () => {
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        resolve(thumbnail);
      } else {
        reject(new Error('Could not get canvas context'));
      }
      URL.revokeObjectURL(video.src);
    };

    video.onerror = reject;
    video.src = URL.createObjectURL(file);
  });
};

// File naming utilities
export const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
};

export const createUniqueFilename = (originalName: string, type: string): string => {
  const timestamp = Date.now();
  const id = generateUniqueId();
  const extension = getFileExtension(originalName);
  const sanitized = sanitizeFilename(originalName.replace(`.${extension}`, ''));
  
  return `${type}_${timestamp}_${sanitized}_${id}.${extension}`;
};

// Media type detection
export const getMediaType = (file: File): 'photo' | 'video' | 'audio' | 'document' | null => {
  const type = file.type.toLowerCase();
  
  if (type.startsWith('image/')) {
    return 'photo';
  } else if (type.startsWith('video/')) {
    return 'video';
  } else if (type.startsWith('audio/')) {
    return 'audio';
  } else if (type === 'application/pdf' || 
             type === 'application/msword' || 
             type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return 'document';
  }
  
  return null;
};

// URL utilities
export const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Metadata extraction utilities
export const extractMetadataFromFile = async (file: File): Promise<Record<string, any>> => {
  const metadata: Record<string, any> = {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: new Date(file.lastModified),
  };

  try {
    const mediaType = getMediaType(file);
    
    switch (mediaType) {
      case 'photo':
        const imageDimensions = await getImageDimensions(file);
        metadata.dimensions = imageDimensions;
        break;
      
      case 'video':
        const videoDuration = await getVideoDuration(file);
        metadata.duration = videoDuration;
        break;
      
      case 'audio':
        const audioDuration = await getAudioDuration(file);
        metadata.duration = audioDuration;
        break;
    }
  } catch (error) {
    console.warn('Could not extract metadata:', error);
  }

  return metadata;
};
