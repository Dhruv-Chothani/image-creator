// AI Template Generator for Crafto - Ultra-Premium AI Template Generation

export interface AITemplateConfig {
  category: string;
  festival?: string;
  mood?: string;
  style?: string;
  aspectRatio?: '4:5' | '9:16' | '1:1';
  quality?: 'standard' | 'premium' | 'ultra';
}

export interface AITemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: string;
  festival?: string;
  style: string;
  aspectRatio: string;
  portraitArea: {
    x: number;
    y: number;
    width: number;
    height: number;
    shape: 'oval' | 'circle' | 'rounded' | 'rectangular';
  };
  textArea: {
    x: number;
    y: number;
    maxWidth: number;
    fontSize: number;
    fontFamily: string;
    color: string;
  };
  background: {
    type: 'gradient' | 'image' | 'solid';
    colors: string[];
    description: string;
  };
  effects: string[];
  lighting: string;
  mood: string;
}

export class AITemplateGenerator {
  private static readonly BASE_PROMPT = `🧠 BASE PROMPT

You are a world-class generative AI visual designer specializing in festival greeting cards, cinematic posters, and hyper-realistic portrait compositions.

Generate a high-resolution vertical 4:5 image template for a personalized wishes app.

The template must:

leave a clean portrait area for user photo insertion

include glowing typography space for name + message

look cinematic and premium

layered depth

realistic lighting

subtle particle effects

festive symbolism

soft bokeh background

ultra-detailed textures

professional color grading

modern typography

No watermarks, no logos, no text except placeholder.

Output should feel like Midjourney / Firefly / SDXL quality.`;

  private static readonly CATEGORY_PROMPTS: Record<string, string> = {
    'birthday': `🎉 Birthday — Luxury Studio Portrait

Cinematic birthday greeting template, royal pastel palette, floating golden confetti, soft spotlight rim lighting, velvet background, subtle balloons in blur, glossy 3D typography placeholder saying "Happy Birthday", central oval portrait frame glowing with gold rim, shallow depth of field, ultra detailed, 8k render, premium photography look, volumetric light beams, sparkles in air.`,

    'diwali': `🪔 Festival — Diwali

Ultra-premium Diwali greeting template, oil lamps glowing, rangoli floor patterns, palace courtyard at night, warm amber lighting, floating embers, fireworks bokeh in sky, ornate golden photo frame at center, silk texture borders, cinematic lighting, shallow depth, festive royal Indian aesthetic, ultra photorealistic, 8k, volumetric fog.`,

    'holi': `🎨 Holi

Vibrant Holi greeting template, exploding colored powder frozen mid-air, slow motion photography look, rainbow lighting, energetic mood, glossy portrait frame, cinematic depth, festive atmosphere, ultra sharp.`,

    'rakshabandhan': `🎁 Raksha Bandhan

Elegant Raksha Bandhan template, rakhi threads macro texture, silk cloth background, golden diya lights, portrait frame with jewelry-style ornamentation, warm tones, premium cultural look.`,

    'ganesh': `🐘 Ganesh Chaturthi

Grand Ganesh Chaturthi greeting poster, temple interior glowing lamps, marigold garlands, misty incense smoke, divine spotlight beams, royal gold palette, carved stone textures, portrait area centered.`,

    'congratulations': `🎊 Congratulations

Luxury achievement poster template, marble stage, spotlight beams, gold foil particles raining, dark navy cinematic background, embossed typography area, glowing laurel wreath frame for photo, professional award ceremony vibe, depth layers, studio lighting, ultra detailed.`,

    'anniversary': `💍 Anniversary

Romantic anniversary portrait template, candle-lit ballroom, rose petals floating, soft pink and champagne tones, glowing heart-shaped portrait window, silk curtain backdrop, subtle fairy lights bokeh, dreamy lighting, cinematic depth, luxury wedding album style, ultra realistic.`,

    'good-morning': `🌅 Good Morning

Golden sunrise background, dewy flowers in foreground blur, sun rays through mist, glass text area glowing softly, minimal zen composition, natural pastel palette, airy mood, premium lifestyle photography style.`,

    'motivation': `💪 Motivation

Epic motivational poster template, mountain peak at sunrise, silhouette frame for portrait, glowing horizon light, bold cinematic typography area, flying dust particles, dramatic contrast, movie poster style, ultra high detail.`
  };

