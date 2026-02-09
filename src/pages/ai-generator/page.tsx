import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Zap, Crown, Star } from 'lucide-react';
import AITemplateInterface from '../../components/AITemplateInterface';
import BackgroundUploader from '../../components/BackgroundUploader';
import { AITemplate } from '../../services/aiTemplateGenerator';

export default function AIGeneratorPage() {
  const [generatedTemplates, setGeneratedTemplates] = useState<AITemplate[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleTemplateGenerated = (template: AITemplate) => {
    setGeneratedTemplates(prev => [...prev, template]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleBatchGenerated = (templates: AITemplate[]) => {
    setGeneratedTemplates(prev => [...prev, ...templates]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const copyAllPrompts = () => {
    const allPrompts = generatedTemplates.map(template => 
      `// ${template.name}\n${template.prompt}\n\n`
    ).join('');
    
    navigator.clipboard.writeText(allPrompts);
    alert('All prompts copied to clipboard!');
  };

  const clearAll = () => {
    setGeneratedTemplates([]);
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
            
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <Link
                to="/simple-personalize"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all"
              >
                Use Templates
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center">
          <Sparkles className="w-5 h-5 mr-2" />
          Template Generated Successfully!
        </div>
      )}

      {/* Hero Section */}
      <div className="pt-24 pb-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white mb-6">
            <Crown className="w-5 h-5" />
            <span className="text-lg font-semibold">AI Template Generator</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Ultra-Premium
            <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              AI Template Creation
            </span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Generate cinematic, hyper-realistic templates with Midjourney/Firefly quality. 
            Perfect for personalized wishes, festival greetings, and celebration cards.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700">
              <Zap className="w-4 h-4" />
              <span className="font-medium">Instant Generation</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700">
              <Star className="w-4 h-4" />
              <span className="font-medium">8 Style Variations</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700">
              <Crown className="w-4 h-4" />
              <span className="font-medium">Premium Quality</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Background Uploader */}
          <div className="lg:col-span-1">
            <BackgroundUploader onBackgroundSet={() => {
              // Refresh templates when background changes
              setGeneratedTemplates([]);
            }} />
          </div>
          
          {/* AI Template Interface */}
          <div className="lg:col-span-2">
            <AITemplateInterface 
              onTemplateGenerated={handleTemplateGenerated}
              onBatchGenerated={handleBatchGenerated}
            />
          </div>
        </div>
      </div>

      {/* Generated Templates Summary */}
      {generatedTemplates.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 pb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Generated Templates ({generatedTemplates.length})
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={copyAllPrompts}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  📋 Copy All Prompts
                </button>
                <button
                  onClick={clearAll}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-all"
                >
                  🗑️ Clear All
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedTemplates.map((template, index) => (
                <div key={template.id} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border">
                  <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{template.style}</p>
                  <div className="text-xs text-gray-500">
                    Category: {template.category} | Quality: {template.aspectRatio}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            AI Template Generator by Crafto - Create stunning designs with AI
          </p>
        </div>
      </footer>
    </div>
  );
}
