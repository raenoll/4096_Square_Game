#!/usr/bin/env node
/**
 * Android Icon Generator for 4096 Square Game
 *
 * Generates launcher icons for all Android density buckets.
 *
 * Usage:
 *   npm install canvas (if not already installed)
 *   node scripts/generate-android-icons.js
 *
 * Output directories:
 *   android/app/src/main/res/mipmap-mdpi/      (48x48)
 *   android/app/src/main/res/mipmap-hdpi/      (72x72)
 *   android/app/src/main/res/mipmap-xhdpi/     (96x96)
 *   android/app/src/main/res/mipmap-xxhdpi/    (144x144)
 *   android/app/src/main/res/mipmap-xxxhdpi/   (192x192)
 *   + 512x512 for Google Play Store listing
 */

try {
  const { createCanvas } = require('canvas');
  const fs = require('fs');
  const path = require('path');

  const SIZES = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192,
  };

  const PLAY_STORE_SIZE = 512;

  function drawIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Background - game theme color
    ctx.fillStyle = '#faf8ef';
    ctx.fillRect(0, 0, size, size);

    // Tile (rounded rectangle)
    const tileSize = size * 0.6;
    const tileX = (size - tileSize) / 2;
    const tileY = (size - tileSize) / 2;
    const radius = size * 0.06;

    ctx.beginPath();
    ctx.moveTo(tileX + radius, tileY);
    ctx.lineTo(tileX + tileSize - radius, tileY);
    ctx.arcTo(tileX + tileSize, tileY, tileX + tileSize, tileY + radius, radius);
    ctx.lineTo(tileX + tileSize, tileY + tileSize - radius);
    ctx.arcTo(tileX + tileSize, tileY + tileSize, tileX + tileSize - radius, tileY + tileSize, radius);
    ctx.lineTo(tileX + radius, tileY + tileSize);
    ctx.arcTo(tileX, tileY + tileSize, tileX, tileY + tileSize - radius, radius);
    ctx.lineTo(tileX, tileY + radius);
    ctx.arcTo(tileX, tileY, tileX + radius, tileY, radius);
    ctx.closePath();

    ctx.fillStyle = '#3c3a32';
    ctx.fill();

    // "4096" text
    ctx.fillStyle = '#f9f6f2';
    const fontSize = Math.round(size * 0.2);
    ctx.font = `bold ${fontSize}px "Segoe UI", "Helvetica Neue", Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('4096', size / 2, size / 2);

    return canvas.toBuffer('image/png');
  }

  const resDir = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');

  // Generate launcher icons for each density
  for (const [folder, size] of Object.entries(SIZES)) {
    const outputDir = path.join(resDir, folder);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const buffer = drawIcon(size);

    // Standard icon
    fs.writeFileSync(path.join(outputDir, 'ic_launcher.png'), buffer);
    // Round icon
    fs.writeFileSync(path.join(outputDir, 'ic_launcher_round.png'), buffer);

    console.log(`Generated ${folder}: ${size}x${size}`);
  }

  // Generate Play Store icon (512x512)
  const playStoreDir = path.join(__dirname, '..', 'android');
  const playStoreBuffer = drawIcon(PLAY_STORE_SIZE);
  fs.writeFileSync(path.join(playStoreDir, 'play-store-icon.png'), playStoreBuffer);
  console.log(`Generated Play Store icon: ${PLAY_STORE_SIZE}x${PLAY_STORE_SIZE}`);

  console.log('\nAll Android icons generated successfully!');
  console.log('Play Store icon saved to: android/play-store-icon.png');
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND') {
    console.log('=== Android Icon Generation Instructions ===');
    console.log('');
    console.log('To auto-generate icons, install the canvas package:');
    console.log('  npm install canvas --save-dev');
    console.log('  node scripts/generate-android-icons.js');
    console.log('');
    console.log('Or use Android Studio to generate icons:');
    console.log('  1. Open the project in Android Studio');
    console.log('  2. Right-click res/ → New → Image Asset');
    console.log('  3. Select "Launcher Icons (Adaptive and Legacy)"');
    console.log('  4. Import your 512x512 icon as foreground');
    console.log('  5. Set background color to #faf8ef');
    console.log('');
    console.log('Required sizes:');
    console.log('  mdpi:    48x48');
    console.log('  hdpi:    72x72');
    console.log('  xhdpi:   96x96');
    console.log('  xxhdpi:  144x144');
    console.log('  xxxhdpi: 192x192');
    console.log('  Play Store: 512x512');
  } else {
    throw e;
  }
}