  private static readonly STYLE_VARIATIONS = [
    {
      name: 'luxury royal style',
      description: 'Opulent gold and jewel tones, ornate frames, royal aesthetics'
    },
    {
      name: 'pastel modern',
      description: 'Soft pastel colors, clean lines, contemporary minimalist design'
    },
    {
      name: 'neon glow',
      description: 'Vibrant neon colors, glowing effects, cyberpunk aesthetics'
    },
    {
      name: 'cinematic dark',
      description: 'Dark moody backgrounds, dramatic lighting, film noir style'
    },
    {
      name: 'floral soft',
      description: 'Delicate flower patterns, soft botanical elements, romantic feel'
    },
    {
      name: 'watercolor',
      description: 'Artistic watercolor textures, flowing colors, painterly style'
    },
    {
      name: 'minimal elegant',
      description: 'Clean simple design, ample whitespace, sophisticated typography'
    },
    {
      name: 'festive explosion',
      description: 'Burst of festive elements, vibrant colors, celebratory mood'
    }
  ];

  static generateTemplate(config: AITemplateConfig): AITemplate {
    const { category, festival, mood, style = 'luxury royal style', aspectRatio = '4:5' } = config;
    
    const basePrompt = this.CATEGORY_PROMPTS[category] || this.CATEGORY_PROMPTS['birthday'];
    const fullPrompt = `${this.BASE_PROMPT}\n\nCategory: ${category}${festival ? `\nFestival: ${festival}` : ''}\nMood: ${mood || 'premium'}\n\n${basePrompt}\n\nStyle: ${style}`;
    
    const templateId = `ai-${category}-${festival || 'default'}-${Date.now()}`;
    
    return {
      id: templateId,
      name: `${category.charAt(0).toUpperCase() + category.slice(1)} Template${festival ? ` - ${festival}` : ''}`,
      description: `AI-generated ${category} template with ${style} aesthetic`,
      prompt: fullPrompt,
      category,
      festival,
      style,
      aspectRatio,
      portraitArea: this.getPortraitArea(category),
      textArea: this.getTextArea(category),
      background: this.getBackgroundConfig(category),
      effects: this.getEffects(category),
      lighting: this.getLighting(category),
      mood: mood || 'premium'
    };
  }

  static generateBatchTemplates(config: AITemplateConfig): AITemplate[] {
    const { category, festival, mood } = config;
    
    return this.STYLE_VARIATIONS.map((styleVariation, index) => {
      return this.generateTemplate({
        ...config,
        style: styleVariation.name,
        mood: mood || 'premium'
      });
    });
  }

  private static getPortraitArea(category: string) {
    const portraitAreas: Record<string, any> = {
      'birthday': { x: 50, y: 35, width: 25, height: 30, shape: 'oval' as const },
      'diwali': { x: 50, y: 40, width: 22, height: 25, shape: 'circle' as const },
      'holi': { x: 50, y: 35, width: 25, height: 30, shape: 'rounded' as const },
      'congratulations': { x: 50, y: 30, width: 28, height: 35, shape: 'rectangular' as const },
      'anniversary': { x: 50, y: 35, width: 25, height: 30, shape: 'heart' as const },
      'good-morning': { x: 50, y: 40, width: 20, height: 25, shape: 'circle' as const },
      'motivation': { x: 50, y: 25, width: 30, height: 40, shape: 'rectangular' as const }
    };
    
    return portraitAreas[category] || portraitAreas['birthday'];
  }

  private static getTextArea(category: string) {
    const textAreas: Record<string, any> = {
      'birthday': { x: 50, y: 15, maxWidth: 80, fontSize: 48, fontFamily: 'Playfair Display', color: '#FFD700' },
      'diwali': { x: 50, y: 10, maxWidth: 85, fontSize: 52, fontFamily: 'Cinzel', color: '#FFA500' },
      'holi': { x: 50, y: 15, maxWidth: 80, fontSize: 45, fontFamily: 'Montserrat', color: '#FF1493' },
      'congratulations': { x: 50, y: 70, maxWidth: 75, fontSize: 50, fontFamily: 'Bebas Neue', color: '#FFD700' },
      'anniversary': { x: 50, y: 15, maxWidth: 80, fontSize: 46, fontFamily: 'Dancing Script', color: '#FF69B4' },
      'good-morning': { x: 50, y: 75, maxWidth: 70, fontSize: 42, fontFamily: 'Lato', color: '#FFA500' },
      'motivation': { x: 50, y: 70, maxWidth: 85, fontSize: 54, fontFamily: 'Oswald', color: '#FFFFFF' }
    };
    
    return textAreas[category] || textAreas['birthday'];
  }

