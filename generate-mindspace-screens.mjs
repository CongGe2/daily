// Generate MindSpace UX 4-screen mockups via NanoBanana2
const API_URL = 'https://nn.147ai.com/v1/chat/completions';
const API_KEY = 'sk-RMB5xMHGduTeBEi6KFGFMppdbBQpnVLoZ4Ki1LYw66XfJ7O7';
const MODEL = 'gemini-3.1-flash-image-preview';

import { writeFileSync, existsSync, mkdirSync } from 'fs';

async function gen(prompt, filename) {
  console.log(`\n🎨 ${filename}`);
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
      body: JSON.stringify({ model: MODEL, messages: [{ role: 'user', content: prompt }], max_tokens: 4096 })
    });
    if (!res.ok) { console.error(`   ❌ ${res.status}`); return null; }
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) { console.error('   ❌ No content'); return null; }
    let b64 = null;
    const m = content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/);
    if (m) b64 = m[1];
    if (!b64) { const m2 = content.match(/[A-Za-z0-9+/]{800,}={0,2}/); if (m2) b64 = m2[0]; }
    if (!b64) { console.error('   ❌ No image'); return null; }
    writeFileSync(filename, Buffer.from(b64, 'base64'));
    console.log(`   ✅ ${(Buffer.from(b64,'base64').length/1024).toFixed(1)} KB`);
    return filename;
  } catch(e) { console.error(`   ❌ ${e.message}`); return null; }
}

const outDir = 'C:\\Users\\14169\\portfolio\\images\\ux\\';
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const STYLE = `Mobile app UI mockup, premium dark mode, centered on an iPhone. Clean modern neo-brutalist design with soft purple-violet (#7C5CE7) and cyan (#00D4AA) accent colors, dark charcoal background (#1A1A2E), white text. Rounded cards with subtle glow. Meditation and mindfulness app called "MindSpace". High quality UI design, realistic app screenshot style. No text labels outside the app screen. 4:3 aspect ratio.`;

const screens = [
  {
    name: 'mindspace-onboarding.png',
    prompt: `${STYLE} The onboarding/splash screen. Shows a beautiful abstract flowing purple-violet gradient orb in the center. Below it, the text "MindSpace" in elegant white font, and subtitle "Find your inner calm" beneath. At the bottom, a large rounded "Get Started" button in violet (#7C5CE7) with white text. The background is the dark charcoal with subtle floating particles. Warm, inviting, premium feel.`
  },
  {
    name: 'mindspace-home.png',
    prompt: `${STYLE} The main home dashboard screen. Top: "Good morning" greeting with user name. Below: a large "Daily Meditation" card with a play icon and "Continue your journey" text. Beneath that: a horizontal scroll of meditation category cards (Focus, Sleep, Anxiety, Breathing) with colored icons. At the bottom: a progress ring showing "3/7 days this week". Clean card-based layout.`
  },
  {
    name: 'mindspace-session.png',
    prompt: `${STYLE} The active meditation session screen. Center: a large animated-looking circular breathing guide with a glowing violet ring that expands and contracts. Inside the circle: "Breathe in..." text. Below the circle: a session timer showing "08:32 remaining". At the bottom: a pause button and a stop button. The background has subtle purple ambient glow. Immersive, calming.`
  },
  {
    name: 'mindspace-profile.png',
    prompt: `${STYLE} The user profile and stats screen. Top: user avatar circle with name "Jin" and a settings gear icon. Below: stats cards in a 2x2 grid showing "Total Minutes: 842", "Streak: 12 days", "Sessions: 64", "Avg. Focus: 87%". Below that: a "Recent Sessions" list with 3 entries showing date, duration, and type. Bottom navigation bar with 4 tabs: Home (active), Explore, Stats, Profile.`
  },
];

console.log('╔══════════════════════════════════════╗');
console.log('║  MindSpace 4-Screen UI Generation   ║');
console.log('╚══════════════════════════════════════╝\n');

let ok = 0;
for (const s of screens) {
  const fp = outDir + s.name;
  if (existsSync(fp)) { console.log(`   ⏭️  ${s.name}`); ok++; continue; }
  if (await gen(s.prompt, fp)) ok++;
  await new Promise(r => setTimeout(r, 2000));
}
console.log(`\n✅ ${ok}/4\n`);
