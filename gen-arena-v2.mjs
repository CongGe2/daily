import https from 'node:https'; import fs from 'node:fs'; import sharp from 'sharp';

function api(p){return new Promise((resolve)=>{const b=JSON.stringify({model:'gemini-3.1-flash-image-preview',messages:[{role:'user',content:p}],max_tokens:4096});const r=https.request({hostname:'nn.147ai.com',path:'/v1/chat/completions',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer sk-RMB5xMHGduTeBEi6KFGFMppdbBQpnVLoZ4Ki1LYw66XfJ7O7','Content-Length':Buffer.byteLength(b)},timeout:180000},(res)=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>resolve(res.statusCode===200?JSON.parse(d):null))});r.on('timeout',()=>{r.destroy();resolve(null)});r.on('error',()=>resolve(null));r.write(b);r.end()})}

async function gen(p,file,w=512){
  console.log(`\n🎨 ${file}`);
  const d=await api(p);if(!d?.choices?.[0]?.message?.content){console.log('❌ fail');return}
  const c=d.choices[0].message.content;
  const m=c.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/)||c.match(/!\[.*?\]\(data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)\)/);
  if(!m){console.log('❌ no img');return}
  const buf=Buffer.from(m[1],'base64');
  fs.writeFileSync(file+'.tmp.png',buf);
  await sharp(buf).resize({width:w,height:w,fit:'cover'}).jpeg({quality:82}).toFile(file);
  fs.unlinkSync(file+'.tmp.png');
  console.log(`✅ ${(fs.statSync(file).size/1024).toFixed(0)}KB`);
}

const out='C:/Users/14169/portfolio/images/arena/';
if(!fs.existsSync(out))fs.mkdirSync(out,{recursive:true});

console.log('Generating arena v2 textures...');

// Better floor - Roman mosaic tiles
await gen('A seamless Roman mosaic floor texture with geometric patterns, terracotta and cream colored small tiles arranged in a circular arena pattern. Ancient Roman colosseum style. Top-down photorealistic ground texture for a 3D game. Rich warm earthy tones. Seamless tileable 512x512.',out+'floor.jpg');
await new Promise(r=>setTimeout(r,1500));

// Arena wall - grand colosseum arches
await gen('Ancient Roman colosseum exterior wall texture with arched openings, weathered sandstone and travertine blocks, grand arena architecture. Warm golden-brown stone. Seamless tileable 512x512 texture for 3D game.',out+'wall.jpg');
await new Promise(r=>setTimeout(r,1500));

// Health potion icon
await gen('A game item icon of a glowing red health potion bottle on a dark transparent background. RPG game style, pixel art adjacent but clean. The bottle is round with a cork stopper, containing bright red liquid with a subtle glow. Icon size style, centered. Dark background. 512x512.',out+'health-potion.jpg');
await new Promise(r=>setTimeout(r,1500));

// Speed boost icon
await gen('A game item icon of a glowing blue speed boost potion or winged boot on dark background. RPG game item style. Bright blue energy swirl inside a vial. Clean game icon. Dark background. 512x512.',out+'speed-boost.jpg');
await new Promise(r=>setTimeout(r,1500));

// Damage boost icon
await gen('A game item icon of a glowing orange/yellow strength potion or crossed swords on dark background. RPG game item style. Golden-orange liquid or energy. Clean game icon. Dark background. 512x512.',out+'damage-boost.jpg');
await new Promise(r=>setTimeout(r,1500));

// Shield icon
await gen('A game item icon of a glowing silver shield or barrier potion on dark background. RPG game item style. Silver/white protective aura around a small shield shape. Clean game icon. Dark background. 512x512.',out+'shield.jpg');

console.log('\n✅ Done!');
