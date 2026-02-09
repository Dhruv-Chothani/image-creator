import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { getOccasionsForCategory, Occasion } from '../../data/occasions';

export default function OccasionSelection() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get('category') || 'birthday';
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [occasions, setOccasions] = useState<Occasion[]>([]);

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
    setOccasions(getOccasionsForCategory(category));
  }, [category]);

  const getLocalizedText = (textObj: any) => {
    if (typeof textObj === 'string') return textObj;
    return textObj?.[selectedLanguage] || textObj?.en || '';
  };

  const handleOccasionSelect = (occasion: Occasion) => {
    navigate(`/personalize?category=${category}&occasion=${occasion.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/home')}
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

      {/* Hero Section */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className={`w-16 h-16 bg-gradient-to-br ${currentCategory.color} rounded-2xl flex items-center justify-center text-white text-2xl`}>
              <i className={currentCategory.icon}></i>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {getLocalizedText(currentCategory.name)}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Choose the perfect occasion for your personalized images
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Sparkles className="w-4 h-4" />
            <span>10-15 unique designs for each occasion</span>
          </div>
        </div>
      </div>

      {/* Occasions Grid */}
      <div className="pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {occasions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {occasions.map((occasion) => (
                <button
                  key={occasion.id}
                  onClick={() => handleOccasionSelect(occasion)}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${occasion.gradient} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                        <i className={`${occasion.icon} text-3xl`}></i>
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        {getLocalizedText(occasion.nameLocal || occasion.name)}
                      </h3>
                      <p className="text-sm text-white/90 text-center mb-3">
                        {getLocalizedText(occasion.descriptionLocal || occasion.description)}
                      </p>
                      <div className="flex items-center space-x-1 text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <i className="ri-image-line"></i>
                        <span>{occasion.templateCount} designs</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <i className="ri-arrow-right-line text-white"></i>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-inbox-line text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Occasions Found</h3>
              <p className="text-gray-600 mb-6">
                We're working on adding occasions for this category.
              </p>
              <button
                onClick={() => navigate('/home')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all"
              >
                Back to Categories
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              How it works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">1</span>
                </div>
                <p className="text-sm text-gray-600">Select Occasion</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <p className="text-sm text-gray-600">Upload Photo & Name</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <p className="text-sm text-gray-600">Generate & Download</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
