import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync, statSync } from 'fs';
const src='C:/Users/14169/portfolio/images/ux/';
const dst=src+'optimized/';
if(!existsSync(dst))mkdirSync(dst,{recursive:true});
for(const f of readdirSync(src).filter(f=>f.endsWith('.png'))){
  const i=src+f, o=dst+f.replace('.png','.jpg');
  const kb=(statSync(i).size/1024).toFixed(0);
  await sharp(i).resize({width:1600,withoutEnlargement:true}).jpeg({quality:82,mozjpeg:true}).toFile(o);
  console.log(`${f}: ${kb}KB → ${(statSync(o).size/1024).toFixed(0)}KB`);
}
// thumbnail
await sharp(src+'mindspace-hero.png').resize({width:800,height:600,fit:'cover'}).jpeg({quality:78}).toFile('C:/Users/14169/portfolio/images/optimized/mindspace-thumb.jpg');
console.log('✅ thumb done');
