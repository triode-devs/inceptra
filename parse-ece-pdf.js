import fs from "fs";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse/lib/pdf-parse.js");

const pdfPath = "C:/Users/s7/OneDrive/Desktop/projects/inceptra/src/lib/assets/ECE RULES AND REGULATIONS .pdf";

async function parsePdf() {
    try {
        const dataBuffer = fs.readFileSync(pdfPath);
        const data = await pdf(dataBuffer);

        console.log("PDF TEXT CONTENT:");
        console.log(data.text);

        fs.writeFileSync("debug_ece_pdf.txt", data.text);

    } catch (error) {
        console.error("Error parsing PDF:", error);
    }
}

parsePdf();
