import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Upload, User, Sparkles, Image as ImageIcon, Check } from 'lucide-react';
import { getOccasionById, getOccasionsForCategory, Occasion } from '../../data/occasions';
import { generateCanvasImage, getTemplatesForCategory, Template } from '../../services/canvasImageGenerator';

export default function PersonalizePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get('category') || 'birthday';
  const occasionId = searchParams.get('occasion') || '';
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = {
    birthday: { name: 'Birthday', nameLocal: { en: 'Birthday', hi: 'जन्मदिन', te: 'పుట్టినరోజు' }, icon: 'ri-cake-3-line', color: 'from-pink-400 to-purple-500' },
    anniversary: { name: 'Anniversary', nameLocal: { en: 'Anniversary', hi: 'सालगिरह', te: 'వార్షికోత్సవం' }, icon: 'ri-calendar-heart-line', color: 'from-purple-400 to-pink-500' },
    love: { name: 'Love', nameLocal: { en: 'Love', hi: 'प्यार', te: 'ప్రేమ' }, icon: 'ri-heart-3-line', color: 'from-red-400 to-pink-500' },
    festivals: { name: 'Festivals', nameLocal: { en: 'Festivals', hi: 'त्योहार', te: 'పండుగలు' }, icon: 'ri-gift-line', color: 'from-orange-400 to-yellow-500' },
    motivation: { name: 'Motivation', nameLocal: { en: 'Motivation', hi: 'प्रेरणा', te: 'ప్రేరణ' }, icon: 'ri-rocket-line', color: 'from-blue-400 to-cyan-500' },
    religious: { name: 'Religious', nameLocal: { en: 'Religious', hi: 'धार्मिक', te: 'మతపరమైన' }, icon: 'ri-ancient-gate-line', color: 'from-amber-500 to-orange-600' },
    'good-morning': { name: 'Good Morning', nameLocal: { en: 'Good Morning', hi: 'सुप्रभात', te: 'శుభోదయం' }, icon: 'ri-sun-line', color: 'from-yellow-400 to-orange-500' },
    'good-night': { name: 'Good Night', nameLocal: { en: 'Good Night', hi: 'शुभ रात्रि', te: 'శుభరాత్రి' }, icon: 'ri-moon-line', color: 'from-indigo-500 to-purple-600' },
    political: { name: 'Political', nameLocal: { en: 'Political', hi: 'राजनीतिक', te: 'రాజకీయ' }, icon: 'ri-government-line', color: 'from-green-500 to-teal-600' },
    trending: { name: 'Trending', nameLocal: { en: 'Trending', hi: 'ट्रेंडिंग', te: 'ట్రెండింగ్' }, icon: 'ri-fire-line', color: 'from-purple-500 to-pink-500' },
    business: { name: 'Business', nameLocal: { en: 'Business', hi: 'व्यापार', te: 'వ్యాపారం' }, icon: 'ri-briefcase-line', color: 'from-gray-600 to-blue-700' },
    wedding: { name: 'Wedding', nameLocal: { en: 'Wedding', hi: 'शादी', te: 'వివాహం' }, icon: 'ri-heart-2-line', color: 'from-pink-300 to-rose-400' }
  };

  const currentCategory = categories[category as keyof typeof categories] || categories.birthday;

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    setSelectedLanguage(savedLanguage);
    
    const foundOccasion = getOccasionById(category, occasionId);
    setOccasion(foundOccasion || null);
  }, [category, occasionId]);

  const getLocalizedText = (textObj: any) => {
    if (typeof textObj === 'string') return textObj;
    return textObj?.[selectedLanguage] || textObj?.en || '';
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
        alert('Please upload a valid image file (JPG, PNG, or WEBP)');
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size should be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!selectedImage) {
      alert('Please upload an image');
      return false;
    }
    if (!userName.trim()) {
      alert('Please enter a name');
      return false;
    }
    if (userName.trim().length < 2 || userName.trim().length > 20) {
      alert('Name should be between 2 and 20 characters');
      return false;
    }
    return true;
  };

  const handleGenerateImages = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);
    
    try {
      // Get templates for this occasion
      const templates = getTemplatesForCategory(category);
      const occasionTemplates = templates.filter(template => 
        template.occasionId === occasionId
      ).slice(0, occasion?.templateCount || 10);

      if (occasionTemplates.length === 0) {
        // Fallback to category templates if no occasion-specific templates
        const categoryTemplates = templates.slice(0, 10);
        await generateImagesWithTemplates(categoryTemplates);
      } else {
        await generateImagesWithTemplates(occasionTemplates);
      }
    } catch (error) {
      console.error('Error generating images:', error);
      alert('Failed to generate images. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImagesWithTemplates = async (templates: Template[]) => {
    const generatedImages: string[] = [];
    
    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];
      try {
        const imageUrl = await generateCanvasImage(
          template,
          selectedImage!,
          userName.trim(),
          i
        );
        generatedImages.push(imageUrl);
      } catch (error) {
        console.error('Error generating image with template:', template.id, error);
      }
    }

    if (generatedImages.length > 0) {
      // Navigate to gallery with generated images
      navigate('/gallery', {
        state: {
          category,
          occasion: occasionId,
          userImage: selectedImage,
          userName: userName.trim(),
          mode: 'canvas',
          generatedImages,
          template: templates[0]
        }
      });
    } else {
      alert('Failed to generate images. Please try again.');
    }
  };

  if (!occasion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-line text-4xl text-gray-400"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Occasion Not Found</h3>
          <p className="text-gray-600 mb-6">
            The occasion you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate('/home')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/occasion?category=${category}`)}
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <div className="flex items-center space-x-3">
                <img 
                  src="https://public.readdy.ai/ai/img_res/576122b2-b97a-4006-9790-606ac907714f.png" 
                  alt="Logo" 
                  className="h-8 w-8 object-contain"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Crafto
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Language:</span>
              <span className="text-sm font-medium text-purple-600">
                {selectedLanguage === 'en' ? 'English' : selectedLanguage === 'hi' ? 'हिंदी' : 'తెలుగు'}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${currentCategory.color} rounded-2xl flex items-center justify-center text-white text-2xl`}>
                <i className={currentCategory.icon}></i>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {getLocalizedText(occasion.nameLocal || occasion.name)}
            </h1>
            <p className="text-lg text-gray-600">
              {getLocalizedText(occasion.descriptionLocal || occasion.description)}
            </p>
            <div className="flex items-center justify-center space-x-2 mt-3 text-sm text-gray-500">
              <Sparkles className="w-4 h-4" />
              <span>{occasion.templateCount} unique designs will be generated</span>
            </div>
          </div>

          {/* Personalization Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Upload Section */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="w-5 h-5" />
                    <span>Upload Photo</span>
                  </div>
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative aspect-square rounded-xl border-2 border-dashed ${
                    selectedImage 
                      ? 'border-purple-300 bg-purple-50' 
                      : 'border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50'
                  } cursor-pointer transition-all overflow-hidden`}
                >
                  {selectedImage ? (
                    <img 
                      src={selectedImage} 
                      alt="Uploaded" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-6">
                      <Upload className="w-12 h-12 text-gray-400 mb-3" />
                      <p className="text-gray-600 font-medium mb-1">Click to upload image</p>
                      <p className="text-sm text-gray-500 text-center">
                        JPG, PNG, or WEBP (max 10MB)
                      </p>
                    </div>
                  )}
                  {selectedImage && (
                    <div className="absolute top-3 right-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Name Input Section */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Enter Name</span>
                  </div>
                </label>
                <div className="flex flex-col h-full">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter the name..."
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-lg font-medium"
                    maxLength={20}
                  />
                  <div className="mt-3 text-sm text-gray-500">
                    <p>• 2-20 characters</p>
                    <p>• This name will be added to all designs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="mt-8">
              <button
                onClick={handleGenerateImages}
                disabled={isGenerating || !selectedImage || !userName.trim()}
                className={`w-full py-4 rounded-full text-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
                  isGenerating || !selectedImage || !userName.trim()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-2xl transform hover:scale-105'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating {occasion.templateCount} Designs...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate My Images</span>
                  </>
                )}
              </button>
            </div>

            {/* Preview Info */}
            <div className="mt-6 p-4 bg-purple-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <i className="ri-image-line text-purple-600"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-purple-900">
                    {occasion.templateCount} High-Quality Images
                  </p>
                  <p className="text-xs text-purple-700">
                    Perfect for WhatsApp, Instagram, and social sharing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
