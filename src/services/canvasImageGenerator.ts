// Template interfaces from Project A
export interface Template {
  id: string;
  occasionId: string;
  layout: TemplateLayout;
  background: BackgroundConfig;
  frame: FrameConfig;
  greeting: GreetingConfig;
  nameStyle: NameStyleConfig;
  decorations: DecorationConfig;
}

export interface TemplateLayout {
  type: "center" | "top" | "bottom" | "left" | "split" | "corner" | "fullBg" | "banner";
}

export interface BackgroundConfig {
  gradient: string;
  overlay?: string;
  pattern?: "dots" | "stars" | "hearts" | "floral" | "sparkles" | "confetti" | "waves" | "mandala" | "diyas" | "snowflakes" | "crescents" | "rangoli" | "balloons" | "ribbons" | "none";
}

export interface FrameConfig {
  shape: "circle" | "rounded" | "heart" | "diamond" | "oval" | "hexagon" | "star" | "arch";
  x: number;
  y: number;
  size: number;
  borderColor: string;
  borderWidth: number;
  glowColor?: string;
  shadow?: boolean;
}

export interface GreetingConfig {
  line1: string;
  line2?: string;
  line1Size: number;
  line2Size?: number;
  color: string;
  fontStyle: "script" | "elegant" | "playful";
  y: number;
}

export interface NameStyleConfig {
  fontSize: number;
  color: string;
  y: number;
  prefix?: string;
  suffix?: string;
  badge?: boolean;
  badgeColor?: string;
}

export interface DecorationConfig {
  topEmoji?: string;
  bottomEmoji?: string;
  cornerEmojis?: string[];
  borderDecor?: "gold" | "floral" | "sparkle" | "ribbon" | "none";
}

// Canvas-based image generator
const W = 800;
const H = 1000;

function drawShapePath(ctx: CanvasRenderingContext2D, shape: string, cx: number, cy: number, size: number) {
  const r = size;
  ctx.beginPath();
  switch (shape) {
    case "circle":
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      break;
    case "oval":
      ctx.ellipse(cx, cy, r, r * 1.25, 0, 0, Math.PI * 2);
      break;
    case "rounded":
      ctx.roundRect(cx - r, cy - r, r * 2, r * 2, r * 0.2);
      break;
    case "heart": {
      const s = r * 1.15;
      ctx.moveTo(cx, cy + s * 0.7);
      ctx.bezierCurveTo(cx - s * 1.3, cy - s * 0.2, cx - s * 0.7, cy - s * 1.1, cx, cy - s * 0.45);
      ctx.bezierCurveTo(cx + s * 0.7, cy - s * 1.1, cx + s * 1.3, cy - s * 0.2, cx, cy + s * 0.7);
      break;
    }
    case "diamond": {
      ctx.moveTo(cx, cy - r * 1.1);
      ctx.lineTo(cx + r * 0.75, cy);
      ctx.lineTo(cx, cy + r * 1.1);
      ctx.lineTo(cx - r * 0.75, cy);
      ctx.closePath();
      break;
    }
    case "hexagon":
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    case "star":
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        const rad = i % 2 === 0 ? r : r * 0.5;
        const px = cx + rad * Math.cos(angle);
        const py = cy + rad * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    case "arch": {
      ctx.moveTo(cx - r, cy + r * 0.4);
      ctx.lineTo(cx - r, cy - r * 0.3);
      ctx.arcTo(cx - r, cy - r, cx, cy - r, r);
      ctx.arcTo(cx + r, cy - r, cx + r, cy - r * 0.3, r);
      ctx.lineTo(cx + r, cy + r * 0.4);
      ctx.closePath();
      break;
    }
  }
}

function parseGradient(ctx: CanvasRenderingContext2D, str: string): CanvasGradient {
  const colors = str.match(/#[0-9a-fA-F]{6}/g) || ["#667eea", "#764ba2"];
  const angleMatch = str.match(/(\d+)deg/);
  const angle = angleMatch ? parseInt(angleMatch[1]) : 135;
  const rad = (angle * Math.PI) / 180;
  const dx = Math.cos(rad) * W;
  const dy = Math.sin(rad) * H;
  const g = ctx.createLinearGradient(W / 2 - dx / 2, H / 2 - dy / 2, W / 2 + dx / 2, H / 2 + dy / 2);
  colors.forEach((c, i) => g.addColorStop(i / (colors.length - 1), c));
  return g;
}

function drawPattern(ctx: CanvasRenderingContext2D, pattern: string | undefined) {
  if (!pattern || pattern === "none") return;
  ctx.save();

  const items: { draw: () => void }[] = [];

  switch (pattern) {
    case "dots":
      ctx.globalAlpha = 0.06;
      ctx.fillStyle = "#fff";
      for (let x = 20; x < W; x += 50) {
        for (let y = 20; y < H; y += 50) {
          items.push({ draw: () => { ctx.beginPath(); ctx.arc(x + Math.sin(y) * 5, y, 4, 0, Math.PI * 2); ctx.fill(); } });
        }
      }
      break;
    case "stars":
      ctx.globalAlpha = 0.1;
      ctx.font = "28px serif";
      ctx.fillStyle = "#fff";
      for (let i = 0; i < 25; i++) {
        const x = (Math.sin(i * 4.7) * 0.45 + 0.5) * W;
        const y = (Math.cos(i * 3.3) * 0.45 + 0.5) * H;
        items.push({ draw: () => ctx.fillText(i % 3 === 0 ? "★" : "✦", x, y) });
      }
      break;
    case "hearts":
      ctx.globalAlpha = 0.08;
      ctx.font = "24px serif";
      ctx.fillStyle = "#fff";
      for (let i = 0; i < 20; i++) {
        const x = (Math.sin(i * 5.1) * 0.45 + 0.5) * W;
        const y = (Math.cos(i * 3.7) * 0.45 + 0.5) * H;
        items.push({ draw: () => ctx.fillText("♥", x, y) });
      }
      break;
    case "confetti":
      ctx.globalAlpha = 0.12;
      for (let i = 0; i < 40; i++) {
        const x = (Math.sin(i * 7.3) * 0.5 + 0.5) * W;
        const y = (Math.cos(i * 4.1) * 0.5 + 0.5) * H;
        const colors = ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3", "#54a0ff", "#5f27cd"];
        ctx.fillStyle = colors[i % colors.length];
        items.push({
          draw: () => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(i * 0.7);
            ctx.fillRect(-6, -2, 12, 4);
            ctx.restore();
          }
        });
      }
      break;
  }

  items.forEach(item => item.draw());
  ctx.restore();
}

