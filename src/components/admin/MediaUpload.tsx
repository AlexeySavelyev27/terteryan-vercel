'use client';

import { useState, useRef } from 'react';
import { Upload, X, Check, AlertCircle, FileImage, FileVideo, FileAudio, FileText, Save } from 'lucide-react';
import { AudioTrack, VideoItem, PhotoItem, PublicationItem } from '../../data/mediaContent';

interface MediaUploadProps {
  type: 'photo' | 'video' | 'audio' | 'document';
}

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  metadata?: Record<string, any>;
}

const typeConfig = {
  photo: {
    icon: FileImage,
    accept: 'image/*',
    maxSize: '20MB',
    endpoint: '/api/upload/photo',
    apiType: 'photos',
  },
  video: {
    icon: FileVideo,
    accept: 'video/*',
    maxSize: '500MB',
    endpoint: '/api/upload/video',
    apiType: 'video',
  },
  audio: {
    icon: FileAudio,
    accept: 'audio/*',
    maxSize: '50MB',
    endpoint: '/api/upload/audio',
    apiType: 'music',
  },
  document: {
    icon: FileText,
    accept: '.pdf,.doc,.docx',
    maxSize: '100MB',
    endpoint: '/api/upload/document',
    apiType: 'publications',
  },
};

export default function MediaUpload({ type }: MediaUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const config = typeConfig[type];
  const Icon = config.icon;

  const generateId = () => Math.random().toString(36).substring(2, 15);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadFile[] = Array.from(files).map(file => ({
      id: generateId(),
      file,
      progress: 0,
      status: 'pending',
    }));

    setUploadFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(file => file.id !== id));
  };

  const updateMetadata = (id: string, field: string, value: any, locale: 'ru' | 'en' = 'ru') => {
    setUploadFiles(prev =>
      prev.map(file => {
        if (file.id === id) {
          const updatedMetadata = { ...file.metadata };
          if (locale === 'en') {
            updatedMetadata[`${field}En`] = value;
          } else {
            updatedMetadata[field] = value;
          }
          return { ...file, metadata: updatedMetadata };
        }
        return file;
      })
    );
  };

  const handleFileUpload = async (fileItem: UploadFile) => {
    if (!fileItem.metadata) {
      setUploadFiles(prev =>
        prev.map(file =>
          file.id === fileItem.id
            ? { ...file, status: 'error', error: 'Please fill in all required fields' }
            : file
        )
      );
      return;
    }

    // Update status to uploading
    setUploadFiles(prev =>
      prev.map(file =>
        file.id === fileItem.id
          ? { ...file, status: 'uploading', progress: 0 }
          : file
      )
    );

    try {
      // First upload the file
      const formData = new FormData();
      formData.append('file', fileItem.file);
      formData.append('metadata', JSON.stringify(fileItem.metadata));

      const uploadResponse = await fetch(config.endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const uploadResult = await uploadResponse.json();

      // Then save metadata to media data
      const mediaItem = {
        id: uploadResult.data.id,
        ...fileItem.metadata,
        src: uploadResult.data.url,
        fileUrl: uploadResult.data.url,
      };

      // Add to both Russian and English versions
      for (const locale of ['ru', 'en']) {
        await fetch('/api/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: config.apiType,
            locale,
            item: mediaItem,
          }),
        });
      }

      // Update status to success
      setUploadFiles(prev =>
        prev.map(file =>
          file.id === fileItem.id
            ? { ...file, status: 'success', progress: 100 }
            : file
        )
      );
    } catch (error) {
      // Update status to error
      setUploadFiles(prev =>
        prev.map(file =>
          file.id === fileItem.id
            ? { 
                ...file, 
                status: 'error', 
                error: error instanceof Error ? error.message : 'Upload failed' 
              }
            : file
        )
      );
    }
  };

  const uploadAll = () => {
    uploadFiles
      .filter(file => file.status === 'pending' && file.metadata)
      .forEach(fileItem => handleFileUpload(fileItem));
  };

  const renderMetadataFields = (fileItem: UploadFile) => {
    const baseFields = getFieldsForType(type);
    
    return (
      <div className="space-y-6">
        {/* Russian Fields */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-600 pb-2">
            Russian Metadata
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {baseFields.map(field => renderField(fileItem, field, 'ru'))}
          </div>
        </div>

        {/* English Fields */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-600 pb-2">
            English Metadata
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {baseFields.map(field => renderField(fileItem, field, 'en'))}
          </div>
        </div>
      </div>
    );
  };

  const renderField = (fileItem: UploadFile, field: string, locale: 'ru' | 'en') => {
    const fieldKey = locale === 'en' ? `${field}En` : field;
    const fieldType = getFieldType(field);
    const isRequired = isFieldRequired(field);
    const label = getFieldLabel(field, locale);

    return (
      <div key={`${field}-${locale}`} className={fieldType === 'textarea' ? 'md:col-span-2' : ''}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
        {fieldType === 'textarea' ? (
          <textarea
            value={fileItem.metadata?.[fieldKey] || ''}
            onChange={(e) => updateMetadata(fileItem.id, field, e.target.value, locale)}
            required={isRequired}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        ) : fieldType === 'select' ? (
          <select
            value={fileItem.metadata?.[fieldKey] || ''}
            onChange={(e) => updateMetadata(fileItem.id, field, e.target.value, locale)}
            required={isRequired}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select {label.toLowerCase()}</option>
            {getSelectOptions(field, locale).map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={fieldType}
            value={fileItem.metadata?.[fieldKey] || ''}
            onChange={(e) => updateMetadata(fileItem.id, field, fieldType === 'number' ? parseInt(e.target.value) || '' : e.target.value, locale)}
            required={isRequired}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        )}
      </div>
    );
  };

  const getFieldsForType = (type: string) => {
    const fields = {
      photo: ['title', 'description', 'year', 'location', 'photographer', 'event'],
      video: ['title', 'description', 'year', 'location', 'performers'],
      audio: ['title', 'composer', 'year', 'album', 'genre', 'description'],
      document: ['title', 'author', 'description', 'type', 'year', 'language', 'publisher', 'isbn'],
    };
    return fields[type as keyof typeof fields] || [];
  };

  const getFieldType = (field: string) => {
    const types: Record<string, string> = {
      year: 'number',
      pages: 'number',
      description: 'textarea',
      type: 'select',
      language: 'select',
    };
    return types[field] || 'text';
  };

  const getFieldLabel = (field: string, locale: 'ru' | 'en') => {
    const labels: Record<string, { ru: string; en: string }> = {
      title: { ru: 'Название', en: 'Title' },
      description: { ru: 'Описание', en: 'Description' },
      year: { ru: 'Год', en: 'Year' },
      location: { ru: 'Место', en: 'Location' },
      photographer: { ru: 'Фотограф', en: 'Photographer' },
      event: { ru: 'Событие', en: 'Event' },
      composer: { ru: 'Композитор', en: 'Composer' },
      album: { ru: 'Альбом', en: 'Album' },
      genre: { ru: 'Жанр', en: 'Genre' },
      author: { ru: 'Автор', en: 'Author' },
      type: { ru: 'Тип', en: 'Type' },
      language: { ru: 'Язык', en: 'Language' },
      publisher: { ru: 'Издатель', en: 'Publisher' },
      isbn: { ru: 'ISBN', en: 'ISBN' },
      performers: { ru: 'Исполнители', en: 'Performers' },
    };
    return labels[field]?.[locale] || field;
  };

  const getSelectOptions = (field: string, locale: 'ru' | 'en') => {
    const options: Record<string, { ru: Array<{value: string, label: string}>, en: Array<{value: string, label: string}> }> = {
      type: {
        ru: [
          { value: 'Интервью', label: 'Интервью' },
          { value: 'Статья', label: 'Статья' },
          { value: 'Исследование', label: 'Исследование' },
          { value: 'Каталог', label: 'Каталог' },
          { value: 'Сборник', label: 'Сборник' },
        ],
        en: [
          { value: 'Interview', label: 'Interview' },
          { value: 'Article', label: 'Article' },
          { value: 'Research', label: 'Research' },
          { value: 'Catalog', label: 'Catalog' },
          { value: 'Collection', label: 'Collection' },
        ],
      },
      language: {
        ru: [
          { value: 'Русский', label: 'Русский' },
          { value: 'Английский', label: 'Английский' },
          { value: 'Армянский', label: 'Армянский' },
        ],
        en: [
          { value: 'Russian', label: 'Russian' },
          { value: 'English', label: 'English' },
          { value: 'Armenian', label: 'Armenian' },
        ],
      },
    };
    return options[field]?.[locale] || [];
  };

  const isFieldRequired = (field: string) => {
    const required = ['title', 'description', 'year'];
    const typeSpecific = {
      audio: ['composer'],
      document: ['author', 'type', 'language'],
    };
    
    return required.includes(field) || (typeSpecific[type as keyof typeof typeSpecific] || []).includes(field);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Icon size={24} className="text-blue-600 dark:text-blue-400" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Upload {type === 'document' ? 'Documents' : type === 'audio' ? 'Audio Files' : `${type.charAt(0).toUpperCase() + type.slice(1)}s`}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Maximum file size: {config.maxSize}
          </p>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragOver
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
      >
        <Upload size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Drop files here or click to browse
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Accepts {config.accept} files up to {config.maxSize}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={config.accept}
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Upload Queue */}
      {uploadFiles.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Upload Queue ({uploadFiles.length})
            </h3>
            <button
              onClick={uploadAll}
              disabled={uploadFiles.every(f => f.status !== 'pending' || !f.metadata)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Upload size={16} />
              <span>Upload All</span>
            </button>
          </div>

          <div className="space-y-6">
            {uploadFiles.map((fileItem) => (
              <div
                key={fileItem.id}
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Icon size={20} className="text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {fileItem.file.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {(fileItem.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Status Icon */}
                    {fileItem.status === 'success' && (
                      <Check size={20} className="text-green-600" />
                    )}
                    {fileItem.status === 'error' && (
                      <AlertCircle size={20} className="text-red-600" />
                    )}
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFile(fileItem.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                {fileItem.status === 'uploading' && (
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${fileItem.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {fileItem.status === 'error' && fileItem.error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-700 dark:text-red-300">
                    {fileItem.error}
                  </div>
                )}

                {/* Metadata Form */}
                {fileItem.status !== 'success' && (
                  <>
                    {renderMetadataFields(fileItem)}

                    {/* Upload Button */}
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => handleFileUpload(fileItem)}
                        disabled={!fileItem.metadata}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                      >
                        <Save size={16} />
                        <span>Upload File</span>
                      </button>
                    </div>
                  </>
                )}

                {/* Success Message */}
                {fileItem.status === 'success' && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-sm text-green-700 dark:text-green-300">
                    File uploaded successfully and added to media library.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
