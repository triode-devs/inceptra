import sharp from 'sharp';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get command line arguments
const args = process.argv.slice(2);
const imagePath = args[0];
const rotation = parseInt(args[1]) || 0;

if (!imagePath) {
    console.error('Usage: node rotate-specific.js <image-path> <rotation-degrees>');
    process.exit(1);
}

const inputPath = join(__dirname, imagePath);
const outputPath = inputPath;

async function rotateImage() {
    console.log(`Rotating ${imagePath} by ${rotation}° ...\n`);

    // Rotate the image
    await sharp(inputPath)
        .rotate(rotation)
        .toFile(outputPath + '.tmp');

    // Replace original with rotated version
    await (await import('fs/promises')).rename(outputPath + '.tmp', outputPath);

    const stats = await (await import('fs/promises')).stat(outputPath);
    const sizeKB = Math.round(stats.size / 1024);

    console.log(`✅ Success! Image rotated ${rotation}°. Size: ${sizeKB}KB`);
}

rotateImage().catch(console.error);