function drawBorderDecor(ctx: CanvasRenderingContext2D, decor: string | undefined) {
  if (!decor || decor === "none") return;
  ctx.save();

  switch (decor) {
    case "gold": {
      ctx.globalAlpha = 0.25;
      ctx.strokeStyle = "#ffd700";
      ctx.lineWidth = 3;
      const s = 60;
      ctx.beginPath(); ctx.moveTo(20, s + 20); ctx.lineTo(20, 20); ctx.lineTo(s + 20, 20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(30, s - 10 + 20); ctx.lineTo(30, 30); ctx.lineTo(s - 10 + 20, 30); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W - 20, s + 20); ctx.lineTo(W - 20, 20); ctx.lineTo(W - s - 20, 20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W - 30, s - 10 + 20); ctx.lineTo(W - 30, 30); ctx.lineTo(W - s + 10 - 20, 30); ctx.stroke();
      break;
    }
  }

  ctx.restore();
}

function drawGreeting(ctx: CanvasRenderingContext2D, template: Template) {
  const { greeting } = template;
  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = greeting.color;

  let fontBase = "Outfit, sans-serif";
  switch (greeting.fontStyle) {
    case "script":
      fontBase = "Georgia, serif";
      break;
    case "elegant":
      fontBase = "'Space Grotesk', sans-serif";
      break;
    case "playful":
      fontBase = "Outfit, sans-serif";
      break;
  }

  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 3;

  const y1 = (greeting.y / 100) * H;
  ctx.font = `800 ${greeting.line1Size}px ${fontBase}`;
  ctx.fillText(greeting.line1, W / 2, y1);

  if (greeting.line2 && greeting.line2Size) {
    ctx.font = `500 ${greeting.line2Size}px ${fontBase}`;
    ctx.fillText(greeting.line2, W / 2, y1 + greeting.line1Size + 10);
  }

  ctx.restore();
}

function drawName(ctx: CanvasRenderingContext2D, template: Template, userName: string) {
  const { nameStyle } = template;
  ctx.save();
  ctx.textAlign = "center";

  const ty = (nameStyle.y / 100) * H;
  const displayText = `${nameStyle.prefix || ""}${userName}${nameStyle.suffix || ""}`;

  if (nameStyle.badge && nameStyle.badgeColor) {
    ctx.font = `700 ${nameStyle.fontSize}px 'Space Grotesk', sans-serif`;
    const metrics = ctx.measureText(displayText);
    const pad = 20;
    const bw = metrics.width + pad * 2;
    const bh = nameStyle.fontSize + pad;

    ctx.fillStyle = nameStyle.badgeColor;
    ctx.beginPath();
    ctx.roundRect(W / 2 - bw / 2, ty - bh / 2 - nameStyle.fontSize * 0.3, bw, bh, 12);
    ctx.fill();
  }

  ctx.font = `700 ${nameStyle.fontSize}px 'Space Grotesk', sans-serif`;
  ctx.fillStyle = nameStyle.color;
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 2;
  ctx.fillText(displayText, W / 2, ty);

  ctx.restore();
}

