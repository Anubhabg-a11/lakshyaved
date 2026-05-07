import { useState } from 'react';
import { Download } from 'lucide-react';
import { exportElementToPdf } from '../../core/utils/pdfExport';

export default function ExportPdfButton({ elementId, filename, label = "Export as PDF" }) {
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        setExporting(true);
        try {
            await exportElementToPdf(elementId, filename);
        } catch (err) {
            alert(err.message);
        } finally {
            setExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white font-bold rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors disabled:opacity-50 text-sm"
        >
            <Download size={16} className={exporting ? "animate-bounce" : ""} />
            {exporting ? "Generating PDF..." : label}
        </button>
    );
}
