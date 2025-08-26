import { NextRequest } from 'next/server';
import { UploadHandler, parseFormData, createResponse, createErrorResponse } from '../utils';

interface AudioMetadata {
  title: string;
  composer: string;
  year: number;
  album?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const { file, metadata } = await parseFormData(request);

    if (!file) {
      return createErrorResponse('No file provided', 400);
    }

    // Validate metadata
    const audioMetadata = metadata as AudioMetadata;
    if (!audioMetadata.title || !audioMetadata.composer || !audioMetadata.year) {
      return createErrorResponse('Missing required metadata: title, composer, year', 400);
    }

    // Upload file
    const uploadHandler = new UploadHandler('audio');
    const result = await uploadHandler.saveFile(file, audioMetadata);

    if (!result.success) {
      return createErrorResponse(result.error || 'Upload failed', 400);
    }

    // TODO: Generate audio waveform and extract duration
    // This would include generating waveform visualization
    // const audioData = await uploadHandler.generatePreview(filePath, result.data!.id);

    // Return success response with audio data
    return createResponse({
      success: true,
      data: {
        ...result.data,
        // duration: extractedDuration,
        // waveformUrl: `/audio/waveforms/${result.data!.id}_waveform.png`,
        metadata: audioMetadata,
      },
    });
  } catch (error) {
    console.error('Audio upload error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

export async function OPTIONS() {
  return createResponse({}, 200);
}