export const getTemplatesForCategory = (category: string): Template[] => {
  const templates: Record<string, Template[]> = {
    birthday: [
      {
        id: 'birthday-friend-1',
        occasionId: 'birthday-friend',
        layout: { type: 'center' },
        background: { 
          gradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff8c00 100%)',
          pattern: 'confetti'
        },
        frame: {
          shape: 'star',
          x: 50,
          y: 35,
          size: 25,
          borderColor: '#ffffff',
          borderWidth: 4,
          glowColor: '#ff6b6b',
          shadow: true
        },
        greeting: {
          line1: 'Happy Birthday',
          line2: 'Bestie Forever!',
          line1Size: 64,
          line2Size: 42,
          color: '#ffffff',
          fontStyle: 'playful',
          y: 15
        },
        nameStyle: {
          fontSize: 42,
          color: '#ffffff',
          y: 65,
          badge: true,
          badgeColor: 'rgba(255,107,107,0.3)'
        },
        decorations: {
          topEmoji: '🎉',
          bottomEmoji: '🎂',
          cornerEmojis: ['🎈', '🎁', '🎊'],
          borderDecor: 'gold'
        }
      },
      {
        id: 'birthday-friend-2',
        occasionId: 'birthday-friend',
        layout: { type: 'banner' },
        background: { 
          gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #ffd700 100%)',
          pattern: 'balloons'
        },
        frame: {
          shape: 'arch',
          x: 50,
          y: 40,
          size: 22,
          borderColor: '#ffffff',
          borderWidth: 3,
          glowColor: '#ff6b9d',
          shadow: true
        },
        greeting: {
          line1: 'Party Time!',
          line2: 'Birthday Vibes',
          line1Size: 56,
          line2Size: 36,
          color: '#ffffff',
          fontStyle: 'script',
          y: 12
        },
        nameStyle: {
          fontSize: 38,
          color: '#ffffff',
          y: 70,
          prefix: 'My dear ',
          suffix: ' 🎉'
        },
        decorations: {
          topEmoji: '🎊',
          bottomEmoji: '🌟',
          cornerEmojis: ['💫', '✨', '🎈'],
          borderDecor: 'sparkle'
        }
      },
      {
        id: 'birthday-friend-3',
        occasionId: 'birthday-friend',
        layout: { type: 'split' },
        background: { 
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          pattern: 'stars'
        },
        frame: {
          shape: 'hexagon',
          x: 50,
          y: 35,
          size: 25,
          borderColor: '#ffffff',
          borderWidth: 4,
          glowColor: '#667eea',
          shadow: true
        },
        greeting: {
          line1: 'Another Year',
          line2: 'Another Adventure',
          line1Size: 56,
          line2Size: 36,
          color: '#ffffff',
          fontStyle: 'elegant',
          y: 15
        },
        nameStyle: {
          fontSize: 42,
          color: '#ffffff',
          y: 65,
          badge: true,
          badgeColor: 'rgba(102,126,234,0.3)'
        },
        decorations: {
          topEmoji: '🚀',
          bottomEmoji: '⭐',
          cornerEmojis: ['🌟', '💫'],
          borderDecor: 'ribbon'
        }
      },
      {
        id: 'birthday-brother-1',
        occasionId: 'birthday-brother',
        layout: { type: 'center' },
        background: { 
          gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #1e3c72 100%)',
          pattern: 'stars'
        },
        frame: {
          shape: 'star',
          x: 50,
          y: 35,
          size: 25,
          borderColor: '#ffffff',
          borderWidth: 4,
          glowColor: '#00d4ff',
          shadow: true
        },
        greeting: {
          line1: 'Brother Goals!',
          line2: 'Birthday King',
          line1Size: 60,
          line2Size: 40,
          color: '#ffffff',
          fontStyle: 'elegant',
          y: 15
        },
        nameStyle: {
          fontSize: 42,
          color: '#ffffff',
          y: 65,
          badge: true,
          badgeColor: 'rgba(79,172,254,0.3)'
        },
        decorations: {
          topEmoji: '👑',
          bottomEmoji: '🏆',
          cornerEmojis: ['💪', '🎮', '🎯'],
          borderDecor: 'gold'
        }
      },
      {
        id: 'birthday-brother-2',
        occasionId: 'birthday-brother',
        layout: { type: 'left' },
        background: { 
          gradient: 'linear-gradient(135deg, #2196f3 0%, #1976d2 50%, #0d47a1 100%)',
          pattern: 'waves'
        },
        frame: {
          shape: 'rounded',
          x: 35,
          y: 40,
          size: 22,
          borderColor: '#ffffff',
          borderWidth: 3,
          glowColor: '#2196f3',
          shadow: true
        },
        greeting: {
          line1: 'Level Up!',
          line2: 'Bro Mode On',
          line1Size: 56,
          line2Size: 36,
          color: '#ffffff',
          fontStyle: 'playful',
          y: 15
        },
        nameStyle: {
          fontSize: 38,
          color: '#ffffff',
          y: 70,
          prefix: 'Bro ',
          suffix: ' 🎮'
        },
        decorations: {
          topEmoji: '🎯',
          bottomEmoji: '🏅',
          cornerEmojis: ['⚡', '🔥'],
          borderDecor: 'sparkle'
        }
      },
      {
        id: 'birthday-sister-1',
        occasionId: 'birthday-sister',
        layout: { type: 'center' },
        background: { 
          gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fad0c4 100%)',
          pattern: 'hearts'
        },
        frame: {
          shape: 'heart',
          x: 50,
          y: 35,
          size: 25,
          borderColor: '#ffffff',
          borderWidth: 4,
          glowColor: '#ff6b9d',
          shadow: true
        },
        greeting: {
          line1: 'Princess Birthday',
          line2: 'Sister Love',
          line1Size: 60,
          line2Size: 40,
          color: '#ffffff',
          fontStyle: 'script',
          y: 15
        },
        nameStyle: {
          fontSize: 42,
          color: '#ffffff',
          y: 65,
          badge: true,
          badgeColor: 'rgba(255,154,158,0.3)'
        },
        decorations: {
          topEmoji: '👑',
          bottomEmoji: '💖',
          cornerEmojis: ['🌸', '🦄', '💕'],
          borderDecor: 'floral'
        }
      },
      {
        id: 'birthday-sister-2',
        occasionId: 'birthday-sister',
        layout: { type: 'corner' },
        background: { 
          gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          pattern: 'sparkles'
        },
        frame: {
          shape: 'oval',
          x: 50,
          y: 40,
          size: 22,
          borderColor: '#ffffff',
          borderWidth: 3,
          glowColor: '#f093fb',
          shadow: true
        },
        greeting: {
          line1: 'Sweet as Sugar',
          line2: 'Birthday Queen',
          line1Size: 56,
          line2Size: 36,
          color: '#ffffff',
          fontStyle: 'playful',
          y: 12
        },
        nameStyle: {
          fontSize: 38,
          color: '#ffffff',
          y: 70,
          prefix: 'Sweet ',
          suffix: ' 🍰'
        },
        decorations: {
          topEmoji: '🎀',
          bottomEmoji: '🌹',
          cornerEmojis: ['💝', '🎈'],
          borderDecor: 'ribbon'
        }
      },
      {
        id: 'birthday-mother-1',
        occasionId: 'birthday-mother',
        layout: { type: 'center' },
        background: { 
          gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 50%, #ffd700 100%)',
          pattern: 'floral'
        },
        frame: {
          shape: 'arch',
          x: 50,
          y: 35,
          size: 25,
          borderColor: '#ffffff',
          borderWidth: 4,
          glowColor: '#fa709a',
          shadow: true
        },
        greeting: {
          line1: 'Super Mom',
          line2: 'Birthday Blessings',
          line1Size: 60,
          line2Size: 40,
          color: '#ffffff',
          fontStyle: 'elegant',
          y: 15
        },
        nameStyle: {
          fontSize: 42,
          color: '#ffffff',
          y: 65,
          prefix: 'Mom ',
          suffix: ' 🌹'
        },
        decorations: {
          topEmoji: '🌺',
          bottomEmoji: '💐',
          cornerEmojis: ['🕊️', '🌻', '💖'],
          borderDecor: 'floral'
        }
      },
      {
        id: 'birthday-mother-2',
        occasionId: 'birthday-mother',
        layout: { type: 'bottom' },
        background: { 
          gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
          pattern: 'dots'
        },
        frame: {
          shape: 'circle',
          x: 50,
          y: 25,
          size: 22,
          borderColor: '#ffffff',
          borderWidth: 3,
          glowColor: '#fcb69f',
          shadow: true
        },
        greeting: {
          line1: 'World\'s Best Mom',
          line2: 'Love You Forever',
          line1Size: 56,
          line2Size: 36,
          color: '#ffffff',
          fontStyle: 'script',
          y: 55
        },
        nameStyle: {
          fontSize: 38,
          color: '#ffffff',
          y: 85,
          prefix: 'Dear ',
          suffix: ' 🌷'
        },
        decorations: {
          topEmoji: '💕',
          bottomEmoji: '🎂',
          cornerEmojis: ['🌸', '✨'],
          borderDecor: 'gold'
        }
      },
      {
        id: 'birthday-father-1',
        occasionId: 'birthday-father',
        layout: { type: 'center' },
        background: { 
          gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 50%, #1a237e 100%)',
          pattern: 'none'
        },
        frame: {
          shape: 'star',
          x: 50,
          y: 35,
          size: 25,
          borderColor: '#ffffff',
          borderWidth: 4,
          glowColor: '#30cfd0',
          shadow: true
        },
        greeting: {
          line1: 'Dad Strong',
          line2: 'Birthday Hero',
          line1Size: 60,
          line2Size: 40,
          color: '#ffffff',
          fontStyle: 'elegant',
          y: 15
        },
        nameStyle: {
          fontSize: 42,
          color: '#ffffff',
          y: 65,
          prefix: 'Father ',
          suffix: ' 🎩'
        },
        decorations: {
          topEmoji: '🎖️',
          bottomEmoji: '⭐',
          cornerEmojis: ['🏅', '🎯', '💼'],
          borderDecor: 'gold'
        }
      },
      {
        id: 'birthday-father-2',
        occasionId: 'birthday-father',
        layout: { type: 'fullBg' },
        background: { 
          gradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
          pattern: 'mandala'
        },
        frame: {
          shape: 'diamond',
          x: 50,
          y: 35,
          size: 22,
          borderColor: '#ffd700',
          borderWidth: 3,
          glowColor: '#ffd700',
          shadow: true
        },
        greeting: {
          line1: 'Legend Dad',
          line2: 'Birthday Wisdom',
          line1Size: 56,
          line2Size: 36,
          color: '#ffd700',
          fontStyle: 'elegant',
          y: 15
        },
        nameStyle: {
          fontSize: 38,
          color: '#ffffff',
          y: 70,
          prefix: 'Papa ',
          suffix: ' 🏆'
        },
        decorations: {
          topEmoji: '👨‍👩‍👧‍👦',
          bottomEmoji: '🎁',
          cornerEmojis: ['🌟', '💎'],
          borderDecor: 'sparkle'
        }
      }
    ],
    festivals: [
      {
        id: 'festival-diwali-1',
        occasionId: 'festival-diwali',
        layout: { type: 'center' },
        background: { 
          gradient: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffd700 100%)',
          pattern: 'diyas'
        },
        frame: {
          shape: 'star',
          x: 50,
          y: 35,
          size: 25,
          borderColor: '#ffd700',
          borderWidth: 4,
          glowColor: '#ff6b35',
          shadow: true
        },
        greeting: {
          line1: 'दीपावली की हार्दिक शुभकामनाएं',
          line2: 'Ganpati Bappa Morya!',
          line1Size: 56,
          line2Size: 42,
          color: '#ffffff',
          fontStyle: 'elegant',
          y: 15
        },
        nameStyle: {
          fontSize: 42,
          color: '#ffd700',
          y: 65,
          badge: true,
          badgeColor: 'rgba(255,215,0,0.3)'
        },
        decorations: {
          topEmoji: '🪔',
          bottomEmoji: '✨',
          cornerEmojis: ['🎆', '🌟', '💫'],
          borderDecor: 'gold'
        }
      },
      {
        id: 'festival-diwali-2',
        occasionId: 'festival-diwali',
        layout: { type: 'banner' },
        background: { 
          gradient: 'linear-gradient(135deg, #8b4513 0%, #d2691e 50%, #ffd700 100%)',
          pattern: 'rangoli'
        },
        frame: {
          shape: 'arch',
          x: 50,
          y: 40,
          size: 22,
          borderColor: '#ffd700',
          borderWidth: 3,
          glowColor: '#ff6b35',
          shadow: true
        },
        greeting: {
          line1: 'Shubh Diwali',
          line2: 'May lights guide your way',
          line1Size: 64,
          line2Size: 36,
          color: '#ffffff',
          fontStyle: 'script',
          y: 12
        },
        nameStyle: {
          fontSize: 38,
          color: '#ffd700',
          y: 70,
          prefix: 'Dear ',
          suffix: ' 🎊'
        },
        decorations: {
          topEmoji: '🏮',
          bottomEmoji: '🌺',
          cornerEmojis: ['💥', '🎇'],
          borderDecor: 'floral'
        }
      },
      {
        id: 'festival-diwali-3',
        occasionId: 'festival-diwali',
        layout: { type: 'fullBg' },
        background: { 
          gradient: 'linear-gradient(135deg, #4a0e0e 0%, #8b0000 50%, #ff6b35 100%)',
          pattern: 'mandala'
        },
        frame: {
          shape: 'circle',
          x: 50,
          y: 35,
          size: 25,
          borderColor: '#ffd700',
          borderWidth: 4,
          glowColor: '#ffd700',
          shadow: true
        },
        greeting: {
          line1: 'Happy Diwali',
          line2: 'Lakshmi Ki Jai!',
          line1Size: 60,
          line2Size: 40,
          color: '#ffd700',
          fontStyle: 'elegant',
          y: 15
        },
        nameStyle: {
          fontSize: 42,
          color: '#ffffff',
          y: 65,
          badge: true,
          badgeColor: 'rgba(255,215,0,0.4)'
        },
        decorations: {
          topEmoji: '🪔',
          bottomEmoji: '🎆',
          cornerEmojis: ['✨', '🌟'],
          borderDecor: 'sparkle'
        }
      },
      {
        id: 'festival-christmas-1',
        occasionId: 'festival-christmas',
        layout: { type: 'center' },
        background: { 
          gradient: 'linear-gradient(135deg, #0f7938 0%, #228b22 50%, #c62828 100%)',
          pattern: 'snowflakes'
        },
        frame: {
          shape: 'star',
          x: 50,
          y: 35,
          size: 25,
          borderColor: '#ffffff',
          borderWidth: 4,
          glowColor: '#c62828',
          shadow: true
        },
        greeting: {
          line1: 'Ho Ho Ho!',
          line2: 'Merry Christmas',
          line1Size: 56,
          line2Size: 42,
          color: '#ffffff',
          fontStyle: 'playful',
          y: 15
        },
        nameStyle: {
          fontSize: 42,
          color: '#ffffff',
          y: 65,
          badge: true,
          badgeColor: 'rgba(198,40,40,0.3)'
        },
        decorations: {
          topEmoji: '🎄',
          bottomEmoji: '🎅',
          cornerEmojis: ['🔔', '⛄', '🎁'],
          borderDecor: 'gold'
        }
      },
      {
        id: 'festival-christmas-2',
        occasionId: 'festival-christmas',
        layout: { type: 'top' },
        background: { 
          gradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #c62828 100%)',
          pattern: 'snowflakes'
        },
        frame: {
          shape: 'rounded',
          x: 50,
          y: 45,
          size: 22,
          borderColor: '#ffffff',
          borderWidth: 3,
          glowColor: '#c62828',
          shadow: true
        },
        greeting: {
          line1: 'Joy to the World',
          line2: 'Peace & Love',
          line1Size: 56,
          line2Size: 36,
          color: '#ffffff',
          fontStyle: 'script',
          y: 12
        },
        nameStyle: {
          fontSize: 38,
          color: '#ffffff',
          y: 72,
          prefix: 'Merry Christmas ',
          suffix: ' 🎄'
        },
        decorations: {
          topEmoji: '🎅',
          bottomEmoji: '🤶',
          cornerEmojis: ['🔔', '⭐'],
          borderDecor: 'sparkle'
        }
      },
      {
        id: 'festival-holi-1',
        occasionId: 'festival-holi',
        layout: { type: 'center' },
        background: { 
          gradient: 'linear-gradient(135deg, #ff1493 0%, #00ff00 25%, #ffff00 50%, #ff4500 75%, #9400d3 100%)',
          pattern: 'confetti'
        },
        frame: {
          shape: 'hexagon',
          x: 50,
          y: 35,
          size: 25,
          borderColor: '#ffffff',
          borderWidth: 4,
          glowColor: '#ff1493',
          shadow: true
        },
        greeting: {
          line1: 'Rang Barse!',
          line2: 'Happy Holi',
          line1Size: 64,
          line2Size: 42,
          color: '#ffffff',
          fontStyle: 'playful',
          y: 15
        },
        nameStyle: {
          fontSize: 42,
          color: '#ffffff',
          y: 65,
          badge: true,
          badgeColor: 'rgba(255,20,147,0.3)'
        },
        decorations: {
          topEmoji: '🎨',
          bottomEmoji: '🌈',
          cornerEmojis: ['💦', '🎉', '🪔'],
          borderDecor: 'sparkle'
        }
      },
      {
        id: 'festival-holi-2',
        occasionId: 'festival-holi',
        layout: { type: 'banner' },
        background: { 
          gradient: 'linear-gradient(135deg, #ff69b4 0%, #00bfff 50%, #32cd32 100%)',
          pattern: 'balloons'
        },
        frame: {
          shape: 'circle',
          x: 50,
          y: 40,
          size: 22,
          borderColor: '#ffffff',
          borderWidth: 3,
          glowColor: '#ff69b4',
          shadow: true
        },
        greeting: {
          line1: 'Bura Na Maano',
          line2: 'Holi Hai!',
          line1Size: 56,
          line2Size: 40,
          color: '#ffffff',
          fontStyle: 'playful',
          y: 12
        },
        nameStyle: {
          fontSize: 38,
          color: '#ffffff',
          y: 70,
          prefix: 'Holi Hai ',
          suffix: ' 🎨'
        },
        decorations: {
          topEmoji: '�',
          bottomEmoji: '�',
          cornerEmojis: ['�', '🎊'],
          borderDecor: 'ribbon'
        }
      },
      {
        id: 'festival-sankranti-1',
        occasionId: 'festival-sankranti',
        layout: { type: 'center' },
        background: { 
          gradient: 'linear-gradient(135deg, #f4d03f 0%, #16a085 50%, #e67e22 100%)',
          pattern: 'stars'
        },
        frame: {
          shape: 'diamond',
          x: 50,
          y: 35,
          size: 25,
          borderColor: '#ffffff',
          borderWidth: 4,
          glowColor: '#f4d03f',
          shadow: true
        },
        greeting: {
          line1: 'Happy Sankranti',
          line2: 'Uttarayan Celebrations',
          line1Size: 56,
          line2Size: 36,
          color: '#ffffff',
          fontStyle: 'elegant',
          y: 15
        },
        nameStyle: {
          fontSize: 42,
          color: '#ffffff',
          y: 65,
          badge: true,
          badgeColor: 'rgba(244,208,63,0.3)'
        },
        decorations: {
          topEmoji: '🪁',
          bottomEmoji: '☀️',
          cornerEmojis: ['🌾', '🎐'],
          borderDecor: 'gold'
        }
      }
    ],
    love: [
      {
        id: 'love-romantic-1',
        occasionId: 'love-romantic',
        layout: { type: 'center' },
        background: { 
          gradient: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #ff1744 100%)',
          pattern: 'hearts'
        },
        frame: {
          shape: 'heart',
          x: 50,
          y: 35,
          size: 25,
          borderColor: '#ffffff',
          borderWidth: 4,
          glowColor: '#ff6b9d',
          shadow: true
        },
        greeting: {
          line1: 'I Love You',
          line2: 'Forever & Always',
          line1Size: 64,
          line2Size: 42,
          color: '#ffffff',
          fontStyle: 'script',
          y: 15
        },
        nameStyle: {
          fontSize: 42,
          color: '#ffffff',
          y: 65,
          badge: true,
          badgeColor: 'rgba(255,107,157,0.3)'
        },
        decorations: {
          topEmoji: '💕',
          bottomEmoji: '❤️',
          cornerEmojis: ['🌹', '💝', '💘'],
          borderDecor: 'gold'
        }
      },
      {
        id: 'love-romantic-2',
        occasionId: 'love-romantic',
        layout: { type: 'banner' },
        background: { 
          gradient: 'linear-gradient(135deg, #ff006e 0%, #833471 50%, #c44569 100%)',
          pattern: 'sparkles'
        },
        frame: {
          shape: 'arch',
          x: 50,
          y: 40,
          size: 22,
          borderColor: '#ffffff',
          borderWidth: 3,
          glowColor: '#ff006e',
          shadow: true
        },
        greeting: {
          line1: 'My Heart Beats',
          line2: 'Only For You',
          line1Size: 56,
          line2Size: 36,
          color: '#ffffff',
          fontStyle: 'elegant',
          y: 12
        },
        nameStyle: {
          fontSize: 38,
          color: '#ffffff',
          y: 70,
          prefix: 'My love ',
          suffix: ' 💕'
        },
        decorations: {
          topEmoji: '💖',
          bottomEmoji: '💝',
          cornerEmojis: ['🌟', '✨'],
          borderDecor: 'sparkle'
        }
      },
      {
        id: 'love-romantic-3',
        occasionId: 'love-romantic',
        layout: { type: 'split' },
        background: { 
          gradient: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
          pattern: 'hearts'
        },
        frame: {
          shape: 'oval',
          x: 50,
          y: 35,
          size: 25,
          borderColor: '#ffffff',
          borderWidth: 4,
          glowColor: '#ee9ca7',
          shadow: true
        },
        greeting: {
          line1: 'You Complete Me',
          line2: 'My Everything',
          line1Size: 56,
          line2Size: 36,
          color: '#ffffff',
          fontStyle: 'script',
          y: 15
        },
        nameStyle: {
          fontSize: 42,
          color: '#ffffff',
          y: 65,
          badge: true,
          badgeColor: 'rgba(238,156,167,0.3)'
        },
        decorations: {
          topEmoji: '💑',
          bottomEmoji: '🥰',
          cornerEmojis: ['💕', '❤️'],
          borderDecor: 'floral'
        }
      },
      {
        id: 'love-valentine-1',
        occasionId: 'love-valentine',
        layout: { type: 'center' },
        background: { 
          gradient: 'linear-gradient(135deg, #ff1744 0%, #ff6b9d 50%, #ffc0cb 100%)',
          pattern: 'hearts'
        },
        frame: {
          shape: 'heart',
          x: 50,
          y: 35,
          size: 25,
          borderColor: '#ffffff',
          borderWidth: 4,
          glowColor: '#ff1744',
          shadow: true
        },
        greeting: {
          line1: 'Be My Valentine',
          line2: 'Love Always',
          line1Size: 60,
          line2Size: 40,
          color: '#ffffff',
          fontStyle: 'script',
          y: 15
        },
        nameStyle: {
          fontSize: 42,
          color: '#ffffff',
          y: 65,
          badge: true,
          badgeColor: 'rgba(255,23,68,0.3)'
        },
        decorations: {
          topEmoji: '🌹',
          bottomEmoji: '💝',
          cornerEmojis: ['💕', '❤️', '💌'],
          borderDecor: 'gold'
        }
      },
      {
        id: 'love-valentine-2',
        occasionId: 'love-valentine',
        layout: { type: 'corner' },
        background: { 
          gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          pattern: 'sparkles'
        },
        frame: {
          shape: 'circle',
          x: 50,
          y: 40,
          size: 22,
          borderColor: '#ffffff',
          borderWidth: 3,
          glowColor: '#f093fb',
          shadow: true
        },
        greeting: {
          line1: 'Cupid Strikes',
          line2: 'Valentine Love',
          line1Size: 56,
          line2Size: 36,
          color: '#ffffff',
          fontStyle: 'playful',
          y: 12
        },
        nameStyle: {
          fontSize: 38,
          color: '#ffffff',
          y: 70,
          prefix: 'Valentine ',
          suffix: ' 🌹'
        },
        decorations: {
          topEmoji: '🏹',
          bottomEmoji: '💘',
          cornerEmojis: ['💕', '❤️'],
          borderDecor: 'ribbon'
        }
      }
    ],
    anniversary: [
      {
        id: 'anniversary-wedding-1',
        occasionId: 'anniversary-wedding',
        layout: { type: 'center' },
        background: { 
          gradient: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #ff1744 100%)',
          pattern: 'hearts'
        },
        frame: {
          shape: 'heart',
          x: 50,
          y: 35,
          size: 25,
          borderColor: '#ffffff',
          borderWidth: 4,
          glowColor: '#ff6b9d',
          shadow: true
        },
        greeting: {
          line1: 'Happy Anniversary',
          line2: 'Forever Together',
          line1Size: 60,
          line2Size: 40,
          color: '#ffffff',
          fontStyle: 'elegant',
          y: 15
        },
        nameStyle: {
          fontSize: 42,
          color: '#ffffff',
          y: 65,
          badge: true,
          badgeColor: 'rgba(255,107,157,0.3)'
        },
        decorations: {
          topEmoji: '💑',
          bottomEmoji: '🥂',
          cornerEmojis: ['🌹', '💍', '🎊'],
          borderDecor: 'gold'
        }
      },
      {
        id: 'anniversary-wedding-2',
        occasionId: 'anniversary-wedding',
        layout: { type: 'banner' },
        background: { 
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          pattern: 'stars'
        },
        frame: {
          shape: 'arch',
          x: 50,
          y: 40,
          size: 22,
          borderColor: '#ffffff',
          borderWidth: 3,
          glowColor: '#667eea',
          shadow: true
        },
        greeting: {
          line1: 'Years of Love',
          line2: 'Memories Forever',
          line1Size: 56,
          line2Size: 36,
          color: '#ffffff',
          fontStyle: 'script',
          y: 12
        },
        nameStyle: {
          fontSize: 38,
          color: '#ffffff',
          y: 70,
          prefix: 'My love ',
          suffix: ' 💕'
        },
        decorations: {
          topEmoji: '🎉',
          bottomEmoji: '🥰',
          cornerEmojis: ['💖', '✨'],
          borderDecor: 'sparkle'
        }
      },
      {
        id: 'anniversary-dating-1',
        occasionId: 'anniversary-dating',
        layout: { type: 'top' },
        background: { 
          gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          pattern: 'sparkles'
        },
        frame: {
          shape: 'circle',
          x: 50,
          y: 45,
          size: 22,
          borderColor: '#ffffff',
          borderWidth: 3,
          glowColor: '#fa709a',
          shadow: true
        },
        greeting: {
          line1: 'Love Journey',
          line2: 'Still Going Strong',
          line1Size: 56,
          line2Size: 36,
          color: '#ffffff',
          fontStyle: 'playful',
          y: 12
        },
        nameStyle: {
          fontSize: 38,
          color: '#ffffff',
          y: 72,
          prefix: 'My dear ',
          suffix: ' 🌟'
        },
        decorations: {
          topEmoji: '💕',
          bottomEmoji: '🎈',
          cornerEmojis: ['✨', '🌈'],
          borderDecor: 'ribbon'
        }
      }
    ],
    motivation: [
      {
        id: 'motivation-success-1',
        occasionId: 'motivation-success',
        layout: { type: 'center' },
        background: { 
          gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%)',
          pattern: 'stars'
        },
        frame: {
          shape: 'star',
          x: 50,
          y: 35,
          size: 25,
          borderColor: '#ffffff',
          borderWidth: 4,
          glowColor: '#00d4ff',
          shadow: true
        },
        greeting: {
          line1: 'Dream Big',
          line2: 'Achieve More',
          line1Size: 64,
          line2Size: 42,
          color: '#ffffff',
          fontStyle: 'elegant',
          y: 15
        },
        nameStyle: {
          fontSize: 42,
          color: '#ffffff',
          y: 65,
          badge: true,
          badgeColor: 'rgba(79,172,254,0.3)'
        },
        decorations: {
          topEmoji: '🚀',
          bottomEmoji: '⭐',
          cornerEmojis: ['💫', '✨', '🏆'],
          borderDecor: 'gold'
        }
      },
      {
        id: 'motivation-success-2',
        occasionId: 'motivation-success',
        layout: { type: 'banner' },
        background: { 
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          pattern: 'mandala'
        },
        frame: {
          shape: 'arch',
          x: 50,
          y: 40,
          size: 22,
          borderColor: '#ffffff',
          borderWidth: 3,
          glowColor: '#667eea',
          shadow: true
        },
        greeting: {
          line1: 'Success Is Coming',
          line2: 'Keep Going',
          line1Size: 56,
          line2Size: 36,
          color: '#ffffff',
          fontStyle: 'script',
          y: 12
        },
        nameStyle: {
          fontSize: 38,
          color: '#ffffff',
          y: 70,
          prefix: 'Champion ',
          suffix: ' 🏆'
        },
        decorations: {
          topEmoji: '🎯',
          bottomEmoji: '🏅',
          cornerEmojis: ['💪', '⚡'],
          borderDecor: 'sparkle'
        }
      },
      {
        id: 'motivation-inspiration-1',
        occasionId: 'motivation-inspiration',
        layout: { type: 'split' },
        background: { 
          gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #ffecd2 100%)',
          pattern: 'waves'
        },
        frame: {
          shape: 'diamond',
          x: 50,
          y: 35,
          size: 25,
          borderColor: '#ffffff',
          borderWidth: 4,
          glowColor: '#a8edea',
          shadow: true
        },
        greeting: {
          line1: 'Believe In Yourself',
          line2: 'Magic Happens',
          line1Size: 56,
          line2Size: 36,
          color: '#ffffff',
          fontStyle: 'elegant',
          y: 15
        },
        nameStyle: {
          fontSize: 42,
          color: '#ffffff',
          y: 65,
          badge: true,
          badgeColor: 'rgba(168,237,234,0.3)'
        },
        decorations: {
          topEmoji: '✨',
          bottomEmoji: '�',
          cornerEmojis: ['💫', '🦋'],
          borderDecor: 'floral'
        }
      },
      {
        id: 'motivation-inspiration-2',
        occasionId: 'motivation-inspiration',
        layout: { type: 'top' },
        background: { 
          gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
          pattern: 'sparkles'
        },
        frame: {
          shape: 'circle',
          x: 50,
          y: 45,
          size: 22,
          borderColor: '#ffffff',
          borderWidth: 3,
          glowColor: '#fcb69f',
          shadow: true
        },
        greeting: {
          line1: 'Rise & Shine',
          line2: 'New Day New Goals',
          line1Size: 56,
          line2Size: 36,
          color: '#ffffff',
          fontStyle: 'playful',
          y: 12
        },
        nameStyle: {
          fontSize: 38,
          color: '#ffffff',
          y: 72,
          prefix: 'Inspired ',
          suffix: ' ☀️'
        },
        decorations: {
          topEmoji: '🌅',
          bottomEmoji: '🌈',
          cornerEmojis: ['✨', '🦋'],
          borderDecor: 'ribbon'
        }
      }
    ],
    'good-morning': [
      {
        id: 'morning-inspirational-1',
        occasionId: 'morning-inspirational',
        layout: { type: 'center' },
        background: { 
          gradient: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 50%, #f39c12 100%)',
          pattern: 'stars'
        },
        frame: {
          shape: 'circle',
          x: 50,
          y: 35,
          size: 25,
          borderColor: '#ffffff',
          borderWidth: 4,
          glowColor: '#f39c12',
          shadow: true
        },
        greeting: {
          line1: 'Good Morning Sunshine',
          line2: 'Rise & Shine',
          line1Size: 56,
          line2Size: 36,
          color: '#ffffff',
          fontStyle: 'playful',
          y: 15
        },
        nameStyle: {
          fontSize: 42,
          color: '#ffffff',
          y: 65,
          badge: true,
          badgeColor: 'rgba(243,156,18,0.3)'
        },
        decorations: {
          topEmoji: '☀️',
          bottomEmoji: '🌻',
          cornerEmojis: ['✨', '🌈', '🦋'],
          borderDecor: 'gold'
        }
      },
      {
        id: 'morning-inspirational-2',
        occasionId: 'morning-inspirational',
        layout: { type: 'banner' },
        background: { 
          gradient: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 50%, #a29bfe 100%)',
          pattern: 'waves'
        },
        frame: {
          shape: 'arch',
          x: 50,
          y: 40,
          size: 22,
          borderColor: '#ffffff',
          borderWidth: 3,
          glowColor: '#74b9ff',
          shadow: true
        },
        greeting: {
          line1: 'New Day New Beginnings',
          line2: 'Make It Amazing',
          line1Size: 56,
          line2Size: 36,
          color: '#ffffff',
          fontStyle: 'elegant',
          y: 12
        },
        nameStyle: {
          fontSize: 38,
          color: '#ffffff',
          y: 70,
          prefix: 'Good morning ',
          suffix: ' 🌅'
        },
        decorations: {
          topEmoji: '🌤',
          bottomEmoji: '☕',
          cornerEmojis: ['🌻', '✨'],
          borderDecor: 'sparkle'
        }
      }
    ],
    'good-night': [
      {
        id: 'night-peaceful-1',
        occasionId: 'night-peaceful',
        layout: { type: 'center' },
        background: { 
          gradient: 'linear-gradient(135deg, #2c3e50 0%, #3498db 50%, #9b59b6 100%)',
          pattern: 'stars'
        },
        frame: {
          shape: 'circle',
          x: 50,
          y: 35,
          size: 25,
          borderColor: '#ffffff',
          borderWidth: 4,
          glowColor: '#9b59b6',
          shadow: true
        },
        greeting: {
          line1: 'Sweet Dreams',
          line2: 'Peaceful Night',
          line1Size: 56,
          line2Size: 36,
          color: '#ffffff',
          fontStyle: 'elegant',
          y: 15
        },
        nameStyle: {
          fontSize: 42,
          color: '#ffffff',
          y: 65,
          badge: true,
          badgeColor: 'rgba(155,89,182,0.3)'
        },
        decorations: {
          topEmoji: '🌙',
          bottomEmoji: '⭐',
          cornerEmojis: ['💫', '✨', '🌟'],
          borderDecor: 'sparkle'
        }
      },
      {
        id: 'night-peaceful-2',
        occasionId: 'night-peaceful',
        layout: { type: 'bottom' },
        background: { 
          gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
          pattern: 'stars'
        },
        frame: {
          shape: 'circle',
          x: 50,
          y: 25,
          size: 22,
          borderColor: '#ffffff',
          borderWidth: 3,
          glowColor: '#302b63',
          shadow: true
        },
        greeting: {
          line1: 'Good Night Moonlight',
          line2: 'Rest Well',
          line1Size: 56,
          line2Size: 36,
          color: '#ffffff',
          fontStyle: 'script',
          y: 55
        },
        nameStyle: {
          fontSize: 38,
          color: '#ffffff',
          y: 85,
          prefix: 'Sweet dreams ',
          suffix: ' 🌙'
        },
        decorations: {
          topEmoji: '💤',
          bottomEmoji: '🌛',
          cornerEmojis: ['⭐', '✨'],
          borderDecor: 'gold'
        }
      }
    ],
    religious: [
      {
        id: 'religious-prayer-1',
        occasionId: 'religious-prayer',
        layout: { type: 'center' },
        background: { 
          gradient: 'linear-gradient(135deg, #f39c12 0%, #e67e22 50%, #d35400 100%)',
          pattern: 'mandala'
        },
        frame: {
          shape: 'arch',
          x: 50,
          y: 35,
          size: 25,
          borderColor: '#ffffff',
          borderWidth: 4,
          glowColor: '#f39c12',
          shadow: true
        },
        greeting: {
          line1: 'ईश्वर की कृपा',
          line2: 'Divine Blessings',
          line1Size: 56,
          line2Size: 36,
          color: '#ffffff',
          fontStyle: 'elegant',
          y: 15
        },
        nameStyle: {
          fontSize: 42,
          color: '#ffffff',
          y: 65,
          badge: true,
          badgeColor: 'rgba(243,156,18,0.3)'
        },
        decorations: {
          topEmoji: '🕉️',
          bottomEmoji: '🙏',
          cornerEmojis: ['🪔', '✨', '🌺'],
          borderDecor: 'gold'
        }
      },
      {
        id: 'religious-temple-1',
        occasionId: 'religious-temple',
        layout: { type: 'banner' },
        background: { 
          gradient: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 50%, #ffcc00 100%)',
          pattern: 'diyas'
        },
        frame: {
          shape: 'oval',
          x: 50,
          y: 40,
          size: 22,
          borderColor: '#ffffff',
          borderWidth: 3,
          glowColor: '#e74c3c',
          shadow: true
        },
        greeting: {
          line1: 'Temple Blessings',
          line2: 'Peace & Prosperity',
          line1Size: 56,
          line2Size: 36,
          color: '#ffffff',
          fontStyle: 'script',
          y: 12
        },
        nameStyle: {
          fontSize: 38,
          color: '#ffffff',
          y: 70,
          prefix: 'Blessed ',
          suffix: ' 🙏'
        },
        decorations: {
          topEmoji: '🏛️',
          bottomEmoji: '🕉️',
          cornerEmojis: ['🪔', '✨'],
          borderDecor: 'floral'
        }
      }
    ],
    wedding: [
      {
        id: 'wedding-couple-1',
        occasionId: 'wedding-couple',
        layout: { type: 'center' },
        background: { 
          gradient: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #ff1744 100%)',
          pattern: 'hearts'
        },
        frame: {
          shape: 'heart',
          x: 50,
          y: 35,
          size: 25,
          borderColor: '#ffffff',
          borderWidth: 4,
          glowColor: '#ff6b9d',
          shadow: true
        },
        greeting: {
          line1: 'Congratulations Couple',
          line2: 'Happy Wedding',
          line1Size: 56,
          line2Size: 36,
          color: '#ffffff',
          fontStyle: 'elegant',
          y: 15
        },
        nameStyle: {
          fontSize: 42,
          color: '#ffffff',
          y: 65,
          badge: true,
          badgeColor: 'rgba(255,107,157,0.3)'
        },
        decorations: {
          topEmoji: '💑',
          bottomEmoji: '🎊',
          cornerEmojis: ['💍', '🌹', '🎉'],
          borderDecor: 'gold'
        }
      },
      {
        id: 'wedding-couple-2',
        occasionId: 'wedding-couple',
        layout: { type: 'banner' },
        background: { 
          gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)',
          pattern: 'sparkles'
        },
        frame: {
          shape: 'arch',
          x: 50,
          y: 40,
          size: 22,
          borderColor: '#ffffff',
          borderWidth: 3,
          glowColor: '#f093fb',
          shadow: true
        },
        greeting: {
          line1: 'Two Hearts One Soul',
          line2: 'Forever Begins',
          line1Size: 56,
          line2Size: 36,
          color: '#ffffff',
          fontStyle: 'script',
          y: 12
        },
        nameStyle: {
          fontSize: 38,
          color: '#ffffff',
          y: 70,
          prefix: 'Happy couple ',
          suffix: ' 💕'
        },
        decorations: {
          topEmoji: '🎊',
          bottomEmoji: '🥂',
          cornerEmojis: ['💍', '✨'],
          borderDecor: 'floral'
        }
      }
    ]
  };

  return templates[category] || templates.birthday;
};

