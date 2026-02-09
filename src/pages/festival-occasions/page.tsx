import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Sparkles, Calendar, Gift, Heart, Sun, Moon, Flower, Flame } from 'lucide-react';

export default function FestivalOccasionsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const festivals = [
    {
      id: 'diwali',
      name: 'Diwali',
      icon: 'ri-lightbulb-fill',
      gradient: 'from-orange-400 to-yellow-500',
      bgColor: 'bg-gradient-to-br from-orange-100 to-yellow-200',
      description: 'Festival of Lights',
      blessings: ['दीपावली की हार्दिक शुभकामनाएं', 'Ganpati Bappa Morya!', 'Shubh Diwali', 'Lakshmi Ki Jai!'],
      emoji: '🪔'
    },
    {
      id: 'holi',
      name: 'Holi',
      icon: 'ri-palette-fill',
      gradient: 'from-pink-400 to-purple-500',
      bgColor: 'bg-gradient-to-br from-pink-100 to-purple-200',
      description: 'Festival of Colors',
      blessings: ['Rang Barse!', 'Bura Na Maano Holi Hai!', 'Happy Holi', 'Colors of Joy!'],
      emoji: '🎨'
    },
    {
      id: 'sankranti',
      name: 'Makar Sankranti',
      icon: 'ri-sun-fill',
      gradient: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-gradient-to-br from-yellow-100 to-orange-200',
      description: 'Harvest Festival',
      blessings: ['Happy Sankranti', 'Uttarayan Celebrations', 'Til Gul Ghya', 'New Harvest Joy'],
      emoji: '🪁'
    },
    {
      id: 'rakshabandhan',
      name: 'Raksha Bandhan',
      icon: 'ri-heart-3-fill',
      gradient: 'from-red-400 to-pink-500',
      bgColor: 'bg-gradient-to-br from-red-100 to-pink-200',
      description: 'Bond of Protection',
      blessings: ['Happy Raksha Bandhan', 'Brother-Sister Love', 'Sacred Bond', 'Protective Thread'],
      emoji: '🎀'
    },
    {
      id: 'ganesh-chaturthi',
      name: 'Ganesh Chaturthi',
      icon: 'ri-emotion-happy-fill',
      gradient: 'from-green-400 to-teal-500',
      bgColor: 'bg-gradient-to-br from-green-100 to-teal-200',
      description: 'Lord Ganesha Festival',
      blessings: ['Ganpati Bappa Morya!', 'Happy Ganesh Chaturthi', 'Lord Ganesha Blessings', 'Vinayaka Chavithi'],
      emoji: '🙏'
    },
    {
      id: 'navratri',
      name: 'Navratri',
      icon: 'ri-moon-fill',
      gradient: 'from-purple-400 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-100 to-pink-200',
      description: 'Nine Nights Festival',
      blessings: ['Happy Navratri', 'Durga Puja', 'Garba Nights', 'Divine Mother'],
      emoji: '🌙'
    },
    {
      id: 'dussehra',
      name: 'Dussehra',
      icon: 'ri-sword-fill',
      gradient: 'from-amber-400 to-orange-500',
      bgColor: 'bg-gradient-to-br from-amber-100 to-orange-200',
      description: 'Victory of Good',
      blessings: ['Happy Dussehra', 'Victory of Good', 'Durga Wins', 'Ravana Dahan'],
      emoji: '⚔️'
    },
    {
      id: 'christmas',
      name: 'Christmas',
      icon: 'ri-gift-fill',
      gradient: 'from-red-400 to-green-500',
      bgColor: 'bg-gradient-to-br from-red-100 to-green-200',
      description: 'Festival of Joy',
      blessings: ['Ho Ho Ho!', 'Merry Christmas', 'Joy to the World', 'Santa Claus Magic'],
      emoji: '🎄'
    },
    {
      id: 'eid',
      name: 'Eid',
      icon: 'ri-moon-star-fill',
      gradient: 'from-blue-400 to-purple-500',
      bgColor: 'bg-gradient-to-br from-blue-100 to-purple-200',
      description: 'Festival of Brotherhood',
      blessings: ['Eid Mubarak', 'Happy Eid', 'Blessed Festival', 'Joyful Celebration'],
      emoji: '🌙'
    },
    {
      id: 'pongal',
      name: 'Pongal',
      icon: 'ri-plant-fill',
      gradient: 'from-yellow-400 to-green-500',
      bgColor: 'bg-gradient-to-br from-yellow-100 to-green-200',
      description: 'Tamil Harvest Festival',
      blessings: ['Happy Pongal', 'Harvest Joy', 'Sweet Rice', 'New Beginnings'],
      emoji: '🌾'
    },
    {
      id: 'baisakhi',
      name: 'Baisakhi',
      icon: 'ri-wheat-fill',
      gradient: 'from-yellow-400 to-amber-500',
      bgColor: 'bg-gradient-to-br from-yellow-100 to-amber-200',
      description: 'Punjabi Harvest Festival',
      blessings: ['Happy Baisakhi', 'Harvest Celebration', 'Golden Fields', 'Joyful Harvest'],
      emoji: '🌾'
    },
    {
      id: 'onam',
      name: 'Onam',
      icon: 'ri-flower-fill',
      gradient: 'from-pink-400 to-yellow-500',
      bgColor: 'bg-gradient-to-br from-pink-100 to-yellow-200',
      description: 'Kerala Harvest Festival',
      blessings: ['Happy Onam', 'Flower Carpet', 'King Mahabali', 'Harvest Feast'],
      emoji: '🌺'
    }
  ];

  const handleFestivalSelect = (festivalId: string) => {
    navigate(`/simple-personalize?category=festivals&festival=${festivalId}`);
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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-green-400 to-teal-500 text-white mb-6">
              <i className="ri-gift-fill text-xl"></i>
              <span className="text-lg font-semibold">Festivals</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Festival
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select a festival to create personalized images with traditional blessings and wishes
            </p>
          </div>

          {/* Festival Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {festivals.map((festival) => (
              <button
                key={festival.id}
                onClick={() => handleFestivalSelect(festival.id)}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 text-left"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <div className={`w-full h-full ${festival.bgColor} group-hover:scale-110 transition-transform duration-500`}></div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${festival.gradient} opacity-80 group-hover:opacity-90 transition-opacity`}></div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  <div className="text-4xl mb-2">{festival.emoji}</div>
                  <i className={`${festival.icon} text-3xl mb-2`}></i>
                  <h3 className="text-xl font-bold text-center">{festival.name}</h3>
                  <p className="text-sm mt-1 opacity-90 text-center">{festival.description}</p>
                </div>
                
                {/* Blessings Preview */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-white text-center">
                    {festival.blessings[0]}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Features Section */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-purple-100 text-purple-700 mb-6">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Festival Special Features</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Traditional Blessings</h3>
                <p className="text-sm text-gray-600">Authentic festival wishes in multiple languages</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Flower className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Festival Themes</h3>
                <p className="text-sm text-gray-600">Colors and designs matching each festival</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cultural Elements</h3>
                <p className="text-sm text-gray-600">Traditional symbols and decorations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
