import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export async function extractTextFromPdf(file) {
    if (!file || file.type !== 'application/pdf') {
        throw new Error("Invalid file type. Please upload a PDF.");
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const maxPages = pdf.numPages;

        let extractedText = [];

        for (let pageNo = 1; pageNo <= maxPages; pageNo++) {
            const page = await pdf.getPage(pageNo);
            const textContent = await page.getTextContent();

            // Extract text from items
            const pageStrings = textContent.items.map(item => item.str);
            const rawPageText = pageStrings.join(' ');

            extractedText.push(`\n\n--- PAGE ${pageNo} ---\n\n`);
            extractedText.push(rawPageText);
        }

        return extractedText.join(' ');
    } catch (error) {
        console.error("PDF Parsing Error:", error);
        throw new Error("Failed to parse PDF. The file might be corrupted or protected.");
    }
}
