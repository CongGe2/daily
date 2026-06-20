const fs = require('fs');
const { PDFParse } = require('pdf-parse');

const pdfPath = 'C:/Users/14169/portfolio/references/时尚設計2_金承旭_1230014532_D2.pdf';

(async () => {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await PDFParse(dataBuffer);

  console.log(`Pages: ${data.numpages}`);
  console.log(`\n=== Full Text ===\n`);
  console.log(data.text);
})();
