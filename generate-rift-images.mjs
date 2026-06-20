// Generate Rift Speaker product images via NanoBanana2 (Gemini 3.1 Flash Image)
// API: nn.147ai.com | Model: gemini-3.1-flash-image-preview

const API_URL = 'https://nn.147ai.com/v1/chat/completions';
const API_KEY = 'sk-RMB5xMHGduTeBEi6KFGFMppdbBQpnVLoZ4Ki1LYw66XfJ7O7';
const MODEL = 'gemini-3.1-flash-image-preview';

async function generateImage(prompt, filename) {
  console.log(`\n🎨 Generating: ${filename}`);
  console.log(`   Prompt: ${prompt.substring(0, 100)}...`);

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
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
    console.error(`   ❌ No content in response`);
    console.log(`   Response keys: ${Object.keys(data)}`);
    return null;
  }

  // Gemini returns images as base64 in markdown or as inline data
  // Try multiple extraction patterns
  let base64 = null;

  // Pattern 1: data:image/png;base64,...
  const dataUriMatch = content.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/);
  if (dataUriMatch) {
    base64 = dataUriMatch[0].split(',')[1];
  }

  // Pattern 2: Markdown image with base64
  if (!base64) {
    const mdMatch = content.match(/!\[.*?\]\(data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)\)/);
    if (mdMatch) base64 = mdMatch[1];
  }

  // Pattern 3: image_url in content array
  if (!base64 && data.choices?.[0]?.message?.content) {
    // Might be multimodal response
    if (typeof content === 'object' && Array.isArray(content)) {
      for (const part of content) {
        if (part.type === 'image_url' && part.image_url?.url) {
          const url = part.image_url.url;
          if (url.startsWith('data:')) {
            base64 = url.split(',')[1];
          } else {
            // It's a URL - download it
            console.log(`   Found image URL: ${url.substring(0, 80)}...`);
            const imgRes = await fetch(url);
            if (imgRes.ok) {
              const buf = Buffer.from(await imgRes.arrayBuffer());
              const fs = await import('fs');
              fs.writeFileSync(filename, buf);
              console.log(`   ✅ Saved (from URL): ${filename} (${(buf.length / 1024).toFixed(1)} KB)`);
              return filename;
            }
          }
        }
      }
    }
  }

  // Pattern 4: Check for base64 embedded directly in text
  if (!base64) {
    const b64Match = content.match(/[A-Za-z0-9+/]{500,}={0,2}/);
    if (b64Match) base64 = b64Match[0];
  }

  if (!base64) {
    console.error(`   ❌ No image found in response`);
    console.log(`   Content preview: ${typeof content === 'string' ? content.substring(0, 200) : JSON.stringify(content).substring(0, 200)}`);
    return null;
  }

  const fs = await import('fs');
  const buf = Buffer.from(base64, 'base64');
  fs.writeFileSync(filename, buf);
  console.log(`   ✅ Saved: ${filename} (${(buf.length / 1024).toFixed(1)} KB)`);
  return filename;
}

// ============ Prompts ============

