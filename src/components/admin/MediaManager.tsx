'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Edit3, Trash2, Eye, Search, Filter, Music, Video, Image, FileText, Save, X, Plus } from 'lucide-react';
import { AudioTrack, VideoItem, PhotoItem, PublicationItem } from '../../data/mediaContent';

type MediaType = 'music' | 'video' | 'photos' | 'publications';
type MediaItem = AudioTrack | VideoItem | PhotoItem | PublicationItem;

export default function MediaManager() {
  const [selectedType, setSelectedType] = useState<MediaType>('music');
  const [selectedLocale, setSelectedLocale] = useState<'ru' | 'en'>('ru');
  const [items, setItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const typeConfig = {
    music: { icon: Music, label: 'Audio', color: 'green' },
    video: { icon: Video, label: 'Videos', color: 'purple' },
    photos: { icon: Image, label: 'Photos', color: 'blue' },
    publications: { icon: FileText, label: 'Publications', color: 'orange' },
  };

  // Load media items
  const loadItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/media?type=${selectedType}&locale=${selectedLocale}`);
      
      if (!response.ok) {
        throw new Error('Failed to load media items');
      }
      
      const result = await response.json();
      const data = result.data;
      
      let itemsArray: MediaItem[] = [];
      if (selectedType === 'music') {
        itemsArray = data.tracks || [];
      } else {
        itemsArray = data.items || [];
      }
      
      setItems(itemsArray);
      setFilteredItems(itemsArray);
    } catch (error) {
      console.error('Error loading items:', error);
      setError(error instanceof Error ? error.message : 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on search
  useEffect(() => {
    if (!searchTerm) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter(item => {
      const searchableText = [
        item.title,
        item.titleEn,
        'description' in item ? item.description : '',
        'descriptionEn' in item ? item.descriptionEn : '',
        'composer' in item ? item.composer : '',
        'composerEn' in item ? item.composerEn : '',
        'author' in item ? item.author : '',
        'authorEn' in item ? item.authorEn : '',
      ].join(' ').toLowerCase();
      
      return searchableText.includes(searchTerm.toLowerCase());
    });
    
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  // Load items when type or locale changes
  useEffect(() => {
    loadItems();
  }, [selectedType, selectedLocale]);

  // Save item (create or update)
  const saveItem = async (item: MediaItem) => {
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const response = await fetch('/api/media', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          locale: selectedLocale,
          item,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save item');
      }

      await loadItems(); // Reload items
      setEditingItem(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Error saving item:', error);
      setError(error instanceof Error ? error.message : 'Failed to save item');
    }
  };

  // Delete item
  const deleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/media?type=${selectedType}&locale=${selectedLocale}&id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      await loadItems(); // Reload items
    } catch (error) {
      console.error('Error deleting item:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete item');
    }
  };

  // Create new item template
  const createNewItem = (): MediaItem => {
    const baseItem = {
      id: Date.now().toString(),
      title: '',
      titleEn: '',
      year: new Date().getFullYear().toString(),
    };

    switch (selectedType) {
      case 'music':
        return {
          ...baseItem,
          composer: '',
          composerEn: '',
          duration: '',
          src: '',
          description: '',
          descriptionEn: '',
        } as AudioTrack;
      
      case 'video':
        return {
          ...baseItem,
          description: '',
          descriptionEn: '',
          duration: '',
          thumbnail: '',
          videoUrl: '',
          location: '',
          locationEn: '',
          performers: '',
          performersEn: '',
        } as VideoItem;
      
      case 'photos':
        return {
          ...baseItem,
          src: '',
          description: '',
          descriptionEn: '',
          location: '',
          locationEn: '',
          photographer: '',
          event: '',
          eventEn: '',
        } as PhotoItem;
      
      case 'publications':
        return {
          ...baseItem,
          description: '',
          descriptionEn: '',
          type: '',
          typeEn: '',
          author: '',
          authorEn: '',
          pages: 0,
          size: '',
          fileUrl: '',
          language: '',
          publisher: '',
          publisherEn: '',
          isbn: '',
        } as PublicationItem;
      
      default:
        return baseItem as MediaItem;
    }
  };

  const renderItemCard = (item: MediaItem) => {
    const Icon = typeConfig[selectedType].icon;
    
    return (
      <div key={item.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <Icon size={20} className="text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {selectedLocale === 'en' ? (item.titleEn || item.title) : item.title}
              </h3>
              {'description' in item && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {selectedLocale === 'en' ? (item.descriptionEn || item.description) : item.description}
                </p>
              )}
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>ID: {item.id}</span>
                <span>Year: {typeof item.year === 'string' ? item.year : item.year}</span>
                {'composer' in item && <span>Composer: {selectedLocale === 'en' ? (item.composerEn || item.composer) : item.composer}</span>}
                {'author' in item && <span>Author: {selectedLocale === 'en' ? (item.authorEn || item.author) : item.author}</span>}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
            <button
              onClick={() => setEditingItem(item)}
              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => deleteItem(item.id)}
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEditForm = (item: MediaItem) => {
    const fields = getFieldsForType(selectedType);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isCreating ? 'Create New' : 'Edit'} {typeConfig[selectedType].label}
            </h2>
            <button
              onClick={() => {
                setEditingItem(null);
                setIsCreating(false);
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-6">
              {fields.map(field => renderEditField(item, field))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={() => {
                setEditingItem(null);
                setIsCreating(false);
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => saveItem(item)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save size={16} />
              <span>{isCreating ? 'Create' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEditField = (item: MediaItem, field: string) => {
    const fieldType = getFieldType(field);
    const isRequired = isFieldRequired(field);
    
    return (
      <div key={field}>
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
          {getFieldLabel(field)}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Russian field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Russian
            </label>
            {fieldType === 'textarea' ? (
              <textarea
                value={(item as any)[field] || ''}
                onChange={(e) => setEditingItem({ ...item, [field]: e.target.value } as MediaItem)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            ) : fieldType === 'number' ? (
              <input
                type="number"
                value={(item as any)[field] || ''}
                onChange={(e) => setEditingItem({ ...item, [field]: parseInt(e.target.value) || 0 } as MediaItem)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <input
                type="text"
                value={(item as any)[field] || ''}
                onChange={(e) => setEditingItem({ ...item, [field]: e.target.value } as MediaItem)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            )}
          </div>
          
          {/* English field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              English
            </label>
            {fieldType === 'textarea' ? (
              <textarea
                value={(item as any)[`${field}En`] || ''}
                onChange={(e) => setEditingItem({ ...item, [`${field}En`]: e.target.value } as MediaItem)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <input
                type="text"
                value={(item as any)[`${field}En`] || ''}
                onChange={(e) => setEditingItem({ ...item, [`${field}En`]: e.target.value } as MediaItem)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  const getFieldsForType = (type: MediaType) => {
    const fields = {
      music: ['title', 'composer', 'description', 'duration', 'src', 'album', 'genre'],
      video: ['title', 'description', 'duration', 'videoUrl', 'thumbnail', 'location', 'performers'],
      photos: ['title', 'description', 'src', 'location', 'photographer', 'event'],
      publications: ['title', 'description', 'author', 'type', 'pages', 'fileUrl', 'language', 'publisher', 'isbn'],
    };
    return fields[type] || [];
  };

  const getFieldType = (field: string) => {
    const types: Record<string, string> = {
      description: 'textarea',
      pages: 'number',
    };
    return types[field] || 'text';
  };

  const getFieldLabel = (field: string) => {
    const labels: Record<string, string> = {
      title: 'Title',
      description: 'Description',
      composer: 'Composer',
      duration: 'Duration',
      src: 'Source URL',
      album: 'Album',
      genre: 'Genre',
      videoUrl: 'Video URL',
      thumbnail: 'Thumbnail URL',
      location: 'Location',
      performers: 'Performers',
      photographer: 'Photographer',
      event: 'Event',
      author: 'Author',
      type: 'Type',
      pages: 'Pages',
      fileUrl: 'File URL',
      language: 'Language',
      publisher: 'Publisher',
      isbn: 'ISBN',
    };
    return labels[field] || field;
  };

  const isFieldRequired = (field: string) => {
    const required = ['title', 'description'];
    const typeSpecific = {
      music: ['composer', 'src'],
      video: ['videoUrl'],
      photos: ['src'],
      publications: ['author', 'type', 'language', 'fileUrl'],
    };
    
    return required.includes(field) || (typeSpecific[selectedType] || []).includes(field);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Media Manager
        </h2>
        <button
          onClick={() => {
            setEditingItem(createNewItem());
            setIsCreating(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add New</span>
        </button>
      </div>

      {/* Controls */}
      <div className="space-y-4 mb-6">
        {/* Type Selection */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(typeConfig).map(([type, config]) => {
            const Icon = config.icon;
            const isActive = selectedType === type;
            
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type as MediaType)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon size={16} />
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Locale Selection */}
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedLocale('ru')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedLocale === 'ru'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
              }`}
            >
              Russian
            </button>
            <button
              onClick={() => setSelectedLocale('en')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedLocale === 'en'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
              }`}
            >
              English
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search media items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading media items...</p>
        </div>
      )}

      {/* Items Grid */}
      {!loading && (
        <>
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {filteredItems.length} items found
          </div>
          
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <div className="flex justify-center">
                  {React.createElement(typeConfig[selectedType].icon, { size: 48 })}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                No {typeConfig[selectedType].label.toLowerCase()} found
              </p>
              <button
                onClick={() => {
                  setEditingItem(createNewItem());
                  setIsCreating(true);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add First Item
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredItems.map(renderItemCard)}
            </div>
          )}
        </>
      )}

      {/* Edit Modal */}
      {editingItem && renderEditForm(editingItem)}
    </div>
  );
}
