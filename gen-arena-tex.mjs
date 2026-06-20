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
  await sharp(buf).resize({width:w,height:w,fit:'cover'}).jpeg({quality:80}).toFile(file);
  fs.unlinkSync(file+'.tmp.png');
  console.log(`✅ ${(fs.statSync(file).size/1024).toFixed(0)}KB`);
}

const out='C:/Users/14169/portfolio/images/arena/';
if(!fs.existsSync(out))fs.mkdirSync(out,{recursive:true});

console.log('Generating colosseum textures...');

// 1. Arena floor - Roman stone tiles, sandy, worn
await gen('A seamless tileable Roman arena floor texture. Worn sandy stone tiles with cracks, warm beige and tan colors, ancient colosseum ground. Top-down view, seamless tiling, photorealistic texture for 3D game. No grass, no objects, pure ground surface. 512x512 texture.',out+'floor.jpg');
await new Promise(r=>setTimeout(r,1500));

// 2. Grass patch - tall wild grass, green, suitable for hiding
await gen('A top-down circular patch of tall wild grass and small bushes, deep green colors, suitable for a stealth game hiding spot. Transparent-ready dark background. Seen from above. The grass looks thick enough to hide a person. Game texture asset style.',out+'grass.jpg');
await new Promise(r=>setTimeout(r,1500));

// 3. Marble pillar - broken/fallen, weathered white stone
await gen('A weathered ancient Roman marble pillar texture, cracked white stone with subtle veins, fallen column. Photorealistic stone surface for 3D texturing. Warm off-white with beige weathering. Seamless tileable texture. 512x512.',out+'marble.jpg');
await new Promise(r=>setTimeout(r,1500));

// 4. Colosseum wall - ancient brick/stone wall
await gen('Ancient Roman colosseum brick wall texture, weathered terracotta and tan stones with mortar, old arena wall. Seamless tileable, photorealistic. Warm earthy tones. 512x512 texture for 3D game.',out+'wall.jpg');
await new Promise(r=>setTimeout(r,1500));

// 5. Sand/dirt ground texture
await gen('A top-down sandy dirt ground texture with small pebbles, warm tan color, suitable for Roman arena floor. Seamless tileable. Natural uneven surface. 512x512 game texture.',out+'sand.jpg');

console.log('\n✅ Done!');
