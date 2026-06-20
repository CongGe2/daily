// Short Film Keyframes: 「行者 · THE WALKER」
// NanoBanana2 API (Gemini 3.1 Flash Image)

const API_URL = 'https://nn.147ai.com/v1/chat/completions';
const API_KEY = 'sk-RMB5xMHGduTeBEi6KFGFMppdbBQpnVLoZ4Ki1LYw66XfJ7O7';
const MODEL = 'gemini-3.1-flash-image-preview';

import { writeFileSync, existsSync, mkdirSync } from 'fs';

async function generateImage(prompt, filename) {
  console.log(`\n🎬 Generating: ${filename}`);
  console.log(`   Scene: ${prompt.substring(0, 100)}...`);

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
      console.error(`   ❌ Error ${res.status}: ${err.substring(0, 300)}`);
      return null;
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error(`   ❌ No content`);
      return null;
    }

    let base64 = null;
    const dataUriMatch = content.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/);
    if (dataUriMatch) base64 = dataUriMatch[1];

    if (!base64) {
      const mdMatch = content.match(/!\[.*?\]\(data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)\)/);
      if (mdMatch) base64 = mdMatch[1];
    }

    if (!base64) {
      const b64Match = content.match(/[A-Za-z0-9+/]{800,}={0,2}/);
      if (b64Match) base64 = b64Match[0];
    }

    if (!base64) {
      console.error(`   ❌ No image found. Content preview: ${typeof content === 'string' ? content.substring(0, 200) : JSON.stringify(content).substring(0, 200)}`);
      return null;
    }

    const buf = Buffer.from(base64, 'base64');
    writeFileSync(filename, buf);
    console.log(`   ✅ Saved: ${filename} (${(buf.length / 1024).toFixed(1)} KB)`);
    return filename;
  } catch (e) {
    console.error(`   ❌ Exception: ${e.message}`);
    return null;
  }
}

const scenes = [
  {
    name: 'scene-01-void.png',
    prompt: `Cinematic wide shot, 16:9 aspect ratio. A lone figure in dark minimal clothing walking away from camera in a pure white infinite void. Subtle faint grid lines barely visible on the floor. The figure's first footstep creates a dark path line under their feet. Minimal, clean, architectural. Soft diffused lighting from above. The feeling is beginning, emptiness, potential. No text, no UI, no faces visible. Back view of the figure, small in the frame, centered slightly below.`
  },
  {
    name: 'scene-02-grid.png',
    prompt: `Cinematic wide shot, 16:9 aspect ratio. Same lone dark figure walking forward viewed from behind, now in a dark deep blue-black space. Neon cyan wireframe grid lines on the floor creating glowing circular ripples where feet touch. Floating translucent UI fragments and geometric shapes around the figure. Sci-fi atmosphere but elegant and refined. Dramatic rim lighting in cyan and violet on the figure's silhouette. The figure is small in the vast digital space. No text.`
  },
  {
    name: 'scene-03-curves.png',
    prompt: `Cinematic wide shot, 16:9 aspect ratio. Back view of a lone dark figure walking through a space filled with flowing elegant 3D curves floating in the air. The curves are smooth like NURBS, transitioning from cold cyan at the edges to warm golden tones near the figure. The environment feels like a beautiful 3D modeling workspace come to life. Refined, sophisticated, creative atmosphere. Warm directional light from above-front. No faces, no text.`
  },
  {
    name: 'scene-04-materials.png',
    prompt: `Cinematic wide shot, 16:9 aspect ratio. Back view of a lone dark figure walking through a space with suspended giant material fragments: matte white ceramic shards, textured dark charcoal fabric pieces, brushed silver aluminum panels. The fragments are slowly assembling themselves into a sleek cylindrical product with a visible diagonal split line. Warm studio lighting, high-end product photography aesthetic. Tactile, luxurious material-focused atmosphere. No faces, no text, no logos.`
  },
  {
    name: 'scene-05-break.png',
    prompt: `Cinematic wide shot, 16:9 aspect ratio. Back view of a lone dark figure walking through an explosion of glowing golden particles. A sleek product shattering outward into a storm of warm golden dust. Each tiny particle looks like a miniature sketch or blueprint fragment. Dramatic, climactic, beautiful destruction. Dark charcoal background with golden particle vortex swirling around the figure. The figure continues forward calm and undeterred. Cinematic lighting. No text.`
  },
  {
    name: 'scene-06-light.png',
    prompt: `Cinematic wide shot, 16:9 aspect ratio. A lone dark figure from behind walking through a bright doorway into a warm white minimalist gallery space. Inside: product designs on pedestals, holographic UI screens floating, a ceramic sculpture, all elegantly displayed. The figure pauses mid-step, turning slightly as if looking back. Behind them, a galaxy-like shimmering path made of colorful fragments from different worlds stretches backward. Warm exhibition lighting, achievement, reflection. No faces clearly visible, no text.`
  },
];

const outDir = 'C:\\Users\\14169\\portfolio\\images\\shortfilm\\';
if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
  console.log(`📁 Created: ${outDir}`);
}

console.log('╔══════════════════════════════════════╗');
console.log('║  「行者 · THE WALKER」Keyframes    ║');
console.log('║  6 Scenes · NanoBanana2             ║');
console.log('╚══════════════════════════════════════╝\n');

let success = 0;
for (const scene of scenes) {
  const filepath = outDir + scene.name;
  if (existsSync(filepath)) {
    console.log(`   ⏭️  Skipping (exists): ${scene.name}`);
    success++;
    continue;
  }
  const result = await generateImage(scene.prompt, filepath);
  if (result) success++;
  await new Promise(r => setTimeout(r, 2000));
}

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`✅ Generated ${success}/${scenes.length} keyframes`);
console.log(`📁 ${outDir}`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