const prompts = [
  // 1. Hero product shot - studio lighting, 3/4 perspective
  {
    name: 'rift-hero-shot.png',
    prompt: `Product photography of a premium portable Bluetooth speaker called "Rift". The speaker has a distinctive diagonal split design - the upper section is wrapped in dark charcoal Kvadrat acoustic fabric, the lower section is sandblasted anodized aluminum in warm silver. A subtle diagonal seam line separates the two materials. Three small circular control buttons sit on the fabric upper section. The speaker is a sleek tapered cylinder shape (88mm diameter, 210mm height). Studio lighting with soft key light from the left creating gentle gradient across the metal body. Shot on a warm off-white (#fafaf8) seamless background. 3/4 perspective view showing both the fabric and metal sections clearly. The design is minimalist, architectural, and sophisticated. High-end product photography style like Bang & Olufsen or Devialet product shots. No text, no labels, no logos - just the pure product. 4:3 aspect ratio.`
  },

  // 2. Concept sketches - ideation phase
  {
    name: 'rift-concept-sketches.png',
    prompt: `A product designer's sketchbook page showing 8-12 quick concept sketches of portable Bluetooth speakers in various form factors. The sketches explore different design directions: some cylindrical, some boxy, some organic/pebble-shaped. Use a black fine-liner pen style on off-white paper with light pencil underdrawing visible. Include small annotation scribbles in Chinese/English next to some sketches. Some sketches show the evolution toward a diagonal split design. The final bottom-right sketch is more refined showing the chosen diagonal-split cylindrical direction. This should look like authentic industrial design process sketches from a design student's sketchbook. No digital rendering - pure hand-drawn feel. Warm paper texture. 4:3 aspect ratio.`
  },

  // 3. Form exploration & refinement sketches
  {
    name: 'rift-form-exploration.png',
    prompt: `Industrial design form study sketches of a cylindrical speaker with different split-line treatments. The page shows 5-6 refined pencil-and-pen sketches exploring variations: (1) horizontal split at 1/3 height, (2) diagonal 15-degree split, (3) diagonal 30-degree split, (4) zigzag split, (5) curved wave split. Each variation has a small note about pros/cons. The 30-degree diagonal split (marked with a star or circle) shows the most promise. Hand-drawn look with light grey marker shading to indicate material transitions - upper part darker (fabric), lower part lighter (metal). Designer's sketchbook style with attention to proportion. 4:3 aspect ratio, warm white paper background.`
  },

  // 4. Competitive product comparison visual
  {
    name: 'rift-competitive-comparison.png',
    prompt: `A clean, modern product comparison layout showing 4 portable Bluetooth speakers lined up in a row, photographed from the same angle against a warm off-white background. Left to right: (1) B&O Beosound A1 style - small round pebble, (2) Marshall Emberton style - rectangular retro amp-inspired, (3) JBL Flip style - practical cylindrical with exposed passive radiators, (4) RIFT - the sleeker option with diagonal fabric-to-metal split design. Each speaker labeled underneath with its key design characteristic. The RIFT speaker at position 4 should look distinctly more architectural and sculptural than the others. Clean product photography style, consistent soft studio lighting across all items. The image should communicate that RIFT occupies a unique position: premium home-aesthetic meets acoustic performance. 4:3 aspect ratio. No visible brand logos.`
  },

  // 5. CMF material swatches close-up
  {
    name: 'rift-cmf-detail.png',
    prompt: `Extreme close-up macro photography showing the material transition on the Rift speaker where the dark charcoal Kvadrat acoustic fabric meets the warm silver sandblasted anodized aluminum along a precise diagonal seam line. The fabric shows fine textile weave texture, the metal shows subtle matte grain from sandblasting. A thin metallic accent ring (in a warm rose-gold or copper tone) sits precisely in the seam between the two materials. Soft directional lighting emphasizes the texture contrast between the warm organic fabric and the cool precise metal. The composition is an elegant diagonal close-up that shows craftsmanship and material quality. High-end product detail shot style. 4:3 aspect ratio.`
  },
];

// ============ Main ============
console.log('╔══════════════════════════════════════╗');
console.log('║  Rift Speaker · Image Generation   ║');
console.log('║  NanoBanana2 (Gemini 3.1 Flash)     ║');
console.log('╚══════════════════════════════════════╝');

const outDir = 'C:\\Users\\14169\\portfolio\\images\\rift\\';
const fs = await import('fs');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

let success = 0;
for (const item of prompts) {
  const filepath = outDir + item.name;
  const result = await generateImage(item.prompt, filepath);
  if (result) success++;
  // Small delay to avoid rate limits
  await new Promise(r => setTimeout(r, 1500));
}

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`✅ Generated ${success}/${prompts.length} images`);
console.log(`📁 Output: ${outDir}`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
