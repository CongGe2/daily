const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const INPUT_DIR = path.join(__dirname, 'images');
const OUTPUT_DIR = path.join(__dirname, 'images', 'optimized');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const files = [
  { name: 'terrin-fullpage.png', label: 'Full page' },
  { name: 'terrin-hero.png', label: 'Hero' },
  { name: 'terrin-products.png', label: 'Products' },
];

(async () => {
  for (const f of files) {
    const inputPath = path.join(INPUT_DIR, f.name);
    if (!fs.existsSync(inputPath)) {
      console.log(`Skipping ${f.name} - not found`);
      continue;
    }

    const baseName = path.parse(f.name).name;

    // Create main project image (4:3 crop from top, 1200px wide, jpg for size)
    await sharp(inputPath)
      .resize(1200, 900, { fit: 'cover', position: 'top' })
      .jpeg({ quality: 85 })
      .toFile(path.join(OUTPUT_DIR, `${baseName}-thumb.jpg`));

    console.log(`${f.label}: ${baseName}-thumb.jpg (4:3)`);

    // Also create a narrow detail strip for potential use
    await sharp(inputPath)
      .resize(1200, 600, { fit: 'cover', position: 'top' })
      .jpeg({ quality: 85 })
      .toFile(path.join(OUTPUT_DIR, `${baseName}-hero.jpg`));

    console.log(`${f.label}: ${baseName}-hero.jpg (2:1 detail)`);
  }

  // Check sizes
  const outFiles = fs.readdirSync(OUTPUT_DIR);
  console.log('\n=== Optimized sizes ===');
  for (const file of outFiles) {
    const stat = fs.statSync(path.join(OUTPUT_DIR, file));
    console.log(`${(stat.size / 1024).toFixed(0)} KB  ${file}`);
  }

  console.log('\nDone!');
})();
