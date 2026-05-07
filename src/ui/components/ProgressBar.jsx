export default function ProgressBar({ value, label }) {
    const safeValue = Math.min(100, Math.max(0, value || 0));

    return (
        <div className="w-full">
            {label && (
                <div className="flex justify-between items-end mb-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
                    <span className="text-xs font-bold text-[#13ec6d]">{Math.round(safeValue)}%</span>
                </div>
            )}
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                    className="bg-[#13ec6d] h-1.5 rounded-full transition-all duration-500 ease-in-out shadow-[0_0_10px_rgba(19,236,109,0.5)]"
                    style={{ width: `${safeValue}%` }}
                />
            </div>
        </div>
    );
}
