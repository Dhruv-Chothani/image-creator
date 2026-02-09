import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Download, Share2, Grid, List, Image as ImageIcon, X, Check, RefreshCw } from 'lucide-react';

interface GeneratedImage {
  id: string;
  url: string;
  template?: string;
  metadata?: {
    generationTime: number;
    mode: 'canvas' | 'api';
    category: string;
    style?: string;
  };
}

interface GalleryState {
  category: string;
  userImage: string;
  userName?: string;
  mode: 'api' | 'canvas';
  generatedImages?: string[];
  template?: any;
}

export default function EnhancedGallery() {
  const location = useLocation();
  const state = location.state as GalleryState;
  const { category = 'birthday', userImage, userName, mode = 'api', generatedImages = [], template } = state || {};
  
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const categories = {
    birthday: { name: 'Birthday', icon: 'ri-cake-3-line', color: 'from-pink-400 to-purple-500' },
    love: { name: 'Love', icon: 'ri-heart-3-line', color: 'from-red-400 to-pink-500' },
    motivation: { name: 'Motivation', icon: 'ri-rocket-line', color: 'from-orange-400 to-yellow-500' },
    festivals: { name: 'Festivals', icon: 'ri-gift-line', color: 'from-green-400 to-teal-500' },
    trending: { name: 'Trending', icon: 'ri-fire-line', color: 'from-blue-400 to-indigo-500' },
    anniversary: { name: 'Anniversary', icon: 'ri-calendar-heart-line', color: 'from-purple-400 to-pink-500' }
  };

  const currentCategory = categories[category as keyof typeof categories] || categories.birthday;

  useEffect(() => {
    if (mode === 'canvas' && generatedImages.length > 0) {
      // Canvas mode - use generated images from state
      const canvasImages: GeneratedImage[] = generatedImages.map((url, index) => ({
        id: `canvas-${index}`,
        url,
        template: template?.greeting?.line1 || `Canvas Design ${index + 1}`,
        metadata: {
          generationTime: 0,
          mode: 'canvas' as const,
          category,
          style: 'premium'
        }
      }));
      setImages(canvasImages);
    } else {
      // API mode - generate placeholder images
      const apiImages: GeneratedImage[] = [];
      for (let i = 1; i <= 20; i++) {
        apiImages.push({
          id: `api-${i}`,
          url: `https://readdy.ai/api/search-image?query=Beautiful%20personalized%20${category}%20greeting%20card%20with%20elegant%20design&width=800&height=800&seq=generated-${category}-${i}&orientation=squarish`,
          template: `AI Template ${i}`,
          metadata: {
            generationTime: 0,
            mode: 'api' as const,
            category,
            style: 'ai-generated'
          }
        });
      }
      setImages(apiImages);
    }
  }, [mode, generatedImages, template, category]);

  const handleDownload = async (image: GeneratedImage) => {
    try {
      setIsDownloading(true);
      
      if (image.url.startsWith('data:')) {
        // Canvas-generated image
        const link = document.createElement('a');
        link.href = image.url;
        link.download = `crafto-${category}-${image.id}.png`;
        link.click();
      } else {
        // API-generated image
        const response = await fetch(image.url);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `crafto-${category}-${image.id}.jpg`;
        link.click();
        
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to download image:', error);
      alert('Failed to download image');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadAll = async () => {
    const imagesToDownload = selectedImages.size > 0 
      ? images.filter(img => selectedImages.has(img.id))
      : images;

    for (const image of imagesToDownload) {
      await handleDownload(image);
    }
  };

  const handleShare = async (image: GeneratedImage) => {
    try {
      setIsSharing(true);
      
      if (navigator.share) {
        await navigator.share({
          title: `Crafto ${currentCategory.name} Image`,
          text: `Check out this amazing ${currentCategory.name.toLowerCase()} image I created with Crafto!`,
          url: image.url
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(image.url);
        alert('Image link copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to share image:', error);
      alert('Failed to share image');
    } finally {
      setIsSharing(false);
    }
  };

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  };

  const selectAllImages = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images.map(img => img.id)));
    }
  };

  const handleRegenerate = () => {
    // Go back to category page with same parameters
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="https://public.readdy.ai/ai/img_res/576122b2-b97a-4006-9790-606ac907714f.png" 
                alt="Logo" 
                className="h-10 w-10 object-contain"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Crafto
              </span>
            </Link>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleRegenerate}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </button>
              <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="pt-24 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${currentCategory.color} rounded-2xl mb-4`}>
              <i className={`${currentCategory.icon} text-3xl text-white`}></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentCategory.name} Gallery
            </h1>
            {userName && (
              <p className="text-lg text-gray-600">Created for {userName}</p>
            )}
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                {mode === 'canvas' ? 'Canvas' : 'AI'} Generated
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {images.length} images
              </span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between mb-8 bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={selectAllImages}
                className="px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors"
              >
                {selectedImages.size === images.length ? 'Deselect All' : 'Select All'}
              </button>
              
              {selectedImages.size > 0 && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {selectedImages.size} selected
                </span>
              )}
            </div>

            <button
              onClick={handleDownloadAll}
              disabled={isDownloading || images.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              {selectedImages.size > 0 ? `Download ${selectedImages.size}` : 'Download All'}
            </button>
          </div>

          {/* Images Grid/List */}
          {images.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                : 'space-y-4'
            }>
              {images.map((image) => (
                <div
                  key={image.id}
                  className={`relative group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all ${
                    viewMode === 'list' ? 'flex gap-4 p-4' : ''
                  }`}
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <button
                      onClick={() => toggleImageSelection(image.id)}
                      className={`w-8 h-8 rounded-md border-2 flex items-center justify-center transition-colors ${
                        selectedImages.has(image.id)
                          ? 'bg-purple-600 border-purple-600 text-white'
                          : 'bg-white border-gray-300 hover:border-purple-500'
                      }`}
                    >
                      {selectedImages.has(image.id) && <Check className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Image */}
                  <div
                    className={viewMode === 'grid' ? 'aspect-square' : 'flex-shrink-0'}
                    onClick={() => setSelectedImage(image)}
                  >
                    {viewMode === 'grid' ? (
                      <img
                        src={image.url}
                        alt={image.template}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <img
                        src={image.url}
                        alt={image.template}
                        className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>

                  {/* Info */}
                  {viewMode === 'list' && (
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{image.template}</h3>
                      {image.metadata && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {image.metadata.mode}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {image.metadata.category}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(image);
                      }}
                      disabled={isDownloading}
                      className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                    >
                      <Download className="h-4 w-4 text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(image);
                      }}
                      disabled={isSharing}
                      className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                    >
                      <Share2 className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No images generated yet</h3>
              <p className="text-gray-600 mb-4">
                Start by selecting a category and personalizing your image.
              </p>
              <button
                onClick={handleRegenerate}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Generate Images
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white p-2 rounded-full"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="flex-1 bg-black/5 flex items-center justify-center p-4">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.template}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
              </div>

              <div className="w-full md:w-80 p-6 bg-white">
                <h3 className="text-lg font-semibold mb-2">
                  {selectedImage.template}
                </h3>

                {selectedImage.metadata && (
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {selectedImage.metadata.mode}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {selectedImage.metadata.category}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <button
                    onClick={() => handleDownload(selectedImage)}
                    disabled={isDownloading}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                  >
                    <Download className="h-4 w-4 inline mr-2" />
                    Download
                  </button>
                  <button
                    onClick={() => handleShare(selectedImage)}
                    disabled={isSharing}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    <Share2 className="h-4 w-4 inline mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
