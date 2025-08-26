'use client';

import { useState, useEffect } from 'react';
import { HardDrive, Image, Video, Music, FileText, TrendingUp, Archive } from 'lucide-react';

interface StorageData {
  total: number;
  used: number;
  available: number;
  breakdown: {
    photos: number;
    videos: number;
    audio: number;
    documents: number;
  };
  itemCounts: {
    photos: number;
    videos: number;
    audio: number;
    documents: number;
  };
}

export default function StorageStats() {
  const [storageData, setStorageData] = useState<StorageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading storage data
    // In a real implementation, this would fetch from an API
    setTimeout(() => {
      setStorageData({
        total: 10 * 1024 * 1024 * 1024, // 10GB
        used: 2.5 * 1024 * 1024 * 1024, // 2.5GB
        available: 7.5 * 1024 * 1024 * 1024, // 7.5GB
        breakdown: {
          photos: 800 * 1024 * 1024, // 800MB
          videos: 1.2 * 1024 * 1024 * 1024, // 1.2GB
          audio: 300 * 1024 * 1024, // 300MB
          documents: 200 * 1024 * 1024, // 200MB
        },
        itemCounts: {
          photos: 245,
          videos: 12,
          audio: 67,
          documents: 23,
        },
      });
      setLoading(false);
    }, 1000);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getUsagePercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  const typeConfig = {
    photos: { icon: Image, label: 'Photos', color: 'blue' },
    videos: { icon: Video, label: 'Videos', color: 'purple' },
    audio: { icon: Music, label: 'Audio', color: 'green' },
    documents: { icon: FileText, label: 'Documents', color: 'orange' },
  };

  if (loading || !storageData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading storage statistics...</p>
        </div>
      </div>
    );
  }

  const usagePercentage = getUsagePercentage(storageData.used, storageData.total);

  return (
    <div className="space-y-6">
      {/* Overall Storage Usage */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <HardDrive size={24} className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Storage Overview
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Storage Usage
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {formatBytes(storageData.used)} of {formatBytes(storageData.total)} used
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                usagePercentage > 80 ? 'bg-red-500' : 
                usagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
          
          <div className="text-center">
            <span className={`text-2xl font-bold ${
              usagePercentage > 80 ? 'text-red-600' : 
              usagePercentage > 60 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {usagePercentage}%
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {formatBytes(storageData.available)} available
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown by Type */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Archive size={24} className="text-green-600 dark:text-green-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Storage Breakdown
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(typeConfig).map(([type, config]) => {
            const Icon = config.icon;
            const size = storageData.breakdown[type as keyof typeof storageData.breakdown];
            const count = storageData.itemCounts[type as keyof typeof storageData.itemCounts];
            const percentage = getUsagePercentage(size, storageData.used);
            
            return (
              <div
                key={type}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                  config.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                  config.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' :
                  config.color === 'green' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                  'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                }`}>
                  <Icon size={20} />
                </div>
                
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {config.label}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {formatBytes(size)}
                </p>
                
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                  {count} items • {percentage}%
                </p>
                
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      config.color === 'blue' ? 'bg-blue-500' :
                      config.color === 'purple' ? 'bg-purple-500' :
                      config.color === 'green' ? 'bg-green-500' :
                      'bg-orange-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Usage Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp size={24} className="text-purple-600 dark:text-purple-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Usage Trends
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">+12%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">This Month</div>
            <div className="text-xs text-gray-500 dark:text-gray-500">vs. Last Month</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">347</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Items</div>
            <div className="text-xs text-gray-500 dark:text-gray-500">All Media Types</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">23</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Recent Uploads</div>
            <div className="text-xs text-gray-500 dark:text-gray-500">Last 7 Days</div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Optimization Recommendations
        </h2>
        
        <div className="space-y-3">
          {usagePercentage > 80 && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">
                <strong>Storage Almost Full:</strong> Consider upgrading your storage plan or removing unused files.
              </p>
            </div>
          )}
          
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Optimize Images:</strong> Consider converting large images to WebP format to save space.
            </p>
          </div>
          
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300">
              <strong>Video Compression:</strong> Large video files can be compressed without significant quality loss.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
