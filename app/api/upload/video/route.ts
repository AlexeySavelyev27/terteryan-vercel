import { NextRequest } from 'next/server';
import { UploadHandler, parseFormData, createResponse, createErrorResponse } from '../utils';

interface VideoMetadata {
  title: string;
  description: string;
  year: number;
}

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const { file, metadata } = await parseFormData(request);

    if (!file) {
      return createErrorResponse('No file provided', 400);
    }

    // Validate metadata
    const videoMetadata = metadata as VideoMetadata;
    if (!videoMetadata.title || !videoMetadata.description || !videoMetadata.year) {
      return createErrorResponse('Missing required metadata: title, description, year', 400);
    }

    // Upload file
    const uploadHandler = new UploadHandler('video');
    const result = await uploadHandler.saveFile(file, videoMetadata);

    if (!result.success) {
      return createErrorResponse(result.error || 'Upload failed', 400);
    }

    // TODO: Generate video thumbnails and previews
    // This would include generating thumbnail at 10% and poster at 50% duration
    // const previewData = await uploadHandler.generatePreview(filePath, result.data!.id);

    // Return success response with video data
    return createResponse({
      success: true,
      data: {
        ...result.data,
        // thumbnailUrl: `/videos/thumbnails/${result.data!.id}_thumb.jpg`,
        // posterUrl: `/videos/posters/${result.data!.id}_poster.jpg`,
        // duration: extractedDuration,
        metadata: videoMetadata,
      },
    });
  } catch (error) {
    console.error('Video upload error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

export async function OPTIONS() {
  return createResponse({}, 200);
}
