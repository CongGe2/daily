// Generate UX project images via NanoBanana2 API
import https from 'node:https';
import fs from 'node:fs';

const API_HOST = 'nn.147ai.com';
const API_PATH = '/v1/chat/completions';
const API_KEY = 'sk-RMB5xMHGduTeBEi6KFGFMppdbBQpnVLoZ4Ki1LYw66XfJ7O7';
const MODEL = 'gemini-3.1-flash-image-preview';

function apiRequest(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4096
    });

    const req = https.request({
      hostname: API_HOST,
      path: API_PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(body)
      },
      timeout: 180000 // 3 min
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 300)}`));
        } else {
          resolve(JSON.parse(data));
        }
      });
    });

    req.on('timeout', () => { req.destroy(); reject(new Error('Request timeout')); });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function gen(prompt, filename) {
  console.log(`\n🎨 Generating: ${filename}`);
  console.log(`   Prompt: ${prompt.substring(0, 100)}...`);

  try {
    const data = await apiRequest(prompt);
    const content = data.choices?.[0]?.message?.content;
    if (!content) { console.error('   ❌ No content'); return null; }

    let b64 = null;
    const m = content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/) ||
              content.match(/!\[.*?\]\(data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)\)/);
    if (m) b64 = m[1];
    if (!b64) {
      const b = content.match(/[A-Za-z0-9+/]{1000,}={0,2}/);
      if (b) b64 = b[0];
    }
    if (!b64) { console.error('   ❌ No image in response'); console.log('   Preview:', content.substring(0, 150)); return null; }

    const buf = Buffer.from(b64, 'base64');
    fs.writeFileSync(filename, buf);
    console.log(`   ✅ Saved (${(buf.length/1024).toFixed(0)} KB)`);
    return filename;
  } catch (e) {
    console.error(`   ❌ ${e.message}`);
    return null;
  }
}

const out = 'C:/Users/14169/portfolio/images/ux/';
if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true });

console.log('╔══════════════════════════════════════╗');
console.log('║  MindSpace UX · Image Generation    ║');
console.log('╚══════════════════════════════════════╝');

let ok = 0;

// 1. App main screen
if (await gen(
  `A modern minimalist meditation app main screen UI design. The screen shows a large circular breathing timer in the center with a soft gradient from warm amber to deep purple. Below the timer are three category cards: "Focus", "Sleep", "Anxiety Relief" with subtle icons. The background is a AI-generated abstract gradient illustration in soft pastel tones suggesting calm and mindfulness. The overall design language is clean, airy, with generous whitespace. Sans-serif typography. iPhone 15 Pro mockup frame, perspective angle showing the screen clearly. App name "MindSpace" visible in the status bar area. Professional UI/UX portfolio quality. No real brand logos. 4:3 aspect ratio.`,
  out + 'mindspace-hero.png'
)) ok++;
await new Promise(r => setTimeout(r, 2000));

// 2. AI concept exploration grid
if (await gen(
  `A design process moodboard showing AI-generated visual explorations for a meditation app. The image is divided into a 2x3 grid of different visual styles: (1) soft watercolor botanicals in sage green, (2) cosmic nebula gradients in deep blue and purple, (3) minimalist geometric shapes in warm terracotta, (4) Japanese zen ink wash style in black and white, (5) organic fluid shapes in coral and cream, (6) sunrise mountain silhouettes in gradient orange-to-indigo. Each cell has a small label below it. The layout should look like a design exploration board - clean grid with thin borders between cells. Below the grid there's a subtitle "AI-Generated Concept Exploration · 6 Visual Directions". Professional UX portfolio quality. 4:3 aspect ratio.`,
  out + 'mindspace-concepts.png'
)) ok++;
await new Promise(r => setTimeout(r, 2000));

// 3. SD workflow
if (await gen(
  `A design workflow diagram showing how AI image generation was used to create app illustrations. The image shows a 3-column layout: Column 1 "Prompt Engineering" shows text prompts with parameters like "serene mountain lake at dawn, minimalist flat vector style, pastel colors, meditation theme, --steps 30 --cfg 7". Column 2 "Generation" shows 4 small AI-generated illustration variations of the same prompt in different styles arranged in a 2x2 grid. Column 3 "Selection → Refinement" shows the chosen illustration refined and placed into a mobile app screen mockup. The layout should be clean and professional like a case study slide from a design portfolio. Labels in English and Chinese. 4:3 aspect ratio.`,
  out + 'mindspace-sd-workflow.png'
)) ok++;
await new Promise(r => setTimeout(r, 2000));

// 4. Full screens
if (await gen(
  `A mobile app design showcase showing 4 iPhone screens of a meditation app called "MindSpace" arranged in a row with slight overlap. Screen 1: Onboarding - "Find your calm" with AI-generated gradient background. Screen 2: Home - Breathing timer circle with daily streak counter. Screen 3: Session - Audio player with waveform visualization and nature illustration. Screen 4: Profile - Stats, achievements, and saved sessions. Each screen has clean modern UI with consistent design tokens (rounded corners, soft shadows, pastel color palette). The screens float on a warm off-white (#fafaf8) background. Professional UI/UX portfolio quality. No real brand logos. 4:3 aspect ratio.`,
  out + 'mindspace-screens.png'
)) ok++;
await new Promise(r => setTimeout(r, 2000));

// 5. Hero illustration - AI generated meditation visual
if (await gen(
  `A beautiful relaxing abstract illustration for a meditation app hero section. Soft flowing gradients from deep indigo (#1a1a3e) through violet to warm peach and soft coral. Organic fluid shapes that suggest calm water ripples and gentle mountain silhouettes. The composition is centered with a circular focal point suggesting mindfulness and focus. Ethereal, calming, premium quality. No text, no UI elements - pure atmospheric illustration to be used as a background. 4:3 aspect ratio.`,
  out + 'mindspace-hero-bg.png'
)) ok++;

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`✅ ${ok}/5 images generated`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
