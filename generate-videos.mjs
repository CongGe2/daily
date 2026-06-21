// Generate 4 Knight videos via Replicate API
const TOKEN = process.env.REPLICATE_API_TOKEN || 'your-token-here';
const BASE = 'https://api.replicate.com/v1';

import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';

const outDir = 'C:\\Users\\14169\\portfolio\\videos\\';
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

// Upload image to Replicate (as base64 data URI)
async function uploadImage(path) {
  const data = readFileSync(path);
  const b64 = data.toString('base64');
  return `data:image/png;base64,${b64}`;
}

// Create prediction and wait for result
async function createVideo(imagePath, prompt, outputName) {
  console.log(`\n🎬 ${outputName}`);
  console.log(`   上传图片...`);

  const imageUri = await uploadImage(imagePath);
  console.log(`   (${(imageUri.length/1024/1024).toFixed(1)} MB base64)`);

  // Create prediction
  console.log(`   提交生成...`);
  const res = await fetch(`${BASE}/predictions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'wan-video/wan-2.2-5b-fast',
      input: {
        image: imageUri,
        prompt: prompt,
        duration: 5,
        width: 1280,
        height: 720,
        go_fast: true,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`   ❌ HTTP ${res.status}: ${err.substring(0, 300)}`);
    return null;
  }

  const prediction = await res.json();
  const id = prediction.id;
  console.log(`   Prediction ID: ${id}`);
  console.log(`   等待生成...`);

  // Poll until complete
  let attempts = 0;
  while (attempts < 60) {
    await new Promise(r => setTimeout(r, 5000));
    attempts++;

    const poll = await fetch(`${BASE}/predictions/${id}`, {
      headers: { 'Authorization': `Bearer ${TOKEN}` },
    });
    const status = await poll.json();

    if (status.status === 'succeeded') {
      const outputUrl = status.output;
      console.log(`   ✅ 生成完成! 下载中...`);

      // Download video
      const videoRes = await fetch(outputUrl);
      if (videoRes.ok) {
        const buf = Buffer.from(await videoRes.arrayBuffer());
        writeFileSync(outputName, buf);
        console.log(`   ✅ 已保存: ${outputName} (${(buf.length/1024/1024).toFixed(1)} MB)`);
        return outputName;
      }
      return null;
    }

    if (status.status === 'failed') {
      console.error(`   ❌ 失败: ${status.error}`);
      return null;
    }

    if (attempts % 6 === 0) {
      process.stdout.write(`   ⏳ ${status.status || 'processing'}...\n`);
    }
  }
  console.error(`   ❌ 超时`);
  return null;
}

const scenes = [
  {
    image: 'C:\\Users\\14169\\portfolio\\images\\knight\\knight-v2-01-sunset.png',
    prompt: 'A tiny knight silhouette walks slowly forward along a flat horizon line at golden ratio. Warm sunset clouds drift gently from right to left across the sky. The grass on the ground sways slightly. Camera follows the knight steadily. Cinematic, atmospheric, no sudden movements.',
    output: outDir + 'knight-01-sunset.mp4',
  },
  {
    image: 'C:\\Users\\14169\\portfolio\\images\\knight\\knight-v3-02-bloodsky.png',
    prompt: 'A tiny knight silhouette walks slowly forward along a flat horizon line. Deep blood-red clouds roll and churn from right to left in the night sky. The grass sways more intensely in rising wind. The knights cape billows slightly. Camera follows steadily. Ominous, dramatic atmosphere.',
    output: outDir + 'knight-02-bloodsky.mp4',
  },
  {
    image: 'C:\\Users\\14169\\portfolio\\images\\knight\\knight-v3-03-gloom.png',
    prompt: 'A tiny knight silhouette walks forward slowly along a flat horizon line. Thick oppressive grey clouds drift heavily from right to left. Almost no wind, grass barely moves. The knights blood-stained cape hangs heavy and still. Camera follows steadily. Hopeless, drained-of-color atmosphere.',
    output: outDir + 'knight-03-gloom.mp4',
  },
  {
    image: 'C:\\Users\\14169\\portfolio\\images\\knight\\knight-v4-04-after-rain.png',
    prompt: 'A tiny knight silhouette walks forward slowly along a flat horizon line. Dark storm clouds part slightly revealing a golden shaft of divine light beaming down onto the knight. The wet ground glistens and reflects. Grass sways gently after the rain. Camera follows steadily. Redemption, hope, cleansing atmosphere.',
    output: outDir + 'knight-04-after-rain.mp4',
  },
];

console.log('╔══════════════════════════════════════╗');
console.log('║  骑士短片 · 4段视频生成            ║');
console.log('║  Replicate · Wan 2.2 5B Fast        ║');
console.log('╚══════════════════════════════════════╝\n');

let ok = 0;
for (const s of scenes) {
  if (existsSync(s.output)) { console.log(`   ⏭️  已有: ${s.output}`); ok++; continue; }
  if (await createVideo(s.image, s.prompt, s.output)) ok++;
}
console.log(`\n✅ ${ok}/${scenes.length} 段视频\n📁 ${outDir}\n`);