  private static getBackgroundConfig(category: string) {
    const backgrounds: Record<string, any> = {
      'birthday': { type: 'gradient' as const, colors: ['#FFE4E1', '#FFC0CB', '#FFB6C1'], description: 'Soft pastel pink gradient with confetti' },
      'diwali': { type: 'gradient' as const, colors: ['#FF8C00', '#FFD700', '#FFA500'], description: 'Warm amber and gold gradient with rangoli patterns' },
      'holi': { type: 'gradient' as const, colors: ['#FF1493', '#00CED1', '#FFD700', '#FF69B4'], description: 'Vibrant rainbow gradient with color powder effects' },
      'congratulations': { type: 'gradient' as const, colors: ['#000080', '#191970', '#FFD700'], description: 'Dark navy background with gold particle effects' },
      'anniversary': { type: 'gradient' as const, colors: ['#FFC0CB', '#FFE4E1', '#F0E68C'], description: 'Soft pink and champagne gradient with rose petals' },
      'good-morning': { type: 'gradient' as const, colors: ['#87CEEB', '#FFE4B5', '#FFA500'], description: 'Golden sunrise gradient with soft morning light' },
      'motivation': { type: 'gradient' as const, colors: ['#2F4F4F', '#FF6347', '#FFD700'], description: 'Dramatic dark gradient with sunrise horizon' }
    };
    
    return backgrounds[category] || backgrounds['birthday'];
  }

  private static getEffects(category: string): string[] {
    const effects: Record<string, string[]> = {
      'birthday': ['golden confetti', 'sparkles', 'soft bokeh', 'volumetric light beams'],
      'diwali': ['glowing oil lamps', 'floating embers', 'fireworks bokeh', 'rangoli patterns', 'volumetric fog'],
      'holi': ['exploding color powder', 'rainbow lighting', 'flying particles', 'motion blur effects'],
      'congratulations': ['gold foil particles', 'spotlight beams', 'laurel wreath glow', 'stage lighting'],
      'anniversary': ['floating rose petals', 'fairy lights bokeh', 'candle glow', 'silk curtain effects'],
      'good-morning': ['sun rays through mist', 'dewy flowers', 'soft glow effects', 'morning haze'],
      'motivation': ['flying dust particles', 'dramatic contrast', 'mountain mist', 'sunrise glow']
    };
    
    return effects[category] || effects['birthday'];
  }

  private static getLighting(category: string): string {
    const lighting: Record<string, string> = {
      'birthday': 'Soft spotlight rim lighting with golden glow',
      'diwali': 'Warm amber cinematic lighting with oil lamp glow',
      'holi': 'Vibrant rainbow lighting with energetic mood',
      'congratulations': 'Professional studio spotlight with dramatic beams',
      'anniversary': 'Romantic candle-lit soft lighting',
      'good-morning': 'Natural golden sunrise with soft morning light',
      'motivation': 'Epic cinematic lighting with dramatic contrast'
    };
    
    return lighting[category] || lighting['birthday'];
  }

  // Get available categories
  static getAvailableCategories(): string[] {
    return Object.keys(this.CATEGORY_PROMPTS);
  }

  // Get available styles
  static getAvailableStyles(): Array<{name: string, description: string}> {
    return this.STYLE_VARIATIONS;
  }

  // Generate prompt for external AI service
  static generateAIPrompt(template: AITemplate): string {
    return template.prompt;
  }

  // Validate template configuration
  static validateConfig(config: AITemplateConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config.category) {
      errors.push('Category is required');
    }
    
    if (config.category && !this.CATEGORY_PROMPTS[config.category]) {
      errors.push(`Invalid category: ${config.category}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
