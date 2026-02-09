import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface GeneratedImage {
  id: number;
  url: string;
  template: string;
}

export default function Gallery() {
  const location = useLocation();
  const { category = 'birthday', userImage } = location.state || {};
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

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
    const images: GeneratedImage[] = [];
    for (let i = 1; i <= 20; i++) {
      images.push({
        id: i,
        url: `https://readdy.ai/api/search-image?query=Beautiful%20personalized%20$%7BcurrentCategory.name.toLowerCase%28%29%7D%20greeting%20card%20with%20elegant%20design%2C%20professional%20typography%2C%20decorative%20elements%2C%20modern%20aesthetic%2C%20high-quality%20composition%2C%20Instagram-ready%20format%2C%20vibrant%20colors%2C%20premium%20look%2C%20celebration%20theme%2C%20ready%20to%20share&width=800&height=800&seq=generated-${category}-${i}&orientation=squarish`,
        template: `Template ${i}`
      });
    }
    setGeneratedImages(images);
  }, [category, currentCategory.name]);

  const handleDownload = (image: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `crafto-${category}-${image.id}.jpg`;
    link.click();
  };

  const handleDownloadAll = () => {
    alert('Downloading all images as ZIP file...');
  };

  const handleShare = (platform: string, image: GeneratedImage) => {
    const text = `Check out my personalized ${currentCategory.name} design!`;
    const url = image.url;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'instagram':
        alert('Image copied! Open Instagram and paste to share.');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
    }
    setShowShareMenu(false);
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
            <button 
              onClick={handleDownloadAll}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <i className="ri-download-cloud-line"></i>
              <span>Download All</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-md mb-4">
              <i className="ri-check-line text-green-500 text-xl"></i>
              <span className="font-semibold text-gray-900">20 Designs Generated Successfully!</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Your {currentCategory.name} Designs
            </h1>
            <p className="text-lg text-gray-600">
              Download individual images or share them directly
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {generatedImages.map((image) => (
              <div 
                key={image.id}
                className="group relative aspect-square rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <img 
                  src={image.url}
                  alt={image.template}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
                    <span className="text-white text-sm font-medium">{image.template}</span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(image);
                        }}
                        className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        <i className="ri-download-line text-white"></i>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(image);
                          setShowShareMenu(true);
                        }}
                        className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        <i className="ri-share-line text-white"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to={`/category?type=${category}`}
              className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 transition-all flex items-center justify-center space-x-2"
            >
              <i className="ri-refresh-line"></i>
              <span>Create More</span>
            </Link>
            <Link 
              to="/"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all flex items-center justify-center space-x-2"
            >
              <i className="ri-home-line"></i>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && !showShareMenu && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 w-10 h-10 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
            <img 
              src={selectedImage.url}
              alt={selectedImage.template}
              className="w-full rounded-2xl shadow-2xl"
            />
            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => handleDownload(selectedImage)}
                className="flex-1 bg-white text-purple-600 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all flex items-center justify-center space-x-2"
              >
                <i className="ri-download-line"></i>
                <span>Download</span>
              </button>
              <button 
                onClick={() => setShowShareMenu(true)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-full font-semibold hover:shadow-xl transition-all flex items-center justify-center space-x-2"
              >
                <i className="ri-share-line"></i>
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Menu Modal */}
      {showShareMenu && selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowShareMenu(false)}
        >
          <div 
            className="bg-white rounded-3xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Share Your Design</h3>
              <p className="text-gray-600">Choose a platform to share</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleShare('whatsapp', selectedImage)}
                className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-2xl hover:bg-green-100 transition-all"
              >
                <i className="ri-whatsapp-line text-4xl text-green-600 mb-2"></i>
                <span className="font-semibold text-gray-900">WhatsApp</span>
              </button>
              <button 
                onClick={() => handleShare('facebook', selectedImage)}
                className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-all"
              >
                <i className="ri-facebook-circle-line text-4xl text-blue-600 mb-2"></i>
                <span className="font-semibold text-gray-900">Facebook</span>
              </button>
              <button 
                onClick={() => handleShare('instagram', selectedImage)}
                className="flex flex-col items-center justify-center p-6 bg-pink-50 rounded-2xl hover:bg-pink-100 transition-all"
              >
                <i className="ri-instagram-line text-4xl text-pink-600 mb-2"></i>
                <span className="font-semibold text-gray-900">Instagram</span>
              </button>
              <button 
                onClick={() => handleShare('copy', selectedImage)}
                className="flex flex-col items-center justify-center p-6 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-all"
              >
                <i className="ri-link text-4xl text-purple-600 mb-2"></i>
                <span className="font-semibold text-gray-900">Copy Link</span>
              </button>
            </div>
            <button 
              onClick={() => setShowShareMenu(false)}
              className="w-full mt-6 bg-gray-100 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
