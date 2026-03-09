#!/usr/bin/env node
/**
 * App Icon Generator for 4096 Square Game
 *
 * This script generates the required 1024x1024 App Icon for iOS.
 *
 * Usage:
 *   Option 1: Use a design tool (Figma, Sketch, etc.) to create a 1024x1024 PNG
 *   Option 2: Install canvas and run this script:
 *     npm install canvas
 *     node scripts/generate-icon.js
 *
 * The icon will be placed at:
 *   ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png
 *
 * Requirements for App Store:
 *   - 1024x1024 pixels, PNG format
 *   - No transparency (no alpha channel)
 *   - No rounded corners (iOS adds them automatically)
 *   - sRGB color space
 */

try {
  const { createCanvas } = require('canvas');
  const fs = require('fs');
  const path = require('path');

  const SIZE = 1024;
  const canvas = createCanvas(SIZE, SIZE);
  const ctx = canvas.getContext('2d');

  // Background - match game theme
  ctx.fillStyle = '#faf8ef';
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Draw a rounded rectangle for the tile
  const tileSize = 600;
  const tileX = (SIZE - tileSize) / 2;
  const tileY = (SIZE - tileSize) / 2;
  const radius = 60;

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

  // 4096 tile color
  ctx.fillStyle = '#3c3a32';
  ctx.fill();

  // Number "4096"
  ctx.fillStyle = '#f9f6f2';
  ctx.font = 'bold 200px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('4096', SIZE / 2, SIZE / 2);

  // Save
  const outputDir = path.join(__dirname, '..', 'ios', 'App', 'App', 'Assets.xcassets', 'AppIcon.appiconset');
  const outputPath = path.join(outputDir, 'AppIcon-512@2x.png');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`App icon generated at: ${outputPath}`);
  console.log('Size: 1024x1024');
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND') {
    console.log('=== App Icon Generation Instructions ===');
    console.log('');
    console.log('To auto-generate the icon, install the canvas package:');
    console.log('  npm install canvas');
    console.log('  node scripts/generate-icon.js');
    console.log('');
    console.log('Or manually create a 1024x1024 PNG and place it at:');
    console.log('  ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png');
    console.log('');
    console.log('Icon requirements:');
    console.log('  - 1024x1024 pixels, PNG format');
    console.log('  - No transparency');
    console.log('  - No rounded corners (iOS adds them)');
    console.log('  - sRGB color space');
  } else {
    throw e;
  }
}
