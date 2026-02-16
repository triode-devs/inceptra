
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputPath = 'src/lib/assets/gallery/DSC03734.JPG';
const outputPath = 'src/lib/assets/gallery/DSC03734.webp';
const maxSize = 200 * 1024; // 200KB

async function compressImage() {
    try {
        let quality = 90;
        let buffer = await sharp(inputPath)
            .resize({ width: 1920, withoutEnlargement: true }) // reasonable max width
            .webp({ quality })
            .toBuffer();

        while (buffer.length > maxSize && quality > 10) {
            quality -= 5;
            buffer = await sharp(inputPath)
                .resize({ width: 1920, withoutEnlargement: true })
                .webp({ quality })
                .toBuffer();
        }

        if (buffer.length > maxSize) {
            // Try reducing dimensions if quality alone isn't enough
            let width = 1600;
            while (buffer.length > maxSize && width > 400) {
                width -= 200;
                buffer = await sharp(inputPath)
                    .resize({ width: width, withoutEnlargement: true })
                    .webp({ quality: quality }) // use the lowest quality reached
                    .toBuffer();
            }
        }

        fs.writeFileSync(outputPath, buffer);
        console.log(`Image saved to ${outputPath}`);
        console.log(`Final size: ${(buffer.length / 1024).toFixed(2)} KB`);
        console.log(`Quality: ${quality}`);

    } catch (err) {
        console.error('Error processing image:', err);
    }
}

compressImage();
