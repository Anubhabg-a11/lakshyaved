import React from 'react';

export default function ReadinessMeter({ score, breakdown }) {
    // 0 - 100 score
    const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

    let colorClass = 'bg-red-500 text-red-50 border-red-500/30';
    let progressClass = 'bg-red-500';
    let textClass = 'text-red-500';
    let label = 'LOW CONFIDENCE';

    if (clampedScore >= 75) {
        colorClass = 'bg-[#13ec6d]/20 text-[#13ec6d] border-[#13ec6d]/30';
        progressClass = 'bg-[#13ec6d]';
        textClass = 'text-[#13ec6d]';
        label = 'HIGH CONFIDENCE';
    } else if (clampedScore >= 50) {
        colorClass = 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
        progressClass = 'bg-yellow-500';
        textClass = 'text-yellow-500';
        label = 'MEDIUM CONFIDENCE';
    }

    return (
        <div className="flex flex-col gap-2 p-4 rounded-xl border border-slate-700/50 bg-[#121a2a]/80 shadow-lg relative group">
            <div className="flex justify-between items-end mb-1">
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Readiness Score</h4>
                    <p className={`text-xs font-bold px-2 py-0.5 rounded-md inline-block border ${colorClass}`}>
                        {label}
                    </p>
                </div>
                <div className="text-right">
                    <span className={`text-3xl font-black ${textClass} drop-shadow-md leading-none`}>{clampedScore}</span>
                    <span className="text-slate-500 text-sm font-bold ml-1">/100</span>
                </div>
            </div>

            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-2">
                <div
                    className={`h-full ${progressClass} transition-all duration-1000 ease-out`}
                    style={{ width: `${clampedScore}%` }}
                />
            </div>

            {breakdown && breakdown.length > 0 && (
                <div className="mt-3 py-2 border-t border-slate-700/50">
                    <ul className="text-xs text-slate-400 space-y-1">
                        {breakdown.map((item, idx) => (
                            <li key={idx} className="flex justify-between">
                                <span>{item.label}</span>
                                <span className={item.highlight ? 'text-white font-medium' : ''}>{item.value}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
