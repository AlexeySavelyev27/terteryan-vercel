'use client';

import { useState } from 'react';
import { Upload, Image, Video, Music, FileText, Settings, BarChart3 } from 'lucide-react';
import MediaUpload from '../../../src/components/admin/MediaUpload';
import MediaManager from '../../../src/components/admin/MediaManager';
import StorageStats from '../../../src/components/admin/StorageStats';

type DashboardTab = 'upload' | 'manage' | 'stats';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('upload');
  const [uploadType, setUploadType] = useState<'photo' | 'video' | 'audio' | 'document'>('photo');

  const tabConfig = [
    { id: 'upload' as const, label: 'Upload Media', icon: Upload },
    { id: 'manage' as const, label: 'Manage Media', icon: Settings },
    { id: 'stats' as const, label: 'Storage Stats', icon: BarChart3 },
  ];

  const uploadTypes = [
    { id: 'photo' as const, label: 'Photos', icon: Image, color: 'blue' },
    { id: 'video' as const, label: 'Videos', icon: Video, color: 'purple' },
    { id: 'audio' as const, label: 'Audio', icon: Music, color: 'green' },
    { id: 'document' as const, label: 'Documents', icon: FileText, color: 'orange' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return (
          <div className="space-y-6">
            {/* Upload Type Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Select Media Type
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadTypes.map((type) => {
                  const Icon = type.icon;
                  const isActive = uploadType === type.id;
                  
                  return (
                    <button
                      key={type.id}
                      onClick={() => setUploadType(type.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        isActive
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Icon
                          size={24}
                          className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}
                        />
                        <span
                          className={`text-sm font-medium ${
                            isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {type.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Upload Component */}
            <MediaUpload type={uploadType} />
          </div>
        );
        
      case 'manage':
        return <MediaManager />;
        
      case 'stats':
        return <StorageStats />;
        
      default:
        return <div>Coming soon...</div>;
    }
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Media Management Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload and manage media files for the Terteryan website
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {tabConfig.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    isActive
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {renderContent()}
      </div>
    </div>
  );
}
