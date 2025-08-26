import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

// File type configurations
export const UPLOAD_CONFIGS = {
  photo: {
    maxSize: 20 * 1024 * 1024, // 20MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'],
    directory: 'photos',
  },
  video: {
    maxSize: 500 * 1024 * 1024, // 500MB
    allowedTypes: ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm'],
    directory: 'videos',
  },
  audio: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/flac', 'audio/aac'],
    directory: 'audio',
  },
  document: {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    directory: 'documents',
  },
};

export interface UploadResult {
  success: boolean;
  data?: {
    id: string;
    filename: string;
    originalName: string;
    url: string;
    size: number;
    type: string;
    metadata?: Record<string, any>;
  };
  error?: string;
}

export class UploadHandler {
  private type: keyof typeof UPLOAD_CONFIGS;
  private config: typeof UPLOAD_CONFIGS[keyof typeof UPLOAD_CONFIGS];

  constructor(type: keyof typeof UPLOAD_CONFIGS) {
    this.type = type;
    this.config = UPLOAD_CONFIGS[type];
  }

  async validateFile(file: File): Promise<{ valid: boolean; error?: string }> {
    // Check file size
    if (file.size > this.config.maxSize) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed size of ${this.config.maxSize / (1024 * 1024)}MB`,
      };
    }

    // Check file type
    if (!this.config.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${this.config.allowedTypes.join(', ')}`,
      };
    }

    return { valid: true };
  }

  async saveFile(file: File, metadata?: Record<string, any>): Promise<UploadResult> {
    try {
      // Validate file
      const validation = await this.validateFile(file);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Generate unique filename
      const id = randomUUID();
      const timestamp = Date.now();
      const extension = path.extname(file.name);
      const filename = `${this.type}_${timestamp}_${id}${extension}`;

      // Ensure upload directory exists
      const uploadDir = path.join(process.cwd(), 'public', this.config.directory, 'original');
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      // Save file
      const filePath = path.join(uploadDir, filename);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // Create response data
      const result: UploadResult = {
        success: true,
        data: {
          id,
          filename,
          originalName: file.name,
          url: `/${this.config.directory}/original/${filename}`,
          size: file.size,
          type: file.type,
          metadata,
        },
      };

      return result;
    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  async generatePreview(filePath: string, id: string): Promise<string | null> {
    // This will be implemented based on the file type
    // For now, return null - preview generation will be added separately
    return null;
  }
}

export async function parseFormData(request: NextRequest): Promise<{
  file: File | null;
  metadata: Record<string, any>;
}> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const metadataString = formData.get('metadata') as string;

    let metadata = {};
    if (metadataString) {
      try {
        metadata = JSON.parse(metadataString);
      } catch (e) {
        console.warn('Failed to parse metadata:', e);
      }
    }

    return { file, metadata };
  } catch (error) {
    console.error('Error parsing form data:', error);
    return { file: null, metadata: {} };
  }
}

// CORS headers for API responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export function createResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status, headers: corsHeaders });
}

export function createErrorResponse(message: string, status: number = 400) {
  return createResponse({ success: false, error: message }, status);
}
