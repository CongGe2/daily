// Knight v4 — Scene 4 fix: no rain, wet ground, light beam
const API_URL = 'https://nn.147ai.com/v1/chat/completions';
const API_KEY = 'sk-RMB5xMHGduTeBEi6KFGFMppdbBQpnVLoZ4Ki1LYw66XfJ7O7';
const MODEL = 'gemini-3.1-flash-image-preview';

import { readFileSync, writeFileSync } from 'fs';

const refPath = 'C:\\Users\\14169\\portfolio\\images\\knight\\knight-v2-01-sunset.png';
const refB64 = readFileSync(refPath).toString('base64');
const outDir = 'C:\\Users\\14169\\portfolio\\images\\knight\\';

async function img2img(refB64, prompt, filename) {
  console.log(`\n🎨 img2img → ${filename}`);
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
      body: JSON.stringify({
        model: MODEL,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:image/png;base64,${refB64}` } },
            { type: 'text', text: prompt }
          ]
        }],
        max_tokens: 4096
      })
    });
    if (!res.ok) { const e = await res.text(); console.error(`   ❌ ${res.status}: ${e.substring(0,200)}`); return null; }
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) { console.error('   ❌ No content'); return null; }
    let b64 = null;
    const m = content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/);
    if (m) b64 = m[1];
    if (!b64) { const m2 = content.match(/[A-Za-z0-9+/]{800,}={0,2}/); if (m2) b64 = m2[0]; }
    if (!b64 && Array.isArray(content)) {
      for (const part of content) {
        if (part.type === 'image_url' && part.image_url?.url?.startsWith('data:'))
          b64 = part.image_url.url.split(',')[1];
      }
    }
    if (!b64) { console.error('   ❌ No image'); return null; }
    const buf = Buffer.from(b64, 'base64');
    writeFileSync(filename, buf);
    console.log(`   ✅ ${(buf.length/1024).toFixed(1)} KB`);
    return filename;
  } catch(e) { console.error(`   ❌ ${e.message}`); return null; }
}

const prompt = `CRITICAL: Keep the ground plane, horizon line (exactly 50% vertical), ground texture base, and the tiny knight's position (left golden ratio ~38%) IDENTICAL to the reference image. Only change what is described below. Maintain the same painterly atmospheric style. Keep details clear and sharp.

TRANSFORM the scene:
- The storm has just passed. No rain streaks visible in the air — the rain has stopped.
- The ground is now wet and soaked from heavy rain that just ended: dark, reflective, with subtle puddles and a glossy sheen catching the light. The grass glistens with moisture.
- The sky is still mostly dark grey storm clouds, but there is a small break in the clouds directly above the knight.
- Through that break, a single dramatic shaft of warm golden-white divine sunlight beams down like a spotlight, illuminating ONLY the tiny knight and the wet ground immediately around him. The rest of the landscape remains in shadow.
- The knight's armor — battered and scarred from battle — gleams brilliantly where the light hits, the wet metal reflecting the golden beam. The greatsword catches the light. The tattered cape is soaked with residual water, but clean — the rain has washed away the blood and mud.
- Redemption, cleansing, hope after darkness.`;

console.log('╔══════════════════════════════════════╗');
console.log('║  骑士 v4 — 图四修复                 ║');
console.log('║  雨后地面 + 光束，无雨丝            ║');
console.log('╚══════════════════════════════════════╝');

const filename = outDir + 'knight-v4-04-after-rain.png';
const result = await img2img(refB64, prompt, filename);
console.log(`\n${result ? '✅ Done' : '❌ Failed'}\n`);
