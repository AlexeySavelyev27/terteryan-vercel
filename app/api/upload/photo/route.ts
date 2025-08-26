import { NextRequest } from 'next/server';
import { UploadHandler, parseFormData, createResponse, createErrorResponse } from '../utils';

interface PhotoMetadata {
  title: string;
  description: string;
  year: number;
  location?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const { file, metadata } = await parseFormData(request);

    if (!file) {
      return createErrorResponse('No file provided', 400);
    }

    // Validate metadata
    const photoMetadata = metadata as PhotoMetadata;
    if (!photoMetadata.title || !photoMetadata.description || !photoMetadata.year) {
      return createErrorResponse('Missing required metadata: title, description, year', 400);
    }

    // Upload file
    const uploadHandler = new UploadHandler('photo');
    const result = await uploadHandler.saveFile(file, photoMetadata);

    if (!result.success) {
      return createErrorResponse(result.error || 'Upload failed', 400);
    }

    // TODO: Generate thumbnails and previews
    // This would include generating different sizes for the photo
    // const previewUrl = await uploadHandler.generatePreview(filePath, result.data!.id);

    // Return success response with photo data
    return createResponse({
      success: true,
      data: {
        ...result.data,
        // thumbnailUrl: `/photos/thumbnails/${result.data!.id}_thumb.jpg`,
        // mediumUrl: `/photos/medium/${result.data!.id}_medium.jpg`,
        // largeUrl: `/photos/large/${result.data!.id}_large.jpg`,
        metadata: photoMetadata,
      },
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

export async function OPTIONS() {
  return createResponse({}, 200);
}
