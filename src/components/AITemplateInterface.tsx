import React, { useState, useEffect } from 'react';
import { AITemplateGenerator, AITemplate, AITemplateConfig } from '../services/aiTemplateGenerator';

interface AITemplateInterfaceProps {
  onTemplateGenerated?: (template: AITemplate) => void;
  onBatchGenerated?: (templates: AITemplate[]) => void;
}

export default function AITemplateInterface({ onTemplateGenerated, onBatchGenerated }: AITemplateInterfaceProps) {
  const [config, setConfig] = useState<AITemplateConfig>({
    category: 'birthday',
    aspectRatio: '4:5',
    quality: 'premium'
  });
  const [generatedTemplate, setGeneratedTemplate] = useState<AITemplate | null>(null);
  const [batchTemplates, setBatchTemplates] = useState<AITemplate[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showBatchMode, setShowBatchMode] = useState(false);

  const categories = AITemplateGenerator.getAvailableCategories();
  const styles = AITemplateGenerator.getAvailableStyles();

  const handleGenerateSingle = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const template = AITemplateGenerator.generateTemplate(config);
      setGeneratedTemplate(template);
      setIsGenerating(false);
      onTemplateGenerated?.(template);
    }, 1500);
  };

  const handleGenerateBatch = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const templates = AITemplateGenerator.generateBatchTemplates(config);
      setBatchTemplates(templates);
      setIsGenerating(false);
      onBatchGenerated?.(templates);
    }, 2000);
  };

  const handleConfigChange = (key: keyof AITemplateConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const copyPrompt = (template: AITemplate) => {
    const prompt = AITemplateGenerator.generateAIPrompt(template);
    navigator.clipboard.writeText(prompt);
    alert('Prompt copied to clipboard!');
  };

  const validation = AITemplateGenerator.validateConfig(config);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Ultra-Premium AI Template Generator
          </h1>
          <p className="text-gray-600 text-lg">
            Generate cinematic, hyper-realistic templates for personalized wishes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-sm">⚙</span>
                </span>
                Configuration
              </h2>

              {/* Category Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={config.category}
                  onChange={(e) => handleConfigChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Festival Selection (for festivals category) */}
              {config.category === 'festivals' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Festival</label>
                  <select
                    value={config.festival || ''}
                    onChange={(e) => handleConfigChange('festival', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select Festival</option>
                    <option value="diwali">Diwali</option>
                    <option value="holi">Holi</option>
                    <option value="rakshabandhan">Raksha Bandhan</option>
                    <option value="ganesh">Ganesh Chaturthi</option>
                  </select>
                </div>
              )}

              {/* Style Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                <select
                  value={config.style || ''}
                  onChange={(e) => handleConfigChange('style', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {styles.map(style => (
                    <option key={style.name} value={style.name}>
                      {style.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Aspect Ratio */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Aspect Ratio</label>
                <select
                  value={config.aspectRatio}
                  onChange={(e) => handleConfigChange('aspectRatio', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="4:5">4:5 (Vertical)</option>
                  <option value="9:16">9:16 (Story)</option>
                  <option value="1:1">1:1 (Square)</option>
                </select>
              </div>

              {/* Quality */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
                <select
                  value={config.quality}
                  onChange={(e) => handleConfigChange('quality', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="ultra">Ultra</option>
                </select>
              </div>

              {/* Mood */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
                <input
                  type="text"
                  value={config.mood || ''}
                  onChange={(e) => handleConfigChange('mood', e.target.value)}
                  placeholder="e.g., premium, romantic, energetic"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Validation Errors */}
              {!validation.isValid && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                  {validation.errors.map((error, index) => (
                    <p key={index} className="text-red-600 text-sm">{error}</p>
                  ))}
                </div>
              )}

              {/* Generate Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleGenerateSingle}
                  disabled={!validation.isValid || isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Generating...' : 'Generate Single Template'}
                </button>
                
                <button
                  onClick={() => setShowBatchMode(!showBatchMode)}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  {showBatchMode ? 'Hide Batch Mode' : 'Show Batch Mode (8 Styles)'}
                </button>

                {showBatchMode && (
                  <button
                    onClick={handleGenerateBatch}
                    disabled={!validation.isValid || isGenerating}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? 'Generating Batch...' : 'Generate 8 Style Variations'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-sm">🎨</span>
                </span>
                Generated Templates
              </h2>

              {/* Single Template Result */}
              {generatedTemplate && (
                <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{generatedTemplate.name}</h3>
                  <p className="text-gray-600 mb-4">{generatedTemplate.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Portrait Area</h4>
                      <p className="text-sm text-gray-600">
                        {generatedTemplate.portraitArea.shape} at ({generatedTemplate.portraitArea.x}%, {generatedTemplate.portraitArea.y}%)
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Text Area</h4>
                      <p className="text-sm text-gray-600">
                        Font: {generatedTemplate.textArea.fontFamily}, Size: {generatedTemplate.textArea.fontSize}px
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Effects</h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedTemplate.effects.map((effect, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                          {effect}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Lighting</h4>
                    <p className="text-sm text-gray-600">{generatedTemplate.lighting}</p>
                  </div>

                  <button
                    onClick={() => copyPrompt(generatedTemplate)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    📋 Copy AI Prompt
                  </button>
                </div>
              )}

              {/* Batch Templates Result */}
              {batchTemplates.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">8 Style Variations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {batchTemplates.map((template, index) => (
                      <div key={template.id} className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                        <h4 className="font-medium text-gray-900 mb-2">{template.style}</h4>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        <button
                          onClick={() => copyPrompt(template)}
                          className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
                        >
                          📋 Copy Prompt
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!generatedTemplate && batchTemplates.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🎨</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Templates Generated</h3>
                  <p className="text-gray-600">
                    Configure your settings and click "Generate" to create AI templates
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
