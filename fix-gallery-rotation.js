import sharp from 'sharp';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const imagePath = 'src/lib/assets/gallery/1O5A8984.webp';
const inputPath = join(__dirname, imagePath);
const outputPath = inputPath;

async function rotateImage() {
    console.log(`Rotating ${imagePath} by 90° clockwise (to fix orientation)...\n`);

    // Check current metadata
    const metadata = await sharp(inputPath).metadata();
    console.log('Current dimensions:', metadata.width, 'x', metadata.height);
    console.log('Current orientation:', metadata.orientation || 'none');

    // Rotate the image 90 degrees clockwise (which is +90)
    // This should make a sideways image upright
    await sharp(inputPath)
        .rotate(90, { background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .toFile(outputPath + '.tmp');

    // Replace original with rotated version
    await (await import('fs/promises')).rename(outputPath + '.tmp', outputPath);

    // Check new metadata
    const newMetadata = await sharp(outputPath).metadata();
    console.log('\n✅ Success! Image rotated.');
    console.log('New dimensions:', newMetadata.width, 'x', newMetadata.height);

    const stats = await (await import('fs/promises')).stat(outputPath);
    const sizeKB = Math.round(stats.size / 1024);
    console.log('Size:', sizeKB, 'KB');
}

rotateImage().catch(console.error);
