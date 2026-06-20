import https from 'node:https'; import fs from 'node:fs'; import sharp from 'sharp';

function api(p){return new Promise((resolve)=>{const b=JSON.stringify({model:'gemini-3.1-flash-image-preview',messages:[{role:'user',content:p}],max_tokens:4096});const r=https.request({hostname:'nn.147ai.com',path:'/v1/chat/completions',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer sk-RMB5xMHGduTeBEi6KFGFMppdbBQpnVLoZ4Ki1LYw66XfJ7O7','Content-Length':Buffer.byteLength(b)},timeout:180000},(res)=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>resolve(res.statusCode===200?JSON.parse(d):null))});r.on('timeout',()=>{r.destroy();resolve(null)});r.on('error',()=>resolve(null));r.write(b);r.end()})}

async function gen(p, file) {
  console.log(`\n🎨 ${file}`);
  const d = await api(p);
  if (!d?.choices?.[0]?.message?.content) { console.log('❌ API fail'); return null; }
  const c = d.choices[0].message.content;
  const m = c.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/) || c.match(/!\[.*?\]\(data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)\)/);
  if (!m) { console.log('❌ No image'); return null; }
  const buf = Buffer.from(m[1], 'base64');
  // Save raw PNG first
  fs.writeFileSync(file + '.tmp.png', buf);
  // Optimize to JPG
  await sharp(buf).resize({width:1600,withoutEnlargement:true}).jpeg({quality:82,mozjpeg:true}).toFile(file);
  fs.unlinkSync(file + '.tmp.png');
  console.log(`✅ ${(fs.statSync(file).size/1024).toFixed(0)} KB`);
  return file;
}

const out = 'C:/Users/14169/portfolio/images/ux/';
if (!fs.existsSync(out)) fs.mkdirSync(out, {recursive: true});

console.log('╔══════════════════════════════════════╗');
console.log('║  MindSpace UX v2 · Image Gen        ║');
console.log('╚══════════════════════════════════════╝');

// 1. Hero - app on phone mockup
await gen(
  `A beautiful iPhone 15 Pro mockup showing a meditation app main screen. The app has a dark purple-to-indigo gradient background with a large circular breathing animation in the center. Below the circle are three cards labeled "Focus", "Sleep", "Relax" with tiny icons. The UI is clean, modern, minimalist. The phone is angled slightly on a warm off-white desk surface. Professional app showcase photography style. No real logos. High quality.`,
  out + 'hero.jpg'
);
await new Promise(r => setTimeout(r, 2000));

// 2. Concept exploration grid
await gen(
  `A 2x3 grid moodboard showing 6 different visual styles for a meditation app design. Each cell shows a different aesthetic: (1) soft watercolor green botanicals, (2) deep cosmic purple nebula, (3) warm terracotta geometric, (4) zen black ink wash, (5) peach coral fluid shapes, (6) orange-to-indigo mountain gradients. Clean grid layout with thin white dividers. Professional design exploration board. No text labels needed. High quality.`,
  out + 'concepts.jpg'
);
await new Promise(r => setTimeout(r, 2000));

// 3. SD workflow diagram
await gen(
  `A clean 3-panel horizontal diagram showing an AI image generation workflow for UX design. Left panel: "Prompt Engineering" showing a text prompt with parameters. Middle panel: "AI Generation" showing 4 small image variations in a 2x2 grid. Right panel: "Design Integration" showing a polished mobile app screen. Clean modern infographic style with subtle arrows connecting the panels. Professional UX portfolio quality. 4:3 aspect ratio.`,
  out + 'workflow.jpg'
);
await new Promise(r => setTimeout(r, 2000));

// 4. 4 app screens showcase
await gen(
  `Four iPhone screens of a meditation app arranged in a row from left to right: Screen 1 (Onboarding) - purple nebula background with "Find your calm" text. Screen 2 (Home) - circular breathing timer, 3 category cards. Screen 3 (Session) - audio player with abstract illustration. Screen 4 (Profile) - stats dashboard with achievements. Clean modern UI design, consistent purple/indigo color palette, rounded corners. Phones floating on warm off-white background. Professional UI/UX portfolio showcase. No real brand names. 4:3 aspect ratio.`,
  out + 'screens.jpg'
);

// Generate thumbnail
await sharp(out + 'hero.jpg').resize({width:800,height:600,fit:'cover'}).jpeg({quality:78}).toFile('C:/Users/14169/portfolio/images/optimized/mindspace-thumb.jpg');

console.log('\n✅ All done!');
