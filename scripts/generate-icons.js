const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');
const iconsDir = path.join(publicDir, 'icons');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Full standard SVG
const baseSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="96" fill="#0E1117"/>
  <g transform="translate(106, 86) scale(11.5)">
    <path d="M10.5 3.5H15.5" stroke="#F4F5F7" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M11.5 3.5V8.8L6.2 18.4C5.5 19.7 6.4 21.3 7.9 21.3H18.1C19.6 21.3 20.5 19.7 19.8 18.4L14.5 8.8V3.5" stroke="#F4F5F7" stroke-width="1.6" stroke-linejoin="round"/>
    <circle cx="13" cy="15.5" r="4.3" stroke="#5EE6C1" stroke-width="1.4"/>
    <circle cx="13" cy="12.4" r="0.9" fill="#5EE6C1"/>
    <circle cx="10.4" cy="17" r="0.9" fill="#5EE6C1"/>
    <circle cx="15.6" cy="17" r="0.9" fill="#5EE6C1"/>
  </g>
</svg>
`;

// Maskable SVG with 20% safe zone padding and full-bleed solid background
const maskableSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#0E1117"/>
  <g transform="translate(136, 120) scale(9.2)">
    <path d="M10.5 3.5H15.5" stroke="#F4F5F7" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M11.5 3.5V8.8L6.2 18.4C5.5 19.7 6.4 21.3 7.9 21.3H18.1C19.6 21.3 20.5 19.7 19.8 18.4L14.5 8.8V3.5" stroke="#F4F5F7" stroke-width="1.6" stroke-linejoin="round"/>
    <circle cx="13" cy="15.5" r="4.3" stroke="#5EE6C1" stroke-width="1.4"/>
    <circle cx="13" cy="12.4" r="0.9" fill="#5EE6C1"/>
    <circle cx="10.4" cy="17" r="0.9" fill="#5EE6C1"/>
    <circle cx="15.6" cy="17" r="0.9" fill="#5EE6C1"/>
  </g>
</svg>
`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), baseSvg.trim());

async function generate() {
  const baseBuffer = Buffer.from(baseSvg);
  const maskableBuffer = Buffer.from(maskableSvg);

  // 192x192
  await sharp(baseBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(iconsDir, 'icon-192x192.png'));

  // 512x512
  await sharp(baseBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-512x512.png'));

  // Maskable 512x512
  await sharp(maskableBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-maskable-512x512.png'));

  // Apple touch icon 180x180
  await sharp(baseBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(iconsDir, 'apple-touch-icon.png'));

  // Copy to public root for max compatibility
  await sharp(baseBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  await sharp(baseBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  await sharp(baseBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  console.log('PWA icons successfully generated!');
}

generate().catch(console.error);
