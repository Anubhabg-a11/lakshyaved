import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportElementToPdf(elementId, filename = 'export.pdf') {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id ${elementId} not found`);
        throw new Error("Could not find content to export.");
    }

    // Optional: Add a temporary class to adjust styles specifically for PDF export
    const originalStyle = element.style.cssText;

    try {
        const canvas = await html2canvas(element, {
            scale: 2, // High resolution
            useCORS: true,
            logging: false,
            backgroundColor: '#0b0f19' // match dark theme background
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add subsequent pages if content overflows
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(filename);
        return true;
    } catch (err) {
        console.error("PDF Export Error:", err);
        throw new Error("Failed to generate PDF.");
    } finally {
        // Restore original style if modified
        element.style.cssText = originalStyle;
    }
}