export async function generateCanvasImage(
  template: Template,
  userImage: string,
  userName: string,
  _index: number
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // 1. Background gradient
  ctx.fillStyle = parseGradient(ctx, template.background.gradient);
  ctx.fillRect(0, 0, W, H);

  // 2. Subtle overlay for depth
  const overlay = ctx.createRadialGradient(W / 2, H * 0.35, 50, W / 2, H / 2, W);
  overlay.addColorStop(0, "rgba(255,255,255,0.08)");
  overlay.addColorStop(1, "rgba(0,0,0,0.15)");
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, W, H);

  // 3. Pattern decorations
  drawPattern(ctx, template.background.pattern);

  // 4. Border decorations
  drawBorderDecor(ctx, template.decorations.borderDecor);

  // 5. Greeting text
  drawGreeting(ctx, template);

  // 6. User image in frame
  const { frame } = template;
  const cx = (frame.x / 100) * W;
  const cy = (frame.y / 100) * H;
  const size = (frame.size / 100) * Math.min(W, H);

  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = userImage;
    });

    ctx.save();

    // Glow
    if (frame.glowColor) {
      ctx.shadowColor = frame.glowColor;
      ctx.shadowBlur = 30;
    }
    if (frame.shadow) {
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 25;
      ctx.shadowOffsetY = 10;
    }

    // Clip & draw
    drawShapePath(ctx, frame.shape, cx, cy, size);
    ctx.clip();

    const aspect = img.width / img.height;
    let dw = size * 2.2;
    let dh = size * 2.2;
    if (aspect > 1) dh = dw / aspect;
    else dw = dh * aspect;
    ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh);
    ctx.restore();

    // Frame border
    ctx.save();
    drawShapePath(ctx, frame.shape, cx, cy, size);
    ctx.strokeStyle = frame.borderColor;
    ctx.lineWidth = frame.borderWidth;
    ctx.stroke();
    ctx.restore();
  } catch {
    ctx.save();
    drawShapePath(ctx, frame.shape, cx, cy, size);
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fill();
    ctx.restore();
  }

  // 7. Name text
  drawName(ctx, template, userName);

  // 8. Watermark
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.font = "13px Outfit, sans-serif";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText("Made with Crafto ✨", W / 2, H * 0.96);
  ctx.restore();

  return canvas.toDataURL("image/png");
}
