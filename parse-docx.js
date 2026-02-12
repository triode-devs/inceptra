import mammoth from "mammoth";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docxPath = "C:/Users/s7/OneDrive/Desktop/projects/inceptra/src/lib/assets/INCEPTRA 2026-CULTURAL.docx";

async function parseDocx() {
    try {
        const result = await mammoth.extractRawText({ path: docxPath });
        const text = result.value;

        console.log("FIRST 2000 CHARACTERS OF DOCX:");
        console.log(text.slice(0, 2000));

        fs.writeFileSync(path.join(process.cwd(), "debug_docx.txt"), text);
        console.log("\nFull text written to debug_docx.txt");

    } catch (error) {
        console.error("Error parsing DOCX:", error);
    }
}

parseDocx();
