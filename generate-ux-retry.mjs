import https from 'node:https';
import fs from 'node:fs';

function apiRequest(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'gemini-3.1-flash-image-preview',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4096
    });
    const req = https.request({
      hostname: 'nn.147ai.com', path: '/v1/chat/completions', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer sk-RMB5xMHGduTeBEi6KFGFMppdbBQpnVLoZ4Ki1LYw66XfJ7O7`, 'Content-Length': Buffer.byteLength(body) },
      timeout: 180000
    }, (res) => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => resolve(res.statusCode === 200 ? JSON.parse(d) : null));
    });
    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.on('error', () => resolve(null));
    req.write(body); req.end();
  });
}

async function gen(prompt, f) {
  console.log(`🎨 ${f}`);
  const data = await apiRequest(prompt);
  if (!data?.choices?.[0]?.message?.content) { console.log('❌'); return; }
  const c = data.choices[0].message.content;
  const m = c.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/) || c.match(/!\[.*?\]\(data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)\)/);
  if (!m) { console.log('❌ no img'); return; }
  const buf = Buffer.from(m[1], 'base64');
  fs.writeFileSync(f, buf);
  console.log(`✅ ${(buf.length/1024).toFixed(0)} KB`);
}

const out = 'C:/Users/14169/portfolio/images/ux/';

await gen(
  `A modern minimalist meditation app main screen UI design. The screen shows a large circular breathing timer in the center with a soft gradient from warm amber to deep purple. Below the timer are three category cards: "Focus", "Sleep", "Anxiety Relief" with subtle icons. The background is an AI-generated abstract gradient illustration in soft pastel tones suggesting calm and mindfulness. The overall design language is clean, airy, with generous whitespace. Sans-serif typography. iPhone 15 Pro mockup frame, perspective angle showing the screen clearly. App name "MindSpace" visible in the status bar area. Professional UI/UX portfolio quality. No real brand logos. 4:3 aspect ratio.`,
  out + 'mindspace-hero.png'
);

await new Promise(r => setTimeout(r, 2000));

await gen(
  `A design process moodboard showing AI-generated visual explorations for a meditation app. The image is divided into a 2x3 grid of different visual styles: (1) soft watercolor botanicals in sage green, (2) cosmic nebula gradients in deep blue and purple, (3) minimalist geometric shapes in warm terracotta, (4) Japanese zen ink wash style in black and white, (5) organic fluid shapes in coral and cream, (6) sunrise mountain silhouettes in gradient orange-to-indigo. Each cell has a small label below it. The layout should look like a design exploration board - clean grid with thin borders between cells. Below the grid there's a subtitle "AI-Generated Concept Exploration · 6 Visual Directions". Professional UX portfolio quality. 4:3 aspect ratio.`,
  out + 'mindspace-concepts.png'
);

console.log('\nDone');
