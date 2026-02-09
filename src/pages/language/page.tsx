import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LanguageSelection() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const languages = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇬🇧',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिंदी',
      flag: '🇮🇳',
      gradient: 'from-orange-500 to-green-600'
    },
    {
      code: 'te',
      name: 'Telugu',
      nativeName: 'తెలుగు',
      flag: '🇮🇳',
      gradient: 'from-yellow-500 to-red-600'
    }
  ];

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
    localStorage.setItem('selectedLanguage', code);
    setTimeout(() => {
      navigate('/home');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="https://public.readdy.ai/ai/img_res/576122b2-b97a-4006-9790-606ac907714f.png" 
              alt="Logo" 
              className="h-16 w-16 object-contain drop-shadow-lg"
            />
            <span className="text-4xl font-bold text-white drop-shadow-lg">
              Crafto
            </span>
          </div>
          <p className="text-white/90 text-lg">
            Select Your Language
          </p>
          <p className="text-white/80 text-sm mt-2">
            अपनी भाषा चुनें | మీ భాషను ఎంచుకోండి
          </p>
        </div>

        {/* Language Cards */}
        <div className="space-y-4">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className={`w-full bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 ${
                selectedLanguage === language.code ? 'ring-4 ring-white scale-105' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${language.gradient} rounded-xl flex items-center justify-center text-3xl`}>
                    {language.flag}
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {language.nativeName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {language.name}
                    </p>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedLanguage === language.code 
                    ? 'border-purple-600 bg-purple-600' 
                    : 'border-gray-300'
                }`}>
                  {selectedLanguage === language.code && (
                    <i className="ri-check-line text-white text-lg"></i>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <div className="mt-8">
          <button
            onClick={() => selectedLanguage && handleLanguageSelect(selectedLanguage)}
            disabled={!selectedLanguage}
            className={`w-full py-4 rounded-full text-lg font-semibold transition-all ${
              selectedLanguage
                ? 'bg-white text-purple-600 hover:shadow-2xl transform hover:scale-105'
                : 'bg-white/50 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-8 text-white/80 text-sm">
          <p>Create stunning personalized images</p>
          <p className="mt-1">in your preferred language</p>
        </div>
      </div>
    </div>
  );
}
