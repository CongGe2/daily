import https from 'node:https';import fs from 'node:fs';import sharp from 'sharp';
const API='nn.147ai.com',KEY='sk-RMB5xMHGduTeBEi6KFGFMppdbBQpnVLoZ4Ki1LYw66XfJ7O7';

function api(p){return new Promise(r=>{const b=JSON.stringify({model:'gemini-3.1-flash-image-preview',messages:[{role:'user',content:p}],max_tokens:4096});const req=https.request({hostname:API,path:'/v1/chat/completions',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+KEY,'Content-Length':Buffer.byteLength(b)},timeout:180000},res=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>r(res.statusCode===200?JSON.parse(d):null))});req.on('timeout',()=>{req.destroy();r(null)});req.on('error',()=>r(null));req.write(b);req.end()})}

async function gen(p,file,w=512){
  console.log('\n🎨 '+file);
  const d=await api(p);if(!d?.choices?.[0]?.message?.content){console.log('❌ fail');return}
  const c=d.choices[0].message.content;
  const m=c.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/)||c.match(/!\[.*?\]\(data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)\)/);
  if(!m){console.log('❌ no img');return}
  const buf=Buffer.from(m[1],'base64');fs.writeFileSync(file+'.tmp.png',buf);
  try{await sharp(buf).resize({width:w,height:w,fit:'cover'}).jpeg({quality:82,mozjpeg:true}).toFile(file);fs.unlinkSync(file+'.tmp.png')}catch(e){fs.renameSync(file+'.tmp.png',file)}
  console.log('✅ '+(fs.statSync(file).size/1024).toFixed(0)+'KB');
}

const out='C:/Users/14169/portfolio/images/kitchen/';
if(!fs.existsSync(out))fs.mkdirSync(out,{recursive:true});
console.log('🎨 Generating kitchen game textures...\n');

// 1-3: Kitchen scenes
await gen('A warm cozy Japanese street food stall kitchen counter, viewed from above at a slight angle. Wooden counter surface, warm pendant lights, dark background with lanterns. Top-down isometric view. Dark warm atmosphere. No text. 512x512 game background texture.',out+'bg.jpg');
await new Promise(r=>setTimeout(r,1500));
await gen('A clean empty metal grill surface with heat marks, slight orange glow, dark background. Top-down view for a cooking game. Professional kitchen equipment. 512x512.',out+'grill.jpg');
await new Promise(r=>setTimeout(r,1500));
await gen('A deep fryer basket in hot oil, bubbles visible, golden oil surface. Top-down view for cooking game. Dark background. 512x512 texture.',out+'fryer.jpg');
await new Promise(r=>setTimeout(r,1500));

// 4-5: Prep surfaces
await gen('A wooden cutting board surface, clean, warm brown wood texture. Top-down view for a cooking game. 512x512 seamless texture.',out+'cutboard.jpg');
await new Promise(r=>setTimeout(r,1500));
await gen('A clean white ceramic serving plate on dark background. Top-down view for plating food. Simple elegant plate. 512x512 game asset.',out+'plate.jpg');
await new Promise(r=>setTimeout(r,1500));

// 6-10: Raw food items (isolated on dark bg)
await gen('Raw beef steak, uncooked, red meat texture, on dark background. Top-down view food photography. Isolated ingredient for cooking game. 512x512.',out+'beef-raw.jpg');
await new Promise(r=>setTimeout(r,1500));
await gen('Cooked beef steak, grilled with char marks, well-done brown color. Top-down view food photography. Isolated. 512x512.',out+'beef-cooked.jpg');
await new Promise(r=>setTimeout(r,1500));
await gen('Raw chicken breast pieces, pale pink, uncooked, on dark background. Top-down view. Isolated ingredient for cooking game. 512x512.',out+'chicken-raw.jpg');
await new Promise(r=>setTimeout(r,1500));
await gen('Golden fried chicken pieces, crispy brown coating, cooked, on dark background. Top-down view. 512x512.',out+'chicken-cooked.jpg');
await new Promise(r=>setTimeout(r,1500));
await gen('Fresh raw vegetables assortment - lettuce, tomato slices, onion rings, on dark background. Top-down view. 512x512 game ingredient texture.',out+'veggies.jpg');
await new Promise(r=>setTimeout(r,1500));

// 11-13: Additional foods
await gen('A pile of cooked white rice, steaming slightly, on dark background. Top-down view. 512x512 game texture.',out+'rice.jpg');
await new Promise(r=>setTimeout(r,1500));
await gen('Golden crispy french fries in a pile, on dark background. Top-down view. 512x512.',out+'fries.jpg');
await new Promise(r=>setTimeout(r,1500));
await gen('A whole grilled fish on a plate, charred skin, lemon slices, on dark background. Top-down view. 512x512.',out+'fish.jpg');
await new Promise(r=>setTimeout(r,1500));

// 14-15: UI elements
await gen('A rectangular wooden sign board with dark background, suitable for a game order card. Empty, no text. Warm wood tones. 400x200 aspect ratio.',out+'order-card.jpg',400);
await new Promise(r=>setTimeout(r,1500));
await gen('A gold coin icon for a game, 3D rendered, shiny, on transparent/dark background. 256x256.',out+'coin.png',256);

// 16-18: Misc
await gen('A steamy, sizzling effect overlay - smoke and heat particles on dark transparent background. For cooking game effects. 256x256.',out+'steam.png',256);
await new Promise(r=>setTimeout(r,1500));
await gen('A fire/flame cooking effect on dark transparent background. Small flame for grill cooking game. 256x256.',out+'fire.png',256);
await new Promise(r=>setTimeout(r,1500));
await gen('A kitchen knife on a cutting board, chef knife, professional. Top-down view on dark background. 512x512.',out+'knife.jpg');

console.log('\n✅ All textures generated!');
