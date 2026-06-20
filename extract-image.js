const fs = require('fs');
const path = require('path');

const responsePath = path.join(__dirname, 'images', 'vr-response2.json');
const outputPath = path.join(__dirname, 'images', 'vr-device-gen.png');

const data = fs.readFileSync(responsePath, 'utf8');
const r = JSON.parse(data);
const content = r.choices[0].message.content;

const match = content.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/);
if (match) {
  fs.writeFileSync(outputPath, Buffer.from(match[1], 'base64'));
  const size = fs.statSync(outputPath).size;
  console.log(`Image saved: ${(size / 1024).toFixed(0)} KB`);
} else {
  console.log('No image found. Content start:', content.slice(0, 300));
}
