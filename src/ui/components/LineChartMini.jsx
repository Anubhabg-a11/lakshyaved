import React from 'react';

export default function LineChartMini({ data1, data2, color1 = '#13ec6d', color2 = '#3b82f6', height = 200 }) {
    if (!data1 || data1.length === 0) return <div className="text-slate-500 text-sm">No data available</div>;

    const allValues = [...data1, ...(data2 || [])];
    const minVal = Math.min(...allValues) * 0.9;
    const maxVal = Math.max(...allValues) * 1.1;
    const range = maxVal - minVal || 1;

    // Helper to map values to SVG coordinates
    const normalizeX = (index, length) => (index / (length - 1)) * 100;
    const normalizeY = (val) => 100 - ((val - minVal) / range) * 100;

    const generatePath = (data) => {
        if (!data || data.length === 0) return '';
        return data.map((val, i) => {
            const x = normalizeX(i, data.length);
            const y = normalizeY(val);
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');
    };

    return (
        <div className="w-full relative" style={{ height: `${height}px` }}>
            <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(y => (
                    <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                ))}

                {/* Data 1 Path */}
                {data1 && data1.length > 0 && (
                    <path
                        d={generatePath(data1)}
                        fill="none"
                        stroke={color1}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="drop-shadow-[0_0_8px_currentColor]"
                    />
                )}
                {/* Data 1 Points */}
                {data1 && data1.map((val, i) => (
                    <circle
                        key={`d1-${i}`}
                        cx={normalizeX(i, data1.length)}
                        cy={normalizeY(val)}
                        r="2"
                        fill="#121a2a"
                        stroke={color1}
                        strokeWidth="1.5"
                    />
                ))}

                {/* Data 2 Path */}
                {data2 && data2.length > 0 && (
                    <path
                        d={generatePath(data2)}
                        fill="none"
                        stroke={color2}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                )}
                {/* Data 2 Points */}
                {data2 && data2.map((val, i) => (
                    <circle
                        key={`d2-${i}`}
                        cx={normalizeX(i, data2.length)}
                        cy={normalizeY(val)}
                        r="2"
                        fill="#121a2a"
                        stroke={color2}
                        strokeWidth="1.5"
                    />
                ))}
            </svg>

            {/* simple legend */}
            <div className="absolute -top-6 right-0 flex gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color1 }} />
                    <span className="text-slate-400">Role A</span>
                </div>
                {data2 && (
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color2 }} />
                        <span className="text-slate-400">Role B</span>
                    </div>
                )}
            </div>
        </div>
    );
}
