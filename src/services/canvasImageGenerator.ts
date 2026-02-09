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

// Template definitions for different categories
export const getTemplatesForCategory = (category: string): Template[] => {
  const templates: Record<string, Template[]> = {
    birthday: [
      {
        id: 'birthday-1',
        occasionId: 'birthday',
        layout: { type: 'center' },
        background: { 
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          pattern: 'confetti'
        },
        frame: {
          shape: 'circle',
          x: 50,
          y: 35,
          size: 25,
          borderColor: '#ffffff',
          borderWidth: 4,
          glowColor: '#ffd700',
          shadow: true
        },
        greeting: {
          line1: 'Happy Birthday',
          line2: 'Wishing you joy',
          line1Size: 64,
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
          badgeColor: 'rgba(255,215,0,0.3)'
        },
        decorations: {
          topEmoji: '🎉',
          bottomEmoji: '🎂',
          cornerEmojis: ['🎈', '🎁'],
          borderDecor: 'gold'
        }
      }
    ],
    love: [
      {
        id: 'love-1',
        occasionId: 'love',
        layout: { type: 'center' },
        background: { 
          gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          pattern: 'hearts'
        },
        frame: {
          shape: 'heart',
          x: 50,
          y: 35,
          size: 25,
          borderColor: '#ffffff',
          borderWidth: 4,
          glowColor: '#ff69b4',
          shadow: true
        },
        greeting: {
          line1: 'With Love',
          line2: 'Forever & Always',
          line1Size: 64,
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
          badgeColor: 'rgba(255,105,180,0.3)'
        },
        decorations: {
          topEmoji: '💕',
          bottomEmoji: '❤️',
          cornerEmojis: ['🌹', '💝'],
          borderDecor: 'gold'
        }
      }
    ],
    motivation: [
      {
        id: 'motivation-1',
        occasionId: 'motivation',
        layout: { type: 'center' },
        background: { 
          gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          pattern: 'stars'
        },
        frame: {
          shape: 'rounded',
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
          badgeColor: 'rgba(0,212,255,0.3)'
        },
        decorations: {
          topEmoji: '🚀',
          bottomEmoji: '⭐',
          cornerEmojis: ['💪', '🏆'],
          borderDecor: 'gold'
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
