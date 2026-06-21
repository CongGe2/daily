// Generate design process images for Rift Speaker + VR Device
// NanoBanana2 (Gemini 3.1 Flash Image)
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

const outDir = 'C:\\Users\\14169\\portfolio\\images\\process\\';
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const images = [
  // ── Rift Speaker ──
  {
    name: 'rift-sketches.png',
    prompt: `Industrial design sketchbook page showing 8-12 concept sketches of a premium portable Bluetooth speaker. Black fine-liner pen on off-white paper with light pencil underdrawing. Exploration of cylindrical forms with different diagonal split-line treatments (15°, 30°, 45°). Some sketches show fabric-meets-metal material transition. The bottom-right sketch is circled as the chosen direction: a sleek tapered cylinder with 30° diagonal split, upper section dark fabric, lower section brushed metal. Hand-drawn authentic student designer feel. 4:3. No text or logos.`
  },
  {
    name: 'rift-cmf-detail.png',
    prompt: `Extreme close-up macro photography showing the material transition on a premium speaker: dark charcoal Kvadrat acoustic textile fabric meeting warm silver sandblasted anodized aluminum along a precise diagonal seam line. Fine textile weave texture visible on fabric side, subtle matte grain on metal side. A thin copper-toned accent ring sits precisely in the seam. Soft directional lighting emphasizing texture contrast. High-end product detail shot. 4:3. No text.`
  },
  {
    name: 'rift-exploded.png',
    prompt: `Clean technical exploded view diagram of a cylindrical portable Bluetooth speaker. Components floating apart in aligned order: front fabric grille (dark charcoal), acoustic driver unit, main cylindrical housing with diagonal split, battery pack, rear aluminum shell (warm silver), control button module. Clean white background, subtle drop shadows between layers. Technical but elegant, like Bang & Olufsen documentation. Isometric 3/4 view. 4:3. No text or labels.`
  },
  // ── VR Device ──
  {
    name: 'vr-concepts.png',
    prompt: `Design concept exploration sketchbook page for a magnetic suspension VR haptic feedback device. 8-10 quick concept sketches exploring different exoskeleton forms: full body suit, shoulder-mounted rig, arm-only exoskeleton, cable-suspended harness, magnetic belt system. Black fine-liner on off-white paper. Some sketches have annotations scribbled in Chinese. The bottom sketches show convergence toward a lightweight magnetic+cable solution. Hand-drawn student designer feel. 4:3.`
  },
  {
    name: 'vr-ergonomics.png',
    prompt: `Human factors and ergonomic study sketches for a VR body device. Multiple small figure drawings showing different body positions and the device interaction: a person wearing the lightweight shoulder harness, arm reach radius diagrams, head movement range arcs, weight distribution arrows on shoulders. Technical but hand-drawn feel. Dark pencil with red accent lines marking key measurements. Off-white paper background. 4:3. No text.`
  },
  {
    name: 'vr-prototype.png',
    prompt: `Photography of a 3D-printed prototype for a wearable VR device component. A white FDM 3D-printed shoulder harness piece on a clean white desk surface. The print layers are subtly visible. Next to it: digital calipers, a Rhino 7 wireframe screenshot on a laptop screen in the background (out of focus), and some support material scraps. Natural window lighting. Maker/design studio authentic feel. 4:3. No faces, no text.`
  },
];

console.log('╔══════════════════════════════════════╗');
console.log('║  Design Process Images              ║');
console.log('║  Rift ×3 + VR ×3 = 6 images        ║');
console.log('╚══════════════════════════════════════╝\n');

let ok = 0;
for (const img of images) {
  const fp = outDir + img.name;
  if (existsSync(fp)) { console.log(`   ⏭️  ${img.name}`); ok++; continue; }
  if (await gen(img.prompt, fp)) ok++;
  await new Promise(r => setTimeout(r, 2000));
}
console.log(`\n✅ ${ok}/${images.length}\n`);
