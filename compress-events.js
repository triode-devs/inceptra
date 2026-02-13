import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SOURCE_DIR = join(__dirname, 'src/lib/assets/events');
const TARGET_MAX_SIZE_KB = 200;

async function compressImage(inputPath, outputPath) {
    const fileName = basename(inputPath);
    console.log(`\nProcessing: ${fileName}`);

    let quality = 80;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
        await sharp(inputPath)
            .webp({ quality })
            .toFile(outputPath);

        const stats = await stat(outputPath);
        const sizeKB = Math.round(stats.size / 1024);

        console.log(`  Attempt ${attempts + 1}: Quality ${quality}%, Size: ${sizeKB}KB`);

        if (sizeKB <= TARGET_MAX_SIZE_KB) {
            console.log(`  ✅ Success! Final size: ${sizeKB}KB`);
            return;
        }

        // Reduce quality for next attempt
        quality -= 10;
        attempts++;

        if (quality < 10) {
            console.log(`  ⚠️ Warning: Quality too low, stopping at ${sizeKB}KB`);
            return;
        }
    }
}

async function main() {
    console.log('Starting image compression...\n');
    console.log(`Source: ${SOURCE_DIR}`);
    console.log(`Target max size: ${TARGET_MAX_SIZE_KB}KB\n`);

    const files = await readdir(SOURCE_DIR);
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i.test(f));

    console.log(`Found ${imageFiles.length} images to compress\n`);

    for (const file of imageFiles) {
        const inputPath = join(SOURCE_DIR, file);
        const nameWithoutExt = basename(file, extname(file));
        const outputPath = join(SOURCE_DIR, `${nameWithoutExt}.webp`);

        try {
            await compressImage(inputPath, outputPath);
        } catch (error) {
            console.error(`  ❌ Error processing ${file}:`, error.message);
        }
    }

    console.log('\n✅ Compression complete!');
}

main().catch(console.error);
