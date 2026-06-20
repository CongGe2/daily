// Knight v3 — Image-to-Image, reference: v2-01-sunset
// Keep ground + knight position LOCKED, only change sky/lighting
const API_URL = 'https://nn.147ai.com/v1/chat/completions';
const API_KEY = 'sk-RMB5xMHGduTeBEi6KFGFMppdbBQpnVLoZ4Ki1LYw66XfJ7O7';
const MODEL = 'gemini-3.1-flash-image-preview';

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

const refPath = 'C:\\Users\\14169\\portfolio\\images\\knight\\knight-v2-01-sunset.png';
const refB64 = readFileSync(refPath).toString('base64');
const outDir = 'C:\\Users\\14169\\portfolio\\images\\knight\\';

async function img2img(refBase64, prompt, filename) {
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
            { type: 'image_url', image_url: { url: `data:image/png;base64,${refBase64}` } },
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
    if (!b64) {
      // Check if content is an array with image_url
      if (Array.isArray(content)) {
        for (const part of content) {
          if (part.type === 'image_url' && part.image_url?.url) {
            const url = part.image_url.url;
            if (url.startsWith('data:')) b64 = url.split(',')[1];
          }
        }
      }
    }
    if (!b64) { console.error('   ❌ No image. Preview:', typeof content === 'string' ? content.substring(0,150) : JSON.stringify(content).substring(0,150)); return null; }
    const buf = Buffer.from(b64, 'base64');
    writeFileSync(filename, buf);
    console.log(`   ✅ ${(buf.length/1024).toFixed(1)} KB`);
    return filename;
  } catch(e) { console.error(`   ❌ ${e.message}`); return null; }
}

// Key constraint: ground, horizon line, knight position MUST stay identical to reference
const LOCK = `CRITICAL: Keep the ground plane, horizon line position (exactly at 50% vertical), ground texture, and the tiny knight's position (left golden ratio, ~38% from left) IDENTICAL to the reference image. Only change the sky, lighting, atmosphere, and the knight's armor/cape condition as described. Maintain clear sharp details — not blurry, not hazy, suitable for adding foreground props later. Keep the same painterly atmospheric style and color palette treatment as the reference.`;

const scenes = [
  {
    name: 'knight-v3-02-bloodsky.png',
    prompt: `${LOCK} Transform the sky to a deep ominous blood-red crimson night sky with streaks of dark purple-black clouds. The horizon glows faint red. The tiny knight's armor should now look clean and polished — steel faintly catching the crimson glow. The greatsword gleams. The tattered cape lifts slightly in wind. The ground remains exactly the same dark plain. Ominous, supernatural atmosphere.`
  },
  {
    name: 'knight-v3-03-gloom.png',
    prompt: `${LOCK} Transform the sky to oppressive heavy grey overcast clouds — uniform, flat, lifeless grey light across the entire sky. The scene becomes nearly monochrome grey. The tiny knight's cape is now dark with blood stains, heavy and wet-looking. The armor is intact but dull. The ground remains exactly the same. Despair, exhaustion atmosphere.`
  },
  {
    name: 'knight-v3-04-rain-light.png',
    prompt: `${LOCK} Add heavy diagonal rain streaks across the entire frame. Keep the sky dark storm-grey but add a single dramatic shaft of golden-white divine sunlight breaking through the clouds directly onto the tiny knight like a spotlight. The rain creates streaks on the knight's armor — the armor is visibly scarred and battered but the parts washed clean gleam brilliantly. The greatsword reflects the light beam. The cape is soaked, blood being rinsed away. The ground remains exactly the same. Redemption, hope atmosphere.`
  },
];

console.log('╔══════════════════════════════════════╗');
console.log('║  骑士 v3 — 图生图，锁定构图        ║');
console.log('║  参考: knight-v2-01-sunset.png      ║');
console.log('╚══════════════════════════════════════╝\n');

let ok = 0;
for (const s of scenes) {
  if (existsSync(outDir + s.name)) { console.log(`   ⏭️  ${s.name}`); ok++; continue; }
  if (await img2img(refB64, s.prompt, outDir + s.name)) ok++;
  await new Promise(r => setTimeout(r, 2500));
}
console.log(`\n✅ ${ok}/${scenes.length}\n`);
