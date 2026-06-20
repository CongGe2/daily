// Knight v2 — Minimalist composition
// NanoBanana2 (Gemini 3.1 Flash Image)

const API_URL = 'https://nn.147ai.com/v1/chat/completions';
const API_KEY = 'sk-RMB5xMHGduTeBEi6KFGFMppdbBQpnVLoZ4Ki1LYw66XfJ7O7';
const MODEL = 'gemini-3.1-flash-image-preview';

import { writeFileSync, existsSync, mkdirSync } from 'fs';

async function generateImage(prompt, filename) {
  console.log(`\n⚔️  ${filename}`);
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
      body: JSON.stringify({ model: MODEL, messages: [{ role: 'user', content: prompt }], max_tokens: 4096 })
    });
    if (!res.ok) { console.error(`   ❌ ${res.status}: ${(await res.text()).substring(0,150)}`); return null; }
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) { console.error('   ❌ No content'); return null; }
    let b64 = null;
    const m = content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/);
    if (m) b64 = m[1];
    if (!b64) { const m2 = content.match(/[A-Za-z0-9+/]{800,}={0,2}/); if (m2) b64 = m2[0]; }
    if (!b64) { console.error('   ❌ No image'); return null; }
    const buf = Buffer.from(b64, 'base64');
    writeFileSync(filename, buf);
    console.log(`   ✅ ${(buf.length/1024).toFixed(1)} KB`);
    return filename;
  } catch(e) { console.error(`   ❌ ${e.message}`); return null; }
}

// Reference style: like v1 scene-03 — dark, painterly, atmospheric
const STYLE = `Dark atmospheric painterly style, like a Frank Frazetta or Kentaro Miura painting but more minimal. Rich textures, dramatic contrast, moody and cinematic. No sharp digital edges — soft painterly brushstrokes.`;

// Core composition: identical across all 4 scenes
const COMP = `Ultra-wide cinematic landscape, 16:9. The composition is extremely minimal: a flat straight horizon line cuts exactly across the middle of the frame (50% vertical). Below the horizon: simple flat dark ground, minimal detail. Above the horizon: a vast dramatic sky that fills the entire upper half. A tiny knight — full body, very small in scale, like a miniature figure on the horizon — stands on the horizon line at the left golden ratio (approximately 38% from the left edge). The knight wears heavy armor, drags a greatsword behind him, and has a tattered cape blowing slightly. The knight is so small he is almost a silhouette — visible as a tiny armored figure but not detailed. The camera follows the knight as he walks rightward along the horizon, so he remains frozen at that 38% position. ${STYLE}`;

const scenes = [
  {
    name: 'knight-v2-01-sunset.png',
    prompt: `${COMP} The sky is a warm late sunset: layers of golden orange, soft pink, pale violet, and deep blue near the top. Warm light on the horizon. The ground is a dark grassy plain silhouetted against the bright sky. The tiny knight walks along the horizon, his armor dark and dull — covered in mud, unreflective, heavy with filth. The greatsword drags behind. Peaceful but weary atmosphere.`,
  },
  {
    name: 'knight-v2-02-bloodsky.png',
    prompt: `${COMP} Night sky turning an ominous deep blood-red crimson across the entire upper half, with streaks of dark purple-black clouds. The horizon glows faint red. The ground below is nearly black. The tiny knight's armor is now clean — polished steel faintly catching the crimson glow. The greatsword gleams. The tattered cape moves in rising wind. Ominous, supernatural, threatening atmosphere.`,
  },
  {
    name: 'knight-v2-03-gloom.png',
    prompt: `${COMP} The sky is a wall of oppressive grey clouds — thick, heavy, uniform grey, no visible sun, flat and lifeless light. The entire scene is nearly monochrome grey. The ground is a dark muted grey-green. The tiny knight's cape is now visibly stained with dark blood, heavy and wet. The armor is intact but dull. The greatsword drags, leaving a faint line. Hopeless, exhausted, drained-of-color atmosphere.`,
  },
  {
    name: 'knight-v2-04-rain-light.png',
    prompt: `${COMP} Heavy rain falls diagonally across the entire frame, visible as fine streaks. The sky is dark storm-grey — but a single dramatic shaft of golden-white divine sunlight breaks through a small gap in the clouds directly onto the tiny knight, like a spotlight from heaven. The rain on the knight's armor creates streaks of cleanliness — the armor is visibly scarred and battered but the parts washed clean gleam brilliantly. The greatsword reflects the beam of light. The cape is soaked, blood rinsing away. Redemption, cleansing, hope.`,
  },
];

const outDir = 'C:\\Users\\14169\\portfolio\\images\\knight\\';
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

console.log('╔══════════════════════════════════════╗');
console.log('║  骑士短片 v2 — 极简地平线构图      ║');
console.log('╔══════════════════════════════════════╝\n');

let ok = 0;
for (const s of scenes) {
  if (existsSync(outDir + s.name)) { console.log(`   ⏭️  ${s.name}`); ok++; continue; }
  if (await generateImage(s.prompt, outDir + s.name)) ok++;
  await new Promise(r => setTimeout(r, 2000));
}
console.log(`\n✅ ${ok}/4\n`);
