// Knight Short Film Keyframes — 4 Scenes
// NanoBanana2 (Gemini 3.1 Flash Image)

const API_URL = 'https://nn.147ai.com/v1/chat/completions';
const API_KEY = 'sk-RMB5xMHGduTeBEi6KFGFMppdbBQpnVLoZ4Ki1LYw66XfJ7O7';
const MODEL = 'gemini-3.1-flash-image-preview';

import { writeFileSync, existsSync, mkdirSync } from 'fs';

async function generateImage(prompt, filename) {
  console.log(`\n⚔️  Generating: ${filename}`);
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4096
      })
    });
    if (!res.ok) {
      const err = await res.text();
      console.error(`   ❌ Error ${res.status}: ${err.substring(0, 200)}`);
      return null;
    }
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) { console.error('   ❌ No content'); return null; }

    let base64 = null;
    const m = content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/);
    if (m) base64 = m[1];
    if (!base64) {
      const m2 = content.match(/[A-Za-z0-9+/]{800,}={0,2}/);
      if (m2) base64 = m2[0];
    }
    if (!base64) {
      console.error('   ❌ No image. Preview:', typeof content === 'string' ? content.substring(0, 150) : 'object');
      return null;
    }
    const buf = Buffer.from(base64, 'base64');
    writeFileSync(filename, buf);
    console.log(`   ✅ ${(buf.length/1024).toFixed(1)} KB`);
    return filename;
  } catch(e) { console.error(`   ❌ ${e.message}`); return null; }
}

// Shared composition instruction for ALL scenes
const COMPOSITION = `Cinematic wide shot, 16:9. View from behind and slightly below, camera following steadily. The knight occupies the left golden ratio (approximately 38% from left edge of frame), horizontally centered at mid-height. Only the lower legs, heavy armored boots, the tip of a massive greatsword being dragged, and the bottom edge of a tattered torn cape are visible. The camera angle is low, close to the ground, looking up slightly at the legs. No face visible. The knight walks forward along the highest ridge of a grassy slope, the ground sloping down to the right.`;

const scenes = [
  {
    name: 'knight-01-sunset.png',
    prompt: `${COMPOSITION} The sky is a warm late evening sunset — golden orange and soft pink clouds at the horizon, transitioning to pale violet higher up. Warm amber light bathes the grassy slope. The knight's armor is completely covered in mud and dirt, caked-on filth, dull and unreflective. The greatsword blade is similarly grimy. The tattered cape hangs heavy with dust. The atmosphere is weary but peaceful. Late summer evening feeling.`,
  },
  {
    name: 'knight-02-bloodsky.png',
    prompt: `${COMPOSITION} Night has fallen. The sky is an ominous deep blood-red crimson, like a wound across the heavens, with streaks of dark purple-black clouds. The grassy slope is lit by this eerie red glow from above. The knight's armor is now pristine — polished steel gleaming with the crimson reflection of the sky. The greatsword is clean and sharp, catching the red light. The tattered cape billows slightly in a rising wind. The atmosphere is threatening, ominous, supernatural.`,
  },
  {
    name: 'knight-03-gloom.png',
    prompt: `${COMPOSITION} The sky has turned completely grey and overcast — thick oppressive dark grey clouds, no visible sun, flat and lifeless light. The grassy slope is muted, almost colorless under the grey sky. The knight's armor is still intact but the tattered cape is now soaked and stained with dark blood, heavy and dripping. The greatsword drags leaving a thin trail in the grass. The atmosphere is despair, exhaustion, a world drained of color.`,
  },
  {
    name: 'knight-04-rain-light.png',
    prompt: `${COMPOSITION} Heavy sudden rain pours down, visible as diagonal streaks across the frame. Dark grey storm clouds above — but a single dramatic shaft of golden-white sunlight breaks through a gap in the clouds, illuminating the knight directly like a spotlight from heaven. The rain on the armor is washing away the mud and filth in streaks. The knight's armor is visibly battered and scarred from battle, but the parts washed clean gleam brilliantly in the divine light. The greatsword reflects the beam of light. The tattered cape is soaked but the blood is being rinsed away. The atmosphere is redemption, cleansing, hope after darkness.`,
  },
];

const outDir = 'C:\\Users\\14169\\portfolio\\images\\knight\\';
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

console.log('╔══════════════════════════════════════╗');
console.log('║  骑士短片 · 四幕关键帧             ║');
console.log('║  NanoBanana2 (Gemini 3.1 Flash)     ║');
console.log('╚══════════════════════════════════════╝\n');

let success = 0;
for (const scene of scenes) {
  const fp = outDir + scene.name;
  if (existsSync(fp)) { console.log(`   ⏭️  Skip: ${scene.name}`); success++; continue; }
  if (await generateImage(scene.prompt, fp)) success++;
  await new Promise(r => setTimeout(r, 2000));
}
console.log(`\n✅ ${success}/4 keyframes\n📁 ${outDir}\n`);
