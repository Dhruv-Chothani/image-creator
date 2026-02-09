import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import { autoSetBackgroundImages } from '../../services/canvasImageGenerator';

export default function Home() {
  // Auto-set background images for all templates on app load
  React.useEffect(() => {
    autoSetBackgroundImages();
  }, []);

  const categories = [
    {
      id: 'good-morning',
      name: 'Good Morning',
      icon: 'ri-sun-fill',
      gradient: 'from-yellow-400 to-orange-500',
      image: 'https://readdy.ai/api/search-image?query=Beautiful%20sunrise%20scene%20with%20golden%20sun%20rays%2C%20morning%20sky%20with%20soft%20clouds%2C%20fresh%20flowers%2C%20tea%20cup%2C%20peaceful%20and%20energetic%20morning%20atmosphere%2C%20warm%20yellow%20and%20orange%20gradient%20background%2C%20high-quality%20photography%2C%20centered%20composition%2C%20bright%20morning%20lighting%2C%20inspirational%20aesthetic%2C%20Instagram-worthy%20style&width=400&height=300&seq=cat-morning-001&orientation=landscape'
    },
    {
      id: 'festivals',
      name: 'Festivals',
      icon: 'ri-gift-fill',
      gradient: 'from-green-400 to-teal-500',
      link: '/festival-occasions',
      image: 'https://readdy.ai/api/search-image?query=Indian%20festival%20celebration%20scene%20with%20colorful%20rangoli%2C%20diyas%2C%20marigold%20flowers%2C%20decorative%20lights%2C%20vibrant%20multi-colored%20background%20with%20sparkles%2C%20joyful%20and%20celebratory%20atmosphere%2C%20Diwali%20Holi%20aesthetic%2C%20high-quality%20photography%2C%20centered%20composition%2C%20bright%20lighting%2C%20traditional%20Indian%20festival%20style&width=400&height=300&seq=cat-festivals-002&orientation=landscape'
    },
    {
      id: 'birthday',
      name: 'Birthday',
      icon: 'ri-cake-3-fill',
      gradient: 'from-pink-400 to-purple-500',
      image: 'https://readdy.ai/api/search-image?query=Vibrant%20birthday%20celebration%20scene%20with%20colorful%20balloons%2C%20confetti%2C%20birthday%20cake%20with%20candles%2C%20festive%20decorations%2C%20soft%20pastel%20background%20with%20bokeh%20lights%2C%20cheerful%20and%20joyful%20atmosphere%2C%20high-quality%20photography%2C%20centered%20composition%2C%20bright%20and%20warm%20lighting%2C%20party%20aesthetic%2C%20Instagram-worthy%20style&width=400&height=300&seq=cat-birthday-002&orientation=landscape'
    },
    {
      id: 'anniversary',
      name: 'Anniversary',
      icon: 'ri-calendar-heart-fill',
      gradient: 'from-rose-400 to-pink-500',
      image: 'https://readdy.ai/api/search-image?query=Elegant%20anniversary%20celebration%20with%20champagne%20glasses%2C%20red%20roses%2C%20romantic%20candles%2C%20and%20golden%20decorations%2C%20sophisticated%20burgundy%20and%20gold%20gradient%20background%2C%20luxurious%20and%20intimate%20atmosphere%2C%20high-quality%20photography%2C%20centered%20composition%2C%20warm%20ambient%20lighting%2C%20celebration%20aesthetic%2C%20Instagram-worthy%20style&width=400&height=300&seq=cat-anniversary-002&orientation=landscape'
    },
    {
      id: 'motivation',
      name: 'Motivation',
      icon: 'ri-rocket-fill',
      gradient: 'from-blue-400 to-cyan-500',
      image: 'https://readdy.ai/api/search-image?query=Inspirational%20motivation%20scene%20with%20mountain%20peak%2C%20success%20symbols%2C%20upward%20arrows%2C%20trophy%2C%20achievement%20elements%2C%20energetic%20and%20powerful%20atmosphere%2C%20vibrant%20blue%20and%20gold%20gradient%20background%2C%20high-quality%20photography%2C%20centered%20composition%2C%20dynamic%20lighting%2C%20success%20aesthetic%2C%20Instagram-worthy%20style&width=400&height=300&seq=cat-motivation-002&orientation=landscape'
    },
    {
      id: 'congratulations',
      name: 'Congratulations',
      icon: 'ri-trophy-fill',
      gradient: 'from-amber-400 to-yellow-500',
      image: 'https://cdnnew.interflora.in/f_auto,q_auto,t_pnopt8prodlp/products/p-the-grand-golden-405416-m.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="https://public.readdy.ai/ai/img_res/576122b2-b97a-4006-9790-606ac907714f.png" 
                alt="Logo" 
                className="h-10 w-10 object-contain"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Crafto
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-purple-600 transition-colors text-sm font-medium">
                Sign In
              </button>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Create Stunning
            <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Personalized Images
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload one photo and instantly generate 7-8 beautiful designs. Perfect for birthdays, celebrations, and special moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to={`/simple-personalize?category=birthday`}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105 flex items-center space-x-2"
            >
              <span>Start Creating</span>
              <i className="ri-arrow-right-line"></i>
            </Link>
            <button className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 transition-all flex items-center space-x-2">
              <i className="ri-play-circle-line"></i>
              <span>Watch Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <i className="ri-flashlight-line text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600">Generate 10-20 personalized designs in seconds. No waiting, instant results.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                <i className="ri-image-line text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">High Quality</h3>
              <p className="text-gray-600">Instagram-ready, WhatsApp-ready images with perfect resolution.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mb-4">
                <i className="ri-share-line text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Sharing</h3>
              <p className="text-gray-600">Share directly to WhatsApp, Instagram, Facebook, or download as ZIP.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Category
            </h2>
            <p className="text-lg text-gray-600">
              Select from our curated collection of templates
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.link || `/simple-personalize?category=${category.id}`}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-60 group-hover:opacity-70 transition-opacity`}></div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <i className={`${category.icon} text-5xl mb-3`}></i>
                  <h3 className="text-2xl font-bold">{category.name}</h3>
                  <p className="text-sm mt-2 opacity-90">Tap to explore</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Create stunning designs in 3 simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Choose Category</h3>
              <p className="text-gray-600">Select from Birthday, Love, Motivation, Festivals, and more</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Upload Photo</h3>
              <p className="text-gray-600">Upload one image and let our AI do the magic</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Download & Share</h3>
              <p className="text-gray-600">Get 10-20 designs instantly, download or share directly</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-12 text-center shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Create Magic?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Join thousands of users creating stunning personalized images every day
          </p>
          <Link 
            to="/occasion?category=birthday"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Start Creating Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="https://public.readdy.ai/ai/img_res/576122b2-b97a-4006-9790-606ac907714f.png" 
                  alt="Logo" 
                  className="h-8 w-8 object-contain"
                />
                <span className="text-xl font-bold">Crafto</span>
              </div>
              <p className="text-gray-400 text-sm">
                Create stunning personalized images in seconds
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">License</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Crafto. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
