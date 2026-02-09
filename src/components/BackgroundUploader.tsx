import React, { useState, useRef } from 'react';
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react';
import { setGlobalBackgroundImage, getGlobalBackgroundImage } from '../services/canvasImageGenerator';

interface BackgroundUploaderProps {
  onBackgroundSet?: (imageUrl: string) => void;
}

export default function BackgroundUploader({ onBackgroundSet }: BackgroundUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentBg, setCurrentBg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const existingBg = getGlobalBackgroundImage();
    if (existingBg) {
      setCurrentBg(existingBg);
    }
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 10MB');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewUrl(result);
      setIsUploading(false);
    };

    reader.onerror = () => {
      alert('Failed to read image file');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleSetBackground = () => {
    if (previewUrl) {
      setGlobalBackgroundImage(previewUrl);
      setCurrentBg(previewUrl);
      onBackgroundSet?.(previewUrl);
      alert('Background image set successfully!');
    }
  };

  const handleClearBackground = () => {
    setGlobalBackgroundImage('');
    setCurrentBg(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onBackgroundSet?.('');
    alert('Background image cleared!');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <ImageIcon className="w-6 h-6 mr-3 text-purple-600" />
        Global Background Image
      </h2>

      {/* Current Background Display */}
      {currentBg && (
        <div className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">Current Background</h3>
            <button
              onClick={handleClearBackground}
              className="text-red-600 hover:text-red-700 transition-colors"
              title="Clear Background"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100">
            <img 
              src={currentBg} 
              alt="Current background" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload New Background
          </label>
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="w-full px-4 py-3 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-purple-50 hover:bg-purple-100"
            >
              <div className="flex items-center justify-center">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
                ) : (
                  <Upload className="w-5 h-5 mr-2 text-purple-600" />
                )}
                <span className="text-purple-600 font-medium">
                  {isUploading ? 'Processing...' : 'Choose Image File'}
                </span>
              </div>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Supports JPG, PNG, GIF formats. Max size: 10MB
          </p>
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-3">Preview</h3>
            <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100 mb-4">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={handleSetBackground}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center"
            >
              <Check className="w-4 h-4 mr-2" />
              Set as Global Background
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-semibold text-gray-900 mb-2">📝 Instructions</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Upload an image to use as background for ALL generated images</li>
          <li>• The image will be scaled to fit the canvas</li>
          <li>• High-resolution images work best (1920x1080 or higher)</li>
          <li>• This background will override template gradients</li>
          <li>• Clear to remove and use default template backgrounds</li>
        </ul>
      </div>
    </div>
  );
}
