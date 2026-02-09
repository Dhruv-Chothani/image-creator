import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Upload, User, Sparkles, Image as ImageIcon, Check } from 'lucide-react';
import { generateCanvasImage, getTemplatesForCategory, Template, autoSetBackgroundImages } from '../../services/canvasImageGenerator';

export default function SimplePersonalizePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'birthday';
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = {
    'good-morning': { name: 'Good Morning', icon: 'ri-sun-fill', color: 'from-yellow-400 to-orange-500' },
    'festivals': { name: 'Festivals', icon: 'ri-gift-fill', color: 'from-green-400 to-teal-500' },
    'birthday': { name: 'Birthday', icon: 'ri-cake-3-fill', color: 'from-pink-400 to-purple-500' },
    'anniversary': { name: 'Anniversary', icon: 'ri-calendar-heart-fill', color: 'from-rose-400 to-pink-500' },
    'congratulations': { name: 'Congratulations', icon: 'ri-trophy-fill', color: 'from-amber-400 to-yellow-500' },
    'motivation': { name: 'Motivation', icon: 'ri-rocket-fill', color: 'from-blue-400 to-cyan-500' }
  };

  const currentCategory = categories[category as keyof typeof categories] || categories.birthday;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size should be less than 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!selectedImage) {
      alert('Please upload an image');
      return false;
    }
    if (!userName.trim() || userName.trim().length < 2 || userName.trim().length > 20) {
      alert('Name must be between 2 and 20 characters');
      return false;
    }
    return true;
  };

  // Set background images for congratulations category
  useEffect(() => {
    if (category === 'congratulations') {
      // Auto-set background images for congratulations from background-test folder
      autoSetBackgroundImages();
    }
  }, [category]);

  const generateImagesWithTemplates = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);
    setProgress(0);
    setGeneratedImages([]);

    try {
      const templates = getTemplatesForCategory(category);
      const numberOfImages = 7 + Math.floor(Math.random() * 2); // 7-8 images
      const selectedTemplates = templates.slice(0, numberOfImages);
      const images: string[] = [];

      for (let i = 0; i < selectedTemplates.length; i++) {
        const template = selectedTemplates[i];
        try {
          const imageUrl = await generateCanvasImage(
            template,
            selectedImage!,
            userName.trim(),
            i
          );
          images.push(imageUrl);
          setProgress(Math.round(((i + 1) / selectedTemplates.length) * 100));
          
          // Small delay to show progress
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error('Error generating image:', error);
        }
      }

      setGeneratedImages(images);
      
      // Navigate to gallery with generated images
      setTimeout(() => {
        navigate('/gallery', {
          state: {
            category,
            userImage: selectedImage,
            userName: userName.trim(),
            mode: 'canvas',
            generatedImages: images
          }
        });
      }, 500);
      
    } catch (error) {
      console.error('Error generating images:', error);
      alert('Failed to generate images. Please try again.');
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const handleGenerateImages = () => {
    generateImagesWithTemplates();
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
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r ${currentCategory.color} text-white mb-4`}>
              <i className={`${currentCategory.icon} text-xl`}></i>
              <span className="text-lg font-semibold">{currentCategory.name}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Create Your Personalized Images
            </h1>
            <p className="text-lg text-gray-600">
              Upload your photo and enter name to generate 7-8 beautiful images instantly
            </p>
          </div>

          {/* Personalization Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image Upload */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  <User className="inline-block w-5 h-5 mr-2" />
                  Upload Photo
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 transition-colors bg-gray-50"
                >
                  {selectedImage ? (
                    <div className="space-y-4">
                      <img 
                        src={selectedImage} 
                        alt="Selected" 
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <p className="text-sm text-green-600 font-medium">
                        <Check className="inline-block w-4 h-4 mr-1" />
                        Image uploaded successfully
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ImageIcon className="w-16 h-16 mx-auto text-gray-400" />
                      <p className="text-lg font-medium text-gray-700">Click to upload image</p>
                      <p className="text-sm text-gray-500">JPG, PNG, or WEBP (max 10MB)</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  <User className="inline-block w-5 h-5 mr-2" />
                  Enter Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter the name..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg"
                  maxLength={20}
                />
                <p className="text-sm text-gray-500 mt-2">
                  • 2-20 characters<br />
                  • This name will be added to all designs
                </p>
              </div>
            </div>

            {/* Generate Button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleGenerateImages}
                disabled={isGenerating || !selectedImage || !userName.trim()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3 mx-auto"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating {generatedImages.length + 1}/8 Images...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate My Images</span>
                  </>
                )}
              </button>
            </div>

            {/* Progress Bar */}
            {isGenerating && (
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Generating beautiful images...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Preview Info */}
            <div className="mt-8 p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3 text-purple-700">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">High-Quality Images</span>
              </div>
              <p className="text-sm text-purple-600 mt-1">
                Perfect for WhatsApp, Instagram, and social sharing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
