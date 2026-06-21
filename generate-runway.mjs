// Generate 4 Knight videos via Runway API
const TOKEN = 'key_8b9b5cd658dd98b64caf7c1a55a3ff11558e2e2810c3cbc9ce68531c2b6de4a5e78a2194012f648ae8746dfc3c13d01f690f3f9ba1c6bccdee806b1da9d9e45f';
const BASE = 'https://api.dev.runwayml.com/v1';
const VERSION = '2024-11-06';

import { writeFileSync, existsSync, mkdirSync } from 'fs';

const outDir = 'C:\\Users\\14169\\portfolio\\videos\\';
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

async function runwayRequest(path, body = null) {
  const opts = {
    method: body ? 'POST' : 'GET',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'X-Runway-Version': VERSION,
      'Content-Type': 'application/json',
    },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  const text = await res.text();
  if (!res.ok) {
    console.error(`   ❌ HTTP ${res.status}: ${text.substring(0, 300)}`);
    return null;
  }
  try { return JSON.parse(text); } catch { return text; }
}

async function createVideo(imagePath, prompt, outputName) {
  console.log(`\n🎬 ${outputName}`);

  // Use public HTTPS URL (Runway doesn't accept base64)
  const imageUrl = imagePath; // Already passed as URL
  console.log(`   图片URL: ${imageUrl.substring(0, 80)}...`);

  // Submit image-to-video task
  console.log(`   提交生成...`);
  const task = await runwayRequest('/image_to_video', {
    model: 'gen4_turbo',
    promptImage: imageUrl,
    promptText: prompt,
    duration: 5,
    ratio: '1280:720',
    seed: Math.floor(Math.random() * 1000000),
  });

  if (!task || !task.id) {
    console.error(`   ❌ 任务创建失败: ${JSON.stringify(task).substring(0, 200)}`);
    return null;
  }

  console.log(`   Task ID: ${task.id}`);

  // Poll until complete
  let attempts = 0;
  while (attempts < 120) {
    await new Promise(r => setTimeout(r, 10000));
    attempts++;

    const status = await runwayRequest(`/tasks/${task.id}`);
    if (!status) continue;

    if (status.status === 'SUCCEEDED' || status.status === 'COMPLETED') {
      const url = status.output?.[0] || status.output?.video || status.output;
      console.log(`   ✅ 生成完成! 下载中...`);

      if (typeof url === 'string' && url.startsWith('http')) {
        const videoRes = await fetch(url);
        if (videoRes.ok) {
          const buf = Buffer.from(await videoRes.arrayBuffer());
          writeFileSync(outputName, buf);
          console.log(`   ✅ 已保存: ${outputName} (${(buf.length/1024/1024).toFixed(1)} MB)`);
          return outputName;
        }
      }
      console.error(`   ❌ 无法下载: ${JSON.stringify(status.output).substring(0, 200)}`);
      return null;
    }

    if (status.status === 'FAILED') {
      console.error(`   ❌ 生成失败: ${JSON.stringify(status).substring(0, 300)}`);
      return null;
    }

    if (attempts % 5 === 0) {
      process.stdout.write(`   ⏳ ${status.status} (${attempts * 10}s)...\n`);
    }
  }
  console.error(`   ❌ 超时`);
  return null;
}

const MOTION = 'CRITICAL: The camera moves at the exact same speed as the character — the knight remains perfectly locked at the same screen position throughout, like a side-scrolling game. No zoom in or out. No camera shake, no handheld wobble. The knight takes slow heavy steps with a slight up-down bob, dragging the greatsword. Only the background sky and ground scroll past. The cape sways slightly with each step. Absolutely static camera lock — the character is pinned at his golden-ratio position like a tracking matte painting.';

const scenes = [
  {
    image: 'https://ed79a0eb.jin-chengxu-portfolio.pages.dev/images/knight/knight-v2-01-sunset.png',
    prompt: `${MOTION} Golden-orange sunset clouds scroll slowly from right to left. Warm evening light. Grass slides past smoothly. The knight walks with heavy tired steps, armor covered in mud. Peaceful but weary.`,
    output: outDir + 'knight-runway-v2-01-sunset.mp4',
  },
  {
    image: 'https://ed79a0eb.jin-chengxu-portfolio.pages.dev/images/knight/knight-v3-02-bloodsky.png',
    prompt: `${MOTION} Deep blood-red clouds roll from right to left across the night sky. Crimson light. Wind blows harder — cape billows more. Knight walks same pace, armor now clean and gleaming red. Ominous.`,
    output: outDir + 'knight-runway-v2-02-bloodsky.mp4',
  },
  {
    image: 'https://ed79a0eb.jin-chengxu-portfolio.pages.dev/images/knight/knight-v3-03-gloom.png',
    prompt: `${MOTION} Thick oppressive grey clouds slide slowly from right to left. Nearly monochrome. Almost no wind — cape hangs heavy and still, stained with blood. Knight walks same pace but heavier, more burdened. Hopeless atmosphere.`,
    output: outDir + 'knight-runway-v2-03-gloom.mp4',
  },
  {
    image: 'https://ed79a0eb.jin-chengxu-portfolio.pages.dev/images/knight/knight-v4-04-after-rain.png',
    prompt: `${MOTION} Dark storm clouds part with a shaft of golden divine light illuminating the knight. Wet ground glistens and scrolls past. The knight walks same pace — armor scarred but gleaming where light hits. Cape soaked, water dripping. Redemption.`,
    output: outDir + 'knight-runway-v2-04-after-rain.mp4',
  },
];

console.log('╔══════════════════════════════════════╗');
console.log('║  骑士短片 · Runway Gen-4            ║');
console.log('║  4段图生视频                        ║');
console.log('╚══════════════════════════════════════╝\n');

let ok = 0;
for (const s of scenes) {
  if (existsSync(s.output)) { console.log(`   ⏭️  已有: ${s.output}`); ok++; continue; }
  if (await createVideo(s.image, s.prompt, s.output)) ok++;
}
console.log(`\n✅ ${ok}/${scenes.length}\n📁 ${outDir}\n`);
