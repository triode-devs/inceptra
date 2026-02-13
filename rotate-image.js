import sharp from 'sharp';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputPath = join(__dirname, 'src/lib/assets/events/mimix.webp');
const outputPath = join(__dirname, 'src/lib/assets/events/mimix.webp');

async function rotateAndCompress() {
    console.log('Rotating mimix.webp 90° clockwise to fix orientation...\n');

    let quality = 80;

    while (quality >= 10) {
        await sharp(inputPath)
            .rotate(90)  // Rotate 90 degrees clockwise (right)
            .webp({ quality })
            .toFile(outputPath + '.tmp');

        // Replace original with rotated version
        await (await import('fs/promises')).rename(outputPath + '.tmp', outputPath);

        const stats = await (await import('fs/promises')).stat(outputPath);
        const sizeKB = Math.round(stats.size / 1024);

        console.log(`Quality ${quality}%: ${sizeKB}KB`);

        if (sizeKB <= 200) {
            console.log(`\n✅ Success! Final size: ${sizeKB}KB`);
            return;
        }

        quality -= 10;
    }
}

rotateAndCompress().catch(console.error);
