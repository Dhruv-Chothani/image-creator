import { useState, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Upload, Settings, Palette, Zap, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { generateCanvasImage, getTemplatesForCategory, Template } from '../services/canvasImageGenerator';

interface EnhancedCategoryFormProps {
  category: string;
}

export default function EnhancedCategoryForm({ category }: EnhancedCategoryFormProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMode, setGenerationMode] = useState<'api' | 'canvas'>('api');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = {
    birthday: { name: 'Birthday', icon: 'ri-cake-3-line', color: 'from-pink-400 to-purple-500' },
    love: { name: 'Love', icon: 'ri-heart-3-line', color: 'from-red-400 to-pink-500' },
    motivation: { name: 'Motivation', icon: 'ri-rocket-line', color: 'from-orange-400 to-yellow-500' },
    festivals: { name: 'Festivals', icon: 'ri-gift-line', color: 'from-green-400 to-teal-500' },
    trending: { name: 'Trending', icon: 'ri-fire-line', color: 'from-blue-400 to-indigo-500' },
    anniversary: { name: 'Anniversary', icon: 'ri-calendar-heart-line', color: 'from-purple-400 to-pink-500' }
  };

  const currentCategory = categories[category as keyof typeof categories] || categories.birthday;
  const templates = getTemplatesForCategory(category);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

  const generateApiImages = () => {
    if (!selectedImage || !userName.trim()) return;
    
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      navigate('/gallery', { 
        state: { 
          category, 
          userImage: selectedImage,
          userName,
          mode: 'api'
        } 
      });
    }, 2000);
  };

  const generateCanvasImages = async () => {
    if (!selectedImage || !userName.trim() || !selectedTemplate) return;
    
    setIsGenerating(true);
    try {
      const generatedImage = await generateCanvasImage(selectedTemplate, selectedImage, userName, 0);
      setIsGenerating(false);
      navigate('/gallery', { 
        state: { 
          category, 
          userImage: selectedImage,
          userName,
          mode: 'canvas',
          generatedImages: [generatedImage],
          template: selectedTemplate
        } 
      });
    } catch (error) {
      console.error('Canvas generation failed:', error);
      setIsGenerating(false);
      alert('Failed to generate image. Please try again.');
    }
  };

  const handleGenerate = () => {
    if (generationMode === 'api') {
      generateApiImages();
    } else {
      generateCanvasImages();
    }
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
              <ArrowLeft className="text-xl" />
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
              Create stunning personalized designs with advanced options
            </p>
          </div>

          {/* Generation Mode Selection */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Generation Mode</h2>
              <p className="text-gray-600">Select how you want to create your images</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setGenerationMode('api')}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  generationMode === 'api' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="h-6 w-6 text-purple-600" />
                  <span className="font-semibold text-lg">AI Generation</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Generate multiple images instantly with AI
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Fast</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Multiple Styles</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Batch Generation</span>
                </div>
              </button>

              <button
                onClick={() => setGenerationMode('canvas')}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  generationMode === 'canvas' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Palette className="h-6 w-6 text-purple-600" />
                  <span className="font-semibold text-lg">Canvas Generation</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  High-quality templates with advanced styling
                </p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Premium Quality</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Custom Templates</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Personalized Text</span>
                </div>
              </button>
            </div>

            {/* Template Selection for Canvas Mode */}
            {generationMode === 'canvas' && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Template</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedTemplate?.id === template.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-left">
                        <div className="font-medium text-gray-900 mb-1">{template.greeting.line1}</div>
                        {template.greeting.line2 && (
                          <div className="text-sm text-gray-600 mb-2">{template.greeting.line2}</div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                            {template.frame.shape}
                          </span>
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                            {template.background.pattern || 'solid'}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* User Input Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Photo *
                </label>
                {!selectedImage ? (
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Uploaded"
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 transition-all"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-4">Click to upload photo</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
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

            {/* Generate Button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !selectedImage || !userName.trim() || (generationMode === 'canvas' && !selectedTemplate)}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Generate Images
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
