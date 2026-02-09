import { useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function Category() {
  const [searchParams] = useSearchParams();
  const categoryType = searchParams.get('type') || 'birthday';
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = {
    birthday: { name: 'Birthday', icon: 'ri-cake-3-line', color: 'from-pink-400 to-purple-500' },
    love: { name: 'Love', icon: 'ri-heart-3-line', color: 'from-red-400 to-pink-500' },
    motivation: { name: 'Motivation', icon: 'ri-rocket-line', color: 'from-orange-400 to-yellow-500' },
    festivals: { name: 'Festivals', icon: 'ri-gift-line', color: 'from-green-400 to-teal-500' },
    trending: { name: 'Trending', icon: 'ri-fire-line', color: 'from-blue-400 to-indigo-500' },
    anniversary: { name: 'Anniversary', icon: 'ri-calendar-heart-line', color: 'from-purple-400 to-pink-500' }
  };

  const currentCategory = categories[categoryType as keyof typeof categories] || categories.birthday;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (!selectedImage) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowResults(true);
      window.REACT_APP_NAVIGATE?.('/gallery', { state: { category: categoryType, userImage: selectedImage } });
    }, 2000);
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
            <Link to="/" className="text-gray-700 hover:text-purple-600 transition-colors">
              <i className="ri-arrow-left-line text-xl"></i>
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Category Header */}
          <div className="text-center mb-12">
            <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${currentCategory.color} rounded-2xl mb-4`}>
              <i className={`${currentCategory.icon} text-4xl text-white`}></i>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {currentCategory.name} Templates
            </h1>
            <p className="text-lg text-gray-600">
              Upload your photo and create stunning personalized designs
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Photo</h2>
              <p className="text-gray-600">Choose a clear photo for best results</p>
            </div>

            {!selectedImage ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-3 border-dashed border-purple-300 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 transition-all"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-upload-cloud-line text-4xl text-white"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Click to Upload</h3>
                <p className="text-gray-600 mb-4">or drag and drop your image here</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative">
                  <img 
                    src={selectedImage} 
                    alt="Uploaded" 
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <i className="ri-loader-4-line animate-spin text-xl"></i>
                      <span>Generating Designs...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-magic-line text-xl"></i>
                      <span>Generate Designs</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Template Preview */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Templates</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer">
                  <img 
                    src={`https://readdy.ai/api/search-image?query=Professional%20$%7BcurrentCategory.name.toLowerCase%28%29%7D%20greeting%20card%20template%20design%20with%20elegant%20typography%2C%20decorative%20elements%2C%20modern%20layout%2C%20placeholder%20for%20personal%20photo%2C%20high-quality%20design%2C%20Instagram-ready%20format%2C%20vibrant%20colors%2C%20clean%20composition%2C%20premium%20aesthetic&width=400&height=400&seq=template-${categoryType}-${item}&orientation=squarish`}
                    alt={`Template ${item}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <i className="ri-eye-line text-white text-3xl"></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-600 mt-6">
              + 14 more templates available
            </p>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-4">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <i className="ri-magic-line text-5xl text-white"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Creating Magic...</h3>
            <p className="text-gray-600 mb-6">Generating 20 personalized designs for you</p>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
