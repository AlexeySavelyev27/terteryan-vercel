import { NextRequest } from 'next/server';
import { UploadHandler, parseFormData, createResponse, createErrorResponse } from '../utils';

interface DocumentMetadata {
  title: string;
  author: string;
  type: string;
  year: number;
  language: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const { file, metadata } = await parseFormData(request);

    if (!file) {
      return createErrorResponse('No file provided', 400);
    }

    // Validate metadata
    const documentMetadata = metadata as DocumentMetadata;
    if (!documentMetadata.title || !documentMetadata.author || !documentMetadata.type || 
        !documentMetadata.year || !documentMetadata.language) {
      return createErrorResponse('Missing required metadata: title, author, type, year, language', 400);
    }

    // Upload file
    const uploadHandler = new UploadHandler('document');
    const result = await uploadHandler.saveFile(file, documentMetadata);

    if (!result.success) {
      return createErrorResponse(result.error || 'Upload failed', 400);
    }

    // TODO: Generate document preview (first page thumbnail)
    // This would include extracting the first page as an image
    // const previewUrl = await uploadHandler.generatePreview(filePath, result.data!.id);

    // Return success response with document data
    return createResponse({
      success: true,
      data: {
        ...result.data,
        // previewUrl: `/documents/previews/${result.data!.id}_preview.jpg`,
        // pages: extractedPageCount,
        metadata: documentMetadata,
      },
    });
  } catch (error) {
    console.error('Document upload error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

export async function OPTIONS() {
  return createResponse({}, 200);
}
