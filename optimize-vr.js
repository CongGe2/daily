const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const INPUT = path.join(__dirname, 'images', 'vr-device-gen.png');
const OUT_DIR = path.join(__dirname, 'images', 'optimized');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  // Main 4:3 project image (1200x900)
  await sharp(INPUT)
    .resize(1200, 900, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 85 })
    .toFile(path.join(OUT_DIR, 'vr-device-thumb.jpg'));

  console.log('Created: vr-device-thumb.jpg');

  // Also create a 16:10 version for mobile
  await sharp(INPUT)
    .resize(1200, 750, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 85 })
    .toFile(path.join(OUT_DIR, 'vr-device-detail.jpg'));

  console.log('Created: vr-device-detail.jpg');

  const files = fs.readdirSync(OUT_DIR).filter(f => f.startsWith('vr-device'));
  for (const f of files) {
    const stat = fs.statSync(path.join(OUT_DIR, f));
    console.log(`${(stat.size / 1024).toFixed(0)} KB  ${f}`);
  }

  console.log('Done!');
})();
